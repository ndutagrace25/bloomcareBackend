// import chai from 'chai';
// import chaiHttp from 'chai-http';

// import app from '../server';
// const {
//     Bed,
//     Flower,
//     Plant
// } = require('../models');

// const {
//     userPhone,
//     userPassword
// } = require("./config");

// // Configure chai
// chai.use(chaiHttp);
// chai.should();
// const expect = chai.expect;
// let assert = chai.assert;

// const plant_date = "2019-07-25T13:23:33.055Z";
// const expected_pick_date = "2019-07-29T13:16:06.166Z";
// const status = "1";
// const plant_id = "5d404f45758b17199c90c055";

// describe("Plant", () => {

//     //Create plant
//     describe("POST /plant", () => {
//         it('Should save a plant', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
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
//                                         // console.log(flower)
//                                         chai.request(app)
//                                             .post("/plant")
//                                             .send(newPlant)
//                                             .set('Authorization', 'Bearer ' + accessToken)
//                                             .end((err, res) => {
//                                                 if (err) {
//                                                     return done(err);
//                                                 } else {
//                                                     Plant
//                                                         .findOne({
//                                                             plant_date: plant_date,
//                                                             expected_pick_date: expected_pick_date,
//                                                             status: status,
//                                                             bed: bed._id,
//                                                             flower: flower._id
//                                                         })
//                                                         .then(plant => {
//                                                             res.should.have.status(200);
//                                                             res.should.be.a('object');
//                                                             res.body.message.should.not.be.undefined;
//                                                             assert.equal("Success", res.body.message);
//                                                             //Validate plant
//                                                             expect(plant).to.have.property('plant_date');
//                                                             expect(plant).to.have.property('expected_pick_date');
//                                                             expect(plant).to.have.property('status');
//                                                             expect(plant).to.have.property('bed');
//                                                             expect(plant).to.have.property('flower');
//                                                             plant.plant_date.should.not.be.undefined;
//                                                             plant.expected_pick_date.should.not.be.undefined;
//                                                             plant.status.should.not.be.undefined;
//                                                             assert.equal(status, plant.status);
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         })
//                                                         .catch(err => {
//                                                             return done(err);
//                                                         })
//                                                 }
//                                             });
//                                     }
//                                 });
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                 })
//                 .catch(err => {
//                     return done(err);
//                 })
//         }).timeout(100000);

//         it('Should return error if empty fields are provided', (done) => {
//             const newPlant = {
//                 "plant_date": "",
//                 "expected_pick_date": "",
//                 "status": "",
//                 "bed": "",
//                 "flower": ""
//             };
//             Plant
//                 .deleteMany({
//                     _id: plant_id
//                 })
//                 .then(() => {
//                     chai.request(app)
//                         .post('/personnel/login')
//                         .send({
//                             phone: userPhone,
//                             password: userPassword
//                         })
//                         .end((err, res) => {
//                             if (err) {
//                                 return done();
//                             } else {
//                                 const accessToken = res.body.accessToken;
//                                 chai.request(app)
//                                     .post("/plant")
//                                     .send(newPlant)
//                                     .set('Authorization', 'Bearer ' + accessToken)
//                                     .end((err, res) => {
//                                         if (err) {
//                                             return done();
//                                         } else {
//                                             res.should.have.status(400);
//                                             res.should.be.a('object');
//                                             res.body.error.plant_date.should.not.be.undefined;
//                                             res.body.error.expected_pick_date.should.not.be.undefined;
//                                             res.body.error.status.should.not.be.undefined;
//                                             res.body.error.bed.should.not.be.undefined;
//                                             res.body.error.flower.should.not.be.undefined;
//                                             assert.equal("Plant date is required", res.body.error.plant_date);
//                                             assert.equal("Expected pick date is required", res.body.error.expected_pick_date);
//                                             assert.equal("Status is required", res.body.error.status);
//                                             assert.equal("Bed is required", res.body.error.bed);
//                                             assert.equal("Flower is required", res.body.error.flower);
//                                             done();
//                                         }
//                                     })
//                             }
//                         })
//                 })
//                 .catch(err => {
//                     return done();
//                 })
//         }).timeout(20000);

