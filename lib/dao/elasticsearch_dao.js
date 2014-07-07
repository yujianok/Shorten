
var constants = require('../constants');

var client = require('elasticsearch').Client({
    hosts: constants.get('es_hosts')
});

var index = constants.get('es_index');

exports.save = function (user, type, entity, callback) {
    entity._user = user;
    incrementId('global', type, function(id) {
        client.index({
              index: index,
              type: type,
              id: id,
              body: entity
        }, function (error, response) {
            if (callback) {
                callback(error, response);
            }
        });
    });

}

exports.get = function (user, type, id, callback) {
    client.getSource({
      index: index,
      type: type,
      id: id
    }, function (error, response) {
        if(callback) {
            if (response && user != 'global') {
                response = response._user == user ? response : null;
            }
            callback(error, response);
        }
    });
}

exports.update = function (user, type, id, entity, callback) {
    client.update({
      index: index,
      type: type,
      id: id,
      body: {
        doc: entity
      }
    }, function (error, response) {
        if(callback) {
            callback(error, response);
        }
    })

}

exports.find = function (user, type, query, callback) {
    client.indices.refresh({index: index}, function(error, response){
        if (error && callback) {
            callback(error);
        } else {
            client.search({
                    index: index,
                    type: type,
                    from: query.from,
                    size: query.size,
                    body: transformQuery(user, query)
                }, function (error, response) {
                    if(callback) {
                        if (error) {
                            callback(error);
                        } else {
                            var result = [];
                            for (var i in response.hits.hits) {
                                result.push(response.hits.hits[i]._source);
                            }

                            callback(error, result);
                        }
                    }
            });
        }
    });
}

exports.count = function (user, type, query, callback) {
    client.indices.refresh({index: index}, function(error, response){
        if (error && callback) {
            callback(error);
        } else {
            client.count({
                    index: index,
                    type: type,
                    body: transformQuery(user, query)
                }, function (error, response) {
                    if(callback) {
                        if (error) {
                            callback(error);
                        } else {
                            callback(error, response.hits.total)
                        }
                    }
            });
        }
    });
}

function incrementId(user, type, callback) {
    client.index({
          index: index,
          type: 'id_sequence',
          id: user + '_' + type,
          body: {user: user, type: type}
        }, function (error, response) {
            if (callback) {
                callback(response._version);
            }
        });
}

function transformQuery(user, query) {
    var filters = [{term: {_user: user}}];
    query.conditions.forEach(function(condition) {
        if (condition.comparator == null || condition.comparator == 'eq') {
            var filter = {term: {}};
            filter.term[condition.name] = condition.value;
            filters.push(filter);
        } else if (condition.comparator == 'gt') {
            var filter = {range: {}}
            filter.range[condition.name] = {gt: condition.value};
            filters.push(filter);
        } else if (condition.comparator == 'lt') {
            var filter = {range: {}}
            filter.range[condition.name] = {lt: condition.value};
            filters.push(filter);
        } else if (condition.comparator == 'gte') {
            var filter = {range: {}}
            filter.range[condition.name] = {gte: condition.value};
            filters.push(filter);
        } else if (condition.comparator == 'lte') {
            var filter = {range: {}}
            filter.range[condition.name] = {lte: condition.value};
            filters.push(filter);
        }
    });

    return {filter: {and: filters}};
}