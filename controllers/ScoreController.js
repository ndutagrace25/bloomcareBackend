const sequelize = require("sequelize");

const {
    Score
} = require('../models');
const {
    isEmpty,
    createError
} = require('../validation');


const {
    scores
} = require("../tests/config");

module.exports = {
    findScore(where, result) {
        return Score
            .findOne(where)
            .then(score => {
                return result(null, score);
            })
            .catch(error => {
                result(error, null);
            });
    },
    migrateScore(result) {
        this.findScore({
            $or: scores
        }, (err, score) => {
            if (err) {
                result(err, null);
            } else {
                if (score === null) {
                    Score.insertMany(scores)
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
                        name: "Score exists"
                    });
                    result(customError, null);
                }
            }
        });
    },
    getAllScores(result) {
        return Score
            .find()
            .then(scores => {
                //console.log(scores)
                result(null, scores);
            })
            .catch(err => {
                result(err, null);
            });
    },
}