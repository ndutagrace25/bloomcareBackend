const validator = require('validator');
const isEmpty = require('./is-empty');
const validateId = require('./objectId');

module.exports = function validateScoutInput(data) {
    let errors = {};
    data.date = !isEmpty(data.date) ? data.date : '';
    data.entry = !isEmpty(data.entry) ? data.entry : '';
    data.point = !isEmpty(data.point) ? data.point : '';
    data.issue = !isEmpty(data.issue) ? data.issue : '';
    data.longitude = !isEmpty(data.longitude) ? data.longitude : '';
    data.latitude = !isEmpty(data.latitude) ? data.latitude : '';
    data.issueCategory = !isEmpty(data.issueCategory) ? data.issueCategory : '';
    data.value = !isEmpty(data.value) ? data.value : '';

    if (!validateId(data.plant)) {
        errors.plant = 'Invalid plant provided';
    }
    if (!validateId(data.entry)) {
        errors.entry = 'Invalid entry provided';
    }
    if (!validateId(data.point)) {
        errors.point = 'Invalid point provided';
    }
    if (!validateId(data.issue)) {
        errors.issue = 'Invalid issue provided';
    }

    if (validator.isEmpty(data.date)) {
        errors.date = 'Scout date is required';
    }
    if (validator.isEmpty(data.plant)) {
        errors.plant = 'Plant is required';
    }
    if (validator.isEmpty(data.longitude)) {
        errors.longitude = 'Longitude is required';
    }
    if (validator.isEmpty(data.latitude)) {
        errors.latitude = 'Latitude is required';
    }
    if (validator.isEmpty(data.entry)) {
        errors.entry = 'Entry is required';
    }
    if (validator.isEmpty(data.point)) {
        errors.point = 'Point is required';
    }
    if (validator.isEmpty(data.issue)) {
        errors.issue = 'Issue is required';
    }
    if (validator.isEmpty(data.issueCategory)) {
        // errors.issueCategory = 'Issue category is required';
    } else {
        if (!validateId(data.issueCategory)) {
            errors.issueCategory = 'Invalid issue category provided';
        }
    }
    if (!(data.value >= 0)) {
        errors.value = 'Value is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}