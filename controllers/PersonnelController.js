const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
    Personnel,
    personneltype
} = require('../models');

const {
    cleanPhone,
    createError,
    validatePersonnelInput,
    validateLoginInput,
    isEmpty,
    validateId
} = require('../validation');

const {
    keys,
} = require('../config');

module.exports = {
    findById(id, result) {

        if (id > 0) {

            Personnel.findOne({
                attributes: ['id', 'first_name', 'phone', 'password', 'last_name', 'reset_password'],
                where: {
                    id: id
                }
            })
                .then(personnel => {
                    if (personnel) {
                        result(null, personnel);
                    } else {
                        let err = {
                            error: "Personel does not exist"

                        };
                        result(err, null);
                    }
                })
                .catch(error => {
                    result(error, null);
                })
        } else {
            let err = {
                error: "The ID is not a number"
            };
            result(err, null);
        }
    },
    findpersonnel(where, result) {
        Personnel
            .findOne({
                raw: true,
                attributes: ['*'],
                where: where
            })
            .then(user => {
                return result(null, user)
            })
            .catch(error => {
                result(error, null);
            });
    },

    login(personnel, result) {
        const {
            errors,
            isValid
        } = validateLoginInput(personnel);

        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findpersonnel({ phone: personnel.phone },
                (err, user) => {
                    if (err) {
                        result(err, null);
                    } else {
                        if (user) {
                            if (user.reset_password === 1) {
                                const customError = createError({
                                    password: "Please reset your password"
                                });
                                result(customError, null);
                            } else {

                                bcrypt.compare(personnel.password, user.password)
                                    .then(isMatch => {
                                        if (isMatch) {
                                            const payload = {
                                                id: user.id,
                                                first_name: user.first_name,
                                                last_name: user.last_name,
                                                phone: user.phone,
                                                personnel_type_id: user.personnel_type_id,
                                            };
                                            jwt.sign(
                                                payload,
                                                keys.secretKey, {
                                                expiresIn: 31536000
                                            },
                                                (err, token) => {
                                                    if (err) {
                                                        const customError = createError(err);
                                                        result(customError, null);
                                                    } else {
                                                        const res = {
                                                            reset_password: 0,
                                                            accessToken: token,
                                                            expires_in: "24h"
                                                        };
                                                        result(null, res);
                                                    }
                                                }
                                            );
                                        } else {
                                            const customError = createError({
                                                password: "You have entered an incorrect password"
                                            });
                                            result(customError, null);
                                        }
                                    });
                            }
                        } else {
                            const customError = createError({
                                phone: "Phone does not exist"
                            });
                            result(customError, null);
                        }
                    }
                });

        }
    },
    resetPassword(personnel, result) {
        const {
            errors,
            isValid
        } = validateLoginInput(personnel);
        if (!isValid) {
            const customError = createError(errors)
            result(customError, null);
        } else {
            this.findpersonnel({ phone: personnel.phone }, (err, user) => {

                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (user) {

                        if (user.reset_password !== 1) {
                            const customError = createError({
                                password: "please request an admin permission to request your password"
                            });
                            result(customError, null);
                        } else {
                            // console.log('lusso')

                            bcrypt.genSalt(10, (err, salt) => {
                                if (err) {
                                    const customError = createError(err)
                                    result(customError, null)
                                } else {
                                    bcrypt.hash(personnel.password, salt, (err, hash) => {
                                        if (err) {
                                            const customError = createError(err);
                                            result(customError, null);
                                        } else {
                                            Personnel.update({
                                                password: hash,
                                                reset_password: 0
                                            }, {
                                                where: {
                                                    phone: personnel.phone
                                                }

                                            })
                                                .then(() => {
                                                    result(null, {
                                                        message: "password successfully reset"
                                                    });
                                                })
                                                .catch(err => {
                                                    const customError = createError(err);
                                                    result(customError, null)
                                                });
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        const customError = createError({
                            phone: "phone number does not exist"
                        });
                        result(customError, null);
                    }
                }
            });
        }
    },
    savePersonnel(personnel, personnelId, result) {
        const {
            errors,
            isValid
        } = validatePersonnelInput(personnel);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findpersonnel({ phone: personnel.phone }, (err, user) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    const password = "123456";
                    if (user) {
                        const customError = createError({
                            phone: "Phone already exist"
                        });
                        result(customError, null);
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(password, salt, (err, hash) => {
                                if (err) {
                                    const customError = createError(err);
                                    result(customError, null);
                                } else {
                                    Personnel.create({
                                        "first_name": personnel.first_name,
                                        "last_name": personnel.last_name,
                                        "phone": personnel.phone,
                                        "status": personnel.status,
                                        "personnel_type_id": personnel.personnel_type_id,
                                        "reset_password": 1,
                                        "password": hash,
                                        "created_by": personnelId
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
                            });
                        });
                    }
                }
            });
        }
    },
    getAllPersonnel(page, limit, order, ordermethod, first_name, last_name, phone, status, personnel_type_id, result) {
        let where = {};
        // console.log(where)
        if (phone !== "") {
            where["phone"] = {
                [Op.like]: '%' + phone + '%'
            }
        }
        if (!isEmpty(first_name)) {
            where["first_name"] = {
                [Op.like]: '%' + first_name + '%'
            }
        }
        if (!isEmpty(last_name)) {
            where["last_name"] = {
                [Op.like]: '%' + last_name + '%'
            };
        }
        if (!isEmpty(status)) {
            where["status"] = {
                [Op.like]: '%' + status + '%'
            };
        }
        if (!isEmpty(personnel_type_id)) {
            where["personnel_type_id"] = {
                [Op.like]: '%' + personnel_type_id + '%'
            };
        }
        Personnel
            .findAll({
                attributes: ['*'],
                offset: page,
                limit: limit,
                raw: true,
                where: where,
                order: [
                    [order, ordermethod]
                ],
            })
            .then(personnel => {
                this.countPersonnel(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: personnel
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updatePersonnel(personnelId, personnel, loggedPersonnel, result) {
        const {
            errors,
            isValid
        } = validatePersonnelInput(personnel);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findpersonnel({
                first_name: personnel.first_name,
                last_name: personnel.last_name,
                phone: personnel.phone,
                status: personnel.status,
                personnel_type_id: personnel.personnel_type_id,
            }, (err, user) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (user) {
                        const customError = createError({
                            personnel: "Personnel already exist"
                        });
                        result(customError, null);
                    } else {
                        Personnel
                            .findByPk(personnelId)
                            .then(fetchedPersonnel => {
                                //console.log(fetchedPersonnel)
                                if (fetchedPersonnel) {
                                    Personnel.update({
                                        first_name: personnel.first_name,
                                        last_name: personnel.last_name,
                                        phone: personnel.phone,
                                        status: personnel.status,
                                        personnel_type_id: personnel.personnel_type_id,
                                        modified_by: loggedPersonnel
                                    }, {
                                        where: {
                                            id: personnelId
                                        }

                                    })
                                        .then(updatedPersonnel => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Personnel does not exist"
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
    deletePersonnel(personnelId, result) {
        Personnel
            .findByPk(personnelId)
            .then(personnel => {
                if (personnel) {
                    Personnel.destroy({
                        where: {
                            id: personnelId
                        }
                    })
                        .then(removedPersonnel => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            result(err, null);
                        })
                } else {
                    const customError = createError({
                        id: "Personnel does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            })
    },
    countPersonnel(where, result) {
        Personnel
            .count(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    exportPersonnel(result) {
        Personnel
            .findAll({
                attributes: ['*'],
                raw: true,
            })
            .then(personnel => {
                result(null, personnel);
            })
            .catch(err => {
                result(err, null);
            });

    },
    getScouts(personnel_type_id, result) {
        return Personnel
            .find({
                personnel_type_id
            })
            .select('first_name last_name phone status personnel_type_id created')
            .sort({
                created: 'asc'
            })
            .exec()
            .then(personnel => {
                result(null, personnel);
            })
            .catch(err => {
                result(err, null);
            });
    }
}