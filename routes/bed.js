const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    BedController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST bed
//  @desc   bed save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        //console.log(req.body)
        BedController.saveBed(req.body, req.user.id, (err, bed) => {
            if (err) {
                //console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(bed);
            }
        });
    });

//  @route  POST bed
//  @desc   bulk bed save
//  @access private  
router.post('/bulk',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        //console.log(req.body)
        BedController.bulkSaveBed(req.body, req.user.id, (err, bed) => {
            if (err) {
                //console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(bed);
            }
        });
    });

//  @route  GET bed
//  @desc   bed list all
//  @access private  
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        // console.log("kanan")
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 0;
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
        const bed_number = req.query.hasOwnProperty("bed_number") ? req.query.bed_number : "";
        const bed_name = req.query.hasOwnProperty("bed_name") ? req.query.bed_name : "";
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        const plant_date = req.query.hasOwnProperty("plant_date") ? req.query.plant_date : "";
        const expected_pick_date = req.query.hasOwnProperty("expected_pick_date") ? req.query.expected_pick_date : "";
        const status = req.query.hasOwnProperty("status") ? req.query.status : "";
        const variety = req.query.hasOwnProperty("variety") ? req.query.variety : "";

        BedController.getAllBeds(page, limit, bed_number, bed_name, block, plant_date, expected_pick_date, status, variety, (err, bed) => {

            if (err) {
                //console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(bed);
            }
        });

    }
);

//  @route  PATCH bed
//  @desc   Patch a bed
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const bedId = req.params.id;
        if (validateId(bedId) && bedId !== "" && bedId !== null) {
            BedController.updateBed(bedId, req.body, req.user.id, (err, bed) => {
                if (err) {
                    // console.log(err);
                    res.status(400).json(err);
                } else {
                    // console.log(personnel);
                    res.status(200).json(bed);
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

//  @route  DELETE bed
//  @desc   Delete a bed
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const bedId = req.params.id;
        if (bedId) {
            BedController.deleteBed(bedId, (err, bed) => {
                if (err) {
                    //console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json(bed);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid bed id"
            });
        }
    }
);
//  @route  GET bed
//  @desc   bed list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        BedController.fetchAllBeds((err, beds) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(beds);
            }
        });

    }
);

module.exports = router;