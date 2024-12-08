var express = require('express');
var router = express.Router();
const weather = require('weather-js');
let {PythonShell} = require('python-shell')

// import express from 'express';
// import weather from 'weather-js';
// import {PythonShell} from 'python-shell';
//const router = express.Router();


router.get('/', function(req, res, next) {
  res.send({'msg':'respond with an api'});
});

router.get('/weather', function(req, res, next) {
  console.log("Weather route hit");
  
  // Get the zipcode from the body of the request
  var zipcode = req.query.zipcode;

  weather.find({search: zipcode, degreeType: 'F'}, function(err, result) {
    if(err) console.log(err);
  
    console.log(JSON.stringify(result, null, 2));
    res.send(JSON.stringify(result, null, 2));
  });
});

router.get('/historicalWeatherData', function(req, res, next) {
  console.log("historical Weather route hit");

  console.log(req.query);

  const latlong = JSON.parse(req.query.latlong);

  const lat = latlong.lat;
  const long = latlong.long;
  const dateOfMow = req.query.dateOfMow.replaceAll("-", ""); 

  let options = {
    mode: 'text',
    pythonPath: './.venv/bin/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './',
    args: [lat, long, dateOfMow]
  };
  
  // Create a new PythonShell instance to run 'my_script.py'
  let pyshell = new PythonShell('my_script.py', options);

  let result = [];

  // Handle the output from the Python script
  pyshell.on('message', function (message) {
      let resultObj = {};

      console.log(message); // Log the output from the Python script
      
      if(message.indexOf('-') > -1 && message.indexOf('.') > -1) {
        resultObj[`day`] = message;
      } else {
        resultObj[`heading`] = message;
      }
      result.push(resultObj);
  });

  // Handle any errors from the Python script
  pyshell.on('error', function (err) {
      console.error(err);
  });

  // Handle the end of the Python script execution
  pyshell.end(function (err, code, signal) {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      res.send(result);
  });
});

module.exports = router;
//export default router;