//         it('Should return error if invalid ids are provided', (done) => {
//             const newPlant = {
//                 "plant_date": plant_date,
//                 "expected_pick_date": expected_pick_date,
//                 "status": status,
//                 "block": "asdf",
//                 "bed": "asdf",
//                 "flower": "asdf"
//             };
//             Plant
//                 .deleteMany({
//                     _id: plant_id
//                 })
//                 .then(() => {
//                     chai.request(app)
//                         .post('/personnel/login')
//                         .send({
//                             phone: userPhone,
//                             password: userPassword
//                         })
//                         .end((err, res) => {
//                             if (err) {
//                                 return done();
//                             } else {
//                                 const accessToken = res.body.accessToken;
//                                 chai.request(app)
//                                     .post("/plant")
//                                     .send(newPlant)
//                                     .set('Authorization', 'Bearer ' + accessToken)
//                                     .end((err, res) => {
//                                         if (err) {
//                                             return done();
//                                         } else {
//                                             res.should.have.status(400);
//                                             res.should.be.a('object');
//                                             res.body.error.block.should.not.be.undefined;
//                                             res.body.error.bed.should.not.be.undefined;
//                                             res.body.error.flower.should.not.be.undefined;
//                                             assert.equal("Invalid block provided", res.body.error.block);
//                                             assert.equal("Invalid bed provided", res.body.error.bed);
//                                             assert.equal("Invalid flower provided", res.body.error.flower);
//                                             done();
//                                         }
//                                     })
//                             }
//                         })
//                 })
//                 .catch(err => {
//                     return done();
//                 })
//         }).timeout(20000);

//         it('Should return error if personnel creating plant is not logged in', (done) => {
//             chai.request(app)
//                 .post(`/plant`)
//                 .end((err, res) => {
//                     if (err) {
//                         return done();
//                     } else {
//                         res.should.have.status(401);
//                         done();
//                     }
//                 })
//         }).timeout(20000);
//     });

//     // Fetch plants
//     describe("GET /plant", () => {
//         it('Should get all plants', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     //console.log(bed)
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .insertMany(savePlant)
//                                 .then((plant) => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[1].plant_date.should.not.be.undefined;
//                                                             res.body.items[1].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[1].status.should.not.be.undefined;
//                                                             res.body.items[1].bed.should.not.be.undefined;
//                                                             res.body.items[1].flower.should.not.be.undefined;
//                                                             assert.isAtMost(5, res.body.items.length);
//                                                             res.body.items[1].bed.should.be.a('object');
//                                                             res.body.items[1].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });
//                         })
//                         .catch(err => {
//                             return done(err);
//                         });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by plant date', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&plant_date=${plant_date}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;
//                                                             assert.equal(plant_date, res.body.items[0].plant_date);

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });
//                         })
//                         .catch(err => {
//                             return done(err);
//                         });


//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by expeted pick date', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&expected_pick_date=${expected_pick_date}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;
//                                                             assert.equal(expected_pick_date, res.body.items[0].expected_pick_date);

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });
//                         })
//                         .catch(err => {
//                             return done(err);
//                         });

//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by status', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&status=${status}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;
//                                                             assert.equal(status, res.body.items[0].status);

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });

//                         })
//                         .catch(err => {
//                             return done(err);
//                         });


//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by bed', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&bed=${bed._id}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });

//                         })
//                         .catch(err => {
//                             return done(err);
//                         });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by block', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     //console.log(bed.block)
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&block=${bed.block}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });

//                         })
//                         .catch(err => {
//                             return done(err);
//                         });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should search plant by flower', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant, newPlant, newPlant, newPlant, newPlant, newPlant];
//                             Plant
//                                 .create(savePlant)
//                                 .then(() => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant?page=0&limit=5&flower=${flower._id}`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('object');
//                                                             res.body.rows.should.not.be.undefined;
//                                                             res.body.items.should.not.be.undefined;
//                                                             res.body.items.should.be.a('array');
//                                                             res.body.items[0].plant_date.should.not.be.undefined;
//                                                             res.body.items[0].expected_pick_date.should.not.be.undefined;
//                                                             res.body.items[0].status.should.not.be.undefined;
//                                                             res.body.items[0].bed.should.not.be.undefined;

