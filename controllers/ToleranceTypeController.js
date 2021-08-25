const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    ToleranceType,
    Issue,
    Tolerance
} = require('../models');

const {
    userPhone
} = require('../tests/config');

const {
    createError,
    validateToleranceTypeInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findToleranceType(where, result) {
        return ToleranceType
            .findOne(where)
            .then(toleranceType => {
                return result(null, toleranceType);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveToleranceType(toleranceType, personnelId, result) {
        const {
            errors,
            isValid
        } = validateToleranceTypeInput(toleranceType);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findToleranceType({
                name: toleranceType.name
            }, (err, user) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (user) {
                        const customError = createError({
                            name: "Tolerance type already exist"
                        });
                        result(customError, null);
                    } else {
                        ToleranceType.create({
                            "name": toleranceType.name,
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
    getAllToleranceType(page, limit, name, result) {
        let where = {};

        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };;
        }

        return ToleranceType
            .find(where)
            .select('name created created_by modified_by')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(toleranceType => {
                this.countToleranceType(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: toleranceType
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateToleranceType(toleranceTypeId, toleranceType, personnelId, result) {
        const {
            errors,
            isValid
        } = validateToleranceTypeInput(toleranceType);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {

            this.findToleranceType({
                name: toleranceType.name
            }, (err, user) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (user) {
                        const customError = createError({
                            name: "Tolerance type already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": toleranceType.name,
                            "modified_by": objectid(personnelId)
                        };

                        ToleranceType
                            .findById(toleranceTypeId)
                            .then(toleranceType => {
                                if (toleranceType) {
                                    //update
                                    ToleranceType.findOneAndUpdate({
                                        _id: toleranceTypeId
                                    }, {
                                        $set: attributes
                                    }, {
                                        new: true,
                                        useFindAndModify: false
                                    })
                                        .then(updatedToleranceType => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Tolerance Type does not exist"
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
    deleteToleranceType(toleranceTypeId, result) {
        if (validateId(toleranceTypeId)) {

            return ToleranceType
                .findById(toleranceTypeId)
                .then(toleranceType => {

                    if (toleranceType) {

                        toleranceType.remove()
                            .then(removedToleranceType => {
                                Issue
                                    .deleteMany({
                                        tolerance_type: toleranceType._id
                                    })
                                    .then(() => {
                                        Tolerance
                                            .deleteMany({
                                                tolerance_type: toleranceType._id
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
                            id: "Tolerance Type does not exist"
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
    countToleranceType(where, result) {
        return ToleranceType
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },

    fetchAllToleranceTypes(result) {
        return ToleranceType
            .find()
            .then(toleranceType => {
                return result(null, toleranceType);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },


}