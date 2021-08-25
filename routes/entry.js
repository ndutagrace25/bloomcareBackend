const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    EntryController
} = require('../controllers');

const {
    validateId
} = require("../validation");

//  @route  POST entry
//  @desc   Entry save
//  @access private  
router.post('/',
    passport.authenticate("jwt", {
        session: false
    }), (req, res) => {
        EntryController.saveEntry(req.body, req.user.id, (err, entry) => {
            if (err) {
                // console.log(err)
                res.status(400).json(err);
            } else {
                res.status(200).json(entry);
            }
        });
    });

//  @route  GET entry
//  @desc   Entry list all
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

        EntryController.getAllEntries(page, limit, name, (err, entry) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(entry);
            }
        });

    }
);

//  @route  PATCH entry
//  @desc   Patch a Entry
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const entryId = req.params.id;
        if (validateId(entryId) && entryId !== "" && entryId !== null) {
            EntryController.updateEntry(entryId, req.body, req.user.id, (err, entry) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(entry);
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

//  @route  DELETE entry
//  @desc   Delete a entry
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const entyId = req.params.id;
        if (entyId) {
            EntryController.deleteEntry(entyId, (err, entry) => {
                if (err) {
                    // console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json(entry);
                }
            });
        } else {
            res.status(400).json({
                error: "Invalid entry id"
            });
        }
    }
);
//  @route  GET entries
//  @desc   entries list all without pagination
//  @access private  
router.get(
    "/all",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        EntryController.fetchAllEntries((err, entries) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(entries);
            }
        });

    }
);

module.exports = router;