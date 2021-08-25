const express = require('express');
const router = express.Router();

// Import migrations
const migrations = require("../utils/migrations");

//  @route  GET /migration
//  @desc   Run migrations
//  @access public  
router.get('/', (req, res) => {
    // Run migrations
    migrations.migrate((migrationsResult) => {
        res.status(200).json(migrationsResult);
    });
});

module.exports = router;