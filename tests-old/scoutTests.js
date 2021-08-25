import chai from 'chai';
import chaiHttp from 'chai-http';
const dateFormat = require('dateformat');

import app from '../server';
import moment from 'moment';
const {
    Scout,
    Plant,
    Entry,
    Point,
    Issue,
    IssueCategory,
    IssueType,
    Block,
    Bed,
    Variety,
    Tolerance,
    ToleranceType,
    Score,
    Personnel
} = require('../models');

const {
    userPhone,
    userPassword
} = require("./config");

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;
let assert = chai.assert;


const scoutValue = 15;
const longitude = "-78.0364";
const latitude = "39.8951";
const subBlockName = "Test sub block name";
const bedNumber = "888";
const bedName = "Test bed name";
const varietyName = "Test variety name";
const plantDate = "2019-07-29T13:16:06.166Z";
const expectedPickDate = "2019-08-28T12:59:39.577Z";
const status = "1";
const entryName = "test entry name";
const pointName = "test point name"
const issueCategoryName = "issue category test name";
const issueTypeName = "Test Issue Type";
const toleranceTypeName = "Test Tolerance Type";
const issueName = "Test issue Name";
const scoreName = "Test Score Name"
const scoutDate = '2019-09-23';
const blockName = "Test block";
const blockNumber = "Test block number";

