var express = require('express');
var bodyParser = require('body-parser');
var revertRequestManager = require('./manager/revert_request_manager');
var constants = require('./constants');

var router = express.Router();

router.use(bodyParser.json());

router.get('/:shortUri', function(req, res) {
    var shortUrl = 'http://' + constants.get('domain_name') + '/' + req.params.shortUri;

    revertRequestManager.create(null, 'short_url', {url: shortUrl}, function(error, result){
        if (error) {
             res.send(404, error);
        } else {
            res.redirect(result.longUrl);
        }
    });

});

module.exports = router;