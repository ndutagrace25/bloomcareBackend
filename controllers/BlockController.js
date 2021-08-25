const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
    Block,
    Bed
} = require('../models');

const {
    createError,
    validateBlockInput,
    isEmpty
} = require('../validation');

module.exports = {
    findBlock(where, result) {
        Block
            .findOne({
                raw: true,
                attributes: ['*'],
                where: where
            })
            .then(block => {
                return result(null, block)
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveBlock(block, personnelId, result) {
        //console
        const {
            errors,
            isValid
        } = validateBlockInput(block);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findBlock({
                name: block.name,
                number: block.number,
                parent: block.parent
            }, (err, dbBlock) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbBlock) {
                        const customError = createError({
                            block: "Block already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            name: block.name,
                            number: block.number,
                            created_by: personnelId,
                        }
                        if (!isEmpty(block.parent)) {
                            attributes["parent"] = block.parent;
                        }
                        Block.create(attributes)
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
    getAllBlocks(page, limit, order, ordermethod, name, parent, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                [Op.like]: '%' + name + '%'
            };
        }

        if (!isEmpty(parent)) {
            where["parent"] = {
                [Op.like]: '%' + parent + '%'
            };
        }
        Block
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
            .then(block => {
                this.countBlock(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: block
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateBlock(blockId, block, personnelId, result) {

        const {
            errors,
            isValid
        } = validateBlockInput(block);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {

            this.findBlock({
                name: block.name,
            }, (err, dbBlock) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbBlock) {
                        const customError = createError({
                            block: "Block already exist"
                        });
                        result(customError, null);
                    } else {
                        Block
                            .findById(blockId)
                            .then(fetchedBlock => {
                                if (fetchedBlock) {
                                    const parentBlock = fetchedBlock.parent;
                                    //console.log(parentBlock)
                                    if (parentBlock != undefined) {

                                        const Attributes = {
                                            "name": block.name,
                                            "parent": objectid(block.parent),
                                            "modified_by": objectid(personnelId)
                                        }
                                        Block.findOneAndUpdate({
                                            _id: blockId
                                        }, {
                                            $set: Attributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                            .then(updatedParentBlock => {
                                                result(null, {
                                                    message: "Success"
                                                });
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            })

                                    } else {

                                        const parentAttributes = {
                                            "name": block.name,
                                            "number": block.number,
                                            "modified_by": objectid(personnelId)
                                        }
                                        Block.findOneAndUpdate({
                                            _id: blockId
                                        }, {
                                            $set: parentAttributes
                                        }, {
                                            new: true,
                                            useFindAndModify: false
                                        })
                                            .then(updatedParentBlock => {
                                                result(null, {
                                                    message: "Success"
                                                });
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            })

                                    }
                                } else {
                                    const customError = createError({
                                        id: "Block does not exist"
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

    deleteBlock(blockId, result) {
        return Block
            .findById(blockId)
            .then(block => {

                if (block) {
                    const parent = block.parent;
                    if (parent == undefined) {
                        const blockName = block.name;
                        Block
                            .deleteMany({
                                $or: [{
                                    "name": blockName
                                },
                                {
                                    "parent": block._id
                                },
                                ]
                            })
                            .then((deleteBlocks) => {
                                Bed
                                    .deleteMany({
                                        block: block._id
                                    })
                                    .then((removedBed) => {
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
                        block.remove()
                            .then(removedBlock => {
                                Bed
                                    .deleteMany({
                                        block: removedBlock._id
                                    })
                                    .then((removedBed) => {
                                        result(null, {
                                            message: "Success"
                                        });

                                    })
                            })
                            .catch(err => {
                                result(err, null);
                            })
                    }
                } else {
                    const customError = createError({
                        id: "Block does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            })
    },
    getAllParentBlocks(result) {
        return Block
            .find({
                "parent": {
                    $exists: false
                }
            })
            .then(block => {
                result(null, block);
                // console.log(block)
            })
            .catch(err => {
                result(err, null);
            });
    },
    countBlock(where, result) {
        Block
            .count(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },

    fetchAllBlocks(name, number, parent, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = name;
        }
        if (!isEmpty(number)) {
            where["number"] = number;
        }
        if (!isEmpty(parent)) {
            where["parent"] = parent;
        }
        return Block
            .find(where)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(block => {
                result(null, block);
            })
            .catch(err => {
                result(err, null);
            });
    },

}