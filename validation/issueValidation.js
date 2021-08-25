const validator = require('validator');
const isEmpty = require('./is-empty');
const validateId = require('./objectId');

module.exports = function validateIssueInput(data) {
    let errors = {};
    data.issue_name = !isEmpty(data.issue_name) ? data.issue_name : '';
    data.issue_type = !isEmpty(data.issue_type) ? data.issue_type : '';
    data.tolerance_type = !isEmpty(data.tolerance_type) ? data.tolerance_type : '';
    data.score = !isEmpty(data.score) ? data.score : '';

    if (validator.isEmpty(data.issue_name)) {
        errors.issue_name = 'Issue name is required';
    }
    if (!validateId(data.issue_type)) {
        errors.issue_type = 'Invalid issue type provided';
    }
    if (validator.isEmpty(data.issue_type)) {
        errors.issue_type = 'Issue type is required';
    }
    if (!validateId(data.tolerance_type)) {
        errors.tolerance_type = 'Invalid tolerance type provided';
    }
    if (validator.isEmpty(data.tolerance_type)) {
        errors.tolerance_type = 'Tolerance type is required';
    }
    if (!validateId(data.score)) {
        errors.score = 'Invalid score provided';
    }
    if (validator.isEmpty(data.score)) {
        errors.score = 'Score is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}