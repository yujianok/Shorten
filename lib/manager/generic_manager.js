
exports.retrieve = function(user, type, id) {
    console.log('Retrieved');
}

exports.query = function(user, type, query) {
    console.log('Queried');
}

exports.create = function(user, type, entity) {
    console.log('Created');

    return entity;
}

exports.update = function(user, type, id, entity) {
    console.log('Updated');
}

exports.delete= function(user, type, id) {
    console.log('Deleted');
}