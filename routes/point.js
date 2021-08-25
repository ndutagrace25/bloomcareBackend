const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    PointController
} = require('../controllers');
const {
    validateId
} = require("../validation");

//  @route  POST point
//  @desc   Point save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        PointController.savePoint(req.body, req.user.id, (err, point) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(point);
            }
        });
    });

//  @route  GET point
//  @desc   Point list all
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

        PointController.getAllPoints(page, limit, name, (err, point) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(point);
            }
        });

    }
);

//  @route  PATCH point
//  @desc   Patch a Point
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const pointId = req.params.id;
        if (validateId(pointId) && pointId !== "" && pointId !== null) {
            PointController.updatePoint(pointId, req.body, req.user.id, (err, point) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(point);
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

//  @route  DELETE point
//  @desc   Delete a Point
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const pointId = req.params.id;
        if (pointId) {
            PointController.deletePoint(pointId, (err, point) => {
                if (err) {
                    //console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json(point);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid point id"
            });
        }
    }
);
//  @route  GET point
//  @desc   point list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        PointController.fetchAllPoints((err, points) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(points);
            }
        });

    }
);

module.exports = router;