import chai from 'chai';
import chaiHttp from 'chai-http';
const objectid = require('mongodb').ObjectID;

import app from '../server';
const {
    Personnel,
    Bed,
    Block,
    Plant,
    Variety
} = require('../models');

const {
    userPhone,
    userPassword
} = require("../tests/config");

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;
let assert = chai.assert;

const block_name = "Test block";
const block_number = "Test block number";
const sub_block_name = "Test sub block";
const variety_name = "Test variety";
const bed_number = "10000000";
const bed_name = "test bed";
const plant_date = "2019-08-22T15:32:12.417Z";
const expected_pick_date = "2019-08-22T15:32:12.417Z";
const status = "1";
//const objectid = require('mongodb').ObjectID;


describe("Bed", () => {
    //   Create bed
    describe("POST /bed", () => {

        it('It should bulk create a bed', (done) => {
            // console.log({
            //     phone: userPhone,
            //     password: userPassword
            // });
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
                            .post(`/bed/bulk`)
                            .send({
                                from: '1',
                                to: '7',
                                variety: '5d87bc466de14122f4b12e4f',
                                plant_date: '2019-01-01T18:23:18.767Z',
                                status: '1',
                                block: '5d87abe06de14122f4b12e24',
                                expected_pick_date: '2019-12-31T18:23:18.767Z'
                            })
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    console.log(res.body)
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    done();
                                }
                            })
                    }
                })
        }).timeout(20000);

        // it('Should save a bed', (done) => {

        //     //login user
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
        //                     .create({
        //                         "name": block_name,
        //                         "number": block_number
        //                     })
        //                     .then((parentBlock) => {
        //                         Block
        //                             .create({
        //                                 "name": sub_block_name,
        //                                 "parent": parentBlock._id
        //                             })
        //                             .then((block) => {
        //                                 Variety
        //                                     .create({
        //                                         "name": variety_name
        //                                     })
        //                                     .then((variety) => {
        //                                         chai.request(app)
        //                                             .post("/bed")
        //                                             .send({
        // "bed_number": bed_number,
        // "bed_name": bed_name,
        // "variety": variety._id,
        // "plant_date": plant_date,
        // "expected_pick_date": expected_pick_date,
        // "status": status,
        // "block": block._id
        //                                             })
        //                                             .then(() => {
        //                                                 chai.request(app)
        //                                                     .post("/bed")
        //                                                     .send({
        //                                                         "bed_number": bed_number,
        //                                                         "bed_name": bed_name,
        //                                                         "variety": variety._id,
        //                                                         "plant_date": plant_date,
        //                                                         "expected_pick_date": expected_pick_date,
        //                                                         "status": status,
        //                                                         "block": block._id
        //                                                     })
        //                                                     .set('Authorization', 'Bearer ' + accessToken)
        //                                                     .end((err, res) => {
        //                                                         if (err) {
        //                                                             return done(err);
        //                                                         } else {
        //                                                             Bed
        //                                                                 .findOne({
        //                                                                     "bed_number": bed_number,
        //                                                                     "bed_name": bed_name
        //                                                                 })
        //                                                                 .then(savedBed => {
        //                                                                     res.should.have.status(200);
        //                                                                     res.should.be.a('object');
        //                                                                     res.body.message.should.not.be.undefined;
        //                                                                     assert.equal("Success", res.body.message);
        //                                                                     Bed
        //                                                                         .deleteMany({
        //                                                                             "bed_number": bed_number,
        //                                                                             "bed_name": bed_name
        //                                                                         })
        //                                                                         .then(() => {
        //                                                                             Block
        //                                                                                 .deleteMany({
        //                                                                                     "name": sub_block_name
        //                                                                                 })
        //                                                                                 .then(() => {
        //                                                                                     Block
        //                                                                                         .deleteMany({
        //                                                                                             "name": block_name,
        //                                                                                             "number": block_number
        //                                                                                         })
        //                                                                                         .then(() => {
        //                                                                                             Variety
        //                                                                                                 .deleteMany({
        //                                                                                                     "name": variety_name
        //                                                                                                 })
        //                                                                                                 .then(() => {
        //                                                                                                     Plant
        //                                                                                                         .deleteMany({
        //                                                                                                             "bed": objectid(savedBed._id)
        //                                                                                                         })
        //                                                                                                         .then(() => {
        //                                                                                                             done();
        //                                                                                                         })
        //                                                                                                         .catch(err => {
        //                                                                                                             done(err);
        //                                                                                                         })
        //                                                                                                 })
        //                                                                                                 .catch(err => {
        //                                                                                                     done(err);
        //                                                                                                 })
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                                 .catch(err => {
        //                                                                                     done(err);
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             return done(err);
        //                                                                         })
        //                                                                 })
        //                                                                 .catch(err => {
        //                                                                     return done(err);
        //                                                                 })
        //                                                         }
        //                                                     });
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             })
        //                                     })
        //                             })
        //                             .catch(err => {
        //                                 return done(err);
        //                             })
        //                     })

        //                     .catch(err => {
        //                         return done(err);
        //                     })
        //             }
        //         })
        // }).timeout(20000);

        // it('Should return error if BED exist', (done) => {
        //     Bed
        //         .deleteMany({
        //             "bed_number": bed_number,
        //             "bed_name": bed_name,
        //         })
        //         .then(() => {
        //             //login user
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
        //                         Block
        //                             .create({
        //                                 "name": block_name,
        //                                 "number": block_number
        //                             })
        //                     }
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // }).timeout(20000);

        // it('Should return error if personnel creating bed is not logged in', (done) => {
        //     chai.request(app)
        //         .post(`/bed`)
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 res.should.have.status(401);
        //                 done();
        //             }
        //         })
        // }).timeout(20000);
    });

    //  List beds
    describe("GET /bed", () => {
        // it('Should get beds', (done) => {
        //     Bed
        //         .find()
        //         .then((beds) => {
        //             let promises = [];
        //             ``
        //             for (let r = 0; r < beds.length; r++) {
        //                 let bed_number = beds[r].bed_number;
        //                 let bedId = beds[r]._id;

        //                 promises.push(
        //                     Bed.findOneAndUpdate({
        //                         _id: bedId
        //                     }, {
        //                         $set: {
        //                             number: bed_number
        //                         }
        //                     }, {
        //                         new: true,
        //                         useFindAndModify: false
        //                     })
        //                     .then((updatedBed) => {})
        //                     .catch(err => {
        //                         // return done(err);
        //                     })
        //                 );
        //             }

        //             Promise.all(promises)
        //                 .then(() => {
        //                     done();
        //                 })
        //                 .catch(err => {
        //                     return done(err);
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // })
        // it('Should get beds', (done) => {
        //     //login user
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
        //                     .create({
        //                         "name": block_name,
        //                         "number": block_number
        //                     })
        //                     .then((parentBlock) => {
        //                         Block
        //                             .create({
        //                                 "name": sub_block_name,
        //                                 "parent": parentBlock._id
        //                             })
        //                             .then((block) => {
        //                                 Variety
        //                                     .create({
        //                                         "name": variety_name
        //                                     })
        //                                     .then((variety) => {
        //                                         chai.request(app)
        //                                             .post("/bed")
        //                                             .send({
        //                                                 "bed_number": bed_number,
        //                                                 "bed_name": bed_name,
        //                                                 "variety": variety._id,
        //                                                 "plant_date": plant_date,
        //                                                 "expected_pick_date": expected_pick_date,
        //                                                 "status": status,
        //                                                 "block": block._id
        //                                             })
        //                                             .set('Authorization', 'Bearer ' + accessToken)
        //                                             .end((err, res) => {
        //                                                 if (err) {
        //                                                     return done(err);
        //                                                 } else {
        //                                                     //console.log("kanan")
        //                                                     chai.request(app)
        //                                                         .get(`/bed`)
        //                                                         .set('Authorization', 'Bearer ' + accessToken)
        //                                                         .end((err, res) => {
        //                                                             if (err) {
        //                                                                 return done(err);
        //                                                             } else {
        //                                                                 console.log(res.body)
        //                                                                 res.should.have.status(200);
        //                                                                 res.body.should.be.a('object');
        //                                                                 res.body.rows.should.not.be.undefined;
        //                                                                 res.body.items.should.not.be.undefined;
        //                                                                 res.body.items.should.be.a('array');
        //                                                                 res.body.items[0].bed_number.should.not.be.undefined;
        //                                                                 res.body.items[0].bed_name.should.not.be.undefined;
        //                                                                 Bed
        //                                                                     .findOne({
        //                                                                         "bed_number": bed_number,
        //                                                                         "bed_name": bed_name
        //                                                                     })
        //                                                                     .then((savedBed) => {
        //                                                                         Bed
        //                                                                             .deleteMany({
        //                                                                                 "bed_number": bed_number,
        //                                                                                 "bed_name": bed_name
        //                                                                             })
        //                                                                             .then(() => {
        //                                                                                 Block
        //                                                                                     .deleteMany({
        //                                                                                         "name": sub_block_name
        //                                                                                     })
        //                                                                                     .then(() => {
        //                                                                                         Block
        //                                                                                             .deleteMany({
        //                                                                                                 "name": block_name,
        //                                                                                                 "number": block_number
        //                                                                                             })
        //                                                                                             .then(() => {
        //                                                                                                 Variety
        //                                                                                                     .deleteMany({
        //                                                                                                         "name": variety_name
        //                                                                                                     })
        //                                                                                                     .then(() => {
        //                                                                                                         Plant
        //                                                                                                             .deleteMany({
        //                                                                                                                 "bed": objectid(savedBed._id)
        //                                                                                                             })
        //                                                                                                             .then(() => {
        //                                                                                                                 done();
        //                                                                                                             })
        //                                                                                                             .catch(err => {
        //                                                                                                                 done(err);
        //                                                                                                             })
        //                                                                                                     })
        //                                                                                                     .catch(err => {
        //                                                                                                         done(err);
        //                                                                                                     })
        //                                                                                             })
        //                                                                                             .catch(err => {
        //                                                                                                 done(err);
        //                                                                                             })
        //                                                                                     })
        //                                                                                     .catch(err => {
        //                                                                                         done(err);
        //                                                                                     })
        //                                                                             })
        //                                                                             .catch(err => {
        //                                                                                 return done(err);
        //                                                                             })
        //                                                                     })

        //                                                                     .catch(err => {
        //                                                                         return done(err);
        //                                                                     })

        //                                                             }
        //                                                         });
        //                                                 }
        //                                             });
        //                                     })
        //                             })
        //                             .catch(err => {
        //                                 return done(err);
        //                             })
        //                     })
        //                     .catch(err => {
        //                         return done(err);
        //                     })
        //             }
        //         })
        // }).timeout(20000);


        // it('Should get all beds', (done) => {
        //     Block
        //         .findOne()
        //         .then((block) => {

        //             Variety
        //                 .findOne()
        //                 .then((variety) => {
        //                     const newBed = {

        // bed_number: bed_number,
        // bed_name: bed_name,
        // block: block._id,
        // parent_block: 'test parent block',
        // sub_block_name: 'sub block',
        // plant_date: '2019-08-14T00:00:00.000Z',
        // expected_pick_date: '2019-08-17T00:00:00.000Z',
        // variety: '5d5f9ed5121a7713b4aee5df',
        // variety_name: 'Pink roses',
        // status: 1

        //                     };
        //                     const saveBed = [newBed, newBed, newBed, newBed, newBed]
        //                     Bed
        //                         .create(saveBed)
        //                         .then(() => {
        //                             //Login user
        //                             chai.request(app)
        //                                 .post('/personnel/login')
        //                                 .send({
        //                                     phone: userPhone,
        //                                     password: userPassword
        //                                 })
        //                                 .end((err, res) => {
        //                                     if (err) {
        //                                         return done(err);
        //                                     } else {
        //                                         const accessToken = res.body.accessToken;
        //                                         chai.request(app)
        //                                             .get(`/bed?page=0&limit=5`)
        //                                             .set('Authorization', 'Bearer ' + accessToken)
        //                                             .end((err, res) => {
        //                                                 if (err) {
        //                                                     return done(err);
        //                                                 } else {
        //                                                     console.log(res.body)
        //                                                     res.should.have.status(200);
        //                                                     res.body.should.be.a('object');
        //                                                     res.body.rows.should.not.be.undefined;
        //                                                     res.body.items.should.not.be.undefined;
        //                                                     res.body.items.should.be.a('array');
        //                                                     res.body.items[1].bed_number.should.not.be.undefined;
        //                                                     res.body.items[1].bed_name.should.not.be.undefined;
        //                                                     assert.isAtMost(5, res.body.items.length);
        //                                                     Bed
        //                                                         .deleteMany({
        //                                                             "bed_name": bed_name,
        //                                                             "bed_number": bed_number
        //                                                         })
        //                                                         .then(() => {
        //                                                             Plant
        //                                                                 .deleteMany({
        //                                                                     "bed": bed._id
        //                                                                 })
        //                                                                 .then(() => {
        //                                                                     done()
        //                                                                 })
        //                                                                 .catch(err => {
        //                                                                     return done(err);
        //                                                                 })
        //                                                         })
        //                                                         .catch(err => {
        //                                                             return done(err);
        //                                                         })
        //                                                 }
        //                                             })
        //                                             .then((variety) => {
        //                                                 const newBed = {
        //                                                     "bed_number": bed_number,
        //                                                     "bed_name": bed_name,
        //                                                     "variety": variety._id,
        //                                                     "plant_date": plant_date,
        //                                                     "expected_pick_date": expected_pick_date,
        //                                                     "status": status,
        //                                                     "block": block._id
        //                                                 }
        //                                                 Bed
        //                                                     .create(newBed)
        //                                                     .then(() => {
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
        //                                                                             "bed_number": bed_number,
        //                                                                             "bed_name": bed_name
        //                                                                         })
        //                                                                         .then(savedBed => {
        //                                                                             res.should.have.status(400);
        //                                                                             res.should.be.a('object');
        //                                                                             res.body.error.bed.should.not.be.undefined;
        //                                                                             assert.equal("Bed already exist", res.body.error.bed);
        //                                                                             Bed
        //                                                                                 .deleteMany({
        //                                                                                     "bed_number": bed_number,
        //                                                                                     "bed_name": bed_name
        //                                                                                 })
        //                                                                                 .then(() => {
        //                                                                                     Block
        //                                                                                         .deleteMany({
        //                                                                                             "name": sub_block_name
        //                                                                                         })
        //                                                                                         .then(() => {
        //                                                                                             Block
        //                                                                                                 .deleteMany({
        //                                                                                                     "name": block_name,
        //                                                                                                     "number": block_number
        //                                                                                                 })
        //                                                                                                 .then(() => {
        //                                                                                                     Variety
        //                                                                                                         .deleteMany({
        //                                                                                                             "name": variety_name
        //                                                                                                         })
        //                                                                                                         .then(() => {
        //                                                                                                             Plant
        //                                                                                                                 .deleteMany({
        //                                                                                                                     "bed": objectid(savedBed._id)
        //                                                                                                                 })
        //                                                                                                                 .then(() => {
        //                                                                                                                     done();
        //                                                                                                                 })
        //                                                                                                                 .catch(err => {
        //                                                                                                                     done(err);
        //                                                                                                                 })
        //                                                                                                         })
        //                                                                                                         .catch(err => {
        //                                                                                                             done(err);
        //                                                                                                         })
        //                                                                                                 })
        //                                                                                                 .catch(err => {
        //                                                                                                     done(err);
        //                                                                                                 })
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                                 .catch(err => {
        //                                                                                     return done(err);
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             return done(err);
        //                                                                         })
        //                                                                 }
        //                                                             });
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             })
        //                                     })
        //                                     .catch(err => {
        //                                         return done(err);
        //                                     })
        //                             })

        //                             .catch(err => {
        //                                 return done(err);
        //                             })
        //                     }
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // }).timeout(20000);

        // it('Should return error if empty fields are provided', (done) => {

        //     //login user
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
        //                     .create({
        //                         "name": block_name,
        //                         "number": block_number
        //                     })
        //                     .then((parentBlock) => {
        //                         Block
        //                             .create({
        //                                 "name": sub_block_name,
        //                                 "parent": parentBlock._id
        //                             })
        //                             .then((block) => {
        //                                 Variety
        //                                     .create({
        //                                         "name": variety_name
        //                                     })
        //                                     .then((variety) => {
        //                                         Bed
        //                                             .deleteMany({
        //                                                 "bed_number": bed_number,
        //                                                 "bed_name": bed_name,
        //                                             })
        //                                             .then(() => {
        //                                                 chai.request(app)
        //                                                     .post("/bed")
        //                                                     .send({
        //                                                         "bed_number": "",
        //                                                         "bed_name": "",
        //                                                         "variety": "",
        //                                                         "plant_date": "",
        //                                                         "expected_pick_date": "",
        //                                                         "status": "",
        //                                                         "block": ""
        //                                                     })
        //                                                     .set('Authorization', 'Bearer ' + accessToken)
        //                                                     .end((err, res) => {
        //                                                         if (err) {
        //                                                             return done(err);
        //                                                         } else {

        //                                                             res.should.have.status(400);
        //                                                             res.should.be.a('object');
        //                                                             res.body.error.bed_number.should.not.be.undefined;
        //                                                             res.body.error.bed_name.should.not.be.undefined;
        //                                                             res.body.error.block.should.not.be.undefined;
        //                                                             assert.equal("Bed number is required", res.body.error.bed_number);
        //                                                             assert.equal("Bed name is required", res.body.error.bed_name);
        //                                                             assert.equal("Block is required", res.body.error.block);
        //                                                             assert.equal("Variety is required", res.body.error.variety);
        //                                                             assert.equal
        //                                                             Bed
        //                                                                 .deleteMany({
        //                                                                     "bed_number": bed_number,
        //                                                                     "bed_name": bed_name
        //                                                                 })
        //                                                                 .then(() => {
        //                                                                     Block
        //                                                                         .deleteMany({
        //                                                                             "name": sub_block_name
        //                                                                         })
        //                                                                         .then(() => {
        //                                                                             Block
        //                                                                                 .deleteMany({
        //                                                                                     "name": block_name,
        //                                                                                     "number": block_number
        //                                                                                 })
        //                                                                                 .then(() => {
        //                                                                                     Variety
        //                                                                                         .deleteMany({
        //                                                                                             "name": variety_name
        //                                                                                         })
        //                                                                                         .then(() => {
        //                                                                                             done()
        //                                                                                         })
        //                                                                                         .catch(err => {
        //                                                                                             done(err);
        //                                                                                         })
        //                                                                                 })
        //                                                                                 .catch(err => {
        //                                                                                     done(err);
        //                                                                                 })
        //                                                                         })
        //                                                                         .catch(err => {
        //                                                                             done(err);
        //                                                                         })
        //                                                                 })
        //                                                                 .catch(err => {
        //                                                                     return done(err);
        //                                                                 })

        //                                                         }
        //                                                     });
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             })
        //                                     })
        //                             })
        // .catch(err => {
        //     return done(err);
        // })
        //                     })

        // .catch(err => {
        //     return done(err);
        // })
        //             }
        //         })
        // }).timeout(20000);

        // it('Should return error if personnel creating bed is not logged in', (done) => {
        //     chai.request(app)
        //         .post(`/bed`)
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             } else {
        //                 res.should.have.status(401);
        //                 done();
        //             }
        //         })
        // }).timeout(20000);
    });

    //  Patch request on bed
    describe("PATCH /bed/:bedId", () => {

        it('Should update bed', (done) => {
            const id = '5d87ce0abecb722b4d2f1fee';
            //Login user
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/bed/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            "bed_name": " Bed 1",
                            "bed_number": 1,
                            "block": "5d87b7f16de14122f4b12e29",
                            "sub_block_name": "5d87b8cf6de14122f4b12e2b",
                            "variety": "5d87bc466de14122f4b12e4f",
                            "plant_date": "2019-01-01",
                            "expected_pick_date": "2019-12-31",
                            "status": 0
                        })
                        .end((err, resUpdate) => {
                            if (err) {
                                return done(err);
                            } else {
                                console.log();
                                done();
                            }
                        })
                })
        }).timeout(20000);

        // it('Should return error if empty fields are provided', (done) => {
        //     Bed
        //         .find({
        //             "bed_name": bed_name
        //         })
        //         .then((testBed) => {
        //             //  console.log(testBed)
        //             const testBedId = testBed._id;
        //             //console.log(testBedId)
        //             Bed
        //                 .deleteMany({
        //                     $or: [{
        //                         "bed_name": bed_name
        //                     }, {
        //                         "bed_name": "update bed name"
        //                     }]
        //                 })
        //                 .then(() => {
        //                     Plant
        //                         .deleteMany({
        //                             bed: testBedId
        //                         })
        //                         .then(() => {

        //                             //login user
        //                             chai.request(app)
        //                                 .post('/personnel/login')
        //                                 .send({
        //                                     phone: userPhone,
        //                                     password: userPassword
        //                                 })
        //                                 .end((err, res) => {
        //                                     if (err) {
        //                                         return done(err);
        //                                     } else {
        //                                         const accessToken = res.body.accessToken;
        //                                         Block
        //                                             .create({
        //                                                 "name": block_name,
        //                                                 "number": block_number
        //                                             })
        //                                             .then((parentBlock) => {
        //                                                 Block
        //                                                     .create({
        //                                                         "name": sub_block_name,
        //                                                         "parent": parentBlock._id
        //                                                     })
        //                                                     .then((block) => {
        //                                                         Variety
        //                                                             .create({
        //                                                                 "name": variety_name
        //                                                             })
        //                                                             .then((variety) => {
        //                                                                 const newBed = {
        //                                                                     "bed_number": bed_number,
        //                                                                     "bed_name": bed_name,
        //                                                                     "variety": variety._id,
        //                                                                     "plant_date": plant_date,
        //                                                                     "expected_pick_date": expected_pick_date,
        //                                                                     "status": status,
        //                                                                     "block": block._id
        //                                                                 };

        //                                                                 chai.request(app)
        //                                                                     .post("/bed")
        //                                                                     .send(newBed)
        //                                                                     .set('Authorization', 'Bearer ' + accessToken)
        //                                                                     .end((err, res) => {
        //                                                                         if (err) {
        //                                                                             return done(err);
        //                                                                         } else {
        //                                                                             Bed
        //                                                                                 .findOne({
        //                                                                                     "bed_number": bed_number,
        //                                                                                     "bed_name": bed_name
        //                                                                                 })
        //                                                                                 .then((bed) => {
        //                                                                                     const id = bed._id;
        //                                                                                     //Login user
        //                                                                                     chai.request(app)
        //                                                                                         .post('/personnel/login')
        //                                                                                         .send({
        //                                                                                             phone: userPhone,
        //                                                                                             password: userPassword
        //                                                                                         })
        //                                                                                         .end((err, res) => {
        //                                                                                             const accessToken = res.body.accessToken;
        //                                                                                             const url = `/bed/${id}`;
        //                                                                                             chai.request(app)
        //                                                                                                 .patch(url)
        //                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
        //                                                                                                 .send({
        //                                                                                                     "bed_number": "",
        //                                                                                                     "bed_name": "",
        //                                                                                                     "variety": "",
        //                                                                                                     "plant_date": "",
        //                                                                                                     "expected_pick_date": "",
        //                                                                                                     "status": "",
        //                                                                                                     "block": ""
        //                                                                                                 })
        //                                                                                                 .end((err, resUpdate) => {
        //                                                                                                     if (err) {
        //                                                                                                         return done(err);
        //                                                                                                     } else {
        //                                                                                                         Bed
        //                                                                                                             .findOne({
        //                                                                                                                 "_id": id
        //                                                                                                             })
        //                                                                                                             .then(bed => {
        //                                                                                                                 //console.log(bed)
        //                                                                                                                 resUpdate.should.have.status(400);
        //                                                                                                                 resUpdate.should.be.a('object');
        //                                                                                                                 resUpdate.body.error.bed_number.should.not.be.undefined;
        //                                                                                                                 resUpdate.body.error.bed_name.should.not.be.undefined;
        //                                                                                                                 resUpdate.body.error.block.should.not.be.undefined;
        //                                                                                                                 assert.equal("Bed number is required", resUpdate.body.error.bed_number);
        //                                                                                                                 assert.equal("Bed name is required", resUpdate.body.error.bed_name);
        //                                                                                                                 assert.equal("Block is required", resUpdate.body.error.block);
        //                                                                                                                 assert.equal("Variety is required", resUpdate.body.error.variety);
        //                                                                                                                 assert.equal("Plant date is required", resUpdate.body.error.plant_date);

        //                                                                                                                 Bed
        //                                                                                                                     .deleteMany({
        //                                                                                                                         $or: [{
        //                                                                                                                             "bed_name": bed_name
        //                                                                                                                         }, {
        //                                                                                                                             "bed_name": "update bed name"
        //                                                                                                                         }]
        //                                                                                                                     })
        //                                                                                                                     .then(() => {
        //                                                                                                                         Block
        //                                                                                                                             .deleteMany({
        //                                                                                                                                 "name": sub_block_name
        //                                                                                                                             })
        //                                                                                                                             .then(() => {
        //                                                                                                                                 Block
        //                                                                                                                                     .deleteMany({
        //                                                                                                                                         "name": block_name,
        //                                                                                                                                         "number": block_number
        //                                                                                                                                     })
        //                                                                                                                                     .then(() => {
        //                                                                                                                                         Variety
        //                                                                                                                                             .deleteMany({
        //                                                                                                                                                 "name": variety_name
        //                                                                                                                                             })
        //                                                                                                                                             .then(() => {
        //                                                                                                                                                 Plant
        //                                                                                                                                                     .deleteMany({
        //                                                                                                                                                         "bed": bed._id
        //                                                                                                                                                     })
        //                                                                                                                                                     .then(() => {
        //                                                                                                                                                         done();
        //                                                                                                                                                     })
        //                                                                                                                                                     .catch(err => {
        //                                                                                                                                                         done(err);
        //                                                                                                                                                     })
        //                                                                                                                                             })
        //                                                                                                                                             .catch(err => {
        //                                                                                                                                                 done(err);
        //                                                                                                                                             })
        //                                                                                                                                     })
        //                                                                                                                                     .catch(err => {
        //                                                                                                                                         done(err);
        //                                                                                                                                     })
        //                                                                                                                             })
        //                                                                                                                             .catch(err => {
        //                                                                                                                                 done(err);
        //                                                                                                                             })
        //                                                                                                                     })
        //                                                                                                                     .catch(err => {
        //                                                                                                                         return done(err);
        //                                                                                                                     })
        //                                                                                                             })
        //                                                                                                             .catch(err => {
        //                                                                                                                 return done(err);
        //                                                                                                             })
        //                                                                                                     }
        //                                                                                                 })
        //                                                                                         })
        //                                                                                 })
        //                                                                         }
        //                                                                     })
        //                                                             })
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             })
        //                                     }
        //                                 })
        //                         })
        //                         .catch(err => {
        //                             return done(err);
        //                         })
        //                 })
        //                 .catch(err => {
        //                     return done(err);
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // }).timeout(20000);

        // it('Should return error if bed details exist', (done) => {
        //     Bed
        //         .find({
        //             "bed_name": bed_name
        //         })
        //         .then((testBed) => {
        //             //  console.log(testBed)
        //             const testBedId = testBed._id;
        //             //console.log(testBedId)
        //             Bed
        //                 .deleteMany({
        //                     $or: [{
        //                         "bed_name": bed_name
        //                     }, {
        //                         "bed_name": "update bed name"
        //                     }]
        //                 })
        //                 .then(() => {
        //                     Plant
        //                         .deleteMany({
        //                             bed: testBedId
        //                         })
        //                         .then(() => {

        //                             //login user
        //                             chai.request(app)
        //                                 .post('/personnel/login')
        //                                 .send({
        //                                     phone: userPhone,
        //                                     password: userPassword
        //                                 })
        //                                 .end((err, res) => {
        //                                     if (err) {
        //                                         return done(err);
        //                                     } else {
        //                                         const accessToken = res.body.accessToken;
        //                                         Block
        //                                             .create({
        //                                                 "name": block_name,
        //                                                 "number": block_number
        //                                             })
        //                                             .then((parentBlock) => {
        //                                                 Block
        //                                                     .create({
        //                                                         "name": sub_block_name,
        //                                                         "parent": parentBlock._id
        //                                                     })
        //                                                     .then((block) => {
        //                                                         Variety
        //                                                             .create({
        //                                                                 "name": variety_name
        //                                                             })
        //                                                             .then((variety) => {
        //                                                                 const newBed = {
        //                                                                     "bed_number": bed_number,
        //                                                                     "bed_name": bed_name,
        //                                                                     "variety": variety._id,
        //                                                                     "plant_date": plant_date,
        //                                                                     "expected_pick_date": expected_pick_date,
        //                                                                     "status": status,
        //                                                                     "block": block._id
        //                                                                 };

        //                                                                 chai.request(app)
        //                                                                     .post("/bed")
        //                                                                     .send(newBed)
        //                                                                     .set('Authorization', 'Bearer ' + accessToken)
        //                                                                     .end((err, res) => {
        //                                                                         if (err) {
        //                                                                             return done(err);
        //                                                                         } else {
        //                                                                             Bed
        //                                                                                 .findOne({
        //                                                                                     "bed_number": bed_number,
        //                                                                                     "bed_name": bed_name
        //                                                                                 })
        //                                                                                 .then((bed) => {
        //                                                                                     const id = bed._id;
        //                                                                                     //Login user
        //                                                                                     chai.request(app)
        //                                                                                         .post('/personnel/login')
        //                                                                                         .send({
        //                                                                                             phone: userPhone,
        //                                                                                             password: userPassword
        //                                                                                         })
        //                                                                                         .end((err, res) => {
        //                                                                                             const accessToken = res.body.accessToken;
        //                                                                                             const url = `/bed/${id}`;
        //                                                                                             chai.request(app)
        //                                                                                                 .patch(url)
        //                                                                                                 .set('Authorization', 'Bearer ' + accessToken)
        //                                                                                                 .send(newBed)
        //                                                                                                 .end((err, resUpdate) => {
        //                                                                                                     if (err) {
        //                                                                                                         return done(err);
        //                                                                                                     } else {
        //                                                                                                         Bed
        //                                                                                                             .findOne({
        //                                                                                                                 "_id": id
        //                                                                                                             })
        //                                                                                                             .then(bed => {
        //                                                                                                                 resUpdate.should.have.status(400);
        //                                                                                                                 resUpdate.should.be.a('object');
        //                                                                                                                 resUpdate.body.error.bed.should.not.be.undefined;
        //                                                                                                                 assert.equal("Bed already exist", resUpdate.body.error.bed);

        //                                                                                                                 Bed
        //                                                                                                                     .deleteMany({
        //                                                                                                                         $or: [{
        //                                                                                                                             "bed_name": bed_name
        //                                                                                                                         }, {
        //                                                                                                                             "bed_name": "update bed name"
        //                                                                                                                         }]
        //                                                                                                                     })
        //                                                                                                                     .then(() => {
        //                                                                                                                         Block
        //                                                                                                                             .deleteMany({
        //                                                                                                                                 "name": sub_block_name
        //                                                                                                                             })
        //                                                                                                                             .then(() => {
        //                                                                                                                                 Block
        //                                                                                                                                     .deleteMany({
        //                                                                                                                                         "name": block_name,
        //                                                                                                                                         "number": block_number
        //                                                                                                                                     })
        //                                                                                                                                     .then(() => {
        //                                                                                                                                         Variety
        //                                                                                                                                             .deleteMany({
        //                                                                                                                                                 "name": variety_name
        //                                                                                                                                             })
        //                                                                                                                                             .then(() => {
        //                                                                                                                                                 Plant
        //                                                                                                                                                     .deleteMany({
        //                                                                                                                                                         "bed": bed._id
        //                                                                                                                                                     })
        //                                                                                                                                                     .then(() => {
        //                                                                                                                                                         done();
        //                                                                                                                                                     })
        //                                                                                                                                                     .catch(err => {
        //                                                                                                                                                         done(err);
        //                                                                                                                                                     })
        //                                                                                                                                             })
        //                                                                                                                                             .catch(err => {
        //                                                                                                                                                 done(err);
        //                                                                                                                                             })
        //                                                                                                                                     })
        //                                                                                                                                     .catch(err => {
        //                                                                                                                                         done(err);
        //                                                                                                                                     })
        //                                                                                                                             })
        //                                                                                                                             .catch(err => {
        //                                                                                                                                 done(err);
        //                                                                                                                             })
        //                                                                                                                     })
        //                                                                                                                     .catch(err => {
        //                                                                                                                         return done(err);
        //                                                                                                                     })
        //                                                                                                             })
        //                                                                                                             .catch(err => {
        //                                                                                                                 return done(err);
        //                                                                                                             })
        //                                                                                                     }
        //                                                                                                 })
        //                                                                                         })
        //                                                                                 })
        //                                                                         }
        //                                                                     })
        //                                                             })
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             })
        //                                     }
        //                                 })
        //                         })
        //                         .catch(err => {
        //                             return done(err);
        //                         })
        //                 })
        //                 .catch(err => {
        //                     return done(err);
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // }).timeout(20000);

        // it('Should return error if id is invalid hex', (done) => {
        //     const id = "xxxxxx";
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             const accessToken = res.body.accessToken;
        //             const url = `/bed/${id}`;
        //             chai.request(app)
        //                 .patch(url)
        //                 .set('Authorization', 'Bearer ' + accessToken)
        //                 .send({
        //                     "bed_number": "1000000",
        //                     "bed_name": "update bed name",
        //                     "variety": "5d7b7e7ced54af2748555929",
        //                     "plant_date": plant_date,
        //                     "expected_pick_date": expected_pick_date,
        //                     "status": status,
        //                     "block": "5d7b7e7ced54af2748555929"
        //                 })
        //                 .end((err, res) => {
        //                     if (err) {
        //                         return done(err);
        //                     }
        //                     res.should.have.status(400);
        //                     res.should.be.a('object');
        //                     res.body.error.id.should.not.be.undefined;
        //                     assert.equal("Invalid id provided", res.body.error.id);
        //                     done();
        //                 })

        //         })
        // }).timeout(20000);

        // it('Should return error if id does not exist', (done) => {
        //     const id = "8fb15451d578f906d8eb769c";
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             const accessToken = res.body.accessToken;
        //             const url = `/bed/${id}`;
        //             chai.request(app)
        //                 .patch(url)
        //                 .set('Authorization', 'Bearer ' + accessToken)
        //                 .send({
        //                     "bed_number": "1000000",
        //                     "bed_name": "update bed name",
        //                     "variety": "5d7b7e7ced54af2748555929",
        //                     "plant_date": plant_date,
        //                     "expected_pick_date": expected_pick_date,
        //                     "status": status,
        //                     "block": "5d7b7e7ced54af2748555929"
        //                 })
        //                 .end((err, res) => {
        //                     if (err) {
        //                         return done(err);
        //                     }
        //                     res.should.have.status(400);
        //                     res.should.be.a('object');
        //                     res.body.error.id.should.not.be.undefined;
        //                     assert.equal("Bed does not exist", res.body.error.id);
        //                     done();
        //                 })

        //         })
        // }).timeout(20000);

        // it('Should return error personnel is not logged in', (done) => {
        //     const id = "5d47cf8c4e4ed5312ca5e326";
        //     chai.request(app)
        //     const url = `/bed/${id}`;
        //     chai.request(app)
        //         .patch(url)
        //         .send({
        //             bed_number: "67",
        //             bed_name: "bed50",
        //             sub_block: "56",
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             }
        //             res.should.have.status(401);

        //             done();
        //         })

        // }).timeout(20000);

    });

    //  Delete bed
    describe("DELETE /bed/:bedId", () => {
        // it('Should delete bed', (done) => {
        //     Bed
        //         .find({
        //             "bed_name": bed_name
        //         })
        //         .then((testBed) => {
        //             const testBedId = testBed._id;
        //             Bed
        //                 .deleteMany({
        //                     $or: [{
        //                         "bed_name": bed_name
        //                     }, {
        //                         "bed_name": "update bed name"
        //                     }]
        //                 })
        //                 .then(() => {
        //                     Plant
        //                         .deleteMany({
        //                             bed: testBedId
        //                         })
        //                         .then(() => {

        //                             //login user
        //                             chai.request(app)
        //                                 .post('/personnel/login')
        //                                 .send({
        //                                     phone: userPhone,
        //                                     password: userPassword
        //                                 })
        //                                 .end((err, res) => {
        //                                     if (err) {
        //                                         return done(err);
        //                                     } else {
        //                                         const accessToken = res.body.accessToken;
        //                                         Block
        //                                             .create({
        //                                                 "name": block_name,
        //                                                 "number": block_number
        //                                             })
        //                                             .then((parentBlock) => {
        //                                                 Block
        //                                                     .create({
        //                                                         "name": sub_block_name,
        //                                                         "parent": parentBlock._id
        //                                                     })
        //                                                     .then((block) => {
        //                                                         Variety
        //                                                             .create({
        //                                                                 "name": variety_name
        //                                                             })
        //                                                             .then((variety) => {
        //                                                                 const newBed = {
        //                                                                     "bed_number": bed_number,
        //                                                                     "bed_name": bed_name,
        //                                                                     "variety": variety._id,
        //                                                                     "plant_date": plant_date,
        //                                                                     "expected_pick_date": expected_pick_date,
        //                                                                     "status": status,
        //                                                                     "block": block._id
        //                                                                 };

        //                                                                 chai.request(app)
        //                                                                     .post("/bed")
        //                                                                     .send(newBed)
        //                                                                     .set('Authorization', 'Bearer ' + accessToken)
        //                                                                     .end((err, res) => {
        //                                                                         if (err) {
        //                                                                             return done(err);
        //                                                                         } else {
        //                                                                             Bed
        //                                                                                 .findOne({
        //                                                                                     "bed_number": bed_number,
        //                                                                                     "bed_name": bed_name
        //                                                                                 })
        //                                                                                 .then((bed) => {
        //                                                                                     const id = bed._id;
        //                                                                                     //Login user
        //                                                                                     chai.request(app)
        //                                                                                         .post('/personnel/login')
        //                                                                                         .send({
        //                                                                                             phone: userPhone,
        //                                                                                             password: userPassword
        //                                                                                         })
        //                                                                                         .end((err, res) => {
        //                                                                                             const accessToken = res.body.accessToken;
        //                                                                                             const url = `/bed/${id}`;
        //                                                                                             chai.request(app)
        //                                                                                                 .delete(url)
        //                                                                                                 .set('Authorization', 'Bearer ' + accessToken)

        //                                                                                                 .end((err, res) => {
        //                                                                                                     if (err) {
        //                                                                                                         return done(err);
        //                                                                                                     } else {

        //                                                                                                         //console.log(bed)
        //                                                                                                         res.should.have.status(200);
        //                                                                                                         res.should.be.a('object');
        //                                                                                                         res.body.message.should.not.be.undefined;
        //                                                                                                         assert.equal("Success", res.body.message);
        //                                                                                                         Bed
        //                                                                                                             .findOne({
        //                                                                                                                 id: id
        //                                                                                                             })
        //                                                                                                             .then(deletedBed => {
        //                                                                                                                 assert.equal(deletedBed, null);
        //                                                                                                                 //done();


        //                                                                                                                 Bed
        //                                                                                                                     .deleteMany({
        //                                                                                                                         $or: [{
        //                                                                                                                             "bed_name": bed_name
        //                                                                                                                         }, {
        //                                                                                                                             "bed_name": "update bed name"
        //                                                                                                                         }]
        //                                                                                                                     })
        //                                                                                                                     .then(() => {
        //                                                                                                                         Block
        //                                                                                                                             .deleteMany({
        //                                                                                                                                 "name": sub_block_name
        //                                                                                                                             })
        //                                                                                                                             .then(() => {
        //                                                                                                                                 Block
        //                                                                                                                                     .deleteMany({
        //                                                                                                                                         "name": block_name,
        //                                                                                                                                         "number": block_number
        //                                                                                                                                     })
        //                                                                                                                                     .then(() => {
        //                                                                                                                                         Variety
        //                                                                                                                                             .deleteMany({
        //                                                                                                                                                 "name": variety_name
        //                                                                                                                                             })
        //                                                                                                                                             .then(() => {
        //                                                                                                                                                 Plant
        //                                                                                                                                                     .deleteMany({
        //                                                                                                                                                         "bed": bed._id
        //                                                                                                                                                     })
        //                                                                                                                                                     .then(() => {
        //                                                                                                                                                         done();
        //                                                                                                                                                     })
        //                                                                                                                                                     .catch(err => {
        //                                                                                                                                                         done(err);
        //                                                                                                                                                     })
        //                                                                                                                                             })
        //                                                                                                                                             .catch(err => {
        //                                                                                                                                                 done(err);
        //                                                                                                                                             })
        //                                                                                                                                     })
        //                                                                                                                                     .catch(err => {
        //                                                                                                                                         done(err);
        //                                                                                                                                     })
        //                                                                                                                             })
        //                                                                                                                             .catch(err => {
        //                                                                                                                                 done(err);
        //                                                                                                                             })
        //                                                                                                                     })
        //                                                                                                                     .catch(err => {
        //                                                                                                                         return done(err);
        //                                                                                                                     })
        //                                                                                                             })
        //                                                                                                             .catch(err => {
        //                                                                                                                 return done(err);
        //                                                                                                             })

        //                                                                                                     }
        //                                                                                                 })
        //                                                                                         })
        //                                                                                 })
        //                                                                         }
        //                                                                     })
        //                                                             })
        //                                                     })
        //                                                     .catch(err => {
        //                                                         return done(err);
        //                                                     })
        //                                             })
        //                                             .catch(err => {
        //                                                 return done(err);
        //                                             })
        //                                     }
        //                                 })
        //                         })
        //                         .catch(err => {
        //                             return done(err);
        //                         })
        //                 })
        //                 .catch(err => {
        //                     return done(err);
        //                 })
        //         })
        //         .catch(err => {
        //             return done(err);
        //         })
        // }).timeout(20000);

        // it('Should return error if id is invalid hex', (done) => {
        //     const id = "xxxxxx";
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             const accessToken = res.body.accessToken;
        //             const url = `/bed/${id}`;
        //             chai.request(app)
        //                 .delete(url)
        //                 .set('Authorization', 'Bearer ' + accessToken)
        //                 .end((err, res) => {
        //                     if (err) {
        //                         return done(err);
        //                     }
        //                     res.should.have.status(400);
        //                     res.should.be.a('object');
        //                     res.body.error.id.should.not.be.undefined;
        //                     assert.equal("Invalid id provided", res.body.error.id);
        //                     done();
        //                 })

        //         })
        // }).timeout(20000);

        // it('Should return error if id does not exist', (done) => {
        //     const id = "8fb15451d578f906d8eb769c";
        //     chai.request(app)
        //         .post('/personnel/login')
        //         .send({
        //             phone: userPhone,
        //             password: userPassword
        //         })
        //         .end((err, res) => {
        //             const accessToken = res.body.accessToken;
        //             const url = `/bed/${id}`;
        //             chai.request(app)
        //                 .delete(url)
        //                 .set('Authorization', 'Bearer ' + accessToken)
        //                 .end((err, res) => {
        //                     if (err) {
        //                         return done(err);
        //                     }
        //                     // console.log(res.body);
        //                     res.should.have.status(400);
        //                     res.should.be.a('object');
        //                     res.body.error.id.should.not.be.undefined;
        //                     assert.equal("Bed does not exist", res.body.error.id);
        //                     done();
        //                 })

        //         })
        // }).timeout(20000);

        // it('Should return error personnel is not logged in', (done) => {
        //     const id = "5d47cf8c4e4ed5312ca5e326";
        //     chai.request(app)
        //     const url = `/bed/${id}`;
        //     chai.request(app)
        //         .delete(url)
        //         .send({
        //             bed_number: "67",
        //             bed_name: "bed50",
        //             sub_block: "56",
        //         })
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             }
        //             res.should.have.status(401);

        //             done();
        //         })

        // }).timeout(20000);

    });

    // //  List bed without pagination
    // describe("GET /bed/all", () => {
    //     it('Should get all beds without pagination', (done) => {
    //         SubBlock
    //             .findOne()
    //             .then((subblock) => {
    //                 const newBed = {
    //                     "bed_number": bed_number,
    //                     "bed_name": bed_name,
    //                     "sub_block": subblock._id,
    //                 }
    //                 Bed
    //                     .insertMany(newBed)
    //                     .then(() => {
    //                         //Login user
    //                         chai.request(app)
    //                             .post('/personnel/login')
    //                             .send({
    //                                 phone: userPhone,
    //                                 password: userPassword
    //                             })
    //                             .end((err, res) => {
    //                                 if (err) {
    //                                     return done(err);
    //                                 } else {
    //                                     const accessToken = res.body.accessToken;
    //                                     chai.request(app)
    //                                         .get(`/bed/all`)
    //                                         .set('Authorization', 'Bearer ' + accessToken)
    //                                         .end((err, res) => {
    //                                             if (err) {
    //                                                 return done(err);
    //                                             } else {
    //                                                 res.should.have.status(200);
    //                                                 res.body.should.be.a('array');
    //                                                 Bed
    //                                                     .deleteMany({
    //                                                         "bed_number": bed_number
    //                                                     })
    //                                                     .then(() => {
    //                                                         done();
    //                                                     })
    //                                                     .catch(err => {
    //                                                         return done(err);
    //                                                     })
    //                                             }
    //                                         })
    //                                 }
    //                             })
    //                     })
    //                     .catch(err => {
    //                         return done(err);
    //                     });
    //             })
    //             .catch(err => {
    //                 return done(err);
    //             });
    //     }).timeout(20000);
    // })

});