
var base62 = require('base62');

var elasticsearchDao = require('../dao/elasticsearch_dao');

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
