import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    ToleranceType,
    Tolerance
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

const name = "Test Tolerance";
const from = 0;
const to = 5;
const toleranceTypeName = "test tolerance type"

describe("Tolerance", () => {

    //  Create tolerance
    describe("POST /tolerance", () => {

        it('Should save a tolerance', (done) => {
            //login user
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
                        Tolerance
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                ToleranceType
                                    .create({
                                        name: toleranceTypeName
                                    })
                                    .then((tolerancetype) => {
                                        chai.request(app)
                                            .post("/tolerance")
                                            .send({
                                                "name": name,
                                                "from": from,
                                                "to": to,
                                                "tolerance_type": tolerancetype._id
                                            })
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    Tolerance
                                                        .findOne({
                                                            "name": name
                                                        })
                                                        .then(tolerance => {
                                                            res.should.have.status(200);
                                                            res.should.be.a('object');
                                                            res.body.message.should.not.be.undefined;
                                                            assert.equal("Success", res.body.message);
                                                            //Validate tolerance
                                                            expect(tolerance).to.have.property('name');
                                                            expect(tolerance).to.have.property('to');
                                                            expect(tolerance).to.have.property('from');
                                                            expect(tolerance).to.have.property('tolerance_type');
                                                            assert.equal(name, tolerance.name);
                                                            assert.equal(to, tolerance.to);
                                                            assert.equal(from, tolerance.from);

                                                            Tolerance
                                                                .deleteMany({
                                                                    "name": name
                                                                })
                                                                .then(() => {
                                                                    ToleranceType
                                                                        .deleteMany({
                                                                            name: toleranceTypeName
                                                                        })
                                                                        .then(() => {
                                                                            done();
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        })
                                                        .catch(err => {
                                                            return done(err);
                                                        })
                                                }
                                            });
                                    })
                                    .catch(err => {
                                        return done(err);
                                    })
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if tolerance exist', (done) => {
            //login user
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
                        Tolerance
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                ToleranceType
                                    .create({
                                        name: toleranceTypeName
                                    })
                                    .then((tolerancetype) => {
                                        Tolerance
                                            .create({
                                                "name": name,
                                                "from": from,
                                                "to": to,
                                                "tolerance_type": tolerancetype._id
                                            })
                                            .then(() => {

                                                chai.request(app)
                                                    .post("/tolerance")
                                                    .send({
                                                        "name": name,
                                                        "from": from,
                                                        "to": to,
                                                        "tolerance_type": tolerancetype._id
                                                    })
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            Tolerance
                                                                .findOne({
                                                                    "name": name
                                                                })
                                                                .then(tolerance => {
                                                                    res.should.have.status(400);
                                                                    res.should.be.a('object');
                                                                    res.body.error.tolerance.should.not.be.undefined;
                                                                    assert.equal("Tolerance already exist", res.body.error.tolerance);

                                                                    Tolerance
                                                                        .deleteMany({
                                                                            "name": name
                                                                        })
                                                                        .then(() => {
                                                                            ToleranceType
                                                                                .deleteMany({
                                                                                    name: toleranceTypeName
                                                                                })
                                                                                .then(() => {
                                                                                    done();
                                                                                })
                                                                                .catch(err => {
                                                                                    return done(err);
                                                                                })
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    });
                                            })
                                            .catch(err => {
                                                return done(err);
                                            })
                                    })
                                    .catch(err => {
                                        return done(err);
                                    })
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if empty fields are provided', (done) => {
            //login user
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
                        Tolerance
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                ToleranceType
                                    .create({
                                        name: toleranceTypeName
                                    })
                                    .then((tolerancetype) => {
                                        chai.request(app)
                                            .post("/tolerance")
                                            .send({
                                                "name": "",
                                                "from": -5,
                                                "to": -4,
                                                "tolerance_type": ""
                                            })
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    Tolerance
                                                        .findOne({
                                                            "name": name
                                                        })
                                                        .then(tolerance => {
                                                            // console.log(res.body)
                                                            res.should.have.status(400);
                                                            res.should.be.a('object');
                                                            res.body.error.name.should.not.be.undefined;
                                                            res.body.error.from.should.not.be.undefined;
                                                            res.body.error.to.should.not.be.undefined;
                                                            res.body.error.tolerance_type.should.not.be.undefined;

                                                            assert.equal("Name is required", res.body.error.name);
                                                            assert.equal("From is required", res.body.error.from);
                                                            assert.equal("To is required", res.body.error.to);
                                                            assert.equal("Tolerance type is required", res.body.error.tolerance_type);

                                                            Tolerance
                                                                .deleteMany({
                                                                    "name": name
                                                                })
                                                                .then(() => {
                                                                    ToleranceType
                                                                        .deleteMany({
                                                                            name: toleranceTypeName
                                                                        })
                                                                        .then(() => {
                                                                            done();
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        })
                                                        .catch(err => {
                                                            return done(err);
                                                        })
                                                }
                                            });
                                    })
                                    .catch(err => {
                                        return done(err);
                                    })
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/tolerance`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        res.should.have.status(401);
                        done();
                    }
                })
        }).timeout(20000);
    });

    //  List tolerance
    describe("GET /tolerance", () => {
        it('Should get all tolerance', (done) => {
            Tolerance
                .deleteMany({
                    name: name
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            const saveTolerance = [newTolerance, newTolerance, newTolerance, newTolerance, newTolerance];
                            Tolerance
                                .insertMany(saveTolerance)
                                .then(() => {

                                    //Login user
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
                                                    .get(`/tolerance?page=0&limit=5`)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            res.should.have.status(200);
                                                            res.body.should.be.a('object');
                                                            res.body.rows.should.not.be.undefined;
                                                            res.body.items.should.not.be.undefined;
                                                            res.body.items.should.be.a('array');
                                                            res.body.items[1].name.should.not.be.undefined;
                                                            res.body.items[1].from.should.not.be.undefined;
                                                            res.body.items[1].to.should.not.be.undefined;
                                                            res.body.items[1].tolerance_type.should.not.be.undefined;
                                                            assert.isAtMost(5, res.body.items.length);

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            name: name
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search tolerance by  name', (done) => {
            Tolerance
                .deleteMany({
                    name: name
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then(() => {

                                    //Login user
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
                                                    .get(`/tolerance?page=0&limit=5&name=${name}`)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            res.should.have.status(200);
                                                            res.body.should.be.a('object');
                                                            res.body.rows.should.not.be.undefined;
                                                            res.body.items.should.not.be.undefined;
                                                            res.body.items.should.be.a('array');
                                                            res.body.items[0].name.should.not.be.undefined;
                                                            res.body.items[0].from.should.not.be.undefined;
                                                            res.body.items[0].to.should.not.be.undefined;
                                                            res.body.items[0].tolerance_type.should.not.be.undefined;
                                                            assert.equal(name, res.body.items[0].name);

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            name: name
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue by tolerance type', (done) => {
            Tolerance
                .deleteMany({
                    name: name
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then(() => {

                                    //Login user
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
                                                    .get(`/tolerance?page=0&limit=5&tolerance_type=${tolerancetype._id}`)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            res.should.have.status(200);
                                                            res.body.should.be.a('object');
                                                            res.body.rows.should.not.be.undefined;
                                                            res.body.items.should.not.be.undefined;
                                                            res.body.items.should.be.a('array');
                                                            res.body.items[0].name.should.not.be.undefined;
                                                            res.body.items[0].from.should.not.be.undefined;
                                                            res.body.items[0].to.should.not.be.undefined;
                                                            res.body.items[0].tolerance_type.should.not.be.undefined;

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            name: name
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .get(`/tolerance`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        res.should.have.status(401);
                        done();
                    }
                })
        }).timeout(20000);
    });

    // Patch request on tolerance
    describe("PATCH /tolerance/:toleranceId", () => {
        it('Should update tolerance', (done) => {
            Tolerance
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update tolerance"
                    }]
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then((tolerance) => {
                                    const id = tolerance._id;
                                    //Login user
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

                                                const url = `/tolerance/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        name: "update tolerance",
                                                        from: 6,
                                                        to: 8,
                                                        tolerance_type: tolerancetype._id,
                                                    })

                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            Tolerance
                                                                .findOne({
                                                                    _id: id
                                                                })
                                                                .then((updateTolerance) => {
                                                                    //console.log(updateTolerance)
                                                                    resUpdate.should.have.status(200);
                                                                    resUpdate.should.be.a('object');
                                                                    resUpdate.body.message.should.not.be.undefined;
                                                                    assert.equal("Success", resUpdate.body.message);
                                                                    //Validate tolerance
                                                                    assert.equal("update tolerance", updateTolerance.name);
                                                                    assert.equal(6, updateTolerance.from);
                                                                    assert.equal(8, updateTolerance.to);

                                                                    ToleranceType
                                                                        .deleteMany({
                                                                            name: toleranceTypeName,
                                                                        })
                                                                        .then(() => {
                                                                            Tolerance
                                                                                .deleteMany({
                                                                                    $or: [{
                                                                                        "name": name
                                                                                    }, {
                                                                                        "name": "update tolerance"
                                                                                    }]
                                                                                })
                                                                                .then(() => {
                                                                                    done()
                                                                                })
                                                                                .catch(err => {
                                                                                    return done(err);
                                                                                })
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if empty fields are provided', (done) => {
            Tolerance
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update tolerance"
                    }]
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then((tolerance) => {
                                    const id = tolerance._id;
                                    //Login user
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

                                                const url = `/tolerance/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        name: "",
                                                        from: "",
                                                        to: "",
                                                        tolerance_type: "",
                                                    })

                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            resUpdate.should.have.status(400);
                                                            resUpdate.should.be.a('object');
                                                            resUpdate.body.error.name.should.not.be.undefined;
                                                            assert.equal("Name is required", resUpdate.body.error.name);
                                                            resUpdate.body.error.tolerance_type.should.not.be.undefined;
                                                            assert.equal("Tolerance type is required", resUpdate.body.error.tolerance_type);

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            $or: [{
                                                                                "name": name
                                                                            }, {
                                                                                "name": "update tolerance"
                                                                            }]
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if update details exist', (done) => {
            Tolerance
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update tolerance"
                    }]
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then((tolerance) => {
                                    const id = tolerance._id;
                                    //Login user
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

                                                const url = `/tolerance/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send(newTolerance)

                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            resUpdate.should.have.status(400);
                                                            resUpdate.should.be.a('object');
                                                            resUpdate.body.error.tolerance.should.not.be.undefined;

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            $or: [{
                                                                                "name": name
                                                                            }, {
                                                                                "name": "update tolerance"
                                                                            }]
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if id is invalid hex', (done) => {
            const id = "xxxxxx";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "update tolerance",
                            from: 6,
                            to: 8,
                            tolerance_type: "5d3f1179bfe5d81bd82c0f55",
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Invalid id provided", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if id does not exist', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "update tolerance",
                            from: 6,
                            to: 8,
                            tolerance_type: "5d3f1179bfe5d81bd82c0f55",
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Tolerance does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if invalid ids are provided', (done) => {
            Tolerance
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update tolerance"
                    }]
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            Tolerance
                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            }
                            Tolerance
                                .create(newTolerance)
                                .then((tolerance) => {
                                    const id = tolerance._id;
                                    //Login user
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

                                                const url = `/tolerance/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        name: "update tolerance",
                                                        from: 6,
                                                        to: 8,
                                                        tolerance_type: "ASDF",
                                                    })

                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {

                                                            resUpdate.should.have.status(400);
                                                            resUpdate.should.be.a('object');
                                                            resUpdate.body.error.tolerance_type.should.not.be.undefined;
                                                            assert.equal("Invalid tolerance type provided", resUpdate.body.error.tolerance_type);

                                                            ToleranceType
                                                                .deleteMany({
                                                                    name: toleranceTypeName,
                                                                })
                                                                .then(() => {
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            $or: [{
                                                                                "name": name
                                                                            }, {
                                                                                "name": "update tolerance"
                                                                            }]
                                                                        })
                                                                        .then(() => {
                                                                            done()
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })

                                })
                                .catch(err => {
                                    return done(err);
                                })
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
            const url = `/tolerance/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: "update tolerance",
                    from: 6,
                    to: 8,
                    tolerance_type: "5d3f1179bfe5d81bd82c0f55",
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(401);
                    done();
                })
        }).timeout(20000);
    });

    //  Delete tolerance
    describe("DELETE /tolerance/:toleranceId", () => {
        it('Should delete issueCategory', (done) => {

            Tolerance
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update tolerance"
                    }]
                })
                .then(() => {

                    ToleranceType
                        .create({
                            name: toleranceTypeName,
                        })
                        .then((tolerancetype) => {

                            const newTolerance = {
                                "name": name,
                                "from": from,
                                "to": to,
                                "tolerance_type": tolerancetype._id
                            };
                            Tolerance
                                .create(newTolerance)
                                .then((tolerance) => {
                                    const id = tolerance._id;
                                    //Login user
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
                                                const url = `/tolerance/${id}`;

                                                chai.request(app)
                                                    .delete(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)

                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            res.should.have.status(200);
                                                            res.should.be.a('object');
                                                            res.body.message.should.not.be.undefined;
                                                            assert.equal("Success", res.body.message);

                                                            Tolerance.findOne({
                                                                    id: id
                                                                })
                                                                .then(deletedTolerance => {
                                                                    assert.equal(deletedTolerance, null);
                                                                    // done();
                                                                    Tolerance
                                                                        .deleteMany({
                                                                            "name": name
                                                                        })
                                                                        .then(() => {

                                                                            ToleranceType
                                                                                .deleteMany({
                                                                                    name: toleranceTypeName,
                                                                                })
                                                                                .then(() => {
                                                                                    done()
                                                                                })
                                                                                .catch(err => {
                                                                                    return done(err);
                                                                                })


                                                                            //done();
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    return done(err);
                                                                })
                                                        }
                                                    })
                                            }
                                        })
                                })
                                .catch(err => {
                                    return done(err);
                                });

                        })
                        .catch(err => {
                            return done(err);
                        })

                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if id is invalid hex', (done) => {
            const id = "xxxxxx";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance/${id}`;
                    chai.request(app)
                        .delete(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Invalid id provided", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if id does not exist', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance/${id}`;
                    chai.request(app)
                        .delete(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Tolerance does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

    });

});