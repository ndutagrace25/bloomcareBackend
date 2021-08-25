const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    PersonnelTypeController
} = require('../controllers');

//  @route  POST personnel-type/migrate
//  @desc   Create Personnel type
//  @access Public  
router.post('/migrate', (req, res) => {
    PersonnelTypeController.migratePersonnelType((err, personnelType) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(personnelType);
        }
    });
});

//  @route  GET /personnel-type
//  @desc   fetch Personnel type
//  @access private
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        PersonnelTypeController.getAllPersonnelType((err, personneltype) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(personneltype);
            }
        });

    }
);

module.exports = router;