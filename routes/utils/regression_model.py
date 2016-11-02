'''
This script generates the required metrics needed for authentication and
confidence scoring. This script is a child process run from a Nodejs server in
which documents are retrived from the quizzes database that preserves imported
data and passed to this script to build the linear regression model, calculate
metric values and return the metric values in a document. The following values
are in the output:
    1. uid: user identification id
    2. slope: slope coefficient of the regression line
    3. yInt: y-intercept of the regression line
    4. cc: correlation coefficient
    5. cod: coefficient of determination
    6. se: standard error
    7. instances: an object which contains lists of the following data
       aggregated from each quiz instance:
           a. iods: list of the index of difficulies of each instance
           b. mts: list of movement times of each instance
           c. variances: list of variances between the predicted movement
              time and actual time of each instance
    8. mean: the mean value of the instance data for iod (index of difficulty),
       pmt (predicted movement time), amt (actual movement time), v (variance)
'''

import sys, json, math, statistics
from scipy import stats
from formula import index_of_difficulty, distance

# The document from the quizzes database passed by Nodejs
def get_user_doc():
    user_doc = sys.stdin.readline()
    return user_doc

# Used to compile a 1D list of a metric across all quiz instances
def aggregate_metric(metric, objDict):
    metric_list = [i[metric] for i in objDict if metric in i]
    return [item for sublist in metric_list for item in sublist]

# The main function for building the regression model and creating a new document with the results.
def main():
    # Get user doc from nodejs and convert it into a dictionary
    user_doc=get_user_doc()
    user_data = json.loads(user_doc)

    #Aggregate data from all quiz instances into a single list for each metric
    quiz_data = user_data['quiz']
    mt_list = aggregate_metric('mt', quiz_data)
    amp_list = aggregate_metric('a', quiz_data)
    width_list = aggregate_metric('w', quiz_data)

    # Use Shannon's formula along with amplitudes and target widths to get index of difficulty
    iod_list = list(map(index_of_difficulty, amp_list, width_list))

    # Build the linear regression model off of the aggregate data
    slope, intercept, r_value, p_value, std_err = stats.linregress(iod_list, mt_list)

    # Get variances based on model predictions mt = slope*id + intercept, m=slope, b=yInt, x=index of difficulty
    predicted_mts = list(map(lambda x: slope*x + intercept, iod_list))
    variances = list(map(distance, amp_list, mt_list, amp_list, predicted_mts))

    # Get means of variances, predicted_mts and actual mts to store in metrics db
    v_mean = statistics.mean(variances)
    pmt_mean = statistics.mean(predicted_mts)
    amt_mean = statistics.mean(mt_list)
    iod_mean = statistics.mean(iod_list)
    cc = r_value
    cod = r_value ** 2

    # Construct the string to return to nodejs that will be parsed to JSON
    metrics_dict = {
        "uid": user_data["uid"],
        "slope": slope,
        "yInt": intercept,
        "cc": cc,
        "cod": cod,
        "se": std_err,
        "instances": {
            "iods": iod_list,
            "mts": mt_list,
            "predictions": predicted_mts,
            "variances": variances
        },
        "mean": {
            "iod": iod_mean,
            "pmt": pmt_mean,
            "amt": amt_mean,
            "v": v_mean
        }
    }
    metrics = json.dumps(metrics_dict)

    print(metrics)


if __name__ == '__main__':
    main()
