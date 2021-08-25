const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    ToleranceController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST tolerance
//  @desc   Tolerance save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        ToleranceController.saveTolerance(req.body, req.user.id, (err, tolerance) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(tolerance);
            }
        });
    });

//  @route  GET tolerance
//  @desc   Tolerance list all
//  @access private  
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 0;
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;
        const name = req.query.hasOwnProperty("name") ? req.query.name : "";
        const tolerance_type = req.query.hasOwnProperty("tolerance_type") ? req.query.tolerance_type : "";

        ToleranceController.getAllTolerance(page, limit, name, tolerance_type, (err, tolerance) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(tolerance);
            }
        });

    }
);

//  @route  PATCH tolerance
//  @desc   Patch a tolerance
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const toleranceId = req.params.id;
        if (validateId(toleranceId) && toleranceId !== "" && toleranceId !== null) {
            ToleranceController.updateTolerance(toleranceId, req.body, req.user.id, (err, tolerance) => {
                if (err) {
                    //console.log(err)
                    res.status(400).json(err);
                } else {
                    res.status(200).json(tolerance);
                }
            });
        } else {
            res.status(400).json({
                error: {
                    id: "Invalid id provided"
                }
            });
        }
    }
);

//  @route  DELETE tolerance
//  @desc   Delete a tolerance
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const toleranceId = req.params.id;
        if (toleranceId) {
            ToleranceController.deleteTolerance(toleranceId, (err, tolerance) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(tolerance);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid tolerance id"
            });
        }
    }
);

//  @route  GET tolerance
//  @desc   Tolerance list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const name = req.query.hasOwnProperty("name") ? req.query.name : "";
        const tolerance_type = req.query.hasOwnProperty("tolerance_type") ? req.query.tolerance_type : "";
        ToleranceController.fetchAllTolerance(name, tolerance_type, (err, tolerance) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(tolerance);
            }
        });

    }
);

module.exports = router;