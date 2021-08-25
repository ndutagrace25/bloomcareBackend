const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    PlantController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST plant
//  @desc   plant save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        PlantController.savePlant(req.body, req.user.id, (err, plant) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(plant);
            }
        });
    });

//  @route  GET plant
//  @desc   plant list all
//  @access private  
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 0;
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
        const plant_date = req.query.hasOwnProperty("plant_date") ? req.query.plant_date : "";
        const expected_pick_date = req.query.hasOwnProperty("expected_pick_date") ? req.query.expected_pick_date : "";
        const status = req.query.hasOwnProperty("status") ? req.query.status : "";
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        const bed = req.query.hasOwnProperty("bed") ? req.query.bed : "";
        const flower = req.query.hasOwnProperty("flower") ? req.query.flower : "";
        PlantController.getAllPlants(page, limit, plant_date, expected_pick_date, status, block, bed, flower, (err, plant) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(plant);
            }
        });

    }
);
//  @route  PATCH plant
//  @desc   Patch a plant
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const plantId = req.params.id;
        if (validateId(plantId) && plantId !== "" && plantId !== null) {
            PlantController.updatePlant(plantId, req.body, req.user.id, (err, plant) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(plant);
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
//  @route  DELETE plant
//  @desc   Delete a plant
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const plantId = req.params.id;
        if (plantId) {
            PlantController.deletePlant(plantId, (err, plant) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(plant);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid plant id"
            });
        }
    }
);
//  @route  GET plant
//  @desc   plant list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        PlantController.fetchAllPlants((err, plants) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(plants);
            }
        });

    }
);

module.exports = router;