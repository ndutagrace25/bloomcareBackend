const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    Bed,
    Plant,
    Block,
    Variety,
    BedPlant
} = require('../models');

const {
    createError,
    validateBedInput,
    isEmpty,
    validateId,
    validateBulkBedInput
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findBed(where, result) {
        return Bed
            .findOne(where)
            .then(bed => {
                return result(null, bed);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveBed(bed, personnelId, result) {
        //console.log(bed)
        const {
            errors,
            isValid
        } = validateBedInput(bed);

        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findBed({
                $and: [{
                        block: bed.block,
                    },
                    {
                        number: bed.bed_number,
                    },
                    {
                        bed_name: bed.bed_name,
                    }
                ]

            }, (err, dbBed) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbBed) {
                        const customError = createError({
                            bed: "Bed already exist"
                        });
                        result(customError, null);
                    } else {
                        Bed.create({
                                "bed_number": bed.bed_number,
                                "number": bed.bed_number,
                                "bed_name": bed.bed_name,
                                "block": objectid(bed.block),
                                "created_by": objectid(personnelId),
                                "modified_by": objectid(personnelId)
                            })
                            .then((fetchedBed) => {
                                Plant.create({
                                        "variety": objectid(bed.variety),
                                        "bed": objectid(fetchedBed._id),
                                        "plant_date": bed.plant_date,
                                        "status": bed.status,
                                        "expected_pick_date": bed.expected_pick_date,
                                        "created_by": objectid(personnelId),
                                        "modified_by": objectid(personnelId)
                                    })
                                    .then((fetchedPlant) => {
                                        result(null, {
                                            message: "Success"
                                        });
                                    })
                                    .catch(err => {
                                        const customError = createError(err);
                                        result(customError, null);
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
    bulkSaveBed(bed, personnelId, result) {
        // console.log(bed);
        const {
            errors,
            isValid
        } = validateBulkBedInput(bed);

        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            let bedPromises = [];
            let plantPromises = [];
            let bedPlantPromises = [];

            for (let r = bed.from; r <= bed.to; r++) {
                const bed_number = r;
                const bed_name = 'Bed ' + r;

                bedPromises.push(
                    Bed.create({
                        "bed_number": bed_number,
                        "number": bed_number,
                        "bed_name": bed_name,
                        "block": objectid(bed.block),
                        "created_by": objectid(personnelId),
                        "modified_by": objectid(personnelId)
                    })
                    .then((fetchedBed) => {
                        plantPromises.push(Plant.create({
                                "variety": objectid(bed.variety),
                                "bed": objectid(fetchedBed._id),
                                "plant_date": bed.plant_date,
                                "status": bed.status,
                                "expected_pick_date": bed.expected_pick_date,
                                "created_by": objectid(personnelId),
                                "modified_by": objectid(personnelId)
                            })
                            .then((fetchedPlant) => {
                                //console.log(fetchedPlant)
                                bedPlantPromises.push(BedPlant.create({
                                        bed: fetchedBed._id,
                                        plant: fetchedPlant._id
                                    })
                                    .then(() => {

                                    })
                                    .catch(err => {
                                        console.log(err);
                                        dispatch(createError(err, GET_ERRORS));
                                    })
                                );
                            })
                            .catch(err => {
                                console.log(err);
                                dispatch(createError(err, GET_ERRORS));
                            })
                        );
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch(createError(err, GET_ERRORS));
                    })
                );
            }

            Promise.all(bedPromises)
                .then(() => {
                    Promise.all(plantPromises)
                        .then(() => {
                            Promise.all(bedPlantPromises)
                                .then(() => {
                                    result(null, {
                                        message: "Success"
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    dispatch(createError(err, GET_ERRORS));
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            dispatch(createError(err, GET_ERRORS));
                        });
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(createError(err, GET_ERRORS));
                });
        }
    },
    getAllBeds(page, limit, bed_number, bed_name, block, plant_date, expected_pick_date, status, variety, result) {

        let where = {};
        if (!isEmpty(bed_number)) {
            where["number"] = bed_number;
        }
        if (!isEmpty(bed_name)) {
            where["bed_name"] = bed_name;
        }

        if (!isEmpty(block)) {
            where["block"] = block;
        }

        if (!isEmpty(plant_date)) {
            where["plant_date"] = plant_date;
        }
        if (!isEmpty(expected_pick_date)) {
            where["expected_pick_date"] = expected_pick_date;
        }
        if (!isEmpty(status)) {
            where["status"] = status;
        }
        if (!isEmpty(variety)) {
            where["variety"] = variety;
        }
        return Plant
            .find()
            .populate({
                path: 'bed variety',
                populate: {
                    path: 'block',
                    populate: {
                        path: 'parent',
                    }
                },
            })
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(bed => {
                //console.log(bed)
                this.countBed({}, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: bed
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },

    updateBed(bedId, bed, personnelId, result) {
        // console.log(bed)
        const {
            errors,
            isValid
        } = validateBedInput(bed);

        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findBed({
                $and: [{
                        block: bed.block,
                    },
                    {
                        bed_number: bed.bed_number,
                    },
                    {
                        bed_name: bed.bed_name,
                    }
                ]

            }, (err, dbBed) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbBed) {
                        const customError = createError({
                            bed: "Bed already exist"
                        });
                        result(customError, null);
                    } else {

                        const attributes = {
                            "bed_number": bed.bed_number,
                            "bed_name": bed.bed_name,
                            "block": objectid(bed.sub_block_name),
                            "modified_by": objectid(personnelId)
                        };
                        return Bed
                            .findById(bedId)
                            .then((dbBed) => {
                                if (dbBed) {
                                    //update
                                    Bed.findOneAndUpdate({
                                            _id: bedId
                                        }, {
                                            $set: attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                        .then((updatedBed) => {
                                            // console.log(updatedBed)
                                            const updatedBedId = updatedBed._id;
                                            Plant
                                                .findOne({
                                                    bed: updatedBedId,
                                                    status: 1,
                                                })
                                                .then((fetchedPlant) => {
                                                    if (fetchedPlant) {
                                                        const varietyId = fetchedPlant.variety;
                                                        //  console.log(varietyId + "...." + bed.variety)
                                                        if (fetchedPlant == null) {
                                                            const customError = createError({
                                                                bed: "Bed not found"
                                                            });
                                                            result(customError, null);
                                                        } else {
                                                            // console.log(varietyId + "...." + bed.variety)
                                                            const updateVarietyId = bed.variety;
                                                            if (varietyId.equals(updateVarietyId)) {

                                                                //update
                                                                // console.log(fetchedPlant._id)
                                                                const attributesPlant = {
                                                                    "variety": objectid(bed.variety),
                                                                    "bed": objectid(updatedBedId),
                                                                    "plant_date": bed.plant_date,
                                                                    "status": bed.status,
                                                                    "expected_pick_date": bed.expected_pick_date,
                                                                    "modified_by": objectid(personnelId)

                                                                }
                                                                Plant.findOneAndUpdate({
                                                                        _id: fetchedPlant._id
                                                                    }, {
                                                                        $set: attributesPlant
                                                                    }, {
                                                                        new: true,
                                                                        useFindAndModify: false
                                                                    })
                                                                    .then(updatedBlock => {
                                                                        result(null, {
                                                                            message: "Success"
                                                                        });
                                                                    })
                                                                    .catch(err => {
                                                                        result(err, null);
                                                                    })
                                                            } else {

                                                                Plant.findOneAndUpdate({
                                                                        _id: fetchedPlant._id
                                                                    }, {
                                                                        $set: {
                                                                            "status": 0
                                                                        }
                                                                    }, {
                                                                        new: true,
                                                                        useFindAndModify: false
                                                                    })
                                                                    .then(updatedBed => {
                                                                        Plant.create({
                                                                                "variety": objectid(bed.variety),
                                                                                "bed": objectid(fetchedBed._id),
                                                                                "plant_date": bed.plant_date,
                                                                                "status": bed.status,
                                                                                "expected_pick_date": bed.expected_pick_date,
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

                                                                    })
                                                                    .catch(err => {
                                                                        result(err, null);
                                                                    })
                                                            }
                                                        }
                                                    } else {
                                                        const customError = createError("Variety not found");
                                                        result(customError, null);
                                                    }
                                                })
                                                .catch(err => {
                                                    const customError = createError(err);
                                                    result(customError, null);
                                                });

                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Bed does not exist"
                                    });
                                    result(customError, null);
                                }

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
    deleteBed(bedId, result) {
        if (validateId(bedId)) {
            return Bed
                .findById(bedId)
                .then(bed => {
                    if (bed) {
                        bed.remove()
                            .then(() => {
                                Plant
                                    .deleteMany({
                                        "bed": bedId
                                    })
                                    .then((deletePlant) => {
                                        // console.log(deletePlant)
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
                            id: "Bed does not exist"
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
    countBed(where, result) {
        return Bed
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    fetchAllBeds(result) {
        return Bed
            .find()
            .populate('sub_block')
            .then(beds => {
                return result(null, beds);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
}