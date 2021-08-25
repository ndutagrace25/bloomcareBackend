import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    ToleranceType
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

const name = "Test Tolerance Type";

describe("ToleranceType", () => {
    // create tolerance-type
    describe("POST /tolerance-type", () => {
        it('Should save a tolerance-type', (done) => {
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

                        ToleranceType
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                chai.request(app)
                                    .post("/tolerance-type")
                                    .send({
                                        "name": name
                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            ToleranceType
                                                .findOne({
                                                    "name": name
                                                })
                                                .then(toleranceType => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);

                                                    //Validate tolerance-type
                                                    assert.equal(name, toleranceType.name);

                                                    ToleranceType
                                                        .deleteMany({
                                                            "name": name
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
                                        }
                                    });
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if tolerance-type exist', (done) => {
            ToleranceType
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    ToleranceType
                        .create({
                            name: name
                        })
                        .then(() => {
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
                                            .post("/tolerance-type")
                                            .send({
                                                name: name
                                            })
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(400);
                                                    res.should.be.a('object');
                                                    res.body.error.name.should.not.be.undefined;
                                                    assert.equal("Tolerance type already exist", res.body.error.name);
                                                    ToleranceType
                                                        .deleteMany({
                                                            name: name
                                                        })
                                                        .then(() => {
                                                            done();
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
        }).timeout(20000);

        it('Should return error if empty fields are provided', (done) => {
            const newToleranceType = {
                "name": ""
            };
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    if (err) {
                        return done();
                    } else {
                        const accessToken = res.body.accessToken;
                        chai.request(app)
                            .post("/tolerance-type")
                            .send(newToleranceType)
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    res.should.have.status(400);
                                    res.should.be.a('object');
                                    res.body.error.name.should.not.be.undefined;
                                    assert.equal("Name is required", res.body.error.name);
                                    done();
                                }
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/tolerance-type`)
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

    describe("GET /tolerance-type", () => {
        it('Should get all tolerance-type', (done) => {
            ToleranceType
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newToleranceType = [{
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }];

                    ToleranceType
                        .insertMany(newToleranceType)
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
                                            .get(`/tolerance-type?page=0&limit=5`)
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
                                                    assert.isAtMost(5, res.body.items.length);

                                                    ToleranceType
                                                        .deleteMany({
                                                            "name": name
                                                        })
                                                        .then(() => {
                                                            done();
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
                });
        }).timeout(20000);

        it('Should search tolerance-type by name', (done) => {
            ToleranceType
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newToleranceType = {
                        "name": name
                    };
                    ToleranceType
                        .create(newToleranceType)
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
                                            .get(`/tolerance-type?page=0&limit=5&name=${name}`)
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
                                                    assert.equal(name, res.body.items[0].name);

                                                    ToleranceType
                                                        .deleteMany({
                                                            "name": name
                                                        })
                                                        .then(() => {
                                                            done();
                                                        })
                                                        .catch(err => {
                                                            return done(err);
                                                        })
                                                }
                                            })
                                    }
                                });
                        })
                        .catch(err => {
                            return done(err);
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .get(`/tolerance-type`)
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

    // patch request on tolerance - type
    describe("PATCH /tolerance-type/:toleranceTypeId", () => {
        it('Should update tolerance-type', (done) => {
            ToleranceType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Tolerance Name"
                    }]
                })
                .then(() => {
                    const newToleranceType = {
                        "name": name
                    };
                    ToleranceType
                        .create(newToleranceType)
                        .then((toleranceType) => {
                            const id = toleranceType._id;
                            chai.request(app)
                                .post('/personnel/login')
                                .send({
                                    phone: userPhone,
                                    password: userPassword
                                })
                                .end((err, res) => {
                                    if (err) {
                                        return done(err);
                                    }
                                    const accessToken = res.body.accessToken;
                                    const url = `/tolerance-type/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: "update Tolerance Name"
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                ToleranceType
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(toleranceType => {
                                                        // console.log(tolerance-type);
                                                        res.should.have.status(200);
                                                        res.should.be.a('object');
                                                        res.body.message.should.not.be.undefined;
                                                        assert.equal("Success", res.body.message);

                                                        //Validate tolerance-type
                                                        assert.equal("update Tolerance Name", toleranceType.name);

                                                        ToleranceType
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "update Tolerance Name"
                                                                }]
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
                                            }
                                        })
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
            ToleranceType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Tolerance Name"
                    }]
                })
                .then(() => {
                    const newToleranceType = {
                        "name": name
                    };
                    ToleranceType
                        .create(newToleranceType)
                        .then((toleranceType) => {
                            const id = toleranceType._id;
                            chai.request(app)
                                .post('/personnel/login')
                                .send({
                                    phone: userPhone,
                                    password: userPassword
                                })
                                .end((err, res) => {
                                    if (err) {
                                        return done(err);
                                    }
                                    const accessToken = res.body.accessToken;
                                    const url = `/tolerance-type/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: ""
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                res.should.have.status(400);
                                                res.should.be.a('object');
                                                res.body.error.name.should.not.be.undefined;
                                                assert.equal("Name is required", res.body.error.name);

                                                ToleranceType
                                                    .deleteMany({
                                                        $or: [{
                                                            "name": name
                                                        }, {
                                                            "name": "update Tolerance Name"
                                                        }]
                                                    })
                                                    .then(() => {
                                                        done();
                                                    })
                                                    .catch(err => {
                                                        return done(err);
                                                    })
                                            }
                                        })
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
            ToleranceType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Tolerance Name"
                    }]
                })
                .then(() => {
                    const newToleranceType = {
                        "name": name
                    };
                    ToleranceType
                        .create(newToleranceType)
                        .then((toleranceType) => {
                            const id = toleranceType._id;
                            chai.request(app)
                                .post('/personnel/login')
                                .send({
                                    phone: userPhone,
                                    password: userPassword
                                })
                                .end((err, res) => {
                                    if (err) {
                                        return done(err);
                                    }
                                    const accessToken = res.body.accessToken;
                                    const url = `/tolerance-type/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send(newToleranceType)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                res.should.have.status(400);
                                                res.should.be.a('object');
                                                res.body.error.name.should.not.be.undefined;
                                                assert.equal("Tolerance type already exist", res.body.error.name);

                                                ToleranceType
                                                    .deleteMany({
                                                        $or: [{
                                                            "name": name
                                                        }, {
                                                            "name": "update Tolerance Name"
                                                        }]
                                                    })
                                                    .then(() => {
                                                        done();
                                                    })
                                                    .catch(err => {
                                                        return done(err);
                                                    })
                                            }
                                        })
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
                    if (err) {
                        return done(err);
                    }
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance-type/${id}`;
                    chai.request(app)
                        .patch(url)
                        .send({
                            name: "ccc"
                        })
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
                    const url = `/tolerance-type/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "Martin"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Tolerance Type does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);
    });

    //  delete tolerance-type
    describe("DELETE /tolerance-type/:toleranceTypeId", () => {
        it('Should delete tolerance-type', (done) => {
            ToleranceType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Tolerance Name"
                    }]
                })
                .then((toleranceType) => {
                    const newToleranceType = {
                        "name": name
                    };
                    ToleranceType
                        .create(newToleranceType)
                        .then((toleranceType) => {
                            const id = toleranceType._id;
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
                                        const url = `/tolerance-type/${id}`;
                                        chai.request(app)
                                            .delete(url)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);
                                                    ToleranceType.findOne({
                                                            id: id
                                                        })
                                                        .then(deletedToleranceType => {
                                                            assert.equal(deletedToleranceType, null);
                                                            done();
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
                    if (err) {
                        return done(err);
                    }
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance-type/${id}`;
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
                    if (err) {
                        return done(err);
                    }
                    const accessToken = res.body.accessToken;
                    const url = `/tolerance-type/${id}`;
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
                            assert.equal("Tolerance Type does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);
    });

    //  List tolerance type without pagination
    describe("GET /tolerance-type/all", () => {

        it('Should get all tolerance-type without pagination', (done) => {
            ToleranceType
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newToleranceType = [{
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }, {
                        "name": name
                    }];

                    ToleranceType
                        .insertMany(newToleranceType)
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
                                            .get(`/tolerance-type/all`)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('array');

                                                    ToleranceType
                                                        .deleteMany({
                                                            "name": name
                                                        })
                                                        .then(() => {
                                                            done();
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
                });
        }).timeout(20000);

    })
});