describe("Scout", () => {

    //   Create scout
    // describe("POST /scout", () => {

    //     // it('save a scout', (done) => {
    //     //     //login user
    //     //     chai.request(app)
    //     //         .post('/personnel/login')
    //     //         .send({
    //     //             phone: userPhone,
    //     //             password: userPassword
    //     //         })
    //     //         .end((err, res) => {
    //     //             if (err) {
    //     //                 return done(err);
    //     //             } else {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 Block
    //     //                     .create({
    //     //                         "name": blockName,
    //     //                         "number": blockNumber
    //     //                     })
    //     //                     .then((parentBlock) => {
    //     //                         Block
    //     //                             .create({
    //     //                                 "name": subBlockName,
    //     //                                 "parent": parentBlock._id
    //     //                             })
    //     //                             .then((block) => {
    //     //                                 Variety
    //     //                                     .create({
    //     //                                         "name": varietyName
    //     //                                     })
    //     //                                     .then((variety) => {
    //     //                                         chai.request(app)
    //     //                                             .post("/bed")
    //     //                                             .send({
    //     //                                                 "bed_number": bedNumber,
    //     //                                                 "bed_name": bedName,
    //     //                                                 "variety": variety._id,
    //     //                                                 "plant_date": plantDate,
    //     //                                                 "expected_pick_date": expectedPickDate,
    //     //                                                 "status": status,
    //     //                                                 "block": block._id
    //     //                                             })
    //     //                                             .set('Authorization', 'Bearer ' + accessToken)
    //     //                                             .end((err, res) => {
    //     //                                                 if (err) {
    //     //                                                     return done(err);
    //     //                                                 } else {
    //     //                                                     Bed
    //     //                                                         .findOne({
    //     //                                                             "bed_number": bedNumber,
    //     //                                                             "bed_name": bedName,
    //     //                                                         })
    //     //                                                         .then((fetchedTestBed) => {
    //     //                                                             //console.log(fetchedTestBed)
    //     //                                                             const fetchedTestBedId = fetchedTestBed._id;
    //     //                                                             Plant
    //     //                                                                 .findOne({
    //     //                                                                     "bed": fetchedTestBedId
    //     //                                                                 })
    //     //                                                                 .then((plant) => {
    //     //                                                                     IssueType
    //     //                                                                         .create({
    //     //                                                                             "name": issueTypeName,
    //     //                                                                         })
    //     //                                                                         .then((issuetype) => {
    //     //                                                                             ToleranceType
    //     //                                                                                 .create({
    //     //                                                                                     name: toleranceTypeName,
    //     //                                                                                 })
    //     //                                                                                 .then((tolerancetype) => {

    //     //                                                                                     Score
    //     //                                                                                         .findOne({
    //     //                                                                                             "name": "Presence"
    //     //                                                                                         })
    //     //                                                                                         .then((score) => {
    //     //                                                                                             Issue
    //     //                                                                                                 .create({
    //     //                                                                                                     "issue_name": issueName,
    //     //                                                                                                     "score": score._id,
    //     //                                                                                                     "issue_type": issuetype._id,
    //     //                                                                                                     "tolerance_type": tolerancetype._id
    //     //                                                                                                 })
    //     //                                                                                                 .then((issue) => {
    //     //                                                                                                     IssueCategory
    //     //                                                                                                         .create({
    //     //                                                                                                             "name": issueCategoryName,
    //     //                                                                                                             "issue": issue._id,
    //     //                                                                                                         })
    //     //                                                                                                         .then((issuecategory) => {
    //     //                                                                                                             Entry
    //     //                                                                                                                 .create({
    //     //                                                                                                                     "name": entryName
    //     //                                                                                                                 }).then((entry) => {
    //     //                                                                                                                     Point
    //     //                                                                                                                         .create({
    //     //                                                                                                                             "name": pointName
    //     //                                                                                                                         })
    //     //                                                                                                                         .then((point) => {
    //     //                                                                                                                             Scout
    //     //                                                                                                                                 .deleteMany({
    //     //                                                                                                                                     "date": scoutDate,
    //     //                                                                                                                                     "plant": plant._id,
    //     //                                                                                                                                     "entry": entry._id,
    //     //                                                                                                                                     "point": point._id,
    //     //                                                                                                                                     "issue": issue._id,
    //     //                                                                                                                                     "issueCategory": issuecategory._id,
    //     //                                                                                                                                     "value": scoutValue,
    //     //                                                                                                                                     "latitude": latitude,
    //     //                                                                                                                                     "longitude": longitude

    //     //                                                                                                                                 })
    //     //                                                                                                                                 .then(() => {
    //     //                                                                                                                                     chai.request(app)
    //     //                                                                                                                                         .post("/scout")
    //     //                                                                                                                                         .send({
    //     //                                                                                                                                             "date": scoutDate,
    //     //                                                                                                                                             "plant": plant._id,
    //     //                                                                                                                                             "entry": entry._id,
    //     //                                                                                                                                             "point": point._id,
    //     //                                                                                                                                             "issue": issue._id,
    //     //                                                                                                                                             "issueCategory": issuecategory._id,
    //     //                                                                                                                                             "value": scoutValue,
    //     //                                                                                                                                             "latitude": latitude,
    //     //                                                                                                                                             "longitude": longitude

    //     //                                                                                                                                         })
    //     //                                                                                                                                         .set('Authorization', 'Bearer ' + accessToken)
    //     //                                                                                                                                         .end((err, res) => {
    //     //                                                                                                                                             if (err) {
    //     //                                                                                                                                                 return done(err);
    //     //                                                                                                                                             } else {
    //     //                                                                                                                                                 Scout
    //     //                                                                                                                                                     .findOne({
    //     //                                                                                                                                                         "date": scoutDate,
    //     //                                                                                                                                                         "plant": plant._id,
    //     //                                                                                                                                                         "entry": entry._id,
    //     //                                                                                                                                                         "point": point._id,
    //     //                                                                                                                                                         "issue": issue._id,
    //     //                                                                                                                                                         "issueCategory": issuecategory._id,
    //     //                                                                                                                                                         "value": scoutValue,
    //     //                                                                                                                                                         "latitude": latitude,
    //     //                                                                                                                                                         "longitude": longitude
    //     //                                                                                                                                                     })
    //     //                                                                                                                                                     .then(scout => {
    //     //                                                                                                                                                         res.should.have.status(200);
    //     //                                                                                                                                                         res.should.be.a('object');
    //     //                                                                                                                                                         res.body.message.should.not.be.undefined;
    //     //                                                                                                                                                         assert.equal("Success", res.body.message);
    //     //                                                                                                                                                         //Validate issue-category
    //     //                                                                                                                                                         expect(scout).to.have.property('tolerance');
    //     //                                                                                                                                                         expect(scout).to.have.property('value');
    //     //                                                                                                                                                         expect(scout).to.have.property('point');

    //     //                                                                                                                                                         scout.tolerance.should.not.be.undefined;
    //     //                                                                                                                                                         Scout
    //     //                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                 "date": scoutDate,
    //     //                                                                                                                                                                 "plant": plant._id,
    //     //                                                                                                                                                                 "entry": entry._id,
    //     //                                                                                                                                                                 "point": point._id,
    //     //                                                                                                                                                                 "issue": issue._id,
    //     //                                                                                                                                                                 "issueCategory": issuecategory._id,
    //     //                                                                                                                                                                 "value": scoutValue,
    //     //                                                                                                                                                                 "latitude": latitude,
    //     //                                                                                                                                                                 "longitude": longitude
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                 Block
    //     //                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                         $or: [{
    //     //                                                                                                                                                                             "name": blockName
    //     //                                                                                                                                                                         }, {
    //     //                                                                                                                                                                             "name": subBlockName
    //     //                                                                                                                                                                         }]
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                         Bed
    //     //                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                 "bed_number": bedNumber,
    //     //                                                                                                                                                                                 "bed_name": bedName,
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                 Plant
    //     //                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                         "bed": fetchedTestBedId,
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                         Variety
    //     //                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                 "name": varietyName
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                 IssueCategory
    //     //                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                         "name": issueCategoryName
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                         Issue
    //     //                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                 issue_name: issueName
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                 Point
    //     //                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                         name: pointName,
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                         Entry
    //     //                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                 name: entryName
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                 ToleranceType
    //     //                                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                                         name: toleranceTypeName,
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                                         IssueType
    //     //                                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                                 name: issueTypeName
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                                 done()
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                         //done();
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                     })
    //     //                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                         return done(err);
    //     //                                                                                                                                                     })
    //     //                                                                                                                                             }
    //     //                                                                                                                                         });
    //     //                                                                                                                                 })
    //     //                                                                                                                                 .catch(err => {
    //     //                                                                                                                                     return done(err);
    //     //                                                                                                                                 })
    //     //                                                                                                                         })
    //     //                                                                                                                         .catch(err => {
    //     //                                                                                                                             return done(err);
    //     //                                                                                                                         })
    //     //                                                                                                                 })
    //     //                                                                                                                 .catch(err => {
    //     //                                                                                                                     return done(err);
    //     //                                                                                                                 })
    //     //                                                                                                         })
    //     //                                                                                                         .catch(err => {
    //     //                                                                                                             return done(err);
    //     //                                                                                                         })
    //     //                                                                                                 })
    //     //                                                                                                 .catch(err => {
    //     //                                                                                                     return done(err);
    //     //                                                                                                 })
    //     //                                                                                         })
    //     //                                                                                         .catch(err => {
    //     //                                                                                             return done(err);
    //     //                                                                                         })
    //     //                                                                                 })
    //     //                                                                                 .catch(err => {
    //     //                                                                                     return done(err);
    //     //                                                                                 })
    //     //                                                                         })
    //     //                                                                         .catch(err => {
    //     //                                                                             return done(err);
    //     //                                                                         })
    //     //                                                                 })
    //     //                                                                 .catch(err => {
    //     //                                                                     return done(err);
    //     //                                                                 })
    //     //                                                         })
    //     //                                                         .catch(err => {
    //     //                                                             return done(err);
    //     //                                                         })
    //     //                                                 }
    //     //                                             })
    //     //                                     })
    //     //                                     .catch(err => {
    //     //                                         return done(err);
    //     //                                     })
    //     //                             })
    //     //                             .catch(err => {
    //     //                                 return done(err);
    //     //                             })
    //     //                     })
    //     //                     .catch(err => {
    //     //                         return done(err);
    //     //                     })

    //     //             }
    //     //         })
    //     // }).timeout(20000);

    //     // it('Should return error if scout entry exists', (done) => {
    //     //     //login user
    //     //     chai.request(app)
    //     //         .post('/personnel/login')
    //     //         .send({
    //     //             phone: userPhone,
    //     //             password: userPassword
    //     //         })
    //     //         .end((err, res) => {
    //     //             if (err) {
    //     //                 return done(err);
    //     //             } else {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 Block
    //     //                     .create({
    //     //                         "name": blockName,
    //     //                         "number": blockNumber
    //     //                     })
    //     //                     .then((parentBlock) => {
    //     //                         Block
    //     //                             .create({
    //     //                                 "name": subBlockName,
    //     //                                 "parent": parentBlock._id
    //     //                             })
    //     //                             .then((block) => {
    //     //                                 Variety
    //     //                                     .create({
    //     //                                         "name": varietyName
    //     //                                     })
    //     //                                     .then((variety) => {
    //     //                                         chai.request(app)
    //     //                                             .post("/bed")
    //     //                                             .send({
    //     //                                                 "bed_number": bedNumber,
    //     //                                                 "bed_name": bedName,
    //     //                                                 "variety": variety._id,
    //     //                                                 "plant_date": plantDate,
    //     //                                                 "expected_pick_date": expectedPickDate,
    //     //                                                 "status": status,
    //     //                                                 "block": block._id
    //     //                                             })
    //     //                                             .set('Authorization', 'Bearer ' + accessToken)
    //     //                                             .end((err, res) => {
    //     //                                                 if (err) {
    //     //                                                     return done(err);
    //     //                                                 } else {
    //     //                                                     Bed
    //     //                                                         .findOne({
    //     //                                                             "bed_number": bedNumber,
    //     //                                                             "bed_name": bedName,
    //     //                                                         })
    //     //                                                         .then((fetchedTestBed) => {
    //     //                                                             //console.log(fetchedTestBed)
    //     //                                                             const fetchedTestBedId = fetchedTestBed._id;
    //     //                                                             Plant
    //     //                                                                 .findOne({
    //     //                                                                     "bed": fetchedTestBedId
    //     //                                                                 })
    //     //                                                                 .then((plant) => {
    //     //                                                                     IssueType
    //     //                                                                         .create({
    //     //                                                                             "name": issueTypeName,
    //     //                                                                         })
    //     //                                                                         .then((issuetype) => {
    //     //                                                                             ToleranceType
    //     //                                                                                 .create({
    //     //                                                                                     name: toleranceTypeName,
    //     //                                                                                 })
    //     //                                                                                 .then((tolerancetype) => {

    //     //                                                                                     Score
    //     //                                                                                         .findOne({
    //     //                                                                                             "name": "Presence"
    //     //                                                                                         })
    //     //                                                                                         .then((score) => {
    //     //                                                                                             Issue
    //     //                                                                                                 .create({
    //     //                                                                                                     "issue_name": issueName,
    //     //                                                                                                     "score": score._id,
    //     //                                                                                                     "issue_type": issuetype._id,
    //     //                                                                                                     "tolerance_type": tolerancetype._id
    //     //                                                                                                 })
    //     //                                                                                                 .then((issue) => {
    //     //                                                                                                     IssueCategory
    //     //                                                                                                         .create({
    //     //                                                                                                             "name": issueCategoryName,
    //     //                                                                                                             "issue": issue._id,
    //     //                                                                                                         })
    //     //                                                                                                         .then((issuecategory) => {
    //     //                                                                                                             Entry
    //     //                                                                                                                 .create({
    //     //                                                                                                                     "name": entryName
    //     //                                                                                                                 }).then((entry) => {
    //     //                                                                                                                     Point
    //     //                                                                                                                         .create({
    //     //                                                                                                                             "name": pointName
    //     //                                                                                                                         })
    //     //                                                                                                                         .then((point) => {
    //     //                                                                                                                             Scout
    //     //                                                                                                                                 .deleteMany({
    //     //                                                                                                                                     "date": scoutDate,
    //     //                                                                                                                                     "plant": plant._id,
    //     //                                                                                                                                     "entry": entry._id,
    //     //                                                                                                                                     "point": point._id,
    //     //                                                                                                                                     "issue": issue._id,
    //     //                                                                                                                                     "issueCategory": issuecategory._id,
    //     //                                                                                                                                     "value": scoutValue,
    //     //                                                                                                                                     "latitude": latitude,
    //     //                                                                                                                                     "longitude": longitude

    //     //                                                                                                                                 })
    //     //                                                                                                                                 .then(() => {
    //     //                                                                                                                                     Scout
    //     //                                                                                                                                         .create({
    //     //                                                                                                                                             "date": scoutDate,
    //     //                                                                                                                                             "plant": plant._id,
    //     //                                                                                                                                             "entry": entry._id,
    //     //                                                                                                                                             "point": point._id,
    //     //                                                                                                                                             "issue": issue._id,
    //     //                                                                                                                                             "issueCategory": issuecategory._id,
    //     //                                                                                                                                             "value": scoutValue,
    //     //                                                                                                                                             "latitude": latitude,
    //     //                                                                                                                                             "longitude": longitude
    //     //                                                                                                                                         })
    //     //                                                                                                                                         .then(() => {
    //     //                                                                                                                                             chai.request(app)
    //     //                                                                                                                                                 .post("/scout")
    //     //                                                                                                                                                 .send({
    //     //                                                                                                                                                     "date": scoutDate,
    //     //                                                                                                                                                     "plant": plant._id,
    //     //                                                                                                                                                     "entry": entry._id,
    //     //                                                                                                                                                     "point": point._id,
    //     //                                                                                                                                                     "issue": issue._id,
    //     //                                                                                                                                                     "issueCategory": issuecategory._id,
    //     //                                                                                                                                                     "value": scoutValue,
    //     //                                                                                                                                                     "latitude": latitude,
    //     //                                                                                                                                                     "longitude": longitude

    //     //                                                                                                                                                 })
    //     //                                                                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
    //     //                                                                                                                                                 .end((err, res) => {
    //     //                                                                                                                                                     if (err) {
    //     //                                                                                                                                                         return done(err);
    //     //                                                                                                                                                     } else {
    //     //                                                                                                                                                         Scout
    //     //                                                                                                                                                             .findOne({
    //     //                                                                                                                                                                 "date": scoutDate,
    //     //                                                                                                                                                                 "plant": plant._id,
    //     //                                                                                                                                                                 "entry": entry._id,
    //     //                                                                                                                                                                 "point": point._id,
    //     //                                                                                                                                                                 "issue": issue._id,
    //     //                                                                                                                                                                 "issueCategory": issuecategory._id,
    //     //                                                                                                                                                                 "value": scoutValue,
    //     //                                                                                                                                                                 "latitude": latitude,
    //     //                                                                                                                                                                 "longitude": longitude
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .then(scout => {
    //     //                                                                                                                                                                 res.should.have.status(400);
    //     //                                                                                                                                                                 res.should.be.a('object');
    //     //                                                                                                                                                                 res.body.error.scout.should.not.be.undefined;
    //     //                                                                                                                                                                 assert.equal("Scout entry already exist", res.body.error.scout);
    //     //                                                                                                                                                                 Scout
    //     //                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                         "date": scoutDate,
    //     //                                                                                                                                                                         "plant": plant._id,
    //     //                                                                                                                                                                         "entry": entry._id,
    //     //                                                                                                                                                                         "point": point._id,
    //     //                                                                                                                                                                         "issue": issue._id,
    //     //                                                                                                                                                                         "issueCategory": issuecategory._id,
    //     //                                                                                                                                                                         "value": scoutValue,
    //     //                                                                                                                                                                         "latitude": latitude,
    //     //                                                                                                                                                                         "longitude": longitude
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                         Block
    //     //                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                 $or: [{
    //     //                                                                                                                                                                                     "name": blockName
    //     //                                                                                                                                                                                 }, {
    //     //                                                                                                                                                                                     "name": subBlockName
    //     //                                                                                                                                                                                 }]
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                 Bed

    //     //                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                         "bed_number": bedNumber,
    //     //                                                                                                                                                                                         "bed_name": bedName,
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                         Plant
    //     //                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                 "bed": fetchedTestBedId,
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                 Variety
    //     //                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                         "name": varietyName
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                         IssueCategory
    //     //                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                 "name": issueCategoryName
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                 Issue
    //     //                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                         issue_name: issueName
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                         Point
    //     //                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                 name: pointName,
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                 Entry
    //     //                                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                                         name: entryName
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                                         ToleranceType
    //     //                                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                                 name: toleranceTypeName,
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                                 IssueType
    //     //                                                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                                                         name: issueTypeName
    //     //                                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                                                         done()
    //     //                                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                 //done();
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                     }
    //     //                                                                                                                                                 });
    //     //                                                                                                                                         })
    //     //                                                                                                                                         .catch(err => {
    //     //                                                                                                                                             return done(err);
    //     //                                                                                                                                         })
    //     //                                                                                                                                 })
    //     //                                                                                                                                 .catch(err => {
    //     //                                                                                                                                     return done(err);
    //     //                                                                                                                                 })
    //     //                                                                                                                         })
    //     //                                                                                                                         .catch(err => {
    //     //                                                                                                                             return done(err);
    //     //                                                                                                                         })
    //     //                                                                                                                 })
    //     //                                                                                                                 .catch(err => {
    //     //                                                                                                                     return done(err);
    //     //                                                                                                                 })
    //     //                                                                                                         })
    //     //                                                                                                         .catch(err => {
    //     //                                                                                                             return done(err);
    //     //                                                                                                         })
    //     //                                                                                                 })
    //     //                                                                                                 .catch(err => {
    //     //                                                                                                     return done(err);
    //     //                                                                                                 })
    //     //                                                                                         })
    //     //                                                                                         .catch(err => {
    //     //                                                                                             return done(err);
    //     //                                                                                         })
    //     //                                                                                 })
    //     //                                                                                 .catch(err => {
    //     //                                                                                     return done(err);
    //     //                                                                                 })
    //     //                                                                         })
    //     //                                                                         .catch(err => {
    //     //                                                                             return done(err);
    //     //                                                                         })
    //     //                                                                 })
    //     //                                                                 .catch(err => {
    //     //                                                                     return done(err);
    //     //                                                                 })
    //     //                                                         })
    //     //                                                         .catch(err => {
    //     //                                                             return done(err);
    //     //                                                         })
    //     //                                                 }
    //     //                                             })
    //     //                                     })
    //     //                                     .catch(err => {
    //     //                                         return done(err);
    //     //                                     })
    //     //                             })
    //     //                             .catch(err => {
    //     //                                 return done(err);
    //     //                             })
    //     //                     })
    //     //                     .catch(err => {
    //     //                         return done(err);
    //     //                     })

    //     //             }
    //     //         })
    //     // }).timeout(20000);

    //     // it('Should return error if empty fields are provided', (done) => {
    //     //     //login user
    //     //     chai.request(app)
    //     //         .post('/personnel/login')
    //     //         .send({
    //     //             phone: userPhone,
    //     //             password: userPassword
    //     //         })
    //     //         .end((err, res) => {
    //     //             if (err) {
    //     //                 return done(err);
    //     //             } else {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 Block
    //     //                     .create({
    //     //                         "name": blockName,
    //     //                         "number": blockNumber
    //     //                     })
    //     //                     .then((parentBlock) => {
    //     //                         Block
    //     //                             .create({
    //     //                                 "name": subBlockName,
    //     //                                 "parent": parentBlock._id
    //     //                             })
    //     //                             .then((block) => {
    //     //                                 Variety
    //     //                                     .create({
    //     //                                         "name": varietyName
    //     //                                     })
    //     //                                     .then((variety) => {
    //     //                                         chai.request(app)
    //     //                                             .post("/bed")
    //     //                                             .send({
    //     //                                                 "bed_number": bedNumber,
    //     //                                                 "bed_name": bedName,
    //     //                                                 "variety": variety._id,
    //     //                                                 "plant_date": plantDate,
    //     //                                                 "expected_pick_date": expectedPickDate,
    //     //                                                 "status": status,
    //     //                                                 "block": block._id
    //     //                                             })
    //     //                                             .set('Authorization', 'Bearer ' + accessToken)
    //     //                                             .end((err, res) => {
    //     //                                                 if (err) {
    //     //                                                     return done(err);
    //     //                                                 } else {
    //     //                                                     Bed
    //     //                                                         .findOne({
    //     //                                                             "bed_number": bedNumber,
    //     //                                                             "bed_name": bedName,
    //     //                                                         })
    //     //                                                         .then((fetchedTestBed) => {
    //     //                                                             //console.log(fetchedTestBed)
    //     //                                                             const fetchedTestBedId = fetchedTestBed._id;
    //     //                                                             Plant
    //     //                                                                 .findOne({
    //     //                                                                     "bed": fetchedTestBedId
    //     //                                                                 })
    //     //                                                                 .then((plant) => {
    //     //                                                                     IssueType
    //     //                                                                         .create({
    //     //                                                                             "name": issueTypeName,
    //     //                                                                         })
    //     //                                                                         .then((issuetype) => {
    //     //                                                                             ToleranceType
    //     //                                                                                 .create({
    //     //                                                                                     name: toleranceTypeName,
    //     //                                                                                 })
    //     //                                                                                 .then((tolerancetype) => {

    //     //                                                                                     Score
    //     //                                                                                         .findOne({
    //     //                                                                                             "name": "Presence"
    //     //                                                                                         })
    //     //                                                                                         .then((score) => {
    //     //                                                                                             Issue
    //     //                                                                                                 .create({
    //     //                                                                                                     "issue_name": issueName,
    //     //                                                                                                     "score": score._id,
    //     //                                                                                                     "issue_type": issuetype._id,
    //     //                                                                                                     "tolerance_type": tolerancetype._id
    //     //                                                                                                 })
    //     //                                                                                                 .then((issue) => {
    //     //                                                                                                     IssueCategory
    //     //                                                                                                         .create({
    //     //                                                                                                             "name": issueCategoryName,
    //     //                                                                                                             "issue": issue._id,
    //     //                                                                                                         })
    //     //                                                                                                         .then((issuecategory) => {
    //     //                                                                                                             Entry
    //     //                                                                                                                 .create({
    //     //                                                                                                                     "name": entryName
    //     //                                                                                                                 }).then((entry) => {
    //     //                                                                                                                     Point
    //     //                                                                                                                         .create({
    //     //                                                                                                                             "name": pointName
    //     //                                                                                                                         })
    //     //                                                                                                                         .then((point) => {
    //     //                                                                                                                             Scout
    //     //                                                                                                                                 .deleteMany({
    //     //                                                                                                                                     "date": scoutDate,
    //     //                                                                                                                                     "plant": plant._id,
    //     //                                                                                                                                     "entry": entry._id,
    //     //                                                                                                                                     "point": point._id,
    //     //                                                                                                                                     "issue": issue._id,
    //     //                                                                                                                                     "issueCategory": issuecategory._id,
    //     //                                                                                                                                     "value": scoutValue,
    //     //                                                                                                                                     "latitude": latitude,
    //     //                                                                                                                                     "longitude": longitude

    //     //                                                                                                                                 })
    //     //                                                                                                                                 .then(() => {
    //     //                                                                                                                                     chai.request(app)
    //     //                                                                                                                                         .post("/scout")
    //     //                                                                                                                                         .send({
    //     //                                                                                                                                             "date": "",
    //     //                                                                                                                                             "plant": "",
    //     //                                                                                                                                             "entry": "",
    //     //                                                                                                                                             "point": "",
    //     //                                                                                                                                             "issue": "",
    //     //                                                                                                                                             "issueCategory": "",
    //     //                                                                                                                                             "value": "",
    //     //                                                                                                                                             "latitude": "",
    //     //                                                                                                                                             "longitude": ""

    //     //                                                                                                                                         })
    //     //                                                                                                                                         .set('Authorization', 'Bearer ' + accessToken)
    //     //                                                                                                                                         .end((err, res) => {
    //     //                                                                                                                                             if (err) {
    //     //                                                                                                                                                 return done(err);
    //     //                                                                                                                                             } else {
    //     //                                                                                                                                                 Scout
    //     //                                                                                                                                                     .findOne({
    //     //                                                                                                                                                         "date": scoutDate,
    //     //                                                                                                                                                         "plant": plant._id,
    //     //                                                                                                                                                         "entry": entry._id,
    //     //                                                                                                                                                         "point": point._id,
    //     //                                                                                                                                                         "issue": issue._id,
    //     //                                                                                                                                                         "issueCategory": issuecategory._id,
    //     //                                                                                                                                                         "value": scoutValue,
    //     //                                                                                                                                                         "latitude": latitude,
    //     //                                                                                                                                                         "longitude": longitude
    //     //                                                                                                                                                     })
    //     //                                                                                                                                                     .then(scout => {
    //     //                                                                                                                                                         res.should.have.status(400);
    //     //                                                                                                                                                         res.should.be.a('object');
    //     //                                                                                                                                                         res.body.error.date.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.plant.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.entry.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.point.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.issue.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.issueCategory.should.not.be.undefined;
    //     //                                                                                                                                                         res.body.error.value.should.not.be.undefined;
    //     //                                                                                                                                                         assert.equal("Scout date is required", res.body.error.date);
    //     //                                                                                                                                                         assert.equal("Plant is required", res.body.error.plant);
    //     //                                                                                                                                                         assert.equal("Entry is required", res.body.error.entry);
    //     //                                                                                                                                                         assert.equal("Point is required", res.body.error.point);
    //     //                                                                                                                                                         assert.equal("Issue is required", res.body.error.issue);
    //     //                                                                                                                                                         assert.equal("Issue category is required", res.body.error.issueCategory);
    //     //                                                                                                                                                         assert.equal("Value is required", res.body.error.value);
    //     //                                                                                                                                                         Scout
    //     //                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                 "date": scoutDate,
    //     //                                                                                                                                                                 "plant": plant._id,
    //     //                                                                                                                                                                 "entry": entry._id,
    //     //                                                                                                                                                                 "point": point._id,
    //     //                                                                                                                                                                 "issue": issue._id,
    //     //                                                                                                                                                                 "issueCategory": issuecategory._id,
    //     //                                                                                                                                                                 "value": scoutValue,
    //     //                                                                                                                                                                 "latitude": latitude,
    //     //                                                                                                                                                                 "longitude": longitude
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                 Block
    //     //                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                         $or: [{
    //     //                                                                                                                                                                             "name": blockName
    //     //                                                                                                                                                                         }, {
    //     //                                                                                                                                                                             "name": subBlockName
    //     //                                                                                                                                                                         }]
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                         Bed

    //     //                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                 "bed_number": bedNumber,
    //     //                                                                                                                                                                                 "bed_name": bedName,
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                 Plant
    //     //                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                         "bed": fetchedTestBedId,
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                         Variety
    //     //                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                 "name": varietyName
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                 IssueCategory
    //     //                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                         "name": issueCategoryName
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                         Issue
    //     //                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                 issue_name: issueName
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                 Point
    //     //                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                         name: pointName,
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                         Entry
    //     //                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                 name: entryName
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                 ToleranceType
    //     //                                                                                                                                                                                                                                     .deleteMany({
    //     //                                                                                                                                                                                                                                         name: toleranceTypeName,
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .then(() => {
    //     //                                                                                                                                                                                                                                         IssueType
    //     //                                                                                                                                                                                                                                             .deleteMany({
    //     //                                                                                                                                                                                                                                                 name: issueTypeName
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .then(() => {
    //     //                                                                                                                                                                                                                                                 done()
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                                             })
    //     //                                                                                                                                                                                                         //done();
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                                     })
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                                             })
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                                     })
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                                             })
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                                         return done(err);
    //     //                                                                                                                                                                     })
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                             .catch(err => {
    //     //                                                                                                                                                                 return done(err);
    //     //                                                                                                                                                             })
    //     //                                                                                                                                                     })
    //     //                                                                                                                                                     .catch(err => {
    //     //                                                                                                                                                         return done(err);
    //     //                                                                                                                                                     })
    //     //                                                                                                                                             }
    //     //                                                                                                                                         });
    //     //                                                                                                                                 })
    //     //                                                                                                                                 .catch(err => {
    //     //                                                                                                                                     return done(err);
    //     //                                                                                                                                 })
    //     //                                                                                                                         })
    //     //                                                                                                                         .catch(err => {
    //     //                                                                                                                             return done(err);
    //     //                                                                                                                         })
    //     //                                                                                                                 })
    //     //                                                                                                                 .catch(err => {
    //     //                                                                                                                     return done(err);
    //     //                                                                                                                 })
    //     //                                                                                                         })
    //     //                                                                                                         .catch(err => {
    //     //                                                                                                             return done(err);
    //     //                                                                                                         })
    //     //                                                                                                 })
    //     //                                                                                                 .catch(err => {
    //     //                                                                                                     return done(err);
    //     //                                                                                                 })
    //     //                                                                                         })
    //     //                                                                                         .catch(err => {
    //     //                                                                                             return done(err);
    //     //                                                                                         })
    //     //                                                                                 })
    //     //                                                                                 .catch(err => {
    //     //                                                                                     return done(err);
    //     //                                                                                 })
    //     //                                                                         })
    //     //                                                                         .catch(err => {
    //     //                                                                             return done(err);
    //     //                                                                         })
    //     //                                                                 })
    //     //                                                                 .catch(err => {
    //     //                                                                     return done(err);
    //     //                                                                 })
    //     //                                                         })
    //     //                                                         .catch(err => {
    //     //                                                             return done(err);
    //     //                                                         })
    //     //                                                 }
    //     //                                             })
    //     //                                     })
    //     //                                     .catch(err => {
    //     //                                         return done(err);
    //     //                                     })
    //     //                             })
    //     //                             .catch(err => {
    //     //                                 return done(err);
    //     //                             })
    //     //                     })
    //     //                     .catch(err => {
    //     //                         return done(err);
    //     //                     })

    //     //             }
    //     //         })
    //     // }).timeout(20000);

    //     // it('Should return error if personnel is not logged in', (done) => {
    //     //     chai.request(app)
    //     //         .post(`/scout`)
    //     //         .end((err, res) => {
    //     //             if (err) {
    //     //                 return done(err);
    //     //             } else {
    //     //                 res.should.have.status(401);
    //     //                 done();
    //     //             }
    //     //         })
    //     // }).timeout(20000);
    // });

    // //  Fetch scout
    describe("GET /scout", () => {

        it('It should get all scouts', (done) => {
            // Login user
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        const accessToken = res.body.accessToken;
                        chai.request(app)
                            .get(`/scout?page=0&limit=5`)
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    // console.log(res.body)
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.rows.should.not.be.undefined;
                                    res.body.items.should.not.be.undefined;
                                    res.body.items.should.be.a('array');
                                    res.body.items[0].date.should.not.be.undefined;
                                    res.body.items[0].plant.should.not.be.undefined;
                                    res.body.items[0].entry.should.not.be.undefined;
                                    res.body.items[0].point.should.not.be.undefined;
                                    res.body.items[0].issue.should.not.be.undefined;
                                    res.body.items[0].issueCategory.should.not.be.undefined;
                                    res.body.items[0].value.should.not.be.undefined;
                                    expect(res.body.items[0].issueCategory).to.have.property('name');
                                    expect(res.body.items[0].issueCategory).to.have.property('issue');
                                    res.body.items[0].plant.should.be.a('object');
                                    res.body.items[0].entry.should.be.a('object');
                                    res.body.items[0].point.should.be.a('object');
                                    done()

                                }
                            })
                    }
                })
        }).timeout(2000000);
    });


    // // //   Delete score
    // describe("DELETE /scout/:scoutId", () => {

    //     //     it('Should delete scout', (done) => {
    //     //         // Get Block, Bend, Plant, Flower
    //     //         Plant
    //     //             .findOne()
    //     //             .then(plant => {

    //     //                 // Get Entry
    //     //                 Entry
    //     //                     .findOne()
    //     //                     .then(entry => {

    //     //                         // Get Point
    //     //                         Point
    //     //                             .findOne()
    //     //                             .then(point => {

    //     //                                 // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
    //     //                                 Issue
    //     //                                     .findOne()
    //     //                                     .then(issue => {

    //     //                                         // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
    //     //                                         IssueCategory
    //     //                                             .findOne({
    //     //                                                 issue: issue._id
    //     //                                             })
    //     //                                             .then(issueCategory => {
    //     //                                                 const scout = {
    //     //                                                     date: date,
    //     //                                                     plant: plant._id,
    //     //                                                     entry: entry._id,
    //     //                                                     point: point._id,
    //     //                                                     issue: issue._id,
    //     //                                                     issueCategory: issueCategory._id,
    //     //                                                     value: scoutValue
    //     //                                                 };

    //     //                                                 Scout
    //     //                                                     .create(scout)
    //     //                                                     .then((scout) => {
    //     //                                                         const id = scout._id;
    //     //                                                         chai.request(app)
    //     //                                                             .post('/personnel/login')
    //     //                                                             .send({
    //     //                                                                 phone: userPhone,
    //     //                                                                 password: userPassword
    //     //                                                             })
    //     //                                                             .end((err, res) => {
    //     //                                                                 if (err) {
    //     //                                                                     return done(err);
    //     //                                                                 } else {
    //     //                                                                     const accessToken = res.body.accessToken;
    //     //                                                                     const url = `/scout/${id}`;
    //     //                                                                     chai.request(app)
    //     //                                                                         .delete(url)
    //     //                                                                         .set('Authorization', 'Bearer ' + accessToken)
    //     //                                                                         .end((err, res) => {
    //     //                                                                             if (err) {
    //     //                                                                                 return done(err);
    //     //                                                                             } else {
    //     //                                                                                 res.should.have.status(200);
    //     //                                                                                 res.should.be.a('object');
    //     //                                                                                 res.body.message.should.not.be.undefined;
    //     //                                                                                 assert.equal("Success", res.body.message);
    //     //                                                                                 Scout.findOne({
    //     //                                                                                         id: id
    //     //                                                                                     })
    //     //                                                                                     .then(deletedScout => {
    //     //                                                                                         assert.equal(deletedScout, null);
    //     //                                                                                         done();
    //     //                                                                                     })
    //     //                                                                             }
    //     //                                                                         })
    //     //                                                                 }
    //     //                                                             })
    //     //                                                     })
    //     //                                                     .catch(err => {
    //     //                                                         return done(err);
    //     //                                                     })
    //     //                                             })
    //     //                                             .catch(err => {
    //     //                                                 return done(err);
    //     //                                             });
    //     //                                     })
    //     //                                     .catch(err => {
    //     //                                         return done(err);
    //     //                                     })
    //     //                             })
    //     //                             .catch(err => {
    //     //                                 return done(err);
    //     //                             })
    //     //                     })
    //     //                     .catch(err => {
    //     //                         return done(err);
    //     //                     })

    //     //             })
    //     //             .catch(err => {
    //     //                 return done(err);
    //     //             })

    //     //     }).timeout(100000);

    //     //     it('Should return error if id is invalid hex', (done) => {
    //     //         const id = "xxxxxx";
    //     //         chai.request(app)
    //     //             .post('/personnel/login')
    //     //             .send({
    //     //                 phone: userPhone,
    //     //                 password: userPassword
    //     //             })
    //     //             .end((err, res) => {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 const url = `/scout/${id}`;
    //     //                 chai.request(app)
    //     //                     .delete(url)
    //     //                     .set('Authorization', 'Bearer ' + accessToken)
    //     //                     .end((err, res) => {
    //     //                         if (err) {
    //     //                             return done(err);
    //     //                         }
    //     //                         res.should.have.status(400);
    //     //                         res.should.be.a('object');
    //     //                         res.body.error.id.should.not.be.undefined;
    //     //                         assert.equal("Invalid id provided", res.body.error.id);
    //     //                         done();
    //     //                     })

    //     //             })
    //     //     }).timeout(20000);

    //     //     it('Should return error if id does not exist', (done) => {
    //     //         const id = "8fb15451d578f906d8eb769c";
    //     //         chai.request(app)
    //     //             .post('/personnel/login')
    //     //             .send({
    //     //                 phone: userPhone,
    //     //                 password: userPassword
    //     //             })
    //     //             .end((err, res) => {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 const url = `/scout/${id}`;
    //     //                 chai.request(app)
    //     //                     .delete(url)
    //     //                     .set('Authorization', 'Bearer ' + accessToken)
    //     //                     .end((err, res) => {
    //     //                         if (err) {
    //     //                             return done(err);
    //     //                         }
    //     //                         res.should.have.status(400);
    //     //                         res.should.be.a('object');
    //     //                         res.body.error.id.should.not.be.undefined;
    //     //                         assert.equal("Scout does not exist", res.body.error.id);
    //     //                         done();
    //     //                     })

    //     //             })
    //     //     }).timeout(20000);

    // })

    // //  Farm reporting test
    describe("GET /scout/tolerance/farm", () => {

        // it('It should fetch all  parent block  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 chai.request(app)
        //                     .get(`/scout/tolerance/farm`)

        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    // //  Block reporting test
    describe("GET /scout/tolerance/block", () => {
        // it('It should fetch all  beds in a block  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const blockId = "5d87b9696de14122f4b12e31";
        //                 chai.request(app)
        //                     .get(`/scout/tolerance/block?block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);

    })

    //  Farm reporting test
    describe("GET /scout/tolerance/farm", () => {

        // it('It should fetch all  parent block  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 chai.request(app)
        //                     .get(`/scout/tolerance/farm`)

        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             //console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    //  Block reporting test
    describe("GET /scout/tolerance/block", () => {
        // it('It should fetch all  beds in a block  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const blockId = "5d87b9696de14122f4b12e31";
        //                 chai.request(app)
        //                     .get(`/scout/tolerance/block?block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             //console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);

    });


    // Bed reporting test
    describe("GET /scout/etry/all/", () => {
        //         it('It should fetch bed with all entries and threat status (Success, Warning or danger)', (done) => {
        //             // Login user
        //             chai.request(app)
        //                 .post('/personnel/login')
        //                 .send({
        //                     phone: userPhone,
        //                     password: userPassword
        //                 })
        //                 .end((err, res) => {
        //                     if (err) {
        //                         return done(err);
        //                     } else {
        //                         const accessToken = res.body.accessToken;

        //                         // Create block
        //                         const id = "5d6f5bbbb9731f1d38bec9f5";
        //                         const sdate = "2019-08-29"
        //                         const edate = "2019-09-01"
        //                         // const created = "2019-08-29T08:31:50.058Z";
        //                         // const entryId = "5d5a5c56d6e8f82a701bf5d2";
        //                         // const variety = 'Pink Rose'
        //                         chai.request(app)
        //                             // .get(`/scout/bed/prevalence?bed=${id}&sdate=${sdate}&edate=${edate}`)
        //                             .get(`/scout/`)
        //                             .set('Authorization', 'Bearer ' + accessToken)
        //                             .end((err, res) => {
        //                                 if (err) {
        //                                     return done(err);
        //                                 } else {
        //                                     console.log(res.body.items[0].plant)
        //                                     res.should.have.status(200);
        //                                     res.body.should.be.a('object');

        //                                     done();
        //                                 }
        //                             })
        //                     }
        //                 })
        //         }).timeout(20000);

        // it('It should fetch bed with its scouting date', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 // Create block
        //                 chai.request(app)
        //                     .post("/block")
        //                     .send({
        //                         "parent_block": parent_block,
        //                         "sub_block_name": sub_block_name,
        //                     })
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done();
        //                         } else {
        //                             // Get Block
        //                             Block
        //                                 .findOne({
        //                                     //parent_block: parent_block
        //                                     _id: "5d64e5eeb0964341b8aba935"
        //                                 })
        //                                 .then(block => {

        //                                     // Create variety
        //                                     chai.request(app)
        //                                         .post("/variety")
        //                                         .send({
        //                                             "name": variety_name
        //                                         })
        //                                         .set('Authorization', 'Bearer ' + accessToken)
        //                                         .end((err, res) => {
        //                                             if (err) {
        //                                                 return done(err);
        //                                             } else {
        //                                                 Variety
        //                                                     .findOne({
        //                                                         name: variety_name
        //                                                     })
        //                                                     .then(variety => {

        //                                                         // Create bed
        //                                                         const newBed = {
        //                                                             bed_number: bed_number,
        //                                                             bed_name: bed_name,
        //                                                             block: block._id,
        //                                                             parent_block: parent_block,
        //                                                             sub_block_name: block.sub_block_name,
        //                                                             plant_date: '2019-08-14T00:00:00.000Z',
        //                                                             expected_pick_date: '2019-08-17T00:00:00.000Z',
        //                                                             variety: variety._id,
        //                                                             variety_name: variety.name,
        //                                                             status: 1
        //                                                         };

        //                                                         chai.request(app)
        //                                                             .post("/bed")
        //                                                             .send(newBed)
        //                                                             .set('Authorization', 'Bearer ' + accessToken)
        //                                                             .end((err, res) => {
        //                                                                 if (err) {
        //                                                                     return done(err);
        //                                                                 } else {
        //                                                                     Bed
        //                                                                         .findOne({
        //                                                                             _id: "5d64ff8bb842ea05d014dba3"
        //                                                                         })

        //                                                                         .then((bed) => {
        //                                                                             // console.log(bed)
        //                                                                             // Get Entry
        //                                                                             Entry
        //                                                                                 .findOne({
        //                                                                                     _id: "5d64c4d42079af2a9c0baced"
        //                                                                                 })
        //                                                                                 .then(entry => {

        //                                                                                     // Get Point
        //                                                                                     Point
        //                                                                                         .findOne({
        //                                                                                             _id: "5d5a64c0c7b4100b3823164f"
        //                                                                                         })
        //                                                                                         .then(point => {
        //                                                                                             // Create Tolerance Type
        //                                                                                             ToleranceType
        //                                                                                                 .create({
        //                                                                                                     name: tolerance_type_name
        //                                                                                                 })
        //                                                                                                 .then(toleranceType => {

        //                                                                                                     // Create tolerance
        //                                                                                                     Tolerance
        //                                                                                                         .create({
        //                                                                                                             name: tolerance_name,
        //                                                                                                             to: tolerance_to,
        //                                                                                                             from: tolerance_from,
        //                                                                                                             tolerance_type: toleranceType._id
        //                                                                                                         })
        //                                                                                                         .then(tolerance => {
        //                                                                                                             Score
        //                                                                                                                 .findOne({
        //                                                                                                                     name: "Scoring"
        //                                                                                                                 })
        //                                                                                                                 .then(score => {
        //                                                                                                                     // Create issue type
        //                                                                                                                     IssueType
        //                                                                                                                         .create({
        //                                                                                                                             name: issue_type_name
        //                                                                                                                         })
        //                                                                                                                         .then(issueType => {
        //                                                                                                                             // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                             Issue
        //                                                                                                                                 .create({
        //                                                                                                                                     issue_name: issue_name,
        //                                                                                                                                     issue_type: issueType._id,
        //                                                                                                                                     tolerance_type: toleranceType._id,
        //                                                                                                                                     score: score._id
        //                                                                                                                                 })
        //                                                                                                                                 .then(issue => {
        //                                                                                                                                     //console.log(issue)

        //                                                                                                                                     // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                                     IssueCategory
        //                                                                                                                                         .create({
        //                                                                                                                                             name: issue_category_name,
        //                                                                                                                                             issue: issue._id
        //                                                                                                                                         })
        //                                                                                                                                         .then(issueCategory => {
        //                                                                                                                                             Personnel
        //                                                                                                                                                 .findOne({
        //                                                                                                                                                     personnel_type_id: "5d4bf46b2632951704862a0e"
        //                                                                                                                                                 })
        //                                                                                                                                                 .then((personnel) => {

        //                                                                                                                                                     const scout = {
        //                                                                                                                                                         date: date,
        //                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                         point: point._id,
        //                                                                                                                                                         issue: "5d64ccb71448d32c9034e689",
        //                                                                                                                                                         issueCategory: issueCategory._id,
        //                                                                                                                                                         value: "45",
        //                                                                                                                                                         block: block._id,
        //                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                         tolerance: tolerance._id,
        //                                                                                                                                                         scout_personnel: personnel.first_name,
        //                                                                                                                                                     }
        //                                                                                                                                                     const saveScout = [];

        //                                                                                                                                                     Scout
        //                                                                                                                                                         .insertMany(saveScout)
        //                                                                                                                                                         .then((scout) => {
        //                                                                                                                                                             const id = bed._id;

        //                                                                                                                                                             chai.request(app)

        //                                                                                                                                                                 .get(`/scout/entry/all?created=${date}`)

        //                                                                                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
        //                                                                                                                                                                 .end((err, res) => {
        //                                                                                                                                                                     if (err) {
        //                                                                                                                                                                         return done(err);
        //                                                                                                                                                                     } else {
        //                                                                                                                                                                         console.log(res.body)
        //                                                                                                                                                                         res.should.have.status(20);
        //                                                                                                                                                                         res.body.should.be.a('object');

        //                                                                                                                                                                         Block
        //                                                                                                                                                                             .find()
        //                                                                                                                                                                             .then(allBlocks => {

        //                                                                                                                                                                                 Scout
        //                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                         date: date,
        //                                                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                                                         point: point._id,
        //                                                                                                                                                                                         issue: issue._id,
        //                                                                                                                                                                                         issueCategory: issueCategory._id,
        //                                                                                                                                                                                         value: scoutValue,
        //                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                                                         tolerance: tolerance._id
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                         Variety
        //                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                 name: variety._id
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .then(() => {

        //                                                                                                                                                                                                 Bed
        //                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                         bed_number: bed_number,
        //                                                                                                                                                                                                         bed_name: bed_name,
        //                                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                         Block
        //                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                 parent_block: parent_block
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                 Issue
        //                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                         issue_name: issue_name,
        //                                                                                                                                                                                                                         issue_type: issueType._id,
        //                                                                                                                                                                                                                         tolerance_type: toleranceType._id,
        //                                                                                                                                                                                                                         score: score._id
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                         IssueCategory
        //                                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                                 name: issue_category_name,
        //                                                                                                                                                                                                                                 issue: issue._id
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                                 IssueType
        //                                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                                         name: issue_type_name
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                                         done();
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                     })

        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                     })
        //                                                                                                                                                                             })
        //                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                             })
        //                                                                                                                                                                     }
        //                                                                                                                                                                 })

        //                                                                                                                                                         })
        //                                                                                                                                                         .catch(err => {
        //                                                                                                                                                             return done(err);
        //                                                                                                                                                         });
        //                                                                                                                                                 })
        //                                                                                                                                         })
        //                                                                                                                                         .catch(err => {
        //                                                                                                                                             return done(err);
        //                                                                                                                                         })
        //                                                                                                                                 })
        //                                                                                                                                 .catch(err => {
        //                                                                                                                                     return done(err);
        //                                                                                                                                 })
        //                                                                                                                         })
        //                                                                                                                         .catch(err => {
        //                                                                                                                             return done(err);
        //                                                                                                                         })
        //                                                                                                                 })
        //                                                                                                                 .catch(err => {
        //                                                                                                                     return done(err);
        //                                                                                                                 })
        //                                                                                                         })
        //                                                                                                         .catch(err => {
        //                                                                                                             return done(err);
        //                                                                                                         })
        //                                                                                                 })
        //                                                                                                 .catch(err => {
        //                                                                                                     return done(err);
        //                                                                                                 })
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             return done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             return done(err);
        //                                                                         })

        //                                                                     //    }
        //                                                                     //  })
        //                                                                 }
        //                                                             });
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             }
        //                                         });



        //                                 })
        //                                 .catch(err => {
        //                                     return done(err);
        //                                 })
        //                         }
        //                     });
        //             }
        //         })
        // }).timeout(20000);
    });
    //  Get scouting date for a bed test
    describe("GET /scout/bed/entry/date/", () => {
        // it('It should fetch bed with its scouting date', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 // Create block
        //                 chai.request(app)
        //                     .post("/block")
        //                     .send({
        //                         "parent_block": parent_block,
        //                         "sub_block_name": sub_block_name,
        //                     })
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done();
        //                         } else {
        //                             // Get Block
        //                             Block
        //                                 .findOne({
        //                                     //parent_block: parent_block
        //                                     _id: "5d66281388a5d919a078a6ae"
        //                                 })
        //                                 .then(block => {

        //                                     // Create variety
        //                                     chai.request(app)
        //                                         .post("/variety")
        //                                         .send({
        //                                             "name": variety_name
        //                                         })
        //                                         .set('Authorization', 'Bearer ' + accessToken)
        //                                         .end((err, res) => {
        //                                             if (err) {
        //                                                 return done(err);
        //                                             } else {
        //                                                 Variety
        //                                                     .findOne({
        //                                                         name: variety_name
        //                                                     })
        //                                                     .then(variety => {

        //                                                         // Create bed
        //                                                         const newBed = {
        //                                                             bed_number: bed_number,
        //                                                             bed_name: bed_name,
        //                                                             block: block._id,
        //                                                             parent_block: parent_block,
        //                                                             sub_block_name: block.sub_block_name,
        //                                                             plant_date: '2019-08-14T00:00:00.000Z',
        //                                                             expected_pick_date: '2019-08-17T00:00:00.000Z',
        //                                                             variety: variety._id,
        //                                                             variety_name: variety.name,
        //                                                             status: 1
        //                                                         };

        //                                                         chai.request(app)
        //                                                             .post("/bed")
        //                                                             .send(newBed)
        //                                                             .set('Authorization', 'Bearer ' + accessToken)
        //                                                             .end((err, res) => {
        //                                                                 if (err) {
        //                                                                     return done(err);
        //                                                                 } else {
        //                                                                     Bed
        //                                                                         .findOne({
        //                                                                             _id: "5d66295f88a5d919a078a6ba"
        //                                                                         })

        //                                                                         .then((bed) => {
        //                                                                             // console.log(bed)
        //                                                                             // Get Entry
        //                                                                             Entry
        //                                                                                 .findOne({
        //                                                                                     _id: "5d64c4d42079af2a9c0baced"
        //                                                                                 })
        //                                                                                 .then(entry => {

        //                                                                                     // Get Point
        //                                                                                     Point
        //                                                                                         .findOne({
        //                                                                                             _id: "5d5a64c0c7b4100b3823164f"
        //                                                                                         })
        //                                                                                         .then(point => {
        //                                                                                             // Create Tolerance Type
        //                                                                                             ToleranceType
        //                                                                                                 .create({
        //                                                                                                     name: tolerance_type_name
        //                                                                                                 })
        //                                                                                                 .then(toleranceType => {

        //                                                                                                     // Create tolerance
        //                                                                                                     Tolerance
        //                                                                                                         .create({
        //                                                                                                             name: tolerance_name,
        //                                                                                                             to: tolerance_to,
        //                                                                                                             from: tolerance_from,
        //                                                                                                             tolerance_type: toleranceType._id
        //                                                                                                         })
        //                                                                                                         .then(tolerance => {
        //                                                                                                             Score
        //                                                                                                                 .findOne({
        //                                                                                                                     name: "Scoring"
        //                                                                                                                 })
        //                                                                                                                 .then(score => {
        //                                                                                                                     // Create issue type
        //                                                                                                                     IssueType
        //                                                                                                                         .create({
        //                                                                                                                             name: issue_type_name
        //                                                                                                                         })
        //                                                                                                                         .then(issueType => {
        //                                                                                                                             // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                             Issue
        //                                                                                                                                 .create({
        //                                                                                                                                     issue_name: issue_name,
        //                                                                                                                                     issue_type: issueType._id,
        //                                                                                                                                     tolerance_type: toleranceType._id,
        //                                                                                                                                     score: score._id
        //                                                                                                                                 })
        //                                                                                                                                 .then(issue => {
        //                                                                                                                                     //console.log(issue)

        //                                                                                                                                     // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                                     IssueCategory
        //                                                                                                                                         .create({
        //                                                                                                                                             name: issue_category_name,
        //                                                                                                                                             issue: issue._id
        //                                                                                                                                         })
        //                                                                                                                                         .then(issueCategory => {
        //                                                                                                                                             Personnel
        //                                                                                                                                                 .findOne({
        //                                                                                                                                                     personnel_type_id: "5d4bf46b2632951704862a0e"
        //                                                                                                                                                 })
        //                                                                                                                                                 .then((personnel) => {

        //                                                                                                                                                     const scout = {
        //                                                                                                                                                         date: date,
        //                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                         point: point._id,
        //                                                                                                                                                         issue: "5d64ccb71448d32c9034e689",
        //                                                                                                                                                         issueCategory: issueCategory._id,
        //                                                                                                                                                         value: "45",
        //                                                                                                                                                         block: block._id,
        //                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                         tolerance: tolerance._id,
        //                                                                                                                                                         scout_personnel: personnel.first_name,
        //                                                                                                                                                     }
        //                                                                                                                                                     const saveScout = [];

        //                                                                                                                                                     Scout
        //                                                                                                                                                         .insertMany(saveScout)
        //                                                                                                                                                         .then((scout) => {
        //                                                                                                                                                             const id = bed._id;

        //                                                                                                                                                             chai.request(app)

        //                                                                                                                                                                 .get(`/scout/bed/entry/date?bed=${id}`)

        //                                                                                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
        //                                                                                                                                                                 .end((err, res) => {
        //                                                                                                                                                                     if (err) {
        //                                                                                                                                                                         return done(err);
        //                                                                                                                                                                     } else {
        //                                                                                                                                                                         console.log(res.body)
        //                                                                                                                                                                         res.should.have.status(20);
        //                                                                                                                                                                         res.body.should.be.a('object');

        //                                                                                                                                                                         Block
        //                                                                                                                                                                             .find()
        //                                                                                                                                                                             .then(allBlocks => {

        //                                                                                                                                                                                 Scout
        //                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                         date: date,
        //                                                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                                                         point: point._id,
        //                                                                                                                                                                                         issue: issue._id,
        //                                                                                                                                                                                         issueCategory: issueCategory._id,
        //                                                                                                                                                                                         value: scoutValue,
        //                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                                                         tolerance: tolerance._id
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                         Variety
        //                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                 name: variety._id
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .then(() => {

        //                                                                                                                                                                                                 Bed
        //                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                         bed_number: bed_number,
        //                                                                                                                                                                                                         bed_name: bed_name,
        //                                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                         Block
        //                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                 parent_block: parent_block
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                 Issue
        //                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                         issue_name: issue_name,
        //                                                                                                                                                                                                                         issue_type: issueType._id,
        //                                                                                                                                                                                                                         tolerance_type: toleranceType._id,
        //                                                                                                                                                                                                                         score: score._id
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                         IssueCategory
        //                                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                                 name: issue_category_name,
        //                                                                                                                                                                                                                                 issue: issue._id
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                                 IssueType
        //                                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                                         name: issue_type_name
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                                         done();
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                     })

        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                     })
        //                                                                                                                                                                             })
        //                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                             })
        //                                                                                                                                                                     }
        //                                                                                                                                                                 })

        //                                                                                                                                                         })
        //                                                                                                                                                         .catch(err => {
        //                                                                                                                                                             return done(err);
        //                                                                                                                                                         });
        //                                                                                                                                                 })
        //                                                                                                                                         })
        //                                                                                                                                         .catch(err => {
        //                                                                                                                                             return done(err);
        //                                                                                                                                         })
        //                                                                                                                                 })
        //                                                                                                                                 .catch(err => {
        //                                                                                                                                     return done(err);
        //                                                                                                                                 })
        //                                                                                                                         })
        //                                                                                                                         .catch(err => {
        //                                                                                                                             return done(err);
        //                                                                                                                         })
        //                                                                                                                 })
        //                                                                                                                 .catch(err => {
        //                                                                                                                     return done(err);
        //                                                                                                                 })
        //                                                                                                         })
        //                                                                                                         .catch(err => {
        //                                                                                                             return done(err);
        //                                                                                                         })
        //                                                                                                 })
        //                                                                                                 .catch(err => {
        //                                                                                                     return done(err);
        //                                                                                                 })
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             return done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             return done(err);
        //                                                                         })

        //                                                                     //    }
        //                                                                     //  })
        //                                                                 }
        //                                                             });
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             }
        //                                         });

        //                                 })
        //                                 .catch(err => {
        //                                     return done(err);
        //                                 })
        //                         }
        //                     });
        //             }
        //         })
        // }).timeout(20000);
    });

    //  Entry reporting test
    describe("GET /scout/tolerance/entry", () => {

        // it('It should fetch all  points in a entry  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 // Create block
        //                 chai.request(app)
        //                     .post("/block")
        //                     .send({
        //                         "parent_block": parent_block,
        //                         "sub_block_name": sub_block_name,
        //                     })
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done();
        //                         } else {
        //                             // Get Block
        //                             Block
        //                                 .findOne({
        //                                     //  parent_block: parent_block
        //                                     _id: "5d66281d88a5d919a078a6af"
        //                                 })
        //                                 .then(block => {

        //                                     // Create variety
        //                                     chai.request(app)
        //                                         .post("/variety")
        //                                         .send({
        //                                             "name": variety_name
        //                                         })
        //                                         .set('Authorization', 'Bearer ' + accessToken)
        //                                         .end((err, res) => {
        //                                             if (err) {
        //                                                 return done(err);
        //                                             } else {
        //                                                 Variety
        //                                                     .findOne({
        //                                                         name: variety_name
        //                                                     })
        //                                                     .then(variety => {

        //                                                         // Create bed
        //                                                         const newBed = {
        //                                                             bed_number: bed_number,
        //                                                             bed_name: bed_name,
        //                                                             block: block._id,
        //                                                             parent_block: parent_block,
        //                                                             sub_block_name: block.sub_block_name,
        //                                                             plant_date: '2019-08-14T00:00:00.000Z',
        //                                                             expected_pick_date: '2019-08-17T00:00:00.000Z',
        //                                                             variety: variety._id,
        //                                                             variety_name: variety.name,
        //                                                             status: 1
        //                                                         };

        //                                                         chai.request(app)
        //                                                             .post("/bed")
        //                                                             .send(newBed)
        //                                                             .set('Authorization', 'Bearer ' + accessToken)
        //                                                             .end((err, res) => {
        //                                                                 if (err) {
        //                                                                     return done(err);
        //                                                                 } else {
        //                                                                     Bed
        //                                                                         .findOne({
        //                                                                             _id: "5d6666931805ff18bce8d619"
        //                                                                         })

        //                                                                         .then((bed) => {
        //                                                                             // console.log(bed)
        //                                                                             // Get Entry
        //                                                                             Entry
        //                                                                                 .findOne({
        //                                                                                     _id: "5d64c4d42079af2a9c0baced"
        //                                                                                 })
        //                                                                                 .then(entry => {

        //                                                                                     // Get Point
        //                                                                                     Point
        //                                                                                         .findOne({
        //                                                                                             _id: "5d64c4e42079af2a9c0bacee"
        //                                                                                         })
        //                                                                                         .then(point => {
        //                                                                                             // Create Tolerance Type
        //                                                                                             ToleranceType
        //                                                                                                 .create({
        //                                                                                                     name: tolerance_type_name
        //                                                                                                 })
        //                                                                                                 .then(toleranceType => {

        //                                                                                                     // Create tolerance
        //                                                                                                     Tolerance
        //                                                                                                         .create({
        //                                                                                                             name: tolerance_name,
        //                                                                                                             to: tolerance_to,
        //                                                                                                             from: tolerance_from,
        //                                                                                                             tolerance_type: toleranceType._id
        //                                                                                                         })
        //                                                                                                         .then(tolerance => {
        //                                                                                                             Score
        //                                                                                                                 .findOne({
        //                                                                                                                     name: "Scoring"
        //                                                                                                                 })
        //                                                                                                                 .then(score => {
        //                                                                                                                     // Create issue type
        //                                                                                                                     IssueType
        //                                                                                                                         .create({
        //                                                                                                                             name: issue_type_name
        //                                                                                                                         })
        //                                                                                                                         .then(issueType => {
        //                                                                                                                             // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                             Issue
        //                                                                                                                                 .create({
        //                                                                                                                                     issue_name: issue_name,
        //                                                                                                                                     issue_type: issueType._id,
        //                                                                                                                                     tolerance_type: toleranceType._id,
        //                                                                                                                                     score: score._id
        //                                                                                                                                 })
        //                                                                                                                                 .then(issue => {
        //                                                                                                                                     //console.log(issue)

        //                                                                                                                                     // Get Issue Score IssueCetegory Issue Type ToleranceType Tolerance
        //                                                                                                                                     IssueCategory
        //                                                                                                                                         .create({
        //                                                                                                                                             name: issue_category_name,
        //                                                                                                                                             issue: issue._id
        //                                                                                                                                         })
        //                                                                                                                                         .then(issueCategory => {
        //                                                                                                                                             Personnel
        //                                                                                                                                                 .findOne({
        //                                                                                                                                                     personnel_type_id: "5d4bf46b2632951704862a0e"
        //                                                                                                                                                 })
        //                                                                                                                                                 .then((personnel) => {

        //                                                                                                                                                     const scout = {
        //                                                                                                                                                         date: date,
        //                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                         point: point._id,
        //                                                                                                                                                         issue: "5d667a807b4c5747d0bfc502",
        //                                                                                                                                                         issueCategory: "5d667abb7b4c5747d0bfc503",
        //                                                                                                                                                         value: "1",
        //                                                                                                                                                         block: block._id,
        //                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                         tolerance: tolerance._id,
        //                                                                                                                                                         scout_personnel: personnel.first_name,
        //                                                                                                                                                     }
        //                                                                                                                                                     const saveScout = [scout];

        //                                                                                                                                                     Scout
        //                                                                                                                                                         .insertMany(saveScout)
        //                                                                                                                                                         .then((scout) => {
        //                                                                                                                                                             const id = entry._id;
        //                                                                                                                                                             const bedId = bed._id;

        //                                                                                                                                                             chai.request(app)
        //                                                                                                                                                                 .get(`/scout/tolerance/entry?bed=${bedId}&entry=${id}`)
        //                                                                                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
        //                                                                                                                                                                 .end((err, res) => {
        //                                                                                                                                                                     if (err) {
        //                                                                                                                                                                         return done(err);
        //                                                                                                                                                                     } else {
        //                                                                                                                                                                         console.log(res.body)
        //                                                                                                                                                                         res.should.have.status(20);
        //                                                                                                                                                                         res.body.should.be.a('object');

        //                                                                                                                                                                         Block
        //                                                                                                                                                                             .find()
        //                                                                                                                                                                             .then(allBlocks => {

        //                                                                                                                                                                                 Scout
        //                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                         date: date,
        //                                                                                                                                                                                         entry: entry._id,
        //                                                                                                                                                                                         point: point._id,
        //                                                                                                                                                                                         issue: issue._id,
        //                                                                                                                                                                                         issueCategory: issueCategory._id,
        //                                                                                                                                                                                         value: scoutValue,
        //                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                         sub_block: block.sub_block_name,
        //                                                                                                                                                                                         bed: bed._id,
        //                                                                                                                                                                                         variety: variety._id,
        //                                                                                                                                                                                         longitude: longitude,
        //                                                                                                                                                                                         latitude: latitude,
        //                                                                                                                                                                                         tolerance: tolerance._id
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                         Variety
        //                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                 name: variety._id
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .then(() => {

        //                                                                                                                                                                                                 Bed
        //                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                         bed_number: bed_number,
        //                                                                                                                                                                                                         bed_name: bed_name,
        //                                                                                                                                                                                                         block: block._id,
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                         Block
        //                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                 parent_block: parent_block
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                 Issue
        //                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                         issue_name: issue_name,
        //                                                                                                                                                                                                                         issue_type: issueType._id,
        //                                                                                                                                                                                                                         tolerance_type: toleranceType._id,
        //                                                                                                                                                                                                                         score: score._id
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                         IssueCategory
        //                                                                                                                                                                                                                             .deleteMany({
        //                                                                                                                                                                                                                                 name: issue_category_name,
        //                                                                                                                                                                                                                                 issue: issue._id
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .then(() => {
        //                                                                                                                                                                                                                                 IssueType
        //                                                                                                                                                                                                                                     .deleteMany({
        //                                                                                                                                                                                                                                         name: issue_type_name
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .then(() => {
        //                                                                                                                                                                                                                                         done();
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                                             })
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                                     })
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                                             })
        //                                                                                                                                                                                                     })
        //                                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                                     })

        //                                                                                                                                                                                             })
        //                                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                                             })
        //                                                                                                                                                                                     })
        //                                                                                                                                                                                     .catch(err => {
        //                                                                                                                                                                                         return done(err);
        //                                                                                                                                                                                     })
        //                                                                                                                                                                             })
        //                                                                                                                                                                             .catch(err => {
        //                                                                                                                                                                                 return done(err);
        //                                                                                                                                                                             })
        //                                                                                                                                                                     }
        //                                                                                                                                                                 })

        //                                                                                                                                                         })
        //                                                                                                                                                         .catch(err => {
        //                                                                                                                                                             return done(err);
        //                                                                                                                                                         });
        //                                                                                                                                                 })
        //                                                                                                                                         })
        //                                                                                                                                         .catch(err => {
        //                                                                                                                                             return done(err);
        //                                                                                                                                         })
        //                                                                                                                                 })
        //                                                                                                                                 .catch(err => {
        //                                                                                                                                     return done(err);
        //                                                                                                                                 })
        //                                                                                                                         })
        //                                                                                                                         .catch(err => {
        //                                                                                                                             return done(err);
        //                                                                                                                         })
        //                                                                                                                 })
        //                                                                                                                 .catch(err => {
        //                                                                                                                     return done(err);
        //                                                                                                                 })
        //                                                                                                         })
        //                                                                                                         .catch(err => {
        //                                                                                                             return done(err);
        //                                                                                                         })
        //                                                                                                 })
        //                                                                                                 .catch(err => {
        //                                                                                                     return done(err);
        //                                                                                                 })
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             return done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             return done(err);
        //                                                                         })

        //                                                                     //    }
        //                                                                     //  })
        //                                                                 }
        //                                                             });
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             }
        //                                         });
        //                                 })
        //                                 .catch(err => {
        //                                     return done(err);
        //                                 })
        //                         }
        //                     });
        //             }
        //         })
        // }).timeout(20000);

    });

    //  Farm reporting test
    describe("GET /scout/tolerance/farm", () => {

        // it('It should fetch all  parent block  and threat status (Success, Warning or danger)', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 chai.request(app)
        //                     .get(`/scout/tolerance/farm`)

        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    //  Block tolerance level reporting test
    describe("GET /scout/tolerance/block/blockId", () => {

        // it('It should get beds in a block with their threat level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;

        //                 const blockId = "5d87b9696de14122f4b12e31"
        //                 chai.request(app)
        //                     .get(`/scout/tolerance/block?block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             //console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })

        //             }
        //         })
        // }).timeout(20000);
    });

    //  Bed tolerance level reporting test
    describe("GET /scout/entry/all/bedId", () => {
        // it('It should get entries in a bed with their threat level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const bedId = "5d887664fe1e846914abb698";
        //                 // const created = '2019-12-13';
        //                 // const bedId = "5d8876d6fe1e846914abb69b";
        //                 const accessToken = res.body.accessToken;
        //                 chai.request(app)
        //                     .get(`/scout/entry/all?bed=${bedId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             // console.log(res.body);
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);

        // it('It should get entries in a bed with their threat level filtered by date', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const bedId = "5d887789fe1e846914abb707";
        //                 const created = '2019-09-27';
        //                 const accessToken = res.body.accessToken;
        //                 chai.request(app)
        //                     .get(`/scout/entry/all?bed=${bedId}&created=${created}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             //console.log(res.body);
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    //  Entry tolerance level reporting test
    describe("GET /scout /tolerance/entry/bedId / entryId", () => {

        // it('It should get points in an entry in a given bed with their threat level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const bedId = "5d8879ebfe1e846914abb7db";
        //                 const entryId = "5d87d643becb722b4d2f2291"
        //                 const date = "2019-11-18";
        //                 chai.request(app)
        //                     .get(`/scout/bed/tolerance/entry?bed=${bedId}&entry=${entryId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    // //  Block print reporting test(print)
    // describe("GET scout/bed/entry/report", () => {

    //     it('It should get beds in a block with their threat level', (done) => {
    //         // Login user
    //         chai.request(app)
    //             .post('/personnel/login')
    //             .send({
    //                 phone: userPhone,
    //                 password: userPassword
    //             })
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 } else {
    //                     const accessToken = res.body.accessToken;
    //                     const blockId = '5d87b9696de14122f4b12e31';
    //                     chai.request(app)
    //                         .get(`/scout/bed/entry/report?block=${blockId}`)
    //                         .set('Authorization', 'Bearer ' + accessToken)
    //                         .end((err, res) => {
    //                             if (err) {
    //                                 return done(err);
    //                             } else {
    //                                 res.should.have.status(200);
    //                                 res.body.should.be.a('array');
    //                                 done();
    //                             }
    //                         })
    //                 }
    //             })
    //     }).timeout(20000);

    //  Entry tolerance level reporting test
    describe("GET /scout/tolerance/entry/bedId/entryId", () => {

        // it('It should get points in an entry in a given bed with their threat level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const bedId = "5d87ce0abecb722b4d2f1fee";
        //                 const entryId = "5d87d648becb722b4d2f2292";
        //                 chai.request(app)
        //                     .get(`/scout/bed/tolerance/entry?bed=${bedId}&entry=${entryId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             // console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('object');
        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });

    //     it('It should get beds in a block with their threat level filtered by personnel', (done) => {
    //         // Login user
    //         chai.request(app)
    //             .post('/personnel/login')
    //             .send({
    //                 phone: userPhone,
    //                 password: userPassword
    //             })
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 } else {
    //                     const accessToken = res.body.accessToken;
    //                     const blockId = '5d87b9696de14122f4b12e31';
    //                     const personnel = "5d88a7baa60b0f147c2f0799";

    //                     chai.request(app)
    //                         .get(`/scout/bed/entry/report?block=${blockId}&created_by =${personnel} `)
    //                         .set('Authorization', 'Bearer ' + accessToken)
    //                         .end((err, res) => {
    //                             if (err) {
    //                                 return done(err);
    //                             } else {
    //                                 res.should.have.status(200);
    //                                 res.body.should.be.a('array');
    //                                 done();
    //                             }
    //                         })
    //                 }
    //             })
    //     }).timeout(20000);

    //     it('It should get beds in a block with their threat level filtered by variety', (done) => {
    //         // Login user
    //         chai.request(app)
    //             .post('/personnel/login')
    //             .send({
    //                 phone: userPhone,
    //                 password: userPassword
    //             })
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 } else {
    //                     const accessToken = res.body.accessToken;
    //                     const blockId = '5d87b9696de14122f4b12e31';
    //                     const variety = "5d87bc166de14122f4b12e48";

    //                     chai.request(app)
    //                         .get(`/scout/bed/entry/report?block=${blockId}&variety=${variety}`)
    //                         .set('Authorization', 'Bearer ' + accessToken)
    //                         .end((err, res) => {
    //                             if (err) {
    //                                 return done(err);
    //                             } else {
    //                                 res.should.have.status(200);
    //                                 res.body.should.be.a('array');
    //                                 done();
    //                             }
    //                         })
    //                 }
    //             })
    //     }).timeout(20000);

    // });

    // //  Bed prevalence
    // describe("GET scout/bed/prevalence/bedId", () => {

    // it('It should get beds in a bed with its prevalence level', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 Bed
    //                     .findOne({
    //                         name: "Block 1"
    //                     })
    //                     .then((block) => {
    //                         const sdate = "2019-09-15"
    //                         const edate = "2019-09-28"
    //                         const id = "5d87ce0abecb722b4d2f1fee"
    //                         const issue = "5d87dd7abecb722b4d2f22d8";

    //                         chai.request(app)
    //                             .get(`/scout/bed/prevalence?bed=${id}&sdate=${sdate}&edate=${edate}&issue=${issue}`)
    //                             .set('Authorization', 'Bearer ' + accessToken)
    //                             .end((err, res) => {
    //                                 if (err) {
    //                                     return done(err);
    //                                 } else {
    //                                     //console.log(res.body)
    //                                     res.should.have.status(200);
    //                                     res.body.should.be.a('array');
    //                                     done();
    //                                 }
    //                             })
    //                     })
    //             }
    //         })
    // }).timeout(20000);

    // });

    // describe("GET scout/all", () => {

    //     it('It should get all scouts without pagination', (done) => {
    //         // Login user
    //         chai.request(app)
    //             .post('/personnel/login')
    //             .send({
    //                 phone: userPhone,
    //                 password: userPassword
    //             })
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 } else {
    //                     const accessToken = res.body.accessToken;
    //                     chai.request(app)
    //                         .get(`/scout/all`)
    //                         .set('Authorization', 'Bearer ' + accessToken)
    //                         .end((err, res) => {
    //                             if (err) {
    //                                 return done(err);
    //                             } else {
    //                                 // console.log(res.body);
    //                                 res.should.have.status(200);
    //                                 res.body.should.be.a('array');
    //                                 done();
    //                             }
    //                         })
    //                 }
    //             })
    //     }).timeout(20000);

    //     // it('Add tolerance to scout', (done) => {
    //     //     // Login user
    //     //     chai.request(app)
    //     //         .post('/personnel/login')
    //     //         .send({
    //     //             phone: userPhone,
    //     //             password: userPassword
    //     //         })
    //     //         .end((err, res) => {
    //     //             if (err) {
    //     //                 return done(err);
    //     //             } else {
    //     //                 const accessToken = res.body.accessToken;
    //     //                 chai.request(app)
    //     //                     .get(`/scout/update-tolerance`)
    //     //                     .set('Authorization', 'Bearer ' + accessToken)
    //     //                     .end((err, res) => {
    //     //                         if (err) {
    //     //                             return done(err);
    //     //                         } else {
    //     //                             // console.log(res.body)
    //     //                             res.should.have.status(200);
    //     //                             res.body.should.be.a('object');
    //     //                             done();
    //     //                         }
    //     //                     })
    //     //             }
    //     //         })
    //     // }).timeout(20000);

    // });

    describe("GET scout/time-report", () => {
        // it("It should get average time of block, bed & station for all scouts per day", (done) => {

        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const scoutDate1 = "2019-12-17"
        //                 const accessToken = res.body.accessToken;
        //                 const blockId = "5d87b9696de14122f4b12e31"

        //                 chai.request(app)
        //                     .get(`/scout/time-report?date=${scoutDate1}&block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             // Fetch response received
        //                             const response = res.body;

        //                             // Check that status of response is success
        //                             res.should.have.status(200);

        //                             // Check that response is an array
        //                             response.should.be.a('array');

        //                             // Check that first row in response array is an object
        //                             response[0].should.be.a('object');

        //                             // Verify that object has required keys
        //                             expect(response[0].to.have.key(["personnel", "block_time", "bed_time", "station_time", "blocks_scouted", "beds_scouted", "stations_scouted"]));

        //                             done();
        //                         }
        //                     })
        //             }
        //         })
        // }).timeout(20000);
    });


    //  Farm prevalence
    describe("GET scout/farm/prevalence/", () => {

        // it('It should get farm  with its prevalence level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const sdate = "2019-11-15"
        //                 const edate = "2019-11-28"

        //                 chai.request(app)
        //                     .get(`/scout/farm/prevalence?sdate=${sdate}&edate=${edate}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             // console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })

        //             }
        //         })
        // }).timeout(2000000);

        // it('It should filter block in a farm with its prevalence level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 Block
        //                     .findOne({
        //                         name: "Block 13"
        //                     })
        //                     .then((block) => {
        //                         //console.log(block)
        //                         const sdate = "2019-11-15"
        //                         const edate = "2019-11-28"
        //                         const blockId = "5d87b9736de14122f4b12e32"

        //                         chai.request(app)
        //                             .get(`/scout/farm/prevalence?sdate=${sdate}&edate=${edate}&block=${blockId}`)
        //                             .set('Authorization', 'Bearer ' + accessToken)
        //                             .end((err, res) => {
        //                                 if (err) {
        //                                     return done(err);
        //                                 } else {
        //                                     // console.log(res.body)
        //                                     res.should.have.status(200);
        //                                     res.body.should.be.a('array');
        //                                     done();
        //                                 }
        //                             })
        //                     })
        //             }
        //         })
        // }).timeout(2000000);

        // it('It should filter issue in a farm  with its prevalence level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const sdate = "2019-11-15"
        //                 const edate = "2019-11-28"
        //                 const issue = "5d87dd7abecb722b4d2f22d8";

        //                 chai.request(app)
        //                     .get(`/scout/farm/prevalence?sdate=${sdate}&edate=${edate}&issue=${issue}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             // console.log(res.body)
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })

        //             }
        //         })
        // }).timeout(20000);

        // it('It should filter issue and block in a farm  with its prevalence level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const sdate = "2019-11-15"
        //                 const edate = "2019-11-28"
        //                 const blockId = "5d87b9696de14122f4b12e31"
        //                 const issue = "5d87dd7abecb722b4d2f22d8";
        //                 chai.request(app)
        //                     .get(`/scout/farm/prevalence?sdate=${sdate}&edate=${edate}&issue=${issue}&block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })

        //             }
        //         })
        // }).timeout(200000);

        // it('It should filter issue in in a farm  by scout with its prevalence level', (done) => {
        //     // Login user
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 const accessToken = res.body.accessToken;
        //                 const sdate = "2019-11-15"
        //                 const edate = "2019-11-28"
        //                 const blockId = "5d87b9736de14122f4b12e32"
        //                 const created_by = "5d87dd7abecb722b4d2f22d8";
        //                 chai.request(app)
        //                     .get(`/scout/farm/prevalence?sdate=${sdate}&edate=${edate}&created_by=${created_by}&block=${blockId}`)
        //                     .set('Authorization', 'Bearer ' + accessToken)
        //                     .end((err, res) => {
        //                         if (err) {
        //                             return done(err);
        //                         } else {
        //                             res.should.have.status(200);
        //                             res.body.should.be.a('array');
        //                             done();
        //                         }
        //                     })

        //             }
        //         })
        // }).timeout(200000);
    });
});
describe("Get /scout/location", () => {
    // it('It should get scout location', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 const date = "2019-12-11"
    //                 chai.request(app)
    //                     .get(`/scout/location?date=${date}`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             res.body[0].lng.should.not.be.undefined;
    //                             res.body[0].lat.should.not.be.undefined;
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);

    // it('It should get scout location of given scout', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 let scoutId = "5d887623fe1e846914abb697";
    //                 chai.request(app)
    //                     .get(`/scout/location?created_by=${scoutId}`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             // console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             res.body[0].lng.should.not.be.undefined;
    //                             res.body[0].lat.should.not.be.undefined;
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);

    // it('It should get scout location of given scout', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 let scoutId = "5d887623fe1e846914abb697";
    //                 let blockId = "5d87b95a6de14122f4b12e30";
    //                 chai.request(app)
    //                     .get(`/scout/location?created_by=${scoutId}&block=${blockId}`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             //console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);


    // it('It should get scout location of given scout', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 let scoutId = "5d887623fe1e846914abb697";
    //                 let blockId = "5d87b9696de14122f4b12e31";
    //                 const date = "2019-11-28"
    //                 chai.request(app)
    //                     //  .get(`/scout/location`)
    //                     .get(`/scout/location?date=${date}&created_by=${scoutId}&block=${blockId}`)

    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             // console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);

})
//  Alert per variety test
describe("GET /scout/tolerance/farm/variety", () => {

    // it('It should get varieties with their threat alerts', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 chai.request(app)
    //                     .get(`/scout/tolerance/farm/variety`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             //console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);
    // it('It should filter  varieties  in a block with their threat alerts', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 const blockId = "5d87b9696de14122f4b12e31"
    //                 chai.request(app)
    //                     .get(`/scout/tolerance/farm/variety?block=${blockId}`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             //console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);
    // it('It should filter  a variety in a farm with its their threat alerts', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 const blockId = "5d87b9696de14122f4b12e31"
    //                 const varietyId = "5d87bc696de14122f4b12e51";
    //                 chai.request(app)
    //                     .get(`/scout/tolerance/farm/variety?variety=${varietyId}`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             //console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);
});

describe("GET /scout/personnel", () => {

    // it('It should get each scouts latest 10 entries', (done) => {
    //     // Login user
    //     chai.request(app)
    //         .post('/personnel/login')
    //         .send({
    //             phone: userPhone,
    //             password: userPassword
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 const accessToken = res.body.accessToken;
    //                 c
    //                 chai.request(app)
    //                     .get(`/scout/personnel`)
    //                     .set('Authorization', 'Bearer ' + accessToken)
    //                     .end((err, res) => {
    //                         if (err) {
    //                             return done(err);
    //                         } else {
    //                             console.log(res.body)
    //                             res.should.have.status(200);
    //                             res.body.should.be.a('array');
    //                             done();
    //                         }
    //                     })

    //             }
    //         })
    // }).timeout(2000000);


});