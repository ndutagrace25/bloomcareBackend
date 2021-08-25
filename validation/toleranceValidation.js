const validator = require('validator');
const isEmpty = require('./is-empty');
const validateId = require('./objectId');

module.exports = function validateToleranceInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.to = !isEmpty(data.to) ? data.to : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.type = !isEmpty(data.type) ? data.type : '';
    data.tolerance_type = !isEmpty(data.tolerance_type) ? data.tolerance_type : '';

    if (!validateId(data.tolerance_type)) {
        errors.tolerance_type = 'Invalid tolerance type provided';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }
    if (!(data.to >= 0)) {
        errors.to = 'To is required';
    }
    if (!(data.from >= 0)) {
        errors.from = 'From is required';
    }
    if (validator.isEmpty(data.tolerance_type)) {
        errors.tolerance_type = 'Tolerance type is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}