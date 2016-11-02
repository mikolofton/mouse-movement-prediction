var spawn = require('child_process').spawn;
var py = spawn('python3', ['confidence_score.py']);
var scoreDoc = {"uid":1,"auth":{"a":3,"tw":5,"mt":2},"metrics":{"slope":-4.843767254792989,"cod":1.0,"cc":-1.0,"instances":{"iods":[-3.321928094887362,-3.5283789723547887,-3.321928094887362,-3.5283789723547887,-3.321928094887362,-3.5283789723547887],"predictions":[1.0,2.0,1.0,2.0,1.0,2.0],"variances":[0.0,0.0,0.0,0.0,0.0,0.0],"mts":[1,2,1,2,1,2]},"mean":{"pmt":1.5,"amt":1.5,"v":0.0,"iod":-3.4251535336210757},"yInt":-15.090646528792263,"se":0.0}};
var confidence = '';


//{"uid":1,"quiz":[{"qid":1,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":2,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":3,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]}]};
py.stdin.write(JSON.stringify(scoreDoc));
py.stdout.on('data', function(chunk) {
  console.log(chunk.toString())
  confidence += chunk.toString();
});
py.stdout.on('end', function(){
  console.log('Sum of numbers=',confidence);
});

py.stdin.end();
// "score": {
//     "uid": 1,
//     "auth": {
//         "a": 3,
//         "tw": 5,
//         "mt": 2
//     },
//     "metrics": {
//         "slope": -4.843767254792989,
//         "cod": 1.0,
//         "cc": -1.0,
//         "instances": {
//             "iods": [-3.321928094887362, -3.5283789723547887, -3.321928094887362, -3.5283789723547887, -3.321928094887362, -3.5283789723547887],
//             "predictions": [1.0, 2.0, 1.0, 2.0, 1.0, 2.0],
//             "variances": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
//             "mts": [1, 2, 1, 2, 1, 2]
//         },
//         "mean": {
//             "pmt": 1.5,
//             "amt": 1.5,
//             "v": 0.0,
//             "iod": -3.4251535336210757
//         },
//         "yInt": -15.090646528792263,
//         "se": 0.0
//     }
// }
