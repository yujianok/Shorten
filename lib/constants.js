
var constants = require('nconf').argv().env().file({ file: 'config.json' });

module.exports = constants;