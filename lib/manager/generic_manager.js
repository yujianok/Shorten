
exports.retrieve = function(user, type, id, callback) {
    console.log('Retrieved');
}

exports.query = function(user, type, query, callback) {
    console.log('Queried');
}

exports.create = function(user, type, entity, callback) {
    console.log('Created');
}

exports.update = function(user, type, id, entity, callback) {
    console.log('Updated');
}

exports.delete= function(user, type, id, callback) {
    console.log('Deleted');
}