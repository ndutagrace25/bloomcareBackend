const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    ScoreController
} = require('../controllers');

//  @route  GET /scout
//  @desc   fetch scout
//  @access private
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        ScoreController.getAllScores((err, scores) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(scores);
            }
        });

    }
);

module.exports = router;