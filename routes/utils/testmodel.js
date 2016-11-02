var spawn = require('child_process').spawn;
var py = spawn('python3', ['regression_model.py']);
var userDoc = {"uid":1,"quiz":[{"qid":1,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":2,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":3,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]}]};
var metricDoc = '';


//{"uid":1,"quiz":[{"qid":1,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":2,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]},{"qid":3,"mt":[1,2],"origin":[{"x":0,"y":1},{"x":1,"y":2}],"offset":[{"x":6,"y":7},{"x":3,"y":5}],"w":[50,60],"a":[2.5,2.6]}]};
py.stdin.write(JSON.stringify(userDoc));
py.stdout.on('data', function(chunk) {
  console.log(chunk.toString())
  metricDoc += chunk.toString();
});
py.stdout.on('end', function(){
  var m = JSON.parse(metricDoc)
  console.log('Sum of numbers=',m['slope']);
});

py.stdin.end();
// var user = {
//     uid: 01,
//     quiz: [
//         {
//             qid: 1,
//             mt: ["1", "2"],
//             origin: [{x: 0, y: 1}, {x: 1, y:2}],
//             offset: [{x: 6, y: 7}, {x: 3, y:5}],
//             w: [50, 60],
//             a: [2.5, 2.6]
//         },
//         {
//             qid: 1,
//             mt: ["1", "2"],
//             origin: [{x: 0, y: 1}, {x: 1, y:2}],
//             offset: [{x: 6, y: 7}, {x: 3, y:5}],
//             w: [50, 60],
//             a: [2.5, 2.6]
//         },
//         {
//             qid: 1,
//             mt: ["1", "2"],
//             origin: [{x: 0, y: 1}, {x: 1, y:2}],
//             offset: [{x: 6, y: 7}, {x: 3, y:5}],
//             w: [50, 60],
//             a: [2.5, 2.6]
//         }
//     ]
// }
