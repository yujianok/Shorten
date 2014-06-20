var express = require('express');
var bodyParser = require('body-parser');
var managerLocator = require('./manager_locator');

var router = express.Router();

router.use(bodyParser.json());

router.post('/:user/:type', function(req, res) {
    var user = req.params.user;
    var type = req.params.type;

    var manager = managerLocator.getManager(type);
    var result = manager.create(user, type, req.body);

    res.json(result);
});

module.exports = router;
