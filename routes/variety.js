const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    VarietyController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST variety
//  @desc   Variety save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        VarietyController.saveVariety(req.body, req.user.id, (err, variety) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(variety);
            }
        });
    });

//  @route  GET variety
//  @desc   Variety list all
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

        VarietyController.getAllvarieties(page, limit, name, (err, variety) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(variety);
            }
        });

    }
);

//  @route  PATCH variety
//  @desc   Patch a Variety
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const varietyId = req.params.id;
        if (validateId(varietyId) && varietyId !== "" && varietyId !== null) {
            VarietyController.updateVariety(varietyId, req.body, req.user.id, (err, variety) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(variety);
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

//  @route  DELETE variety
//  @desc   Delete a Variety
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const varietyId = req.params.id;
        if (varietyId) {
            VarietyController.deleteVariety(varietyId, (err, variety) => {
                if (err) {
                    //console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json(variety);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid variety id"
            });
        }
    }
);
//  @route  GET variety
//  @desc   Variety list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        VarietyController.fetchAllVarieties((err, varieties) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(varieties);
            }
        });

    }
);

module.exports = router;