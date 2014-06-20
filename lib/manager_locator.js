
exports.getManager = function(type) {
    var genericManager = require('./manager/generic_manager');
    try {
        var specificManager = require('./manager/' + type + '_manager');

        return combine(specificManager, genericManager);
    } catch(err) {
        return genericManager;
    }
}

function combine(specificManager, genericManager) {
    var result = {
        retrieve: genericManager.retrieve,
        query: genericManager.query,
        create: genericManager.create,
        update: genericManager.update,
        delete: genericManager.delete
    };

    if (specificManager.retrieve != null) {
        result.retrieve = specificManager.retrieve;
    }
    if (specificManager.query != null) {
        result.query = specificManager.query;
    }
    if (specificManager.create != null) {
        result.create = specificManager.create;
    }
    if (specificManager.update != null) {
        result.update = specificManager.update;
    }
    if (specificManager.delete != null) {
        result.delete = specificManager.delete;
    }

    return result;
}