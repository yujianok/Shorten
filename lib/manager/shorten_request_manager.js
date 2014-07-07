var base62 = require('base62');
var constants = require('../constants');
var elasticsearchDao = require('../dao/elasticsearch_dao');
var shortUrlPattern = new RegExp('http:\\/\\/' + constants.get('domain_name') + '\\/[A-Za-z0-9_]+');
var urlPattern = new RegExp('http[s]?:\\/\\/.*');

function hash(url) {
    var hash = 0, i, chr, len;
    if (url.length == 0) {
        return hash;
    }
    for (i = 0, len = url.length; i < len; i++) {
        chr   = url.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

exports.create = function(user, type, entity, callback) {
    if(entity.url == null || entity.url == '') {
        callback('长地址不能为空.');
        return;
    }

    if (!urlPattern.exec(entity.url)) {
        callback('不合法的链接地址！');
        return;
    }

    if (shortUrlPattern.exec(entity.url)) {
        callback('该地址已经为短地址！');
        return;
    }

    var hashCode = hash(entity.url);
    var length = entity.url.length;
    var query = {conditions: [{name: 'hashCode', value: hashCode}, {name: 'hashCode', value: hashCode}], from: 0, size: 10000};
    var type = 'short_url';

    elasticsearchDao.find(user, type, query, function(error, result){
        if (error && callback) {
            callback(error, result);
        } else {
            if (result.length >= 1 ) {
                for(var i in result) {
                    var element = result[i];
                    if (element.longUrl == entity.url) {
                        callback(error, element);
                        break;
                    }
                }
            } else {
                var shortUrlEntity = {longUrl: entity.url, hashCode: hashCode, length: length};
                elasticsearchDao.save(user, type, shortUrlEntity, function(error, result) {
                        if (error && callback){
                            callback(error, result);
                        } else {
                            var id = result._id;
                            shortUrlEntity.shortUri = base62.encode(id);
                            elasticsearchDao.update(user, type, id, shortUrlEntity, function(error, result) {
                                callback(error, shortUrlEntity);
                            });
                        }
                    });
            }
        }
    });

}
