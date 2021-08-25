const validator = require('validator');
const isEmpty = require('./is-empty');
const validateId = require('./objectId');

module.exports = function validateBlockInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';

    if (validator.isEmpty(data.name)) {
        errors.name = 'Block name is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}