var express = require('express');
var router = express.Router();

router.post('/classify', function(req, res, next) {
  /**
   * INSTRUCTIONS:
   * -------------
   * 
   * 1. Implement the logic to call different image recognition
   * backends to classify the image.
   * 
   * 2. Once you get the response from the backend, process and return the attributes from the classified image in JSON format as below,
   * 
   * ```
   * {
   *    "labels": ["shoe", "red", "nike"]
   * }
   * ```
   * 
   * 3. Handle any errors that occur while calling the backend or procesesing the response, set the appropriate HTTP status code and return the error in JSON format as below (might want to check out the ExpressJS documentation!),
   * 
   * ```
   * {
   *    "error": "Unable to process the request"
   * }
   * ```
   * 
   * NOTE:
   * -----
   * 
   * The uploaded file is available in "req.files.file"
  */

  // Your code goes here!

  res.json({
    "labels": ["shoe", "red", "nike"]
  });
});

module.exports = router;
