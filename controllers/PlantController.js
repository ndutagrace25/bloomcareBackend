const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");

const {
    Plant
} = require('../models');

const {
    createError,
    validatePlantInput,
    isEmpty,
    validateId
} = require('../validation');

module.exports = {
    findPlant(where, result) {
        return Plant
            .findOne(where)
            .then(plant => {
                return result(null, plant);
            })
            .catch(error => {
                result(error, null);
            });
    },
    savePlant(plant, personnelId, result) {
        // console.log(plant)
        const {
            errors,
            isValid
        } = validatePlantInput(plant);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            const newPlant = {
                "plant_date": plant.plant_date,
                "expected_pick_date": plant.expected_pick_date,
                "status": plant.status,
                "block": objectid(plant.block),
                "bed": objectid(plant.bed),
                "variety": objectid(plant.variety),
                "created_by": objectid(personnelId),
                "modified_by": objectid(personnelId)
            };

            Plant.create(newPlant)
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
    },
    getAllPlants(page, limit, plant_date, expected_pick_date, status, block, bed, flower, result) {
        let where = {};
        if (!isEmpty(plant_date)) {
            where["plant_date"] = plant_date;
        }
        if (!isEmpty(expected_pick_date)) {
            where["expected_pick_date"] = expected_pick_date;
        }
        if (!isEmpty(status)) {
            where["status"] = status;
        }
        if (!isEmpty(block)) {
            where["block"] = block;
        }
        if (!isEmpty(bed)) {
            where["bed"] = bed;
        }
        if (!isEmpty(flower)) {
            where["flower"] = flower;
        }
        return Plant
            .find(where)
            .populate({
                path: 'flower bed',
                populate: {
                    path: 'block'
                }
            })
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(plant => {
                this.countPlant(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: plant
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    countPlant(where, result) {
        return Plant
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    updatePlant(plantId, plant, personnelId, result) {
        const {
            errors,
            isValid
        } = validatePlantInput(plant);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            const attributes = {
                "plant_date": plant.plant_date,
                "expected_pick_date": plant.expected_pick_date,
                "status": plant.status,
                "block": objectid(plant.block),
                "bed": objectid(plant.bed),
                "flower": objectid(plant.flower),
                "modified_by": objectid(personnelId)
            };
            return Plant
                .findById(plantId)
                .then(plant => {
                    if (plant) {
                        //update
                        Plant.findOneAndUpdate({
                            _id: plantId
                        }, {
                            $set: attributes
                        }, {
                            new: true,
                            useFindAndModify: false
                        })
                            .then(updatedPlant => {
                                result(null, {
                                    message: "Success"
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    } else {
                        const customError = createError({
                            id: "Plant does not exist"
                        });
                        result(customError, null);
                    }
                })
                .catch(err => {
                    result(err, null);
                })
        }
    },
    deletePlant(plantId, result) {
        if (validateId(plantId)) {
            return Plant
                .findById(plantId)
                .then(plant => {
                    if (plant) {
                        plant.remove()
                            .then(removedPlant => {
                                result(null, {
                                    message: "Success"
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    } else {
                        const customError = createError({
                            id: "Plant does not exist"
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
    fetchAllPlants(result) {
        return Plant
            .find({
                status: 1
            })
            .then(plants => {
                return result(null, plants);
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },

}