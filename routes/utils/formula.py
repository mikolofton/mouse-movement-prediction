'''
This script contains common formulas for algorithms used in both
regression_model.py and confidence_score.py
'''

import math

# Shannon's formula used in Fitts' Law to determine the index of difficulty of a mouse movement instance
def index_of_difficulty(a, w):
    exp = (2*a)/w
    return math.log2(exp)

# Euclidian distance formula used to determine the distance between two points
def distance(ax, ay, bx, by):
    xd = (bx - ax) ** 2
    yd = (by - ay) ** 2
    return math.sqrt(xd + yd)
