const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    IssueCategory,
    Scout
} = require('../models');

const {
    createError,
    validateIssueCategoryInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findIssueCategory(where, result) {
        return IssueCategory
            .findOne(where)
            .then(issueCategory => {
                return result(null, issueCategory);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveIssueCategory(issuecategory, personnelId, result) {
        const {
            errors,
            isValid
        } = validateIssueCategoryInput(issuecategory);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findIssueCategory({
                name: issuecategory.name
            }, (err, dbissuecategory) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbissuecategory) {
                        const customError = createError({
                            issueCategory: "Issue category already exist"
                        });
                        result(customError, null);
                    } else {
                        IssueCategory.create({
                                "name": issuecategory.name,
                                "issue": objectid(issuecategory.issue),
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
    getAllIssueCategories(page, limit, name, issue, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };
        }
        if (!isEmpty(issue)) {
            where["issue"] = issue;
        }
        return IssueCategory
            .find(where)
            .select('name issue created')
            .populate('issue')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(issueCategory => {

                this.countIssueCategory(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: issueCategory
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateIssueCategory(issueCategoryId, issuecategory, personnelId, result) {

        const {
            errors,
            isValid
        } = validateIssueCategoryInput(issuecategory);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findIssueCategory({
                name: issuecategory.name
            }, (err, dbissuecategory) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbissuecategory) {
                        const customError = createError({
                            issueCategory: "Issue category already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": issuecategory.name,
                            "issue": objectid(issuecategory.issue),
                            "modified_by": objectid(personnelId)
                        };
                        return IssueCategory
                            .findById(issueCategoryId)
                            .then(issueCategory => {
                                if (issueCategory) {
                                    //update
                                    IssueCategory.findOneAndUpdate({
                                            _id: issueCategoryId
                                        }, {
                                            $set: attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                        .then(updatedIssueCategory => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Issue category does not exist"
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
    deleteIssueCategory(issueCategoryId, result) {

        if (validateId(issueCategoryId)) {

            return IssueCategory
                .findById(issueCategoryId)
                .then(issueCategory => {
                    if (issueCategory) {
                        issueCategory.remove()
                            .then(removedIssueCategory => {
                                Scout
                                    .deleteMany({
                                        issueCategory: issueCategory._id,
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
                            id: "Issue category does not exist"
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
    fetchAllIssueCategories(result) {
        return IssueCategory
            .find()
            .then(issueCategory => {
                return result(null, issueCategory);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    countIssueCategory(where, result) {
        return IssueCategory
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    }

}