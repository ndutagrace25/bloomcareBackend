const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    ScoutController,
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST scout
//  @desc   scout save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        ScoutController.saveScout(req.body, req.user.id, (err, scout) => {
            if (err) {
                // console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(scout);
            }
        });
    });

//  @route  GET scout
//  @desc   scout list all
//  @access private  
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 0;
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";
        const entry = req.query.hasOwnProperty("entry") ? req.query.entry : "";
        const point = req.query.hasOwnProperty("point") ? req.query.point : "";
        const issue = req.query.hasOwnProperty("issue") ? req.query.issue : "";
        const tolerance = req.query.hasOwnProperty("tolerance") ? req.query.tolerance : "";
        const issueCategory = req.query.hasOwnProperty("issueCategory") ? req.query.issueCategory : "";
        const plant = req.query.hasOwnProperty("plant") ? req.query.plant : "";
        const value = req.query.hasOwnProperty("value") ? req.query.value : "";
        const latitude = req.query.hasOwnProperty("latitude") ? req.query.latitude : "";
        const longitude = req.query.hasOwnProperty("longitude") ? req.query.longitude : "";
        const created_by = req.query.hasOwnProperty("created_by") ? req.query.created_by : "";

        ScoutController.getAllScouts(page, limit, date, entry, point, issue, tolerance, issueCategory, plant, value, latitude, longitude, created_by, (err, scout) => {
            if (err) {
                //console.log(err)
                res.status(400).json(err);
            } else {
                // console.log(scout)
                res.status(200).json(scout);
            }
        });

    }
);

//  @route  PATCH scout
//  @desc   Patch a scout
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const scoutId = req.params.id;
        if (validateId(scoutId) && scoutId !== "" && scoutId !== null) {
            ScoutController.updateScout(scoutId, req.body, req.user.id, (err, scout) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(scout);
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

//  @route  DELETE scout
//  @desc   Delete a scout
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const scoutId = req.params.id;
        if (scoutId) {
            ScoutController.deleteScout(scoutId, (err, scout) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(scout);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid scout id"
            });
        }
    }
);
//  @route  GET scout
//  @desc   Delete a scout
//  @access private
router.get(
    "/tolerance/farm",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        ScoutController.getFarm((err, scout) => {
            if (err) {
                console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(scout);
            }
        });

    }
);

//  @route  GET scout dates
//  @desc   GET scout dates on each block
//  @access private
router.get(
    "/block/entry/date/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        ScoutController.getBlockScoutingDate(block, (err, block) => {
            if (err) {

                //console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(block);
            }
        });

    }
);
router.get(
    "/tolerance/block/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";

        if (validateId(block) && block !== "" && block !== null) {
            ScoutController.getBlockReport(block, (err, report) => {
                if (err) {
                    console.log(err)
                    res.status(400).json(err);
                } else {
                    res.status(200).json(report);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid scout id"
            });
        }
    }
);

//  @route  GET tolerance
//  @desc   GET tolerance on each bed and its entries
//  @access private
router.get(
    "/bed/entry/report/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        const variety = req.query.hasOwnProperty("variety") ? req.query.variety : "";
        const created_by = req.query.hasOwnProperty("created_by") ? req.query.created_by : "";
        const created = req.query.hasOwnProperty("created") ? req.query.created : "";
        const issue = req.query.hasOwnProperty("issue") ? req.query.issue : "";
        if (validateId(block) && block !== "" && block !== null) {
            ScoutController.getBlockPrintReport(block, variety, created_by, created, issue, (err, report) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(report);
                }
            });
        } else {

            res.status(400).json({
                error: "Invalid scout id"
            });
        }
    }
);

//  @route  GET tolerance
//  @desc   GET tolerance on each bed
//  @access private
router.get(
    "/entry/all/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const bed = req.query.hasOwnProperty("bed") ? req.query.bed : "";
        const created = req.query.hasOwnProperty("created") ? req.query.created : "";

        ScoutController.getBeds(bed, created, (err, bed) => {
            if (err) {
                console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(bed);
            }
        });

    }
);

//  @route  GET tolerance
//  @desc   GET tolerance on each entry
//  @access private
router.get(
    "/tolerance/entry/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const entry = req.query.hasOwnProperty("entry") ? req.query.entry : "";
        const bed = req.query.hasOwnProperty("bed") ? req.query.bed : "";
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";

        ScoutController.getEntries(entry, bed, date, (err, entry) => {
            if (err) {
                console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(entry);
            }
        });

    }
);


