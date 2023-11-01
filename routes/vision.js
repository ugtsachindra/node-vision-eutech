var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

router.post('/classify', function(req, res, next) {
  // DON'T return the hardcoded response after implementing the backend
  let response = [];

  // Your code starts here //

  AWS.config.update({
    accessKeyId: "AKIARAR74F5B2ZJFROOU",
    secretAccessKey: "58t6FYfBVhi0FhEKFwxOWExsgASY3dtg6EHAPcVP",
    region: "ap-southeast-1",
  });

  try {

    if (req.files) {
      // Assign image data to the photo variable
      var photo = req.files.file.data;
      var params = { Image: { Bytes: photo } };
      const rekognition = new AWS.Rekognition();

      //The promise make sure to send the response after processing AWS request and preparing labels array.
      var lebelRes = new Promise((resolve, reject)=>{
        rekognition.detectLabels(params, (err, rsp)=>{
          if (err) {
            res.status(500).json({
              "error": "Unable to process the request"
            });
          } else {
            rsp.Labels.forEach((label,index,array)=>{
              response.push(label.Name);
              if(index === array.length - 1 ) resolve();
            });
          }
        });
      });
      lebelRes.then(()=>{
        res.status(200).json({
          labels: response,
        });
      });
    }
    
  } catch (error) {
    res.status(500).json({
      "error": "Unable to process the request"
    });
  }
  // Your code ends here //

  // res.json({
  //   "labels": response
  // });
});

module.exports = router;
