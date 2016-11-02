var fs = require('fs');
var parse = require('csv-parse');
var exec = require('child_process').exec;

fs.readdir('data/raw', function(err, filenames) {
  filenames.forEach(function(filename) {
    var file = 'data/raw/' + filename;
    exec("head -n 22 " + file + " > data/" + filename, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  });
});
