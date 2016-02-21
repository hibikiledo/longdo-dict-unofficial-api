var express = require('express');
var router = express.Router();

var Client = require('./../lib/client');
var Parser = require('./../lib/result-parser');

var client = new Client();
var parser = new Parser();

// search api endpoint : accepts [query] as string
router.get('/:query', function(req, res, next) {

  client.lookup(req.params.query)
    .then(function(html) {
      console.log('HTML: OK >> Parser');
      try {
        res.json({err: false, result: parser.parse(html)});
      } catch (e) {
        console.log(e);
      }
    })
    .catch(function(reason) {
      console.log('HTML: ERR');
      res.json({err: true, reason: reason});
    });

});

module.exports = router;