//                                                             res.body.items[0].bed.should.be.a('object');
//                                                             res.body.items[0].flower.should.be.a('object');
//                                                             Plant
//                                                                 .deleteMany({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         });
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });

//                         })
//                         .catch(err => {
//                             return done(err);
//                         });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);

//         it('Should return error if personnel is not logged in', (done) => {
//             chai.request(app)
//                 .get(`/plant`)
//                 .end((err, res) => {
//                     if (err) {
//                         return done(err);
//                     } else {
//                         res.should.have.status(401);
//                         done();
//                     }
//                 })
//         }).timeout(20000);
//     });

//     //Patch request on plant
//     describe("PATCH /plant/:plantId", () => {
//         it('Should update plant', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             Plant
//                                 .create(newPlant)
//                                 .then((plant) => {
//                                     const id = plant._id;
//                                     // console.log(id);
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             const accessToken = res.body.accessToken;
//                                             const url = `/plant/${id}`;
//                                             chai.request(app)
//                                                 .patch(url)
//                                                 .set('Authorization', 'Bearer ' + accessToken)
//                                                 .send(newPlant)
//                                                 .end((err, resUpdate) => {
//                                                     if (err) {
//                                                         return done(err);
//                                                     } else {
//                                                         Plant
//                                                             .findOne({
//                                                                 "_id": id
//                                                             })
//                                                             .then(plant => {
//                                                                 resUpdate.should.have.status(200);
//                                                                 resUpdate.should.be.a('object');
//                                                                 resUpdate.body.message.should.not.be.undefined;
//                                                                 assert.equal("Success", resUpdate.body.message);
//                                                                 Plant
//                                                                     .deleteMany({
//                                                                         "_id": id
//                                                                     })
//                                                                     .then(() => {
//                                                                         done();
//                                                                     })
//                                                                     .catch(err => {
//                                                                         return done(err);
//                                                                     })
//                                                             })
//                                                             .catch(err => {
//                                                                 return done(err);
//                                                             })
//                                                     }
//                                                 })
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 })
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                 })
//                 .catch(err => {
//                     return done(err);
//                 })
//         }).timeout(20000);

//         it('Should return error if empty fields are provided', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             Plant
//                                 .create(newPlant)
//                                 .then((plant) => {
//                                     const id = plant._id;
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             }
//                                             const accessToken = res.body.accessToken;
//                                             const url = `/plant/${id}`;
//                                             chai.request(app)
//                                                 .patch(url)
//                                                 .set('Authorization', 'Bearer ' + accessToken)
//                                                 .send({
//                                                     plant_date: "",
//                                                     expected_pick_date: "",
//                                                     status: "",
//                                                     block: "",
//                                                     bed: "",
//                                                     flower: ""

//                                                 })
//                                                 .end((err, res) => {
//                                                     if (err) {
//                                                         return done();
//                                                     } else {
//                                                         Plant
//                                                             .findOne({
//                                                                 "_id": id
//                                                             })
//                                                             .then(plant => {
//                                                                 res.should.have.status(400);
//                                                                 res.should.be.a('object');
//                                                                 res.body.error.plant_date.should.not.be.undefined;
//                                                                 res.body.error.expected_pick_date.should.not.be.undefined;
//                                                                 res.body.error.status.should.not.be.undefined;
//                                                                 res.body.error.bed.should.not.be.undefined;
//                                                                 res.body.error.flower.should.not.be.undefined;
//                                                                 assert.equal("Plant date is required", res.body.error.plant_date);
//                                                                 assert.equal("Expected pick date is required", res.body.error.expected_pick_date);
//                                                                 assert.equal("Status is required", res.body.error.status);
//                                                                 assert.equal("Bed is required", res.body.error.bed);
//                                                                 assert.equal("Flower is required", res.body.error.flower);
//                                                                 Plant
//                                                                     .deleteMany({
//                                                                         "_id": id
//                                                                     })
//                                                                     .then(() => {
//                                                                         done();
//                                                                     })
//                                                                     .catch(err => {
//                                                                         return done(err);
//                                                                     })
//                                                             })
//                                                             .catch(err => {
//                                                                 return done(err);
//                                                             })
//                                                     }
//                                                 })
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 })
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                 })
//                 .catch(err => {
//                     return done(err);
//                 })
//         }).timeout(20000);

