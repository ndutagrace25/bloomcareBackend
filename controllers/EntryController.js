const objectid = require('mongodb').ObjectID;
const sequelize = require("sequelize");
const {
    Entry,
    Scout
} = require('../models');
const {
    createError,
    validateEntryInput,
    isEmpty,
    validateId
} = require('../validation');


const {
    entries
} = require("../tests/config");


module.exports = {
    findEntry(where, result) {
        return Entry
            .findOne(where)
            .then(entry => {
                return result(null, entry);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveEntry(entry, personnelId, result) {
        //console.log(entry)
        const {
            errors,
            isValid
        } = validateEntryInput(entry);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findEntry({
                name: entry.name
            }, (err, dbEntry) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbEntry) {
                        const customError = createError({
                            name: "Entry already exist"
                        });
                        result(customError, null);
                    } else {
                        Entry.create({
                            "name": entry.name,
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
    getAllEntries(page, limit, name, result) {
        let where = {};
        if (!isEmpty(name)) {
            where["name"] = {
                $regex: '^' + name,
                $options: 'i'
            }
        }
        // .find({
        //     "name": {
        //         $regex: '^' + char
        //     },
        //     $options: 'i'
        // }
        return Entry
            .find(where)
            .select('name created created_by modified_by')
            .limit(limit)
            .skip(page * limit)
            .sort({
                created: 'asc'
            })
            .exec()
            .then(entry => {
                this.countEntry(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: entry
                        })
                    }
                })
            })
            .catch(err => {
                result(err, null);
            });
    },
    updateEntry(entryId, entry, personnelId, result) {
        const {
            errors,
            isValid
        } = validateEntryInput(entry);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findEntry({
                name: entry.name
            }, (err, dbEntry) => {
                if (err) {
                    const customError = createError(err);
                    result(customError, null);
                } else {
                    if (dbEntry) {
                        const customError = createError({
                            name: "Entry already exist"
                        });
                        result(customError, null);
                    } else {
                        const attributes = {
                            "name": entry.name,
                            "modified_by": objectid(personnelId)
                        };
                        return Entry
                            .findById(entryId)
                            .then(entry => {
                                if (entry) {
                                    //update
                                    Entry.findOneAndUpdate({
                                        _id: entryId
                                    }, {
                                        $set: attributes
                                    }, {
                                        new: true,
                                        useFindAndModify: false
                                    })
                                        .then(updatedEntry => {
                                            result(null, {
                                                message: "Success"
                                            });
                                        })
                                        .catch(err => {
                                            result(err, null);
                                        })
                                } else {
                                    const customError = createError({
                                        id: "Entry does not exist"
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
    deleteEntry(entryId, result) {
        if (validateId(entryId)) {
            return Entry
                .findById(entryId)
                .then(entry => {
                    if (entry) {
                        entry.remove()
                            .then(removedEntry => {
                                Scout
                                    .deleteMany({
                                        entry: entry._id,
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
                    } else {
                        const customError = createError({
                            id: "Entry does not exist"
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
    countEntry(where, result) {
        return Entry
            .countDocuments(where)
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    // migrateEntry(result) {
    //     this.findEntry({
    //         $or: entries
    //     }, (err, entry) => {
    //         if (err) {
    //             result(err, null);
    //         } else {
    //             if (entry === null) {
    //                 Entry.insertMany(entries)
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
    //                     name: "Entry exists"
    //                 });
    //                 result(customError, null);
    //             }
    //         }
    //     });

    // },
    fetchAllEntries(result) {
        return Entry
            .find()
            .then(entries => {
                //console.log(entries)
                result(null, entries);
            })
            .catch(err => {
                result(err, null);
            });
    },
}