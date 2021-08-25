const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    ToleranceTypeController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST toleranceType
//  @desc   ToleranceType save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        ToleranceTypeController.saveToleranceType(req.body, req.user.id, (err, toleranceType) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(toleranceType);
            }
        });
    });

//  @route  GET toleranceType
//  @desc   ToleranceType list all
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

        ToleranceTypeController.getAllToleranceType(page, limit, name, (err, toleranceType) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(toleranceType);
            }
        });

    }
);

//  @route  PATCH toleranceType
//  @desc   Patch a toleranceType
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const toleranceTypeId = req.params.id;
        if (validateId(toleranceTypeId) && toleranceTypeId !== "" && toleranceTypeId !== null) {
            ToleranceTypeController.updateToleranceType(toleranceTypeId, req.body, req.user.id, (err, toleranceType) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(toleranceType);
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

//  @route  DELETE toleranceType
//  @desc   Delete a toleranceType
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const toleranceTypeId = req.params.id;
        if (toleranceTypeId) {
            ToleranceTypeController.deleteToleranceType(toleranceTypeId, (err, toleranceType) => {
                if (err) {
                    // console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json(toleranceType);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid toleranceType id"
            });
        }
    }
);

//  @route  GET tolerance type
//  @desc   tolerance type list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        ToleranceTypeController.fetchAllToleranceTypes((err, toleranceType) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(toleranceType);
            }
        });

    }
);


module.exports = router;