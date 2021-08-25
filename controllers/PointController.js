const objectid = require('mongodb').ObjectID;
const {
    Point,
    Scout
} = require('../models');
const sequelize = require("sequelize");

const {
    createError,
    validatePointInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    points
} = require("../tests/config");

module.exports = {

    findPoint(where, result) {
        return Point
            .findOne(where)
            .then(point => {
                return result(null, point);
            })
            .catch(error => {
                result(error, null);
            });
    },
    savePoint(point, personnelId, result) {
        const {
            errors,
            isValid
        } = validatePointInput(point);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findPoint({
                name: point.name
            }, (err, dbPoint) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbPoint) {
                        const customError = createError({
                            name: "Point already exist"
                        });
                        result(customError, null);
                    } else {
                        Point.create({
                            "name": point.name,
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
    getAllPoints(page, limit, name, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };;
        }
        return Point
            .find(where)
            .select('name created created_by modified_by')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(point => {
                this.countPoint(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: point
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updatePoint(pointId, point, personnelId, result) {
        const {
            errors,
            isValid
        } = validatePointInput(point);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findPoint({
                name: point.name
            }, (err, dbPoint) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbPoint) {
                        const customError = createError({
                            name: "Point already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": point.name,
                            "modified_by": objectid(personnelId)
                        };
                        return Point
                            .findById(pointId)
                            .then(point => {
                                if (point) {
                                    //update
                                    Point.findOneAndUpdate({
                                        _id: pointId
                                    }, {
                                        $set: attributes
                                    }, {
                                        new: true,
                                        useFindAndModify: false
                                    })
                                        .then(updatedPoint => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Point does not exist"
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
    deletePoint(pointId, result) {
        if (validateId(pointId)) {
            return Point
                .findById(pointId)
                .then(point => {
                    if (point) {
                        point.remove()
                            .then(removedPoint => {
                                Scout
                                    .deleteMany({
                                        point: point._id,
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
                            id: "Point does not exist"
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
    countPoint(where, result) {
        return Point
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllPoints(result) {
        return Point
            .find()
            .then(points => {
                return result(null, points);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    // findPoint(where, result) {
    //     return Point
    //         .findOne(where)
    //         .then(point => {
    //             return result(null, point);
    //         })
    //         .catch(error => {
    //             result(error, null);
    //         });
    // },
    // migratePoint(result) {
    //     this.findPoint({
    //         $or: points
    //     }, (err, point) => {
    //         if (err) {
    //             result(err, null);
    //         } else {
    //             if (point === null) {
    //                 Point.insertMany(points)
    //                     .then(() => {
    //                         result(null, {
    //                             message: "Success"
    //                         });
    //                     })
    //                     .catch(err => {
    //                         const customError = createError({
    //                             error: "Something went wrong. Please try again"
    //                         });
    //                         result(customError, null);
    //                     })
    //             } else {
    //                 const customError = createError({
    //                     name: "Point exists"
    //                 });
    //                 result(customError, null);
    //             }
    //         }
    //     });

    // },
    // getAllPoints(result) {
    //     return Point
    //         .find()
    //         .then(points => {
    //             //console.log(points)
    //             result(null, points);
    //         })
    //         .catch(err => {
    //             result(err, null);
    //         });
    // },
}