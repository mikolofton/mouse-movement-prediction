# Mouse Movement Authentication API

###### Author: Melissa Lofton

Introduction
------------
Biometric authentication is the focus of evolving efforts to identify a user with natural human characteristics or behavior. Mouse movements are such a behavior that can be recorded synchronously as a user interacts with a computer or device. The application programmable interface (API) developed by this study aims to successfully authenticate users based on their mouse movements. To achieve this the API utilizes the index of difficulty (ID) and mouse movement completion time (MT) and applies a linear regression model to Fitts’ Law to predict movement time from the index of difficulty. The API decides whether a user passes authentication by determining if the predicted MT is within one standard error of the actual MT. The API also features a confidence score which demonstrates the level of confidence the API has in its authentication result. Analysis of the mouse movement API includes a series of tests for accuracy and the confidence score to determine the efficacy of the API's authentication service.

Updates
-------
Last Updated: 2016-11-02

__Completed___

1. dbConn.js - general connection module to MongoDB
2. generateData.js - script that cuts csv files to 20 instances
3. formula.py - Euclidean distance formula and Shannon's formula
4. regression_model.py - Takes dummy object as a quizzes doc, builds the regression model, outputs metric doc to be stored in metrics database
5. confidence_score.py - Takes dummy object as authentication data for a user, computes scoring segments and outputs a score object

__In Progress__

populate.js - building the metrics database from the quizzes database and regression_model.py

__To Do__

1. setup.js - Nodejs automation script to automatically populate local databases with valid data
2. auth.js - Authentication logic for verifying a user's identity.
3. test.js - automate multiple instances for testing the authentication
4. server.js - setting up routing and endpoints for the API
5. README.md - write instructions on how to install and use this project

Background Information
----------------------

