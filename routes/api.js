var express = require('express');
var router = express.Router();
const weather = require('weather-js');


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

<<<<<<< HEAD
// router.get('/stats', function(req, res, next) {
//   console.log("Stats! route hit");

//   const chart = Chart;

//   res.send(chart, null, 2);
// });

=======
>>>>>>> 6dcb9073d401bd83a60af6c8dbb6bf404079472b
module.exports = router;
