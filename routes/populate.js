/*
 This script wil be used to populate collections with data from csv files.
 It will take userid and quize number as paramaters from URL. The list of file array will be passed as POST method with no limitation.
 */
var fs = require('fs');
var readline = require('readline');
var csvConverter = require("csvtojson").Converter;
var conversion = new csvConverter({});

// {
//   "uid":1,
//   "quiz":[
//     {
//       "qid":1,
//       "mt":[1,2],
//       "origin":[{
//           "x":0,
//           "y":1
//         },{
//           "x":1,
//           "y":2
//         }],
//         "offset":[{
//           "x":6,
//           "y":7
//         },{
//           "x":3,
//           "y":5
//         }],
//         "w":[50,60],
//         "a": [30,40]
//       }
//     ]
//   }

var csvDoc = {"quiz": []};
var dbDocList = [];
fs.readdir('../data/', function(err, filenames) {
  if (err) {
    console.log(err);
    return err;
  }
  filenames.forEach(function(filename, index) {
    // Loop through each file = each quiz
    var fn = filename.split('_');
    var userNum = parseInt(fn[0].split('U')[1]);
    var quizNum = parseInt(fn[1].split('Q')[1]);

    if (!(csvDoc['uid'] === userNum)) {
        csvDoc['uid'] = userNum;
    }

    csvDoc['quiz'].push({"qid": quizNum})

    fs.readFile('../data/' + filename, 'utf-8', function(err, content) {
      var fileLines = content.split('\n');
      var csvmts = [];

      fileLines.forEach(function(line, idx) {
        if (idx === 0 || idx > 21)
          return;
        else {
          var currVals = line[idx].split(',');
          var nextTimeVal = line[idx + 1].split(',')[0];
          var currMT = Math.abs(currVals[0] - nextTimeVal);
          csvmts.push(currMT);
        }

        console.log("line#" + idx + ' | ' + currMT);
      })
      console.log("file: " + filename + ' | ' + csvmts);
      console.log("uid: " + userNum + ", qid: " + quizNum);
    });
  });
  console.log(csvDoc);
});
