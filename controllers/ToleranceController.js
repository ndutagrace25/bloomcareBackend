const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    Tolerance,
    Scout
} = require('../models');

const {
    createError,
    validateToleranceInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findTolerance(where, result) {
        return Tolerance
            .findOne(where)
            .then(tolerance => {
                return result(null, tolerance);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveTolerance(tolerance, personnelId, result) {

        const {
            errors,
            isValid
        } = validateToleranceInput(tolerance);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findTolerance({
                "name": tolerance.name,
                $and: [{
                        "from": tolerance.from
                    },
                    {
                        "to": tolerance.to
                    },
                ]

            }, (err, dbTolerance) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbTolerance) {
                        const customError = createError({
                            tolerance: "Tolerance already exist"
                        });
                        result(customError, null);
                    } else {
                        Tolerance.create({
                                "name": tolerance.name,
                                "from": tolerance.from.valueOf(),
                                "to": tolerance.to.valueOf(),
                                "tolerance_type": objectid(tolerance.tolerance_type),
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
    getAllTolerance(page, limit, name, tolerance_type, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };
        }
        // if (!isEmpty(tolerance_type)) {
        //     where["tolerance_type"] = tolerance_type;
        // }
        return Tolerance
            .find(where)
            .populate("tolerance_type")
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(tolerance => {
                this.countTolerance(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: tolerance
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateTolerance(toleranceId, tolerance, personnelId, result) {
        const {
            errors,
            isValid
        } = validateToleranceInput(tolerance);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {

            this.findTolerance({
                "name": tolerance.name,
                $and: [{
                        "from": tolerance.from
                    },
                    {
                        "to": tolerance.to
                    },
                ]

            }, (err, dbTolerance) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbTolerance) {
                        const customError = createError({
                            tolerance: "Tolerance already exist"
                        });
                        result(customError, null);
                    } else {
                        return Tolerance
                            .findById(toleranceId)
                            .then(tolerance => {
                                if (tolerance) {
                                    //update
                                    Tolerance.findOneAndUpdate({
                                            _id: toleranceId
                                        }, {
                                            $set: attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                        .then(updatedTolerance => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Tolerance does not exist"
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
            const attributes = {
                "name": tolerance.name,
                "from": tolerance.from.valueOf(),
                "to": tolerance.to.valueOf(),
                "tolerance_type": objectid(tolerance.tolerance_type),
                "modified_by": objectid(personnelId)

            };
        }
    },
    deleteTolerance(toleranceId, result) {

        if (validateId(toleranceId)) {
            return Tolerance
                .findById(toleranceId)
                .then(tolerance => {
                    if (tolerance) {
                        tolerance.remove()
                            .then(removedTolerance => {
                                Scout
                                    .deleteMany({
                                        tolerance: tolerance._id
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
                            id: "Tolerance does not exist"
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
    countTolerance(where, result) {
        return Tolerance
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllTolerance(name, tolerance_type, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = name;
        }

        if (!isEmpty(tolerance_type)) {
            where["tolerance_type"] = tolerance_type;
        }

        return Tolerance
            .find(where)
            .select('name to from tolerance_type created')
            .populate('tolerance_type')
            .sort({
                created: 'asc'
            })
            .exec()
            .then(tolerance => {
                return result(null, tolerance);
            })
            .catch(err => {
                result(err, null);
            });
    },
}