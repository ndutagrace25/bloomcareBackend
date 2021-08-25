// Importing packages
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

// Import keys
const {
    envPort
} = require('./config/keys');

const app = express();

// Ensble CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT,PATCH");
    next();
})
// Link body parser for url reading
app.use(bodyParser.urlencoded({
    extended: false,
    limit: "10gb"
}));
app.use(bodyParser.json({
    limit: "10gb"
}));

// Initialize passport for authenticated routes
app.use(passport.initialize());
require('./config/passport')(passport);


// Import routes
const {
    personnel,
    personnelType,
    block,
    toleranceType,
    tolerance,
    migration,
    bed,
    variety,
    plant,
    issueType,
    issue,
    score,
    point,
    entry,
    scout,
    issueCategory

} = require('./routes');

// Initialize routes
app.use('/personnel', personnel);
app.use('/personnel-type', personnelType);
app.use('/block', block);
app.use('/tolerance-type', toleranceType);
app.use('/tolerance', tolerance);
app.use('/migration', migration);
app.use('/bed', bed);
app.use('/variety', variety);
app.use('/plant', plant);
app.use('/issue-type', issueType);
app.use('/issue', issue);
app.use('/score', score);
app.use('/point', point);
app.use('/entry', entry);
app.use('/scout', scout);
app.use('/issue-category', issueCategory);


// Import routes

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;