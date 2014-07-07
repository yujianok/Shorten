var base62 = require('base62');
var elasticsearchDao = require('../dao/elasticsearch_dao');
var constants = require('../constants');
var shortUrlPattern = new RegExp('http:\\/\\/' + constants.get('domain_name') + '\\/([A-Za-z0-9_]+)');

exports.create = function(user, type, entity, callback) {
    var statistics = entity.statistics;
    var shortUrl = entity.url;
    var shortUrlMatch = shortUrlPattern.exec(shortUrl);
    if (shortUrlMatch) {
        var shortUrlId = base62.decode(shortUrlMatch[1]);
    } else {
        callback("错误的短链接地址！");
        return;
    }

    elasticsearchDao.get('global', 'short_url', shortUrlId, function(error, result){
       if (callback) {
           callback(error, result);
       }
    });
};