![alt text](http://mikolofton.com/mouse-mvmt-auth-01-formulas.png "Formulas")

__Formula 1: Shannon's Limit__

1. _ID – index of difficulty_: Represents the relative difficulty of moving the pointer, from the start to the target using an input device, for that particular person.
2.	_A – amplitude_: The amplitude or distance from start to the target’s center.
3.	_W - width_: The width of the target, where the movement terminates.

__Formula 2: Fitts' Law__

1.	_MT – movement completion time_: The total time it takes to get from the start to the target. It is measured in milliseconds.
2. _a, b –device dependent constants_: a represents the time needed to use the input device and their reaction and b represents user’s human motor system’s capacity to process information, essentially their reaction time
3. _Shannon's Limit_: used to calculate the index of difficulty of a task

__Formula 3: Linear Relationship of MT/ID__

1. _ID_ is the independent variable
2. _MT_ is the dependent variable of ID
3. _a_ is the y-intercept coefficient and _b_ is the slope coefficient

### Stack

MongoDB
NodeJs/ExpressJs
Python (scipy/json)

Setup
-----
The API builds a database from a given set of pre-recorded mouse movement instances. This study uses a sample dataset of mouse movements collected by Pace University [6]. This dataset contains mouse movement data in .csv format collected from 23 users who completed 11 multiple choice quizzes with 10 questions per quiz. The quizzes database serves to preserve .csv data.

The table below displays the properties of the data available within the dataset and their translations to the documents maintained in the quizzes database.

| Document Key | Column in Dataset                            |
| ------------ | -------------------------------------------- |
| mt           | time(n) - time(n+1)                          |
| origin       | {x,y} pointer coordinates within the screen  |
| offset       | {x,y} offset position within the target      |
| w            | target width                                 |
| a            | Euclidean distance between origin and offset |
| iod          | logarithmic function of a and w              |


The API builds a metric database based upon the data contained in the quizzes database. In the metrics database, a regression model is build off of each user's mouse movement data. The table below shows the data contained in the metrics database.

| Key                   | Value                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| uid                   | user ID number                                                                                           |
| slope                 | slope                                                                                                    |
| yInt                  | y-intercept                                                                                              |
| cc                    | correlation coefficient                                                                                  |
| cod                   | coefficient of determination                                                                             |
| se                    | standard error                                                                                           |
| instances.iods        | list of all index of difficulties aggregated from each instance in the quizzes database                  |
| instances.mts         | list of all recorded movement times aggregated from each instance in the quizzes database                |
| instances.predictions | list of all predictions for mt calculated used the regression model for each instance                    |
| instances.variances   | list of the Euclidean distance between the predicted and actual values of mt for each instance           |
| mean.iod              | the mean index of difficulty from all instances                                                          |
| mean.pmt              | the mean predicted movement time from all instances                                                      |
| mean.amt              | the mean actual movement time from all instances                                                         |
| mean.v                | the mean Euclidean distance between predicted movement times and actual movement time from all instances |

Authentication
--------------

1. Instance object that contains _uid_, _origin_, _offset_, _w_ and _mt_ is passed in the API request.
2. _a_ is set to the Euclidean distance between _origin_ and _w_.
3. The _uid_ is used to retrieve an existing document in the “users” database and therefore the _uid_ must match an _uid_ contained in the metrics database.
4. Once a matching user document is found, the API uses the _slope_, _yInt_ for that user along with the _iod_ from the request to predict the movement time by applying them to the linear regression formula.
5. The API evaluates whether the absolute value of the difference between the predicted value and actual value is less than the standard error. This method determines whether the prediction value is within one standard deviation of the actual value.
6. If the predicted MT is within one standard deviation of the actual MT, the API sets the authentication response to true and vice versa.
7. The authentication response includes a confidence score that is a combination of weighted metrics that convey the reliability of the authentication result.

Confidence Score
----------------

The confidence score represents the reliability of the authentication result. The confidence score is split between three segments, each with a weighted value that when combined will produce an overall score between 0 and 100. The table below shows the three segments and their total weight. _Currently the weights are arbitrary and will be tested against a set of data to determine a better weighting system based on their actual affect on accurate authentications._

| Segment                      | Weighted Value |
| ---------------------------- | -------------- |
| Coefficient of Determination | 0 - 50         |
| Standard Error               | 0 - 20         |
| Variance                     | 0 - 30         |

###### Weighted Coefficient of Determination
The coefficient of determination is an important metric in regression analysis that measures how well a regression model represents the data. Denoted by R2, the coefficient of determination is interpreted as a proportion between the variance of the dependent variable that is predicted from the independent variable, signifying the amount of data that fits the regression line and the probability of future data falling upon the regression line. The value of this metric can range between 0 and 1. A value of 0 signifies that the independent variable cannot accurately predict the dependent variable and a value of 1 means that independent variable can predict the dependent variable without error [3]. Therefore, the closer the value of R2 is to 1, the higher the confidence score is for the model. This model is weighted on a scale of 0-50 and is calculated by dividing R2 by 2, then multiplying by 100. The value of R2 is the square of the correlation coefficient which is included in the output of the Python scipy.stats.linregress function [5]. Although, the coefficient of determination signifies the predictive quality of a regression model, it does not signify accuracy or standard error. To accommodate for these values, the algorithm includes data variance and standard error to compose the confidence score.

###### Weighted Standard Error
The standard error metric is included in the Python scipy.stats.linregress function and represents the average distance between the data values and the regression line.  The smaller the standard error, the higher the predictive value of the regression model. The standard error measures the average difference between the predicted values and actual values for movement time [3]. To weight the standard error, the API evaluates the percentage of variances within one standard deviation of the mean variance. The standard error score is assigned a value that corresponds to the percentage taken out of 30.

###### Weighted Variance
The API represents accuracy in the confidence score by determining distance between the predicted point and authentication point. Considered to be the level of variance, this metric demonstrates how far the linear regression model is from predicting the actual value of the instance [9]. The API weights the variance on a scale of 0-20 and compares it to the median variance of all the instances stored in the database for that user. If the instance variance is greater than the median variance, then the variance level is scored as 0. Otherwise, the instance variance is divided by the median variance and multiplied by 20 to determine its weighted variance score.

References
----------
1. Francis Buckley, Vito Barnes, Thomas Corum, Stephen Gelardi, Keith Rainsford, Phil Dressner, and John V. Monaco, Design of the Data Input Structure for a Mouse Movement Biometric System to Authenticate the Identity of Online Test Takers, Proc. Research Day, CSIS, Pace University, May 2015.
2. Paul M. Fitts. (1954,  June).  The information capacity of the human motor system in controlling the amplitude of movement. Journal of Experimental Psychology, 47(6), pp. 381–391. [Online]. Available: http://sing.stanford.edu/cs303-sp11/papers/1954-Fitts.pdf
3. Colin Lewis-Beck and Michael S. Lewis-Beck, Applied Regression: An Introduction (Quantitative Applications in the Social Sciences), 2nd ed. Thousand Oaks, CA: Sage Publishing, 2016, pp. 14–20.
4. I. S. MacKenzie. (1995).  Movement time prediction in human-computer interfaces. Readings in human-computer interaction, (2), pp. 483–493. Los Altos, CA. 1995. [Online] Available: http://www.yorku.ca/mack/GI92.html
5. Luca Massaron and Alberto Boschetti, Regression Analysis with Python. Birmingham, UK: Packt Publishing, Feb 2016, pp. 49–54.
6. Monaco, John V Monaco and Stewart, John C and Cha, Sung-Hyuk and Tappert, Charles C, “Behavioral Biometric Verification of Student Identity in Online Course Assessment and Authentication of Authors in Literary Works,” Biometrics: Theory, Applications and Systems (BTAS) 2013.
7. “scipy.stats.linregress,” SciPy v0.15.1 Reference Guide. Jan 2015. [Online]. Available: http://docs.scipy.org/doc/scipy-0.15.1/reference/generated/scipy.stats.linregress.html
8. The Economist, “Biometrics: Prepare to be Scanned,” Technology Quarterly Q4 2003 [Online], The Economist. Dec. 2003. Available:  http://www.economist.com/node/2246191
9. Eric W. Weisstein. "Least Squares Fitting--Perpendicular Offsets." MathWorld, Wolfram Research Inc. [Online]. Available:  http://mathworld.wolfram.com/LeastSquaresFittingPerpendicularOffsets.html
10. Charles Wheelen, Naked Statistics: Stripping the Dread from the Data. New York, NY: W. W. Norton & Company, 2013, pp. 23–26.
