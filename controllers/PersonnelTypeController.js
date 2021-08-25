const {
    PersonnelType
} = require('../models');
const {
    isEmpty,
    createError
} = require('../validation');
const sequelize = require("sequelize");

module.exports = {
    findPersonnelType(where, result) {
        return PersonnelType
            .findOne(where)
            .then(personnelType => {
                return result(null, personnelType);
            })
            .catch(error => {
                result(error, null);
            });
    },
    migratePersonnelType(result) {
        this.findPersonnelType({
            $or: [{
                name: "Admin"
            }, {
                name: "Scout"
            }]
        }, (err, personnelType) => {
            if (err) {
                result(err, null);
            } else {
                if (personnelType === null) {
                    PersonnelType.insertMany(
                            [{
                                name: "Admin"
                            }, {
                                name: "Scout"
                            }]
                        )
                        .then(() => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            const customError = createError({
                                error: "Something went wrong. Please try again"
                            });
                            result(customError, null);
                        })
                } else {
                    const customError = createError({
                        name: "Personnel Type exists"
                    });
                    result(customError, null);
                }
            }
        });

    },
    getAllPersonnelType(result) {
        return PersonnelType
            .find()
            .then(personneltypes => {
                //console.log(personnels)
                result(null, personneltypes);
            })
            .catch(err => {
                console.log(err);
                result(err, null);
            });
    },
}