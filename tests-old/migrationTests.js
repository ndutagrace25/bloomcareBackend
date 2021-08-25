import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const {
    PersonnelType,
    Personnel,
    Score,
    Point,
    Entry
} = require('../models');

const {
    userPhone,
    entries,
    points,
    scores,
    personnelTypes
} = require("./config");

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;
let assert = chai.assert;

describe("Migrations", () => {
    describe("GET /", () => {
        // it('Should migrate default personnel types, personnel, scores', (done) => {

        //     const personnelTypeWhere = personnelTypes;

        //     const personnelWhere = {
        //         phone: userPhone
        //     };

        //     const scoreWhere = scores;

        //     // Delete previous data
        //     PersonnelType
        //         .deleteMany({
        //             $or: personnelTypeWhere
        //         })
        //         .then(() => {
        //             Personnel
        //                 .deleteMany(personnelWhere)
        //                 .then(() => {
        //                     Score
        //                         .deleteMany({
        //                             $or: scoreWhere
        //                         })
        //                         .then(() => {

        //                             // Run Migrations
        //                             chai.request(app)
        //                                 .get("/migration")
        //                                 .end((err, res) => {
        //                                     if (err) {
        //                                         return done(err);
        //                                     } else {

        //                                         // Test migrations
        //                                         PersonnelType
        //                                             .find({
        //                                                 $or: personnelTypeWhere
        //                                             })
        //                                             .then(personnelType => {
        //                                                 personnelType.length.should.not.be.undefined;
        //                                                 assert.equal(2, personnelType.length);

        //                                                 Personnel
        //                                                     .find(personnelWhere)
        //                                                     .then(personnel => {
        //                                                         personnel.length.should.not.be.undefined;
        //                                                         assert.equal(1, personnel.length);

        //                                                         Score
        //                                                             .find({
        //                                                                 $or: scoreWhere
        //                                                             })
        //                                                             .then(score => {
        //                                                                 score.length.should.not.be.undefined;
        //                                                                 assert.equal(2, score.length);

        //                                                             })
        //                                                             .catch(err => {
        //                                                                 return done(err);
        //                                                             });
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     });
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             });
        //                                     }
        //                                 });

        //                         })
        //                         .catch(err => {
        //                             return done(err);
        //                         });
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         });
        // }).timeout(20000);
    });
});