//  @route  GET scout
//  @desc   scout list all
//  @access private  
router.get(
    "/personnel/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";
        const plant = req.query.hasOwnProperty("plant") ? req.query.plant : "";
        const entry = req.query.hasOwnProperty("entry") ? req.query.entry : "";
        const point = req.query.hasOwnProperty("point") ? req.query.point : "";
        const issue = req.query.hasOwnProperty("issue") ? req.query.issue : "";
        const issueCategory = req.query.hasOwnProperty("issueCategory") ? req.query.issueCategory : "";
        const value = req.query.hasOwnProperty("value") ? req.query.value : "";

        ScoutController.getAllScoutsPersonnel(req.user.id, date, plant, entry, point, issue, issueCategory, value, (err, scout) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(scout);
            }
        });

    }
);

//  @route  GET block prevalence
//  @desc   GET prevalence per block
//  @access private
router.get(
    "/farm/prevalence/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        let today = new Date();
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        let sdate = (req.query.hasOwnProperty('sdate')) ? req.query.sdate : yyyy + "-" + mm + "-01 00:00:00";
        let edate = (req.query.hasOwnProperty('edate')) ? req.query.edate : yyyy + "-" + mm + "-31 23:59:59";
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        const variety = req.query.hasOwnProperty("variety") ? req.query.variety : "";
        const issue = req.query.hasOwnProperty("issue") ? req.query.issue : "";

        ScoutController.getFarmPrevalence(sdate, edate, block, variety, issue, (err, prevalence) => {
            if (err) {
                //console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(prevalence);
            }
        });

    }
);
//  @route  GET scout
//  @desc   scout list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";
        const entry = req.query.hasOwnProperty("entry") ? req.query.entry : "";
        const point = req.query.hasOwnProperty("point") ? req.query.point : "";
        const issue = req.query.hasOwnProperty("issue") ? req.query.issue : "";
        const tolerance = req.query.hasOwnProperty("tolerance") ? req.query.tolerance : "";
        const issueCategory = req.query.hasOwnProperty("issueCategory") ? req.query.issueCategory : "";
        const plant = req.query.hasOwnProperty("plant") ? req.query.plant : "";
        const value = req.query.hasOwnProperty("value") ? req.query.value : "";
        const latitude = req.query.hasOwnProperty("latitude") ? req.query.latitude : "";
        const longitude = req.query.hasOwnProperty("longitude") ? req.query.longitude : "";
        const created_by = req.query.hasOwnProperty("created_by") ? req.query.created_by : "";

        ScoutController.fetchAllScoutsWithoutPagination(date, entry, point, issue, tolerance, issueCategory, plant, value, latitude, longitude, created_by, (err, scout) => {
            if (err) {
                // console.log(err)
                res.status(400).json(err);
            } else {
                // console.log(scout)
                res.status(200).json(scout);
            }
        });

    }
);

//  @route  PATCH scout/update-tolerance
//  @desc   scout tolerance update
//  @access private  
router.get('/update-tolerance',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        ScoutController.updateTolerance((err, scout) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(scout);
            }
        });
    });
//  @route  GET scout personnel time
//  @desc   GET personnel time in a given block on a given date
//  @access private
router.get(
    "/time-report",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";
       // console.log(date)
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        //console.log(block)
        ScoutController.getScoutReportingDate(date, block, (err, created) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(created);
            }
        });

    }
);
//  @route  GET scout/variety
//  @desc   scout tolerance variety
//  @access private  
router.get(
    '/tolerance/farm/variety',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";
        const variety = req.query.hasOwnProperty("variety") ? req.query.variety : "";

        ScoutController.getVarietyAlerts(block, variety, (err, scout) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(scout);
            }
        });
    });

//  @route Get scout/location
//  @desc   scout location while scouting
//  @access private
router.get(
    '/location',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        const date = req.query.hasOwnProperty("date") ? req.query.date : "";
        const created_by = req.query.hasOwnProperty("created_by") ? req.query.created_by : "";
        const block = req.query.hasOwnProperty("block") ? req.query.block : "";

        ScoutController.getScoutLocation(date, created_by, block, (err, location) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(location);
            }
        });
    });


module.exports = router;