const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    Issue,
    Scout,
    IssueCategory
} = require('../models');

const {
    createError,
    validateIssueInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findIssue(where, result) {
        return Issue
            .findOne(where)
            .then(issue => {
                return result(null, issue);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveIssue(issue, personnelId, result) {
        const {
            errors,
            isValid
        } = validateIssueInput(issue);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findIssue({
                issue_name: issue.issue_name
            }, (err, dbIssue) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbIssue) {
                        const customError = createError({
                            issue: "Issue already exist"
                        });
                        result(customError, null);
                    } else {
                        Issue.create({
                                "issue_name": issue.issue_name,
                                "issue_type": objectid(issue.issue_type),
                                "tolerance_type": objectid(issue.tolerance_type),
                                "score": objectid(issue.score),
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
    getAllIssues(page, limit, issue_name, issue_type, tolerance_type, score, result) {
        let where = {};

        if (!isEmpty(issue_type)) {
            where["issue_type"] = issue_type;
        }
        if (!isEmpty(issue_name)) {
            where["issue_name"] = {
                $regex: '^' + issue_name,
                $options: 'i'
            };
        }
        if (!isEmpty(tolerance_type)) {
            where["tolerance_type"] = tolerance_type;
        }
        if (!isEmpty(score)) {
            where["score"] = score;
        }
        return Issue
            .find(where)
            .populate('score issue_type tolerance_type')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(issue => {
                // console.log(issue)
                this.countIssue(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: issue
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateIssue(issueId, issue, personnelId, result) {
        const {
            errors,
            isValid
        } = validateIssueInput(issue);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {

            this.findIssue({
                issue_name: issue.issue_name
            }, (err, dbIssue) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbIssue) {
                        const customError = createError({
                            issue: "Issue already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "issue_name": issue.issue_name,
                            "issue_type": objectid(issue.issue_type),
                            "tolerance_type": objectid(issue.tolerance_type),
                            "score": objectid(issue.score),
                            "modified_by": objectid(personnelId)
                        }
                        Issue
                            .findById(issueId)
                            .then(issue => {
                                if (issue) {
                                    //update
                                    Issue.findOneAndUpdate({
                                            _id: issueId
                                        }, {
                                            $set: attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                        .then(updatedIssue => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Issue does not exist"
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
    deleteIssue(issueId, result) {
        if (validateId(issueId)) {
            return Issue
                .findById(issueId)
                .then(issue => {
                    if (issue) {
                        issue.remove()
                            .then(removedIssue => {
                                IssueCategory
                                    .deleteMany({
                                        "issue": issue._id
                                    })
                                    .then(() => {
                                        Scout
                                            .deleteMany({
                                                "issue": issue._id
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
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    } else {
                        const customError = createError({
                            id: "Issue does not exist"
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
    countIssue(where, result) {
        return Issue
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllIssues(result) {
        return Issue
            .find()
            .then(issue => {
                // console.log(issue)
                return result(null, issue);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
}