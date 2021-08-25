const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    IssueType,
    Issue
} = require('../models');

const {
    userPhone
} = require('../tests/config');

const {
    createError,
    validateIssueTypeInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findIssueType(where, result) {
        return IssueType
            .findOne(where)
            .then(issueType => {
                return result(null, issueType);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveIssueType(issueType, personnelId, result) {
        const {
            errors,
            isValid
        } = validateIssueTypeInput(issueType);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findIssueType({
                name: issueType.name
            }, (err, dbissueType) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbissueType) {
                        const customError = createError({
                            name: "Issue type already exist"
                        });
                        result(customError, null);
                    } else {
                        IssueType.create({
                            "name": issueType.name,
                            "created_by": objectid(personnelId),
                            "modified_by": objectid(personnelId)
                        })
                            .then(() => {
                                result(null, {
                                    message: "Success"
                                });
                            })
                            .catch(err => {
                                const customError = createError(err);
                                result(customError, null);
                            });
                    }
                }
            });
        }
    },
    getAllIssueType(page, limit, name, result) {
        let where = {};

        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };
        }

        return IssueType
            .find(where)
            .select('name created created_by modified_by')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(issueType => {
                this.countIssueType(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: issueType
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateIssueType(issueTypeId, issueType, personnelId, result) {
        const {
            errors,
            isValid
        } = validateIssueTypeInput(issueType);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findIssueType({
                name: issueType.name
            }, (err, dbissueType) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbissueType) {
                        const customError = createError({
                            name: "Issue type already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": issueType.name,
                            "modified_by": objectid(personnelId)
                        };
                        return IssueType
                            .findById(issueTypeId)
                            .then(issueType => {
                                if (issueType) {
                                    //update
                                    IssueType.findOneAndUpdate({
                                        _id: issueTypeId
                                    }, {
                                        $set: attributes
                                    }, {
                                        new: true,
                                        useFindAndModify: false
                                    })
                                        .then(updatedIssueType => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Issue Type does not exist"
                                    });
                                    result(customError, null);
                                }
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    }
                }
            });

        }
    },
    deleteIssueType(issueTypeId, result) {
        if (validateId(issueTypeId)) {
            return IssueType
                .findById(issueTypeId)
                .then(issueType => {
                    if (issueType) {
                        issueType.remove()
                            .then((removedIssueType) => {

                                Issue
                                    .deleteMany({
                                        issue_type: issueType._id,
                                    })
                                    .then(() => {
                                        result(null, {
                                            message: "Success"
                                        });
                                    })
                                    .catch(err => {
                                        result(err, null);
                                    })
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    } else {
                        const customError = createError({
                            id: "Issue Type does not exist"
                        });
                        result(customError, null);
                    }
                })
                .catch(err => {
                    const customError = createError(err);
                    result(customError, null);
                })
        } else {
            const customError = createError({
                id: "Invalid id provided"
            });
            result(customError, null);
        }
    },
    countIssueType(where, result) {
        return IssueType
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllIssueTypes(result) {
        return IssueType
            .find()
            .then(issueTypes => {
                return result(null, issueTypes);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
}