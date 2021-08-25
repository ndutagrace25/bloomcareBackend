const ObjectID = require('mongoose').Types.ObjectId;

module.exports = function validateId(id) {
    return ObjectID.isValid(id);
}