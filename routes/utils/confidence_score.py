'''
This script generates a confidence score for the authentication results of the
API's regression model. The confidence score is the sum of the weighted values of
the coefficient of determination, variance and standard error. The script uses
an aggregated object that combines the required auth data with the required
metric data and returns a confidence object with the score and weighted value of
each segment.
'''

import sys, json, math, statistics
from scipy import stats
from formula import index_of_difficulty, distance

# Received the combined auth+metric doc from Nodejs
def get_score_doc():
    score_doc = sys.stdin.readline()
    return score_doc

# Weights the coefficient of determination on a scale of 0-50
def weigh_cod(cod):
    return (cod/2) * 100

# Weighs the variance of the predicted value vs the actual value of the
# authentication and compares it to the median variance
def weight_variance(var_list, amt, pmt, iod):
    # Get the variance of the prediction movement time and actual movement time
    # to determine the variance
    v = distance(iod, amt, iod, pmt)

    # The median variance of all instances
    mv = statistics.median(var_list)

    # If the variance is 0 the predicted mt and actual mt are the same and should
    # return a perfect variance score (20)
    if v == 0:
        return 20
    else:
        # If the variance is greater than the median variance, than the variance
        # loses accuracy and should return 0
        if v > mv:
            return 0
        else:
        # The variance is less than the median, get its radio to the median and
        # mutiply by 20 to weigh it out of 20.
            return (v/mv) * 20

# Weights the standard error of the regression by determining the percent of
# variances that are within one standard error of the mean variance and scaling
# that percent to weigh it from 0 to 30
def weight_standard_error(var_list, se):
    # The mean variance of all instances
    var_mean = statistics.mean(var_list)

    # Counts the number of variances in the list that are within one standard
    # error of the mean
    counter = 0
    for v in var_list:
        if (v <= var_mean + se or v > var_mean - se):
            counter = counter + 1;
    percent = counter/len(var_list)

    # Scale the result to be between 0 and 30
    return percent * 30

# The main function for building the confidence score
def main():
    # Convert the score doc into a dictionary
    score_doc=get_score_doc()
    score_data = json.loads(score_doc)

    # The metric data from previously stored instances
    metric_data = score_data['metrics']

    # The data from the authentication instance
    auth_data = score_data['auth']
    auth_iod = index_of_difficulty(auth_data['a'], auth_data['tw'])
    auth_mt = auth_data['mt']

    # Uses the stored regression model to predict movement time based on the
    # authentication instance data
    predicted_mt = (metric_data['slope'] * auth_iod) + metric_data['yInt']

    # Calculate the weighted scores of the confidence segments
    score_cod = weigh_cod(metric_data['cod'])
    score_var = weight_variance(metric_data['instances']['variances'], auth_mt, predicted_mt, auth_iod)
    score_se = weight_standard_error(metric_data['instances']['variances'], metric_data['se'])

    # Use the sum of the segments to determine the final confidence score
    final_score = score_cod + score_var + score_se

    # Build the confidence object to return to the Nodejs server to parse as JSON
    confidence_dict = {
        "score": final_score,
        "weights": {
            "cod": score_cod,
            "var": score_var,
            "se": score_se
        }
    }
    confidence = json.dumps(confidence_dict)

    print(confidence)

if __name__ == '__main__':
    main()
