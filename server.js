var express = require('express');
var bodyParser = require("body-parser");

var fs = require('fs');
var csv = require('fast-csv');

var app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/populate')(app, fs, csv);



app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Successfully started server. Listening on port 3000.');
    
});