//         it('Should return error if invalid ids are provided', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             Plant
//                                 .create(newPlant)
//                                 .then((plant) => {
//                                     const id = plant._id;
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             }
//                                             const accessToken = res.body.accessToken;
//                                             const url = `/plant/${id}`;
//                                             chai.request(app)
//                                                 .patch(url)
//                                                 .set('Authorization', 'Bearer ' + accessToken)
//                                                 .send({
//                                                     "plant_date": plant_date,
//                                                     "expected_pick_date": expected_pick_date,
//                                                     "status": status,
//                                                     "block": "asdf",
//                                                     "bed": "asdf",
//                                                     "flower": "asdf"

//                                                 })
//                                                 .end((err, res) => {
//                                                     if (err) {
//                                                         return done();
//                                                     } else {
//                                                         Plant
//                                                             .findOne({
//                                                                 "_id": id
//                                                             })
//                                                             .then(plant => {
//                                                                 res.should.have.status(400);
//                                                                 res.should.be.a('object');
//                                                                 res.body.error.bed.should.not.be.undefined;
//                                                                 res.body.error.flower.should.not.be.undefined;
//                                                                 assert.equal("Invalid bed provided", res.body.error.bed);
//                                                                 assert.equal("Invalid flower provided", res.body.error.flower);
//                                                                 Plant
//                                                                     .deleteMany({
//                                                                         "_id": id
//                                                                     })
//                                                                     .then(() => {
//                                                                         done();
//                                                                     })
//                                                                     .catch(err => {
//                                                                         return done(err);
//                                                                     })
//                                                             })
//                                                             .catch(err => {
//                                                                 return done(err);
//                                                             })
//                                                     }
//                                                 })
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 })
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                 })
//                 .catch(err => {
//                     return done(err);
//                 })
//         }).timeout(20000);

//         it('Should return error if id is invalid hex', (done) => {
//             const id = "xxxxxx";
//             chai.request(app)
//                 .post('/personnel/login')
//                 .send({
//                     phone: userPhone,
//                     password: userPassword
//                 })
//                 .end((err, res) => {
//                     const accessToken = res.body.accessToken;
//                     const url = `/plant/${id}`;
//                     chai.request(app)
//                         .patch(url)
//                         .set('Authorization', 'Bearer ' + accessToken)
//                         .send({
//                             plant_date: plant_date,
//                             expected_pick_date: expected_pick_date,
//                             status: "1",
//                             block: "5d405bff1769fc12c8aad858",
//                             bed: "5d405bff1769fc12c8aad858",
//                             flower: "5d4004ba428c8d35cc5a6b26"
//                         })
//                         .end((err, res) => {
//                             if (err) {
//                                 return done(err);
//                             }
//                             res.should.have.status(400);
//                             res.should.be.a('object');
//                             res.body.error.id.should.not.be.undefined;
//                             assert.equal("Invalid id provided", res.body.error.id);
//                             done();
//                         })

//                 })
//         }).timeout(20000);

//         it('Should return error if personnel is not logged in', (done) => {
//             const id = "5d47cf8c4e4ed5312ca5e326";
//             chai.request(app)
//             const url = `/plant/${id}`;
//             chai.request(app)
//                 .patch(url)
//                 .send({
//                     plant_date: plant_date,
//                     expected_pick_date: expected_pick_date,
//                     status: "1",
//                     block: "5d405bff1769fc12c8aad858",
//                     bed: "5d405bff1769fc12c8aad858",
//                     flower: "5d4004ba428c8d35cc5a6b26"
//                 })
//                 .end((err, res) => {
//                     if (err) {
//                         return done(err);
//                     }
//                     res.should.have.status(401);
//                     done();
//                 })
//         }).timeout(20000);

//     });

//     //   Delete bed
//     describe("DELETE /plant/:plantId", () => {
//         it('Should delete plant', (done) => {
//             Bed
//                 .findOne()
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             Plant
//                                 .create(newPlant)
//                                 .then((plant) => {
//                                     const id = plant._id;
//                                     // console.log(id);
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 const url = `/plant/${id}`;
//                                                 chai.request(app)
//                                                     .delete(url)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             res.should.have.status(200);
//                                                             res.should.be.a('object');
//                                                             res.body.message.should.not.be.undefined;
//                                                             assert.equal("Success", res.body.message);
//                                                             Plant.findOne({
//                                                                     id: id
//                                                                 })
//                                                                 .then(deletedPlant => {
//                                                                     assert.equal(deletedPlant, null);
//                                                                     done();
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 })
//                         })
//                         .catch(err => {
//                             return done(err);
//                         })
//                 })
//                 .catch(err => {
//                     return done(err);
//                 })
//         }).timeout(20000);

