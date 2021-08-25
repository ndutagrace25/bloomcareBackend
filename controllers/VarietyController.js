const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    Variety,
    Plant
} = require('../models');

const {
    createError,
    validateVarietyInput,
    isEmpty,
    validateId
} = require('../validation');

module.exports = {
    findVariety(where, result) {
        return Variety
            .findOne(where)
            .then(variety => {
                return result(null, variety);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveVariety(variety, personnelId, result) {
        const {
            errors,
            isValid
        } = validateVarietyInput(variety);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findVariety({
                name: variety.name
            }, (err, dbVariety) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbVariety) {
                        const customError = createError({
                            name: "Variety already exist"
                        });
                        result(customError, null);
                    } else {
                        Variety.create({
                                "name": variety.name,
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
    getAllvarieties(page, limit, name, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            };;
        }
        return Variety
            .find(where)
            .select('name created created_by modified_by')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(variety => {
                this.countVariety(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: variety
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateVariety(varietyId, variety, personnelId, result) {
        const {
            errors,
            isValid
        } = validateVarietyInput(variety);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {

            this.findVariety({
                name: variety.name
            }, (err, dbVariety) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbVariety) {
                        const customError = createError({
                            name: "Variety already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": variety.name,
                            "modified_by": objectid(personnelId)
                        };
                        return Variety
                            .findById(varietyId)
                            .then(variety => {
                                if (variety) {
                                    //update
                                    Variety.findOneAndUpdate({
                                            _id: varietyId
                                        }, {
                                            $set: attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                        .then(updatedVariety => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Variety does not exist"
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
    deleteVariety(varietyId, result) {

        if (validateId(varietyId)) {
            return Variety
                .findById(varietyId)
                .then(variety => {
                    if (variety) {
                        variety.remove()
                            .then(removedVariety => {
                                Plant
                                    .deleteMany({
                                        variety: variety._id
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
                            id: "Variety does not exist"
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
    countVariety(where, result) {
        return Variety
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllVarieties(result) {
        return Variety
            .find()
            .then(varieties => {
                return result(null, varieties);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
}