//         it('Should return error if id is invalid hex', (done) => {
//             const id = "xxxxxx";
//             chai.request(app)
//                 .post('/personnel/login')
//                 .send({
//                     phone: userPhone,
//                     password: userPassword
//                 })
//                 .end((err, res) => {
//                     const accessToken = res.body.accessToken;
//                     const url = `/plant/${id}`;
//                     chai.request(app)
//                         .delete(url)
//                         .set('Authorization', 'Bearer ' + accessToken)
//                         .end((err, res) => {
//                             if (err) {
//                                 return done(err);
//                             }
//                             res.should.have.status(400);
//                             res.should.be.a('object');
//                             res.body.error.id.should.not.be.undefined;
//                             assert.equal("Invalid id provided", res.body.error.id);
//                             done();
//                         })

//                 })
//         }).timeout(20000);

//         it('Should return error if id does not exist', (done) => {
//             const id = "8fb15451d578f906d8eb769c";
//             chai.request(app)
//                 .post('/personnel/login')
//                 .send({
//                     phone: userPhone,
//                     password: userPassword
//                 })
//                 .end((err, res) => {
//                     const accessToken = res.body.accessToken;
//                     const url = `/plant/${id}`;
//                     chai.request(app)
//                         .delete(url)
//                         .set('Authorization', 'Bearer ' + accessToken)
//                         .end((err, res) => {
//                             if (err) {
//                                 return done(err);
//                             }
//                             res.should.have.status(400);
//                             res.should.be.a('object');
//                             res.body.error.id.should.not.be.undefined;
//                             assert.equal("Plant does not exist", res.body.error.id);
//                             done();
//                         })

//                 })
//         }).timeout(20000);

//     });

//     // Fetch plants without pagination
//     describe("GET /plant/all", () => {
//         it('Should get all plants without pagination', (done) => {
//             Bed
//                 .findOne({
//                     block: "5d50185b8dd94830b06471d2",
//                 })
//                 .then((bed) => {
//                     Flower
//                         .findOne()
//                         .then((flower) => {
//                             const newPlant = {
//                                 "plant_date": plant_date,
//                                 "expected_pick_date": expected_pick_date,
//                                 "status": status,
//                                 "block": bed.block,
//                                 "bed": bed._id,
//                                 "flower": flower._id
//                             };
//                             const savePlant = [newPlant];

//                             Plant
//                                 .insertMany(savePlant)
//                                 .then((plant) => {
//                                     //Login user
//                                     chai.request(app)
//                                         .post('/personnel/login')
//                                         .send({
//                                             phone: userPhone,
//                                             password: userPassword
//                                         })
//                                         .end((err, res) => {
//                                             if (err) {
//                                                 return done(err);
//                                             } else {
//                                                 const accessToken = res.body.accessToken;
//                                                 chai.request(app)
//                                                     .get(`/plant/all`)
//                                                     .set('Authorization', 'Bearer ' + accessToken)
//                                                     .end((err, res) => {
//                                                         if (err) {
//                                                             return done(err);
//                                                         } else {
//                                                             // console.log(res.body)
//                                                             res.should.have.status(200);
//                                                             res.body.should.be.a('array');
//                                                             Plant
//                                                                 .find({
//                                                                     plant_date: plant_date,
//                                                                     expected_pick_date: expected_pick_date,
//                                                                     status: status,
//                                                                     bed: bed._id,
//                                                                     flower: flower._id
//                                                                 })
//                                                                 .then(() => {
//                                                                     done();
//                                                                 })
//                                                                 .catch(err => {
//                                                                     return done(err);
//                                                                 })
//                                                         }
//                                                     })
//                                             }
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return done(err);
//                                 });
//                         })
//                         .catch(err => {
//                             return done(err);
//                         });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         }).timeout(100000);
//     })
// });