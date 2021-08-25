import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const {
    Point
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
const name = "Test point";

describe("Point", () => {
    // Create point
    describe("POST /point", () => {

        it('Should save a point', (done) => {
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

                        Point
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                chai.request(app)
                                    .post("/point")
                                    .send({
                                        "name": name
                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            Point
                                                .findOne({
                                                    "name": name
                                                })
                                                .then(point => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);

                                                    //Validate point
                                                    assert.equal(name, point.name);

                                                    Point
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

        it('Should return error if point exist', (done) => {
            Point
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    Point
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
                                            .post("/point")
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
                                                    assert.equal("Point already exist", res.body.error.name);
                                                    Point
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

        it('Should return error if empty fields are not provided', (done) => {
            const newPoint = {
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
                            .post("/point")
                            .send(newPoint)
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
                .post(`/point`)
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

    //  List points
    describe("GET /point", () => {
        it('Should get all points', (done) => {
            -
            Point
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newPoint = [{
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

                    Point
                        .insertMany(newPoint)
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
                                            .get(`/point?page=0&limit=5`)
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

                                                    Point
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

        it('Should search point by name', (done) => {
            Point
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newPoint = {
                        "name": name
                    };
                    Point
                        .create(newPoint)
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
                                            .get(`/point?page=0&limit=5&name=${name}`)
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

                                                    Point
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
                .get(`/point`)
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

    // Patch request on point
    describe("PATCH /point/:pointId", () => {

        it('Should update point', (done) => {
            Point
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Point Name"
                    }]
                })
                .then(() => {
                    const newPoint = {
                        "name": name
                    };
                    Point
                        .create(newPoint)
                        .then((point) => {
                            const id = point._id;
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
                                    const url = `/point/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: "update Point Name"
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                Point
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(point => {
                                                        res.should.have.status(200);
                                                        res.should.be.a('object');
                                                        res.body.message.should.not.be.undefined;
                                                        assert.equal("Success", res.body.message);

                                                        //Validate tolerance-type
                                                        assert.equal("update Point Name", point.name);

                                                        Point
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "update Point Name"
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
            Point
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Point Name"
                    }]
                })
                .then(() => {
                    const newPoint = {
                        "name": name
                    };
                    Point
                        .create(newPoint)
                        .then((point) => {
                            const id = point._id;
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
                                    const url = `/point/${id}`;
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

                                                Point
                                                    .deleteMany({
                                                        $or: [{
                                                            "name": name
                                                        }, {
                                                            "name": "update Point Name"
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

        it('Should return error if update details exist for another point', (done) => {
            Point
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update Point Name"
                    }]
                })
                .then(() => {
                    const newPoint = {
                        "name": name
                    };
                    Point
                        .create(newPoint)
                        .then((point) => {
                            const id = point._id;
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
                                    const url = `/point/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send(newPoint)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                Point
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(point => {
                                                        res.should.have.status(400);
                                                        res.should.be.a('object');
                                                        res.body.error.name.should.not.be.undefined;
                                                        assert.equal("Point already exist", res.body.error.name);

                                                        Point
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "New Point Name"
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
                    const url = `/point/${id}`;
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
                    const url = `/point/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "point34"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Point does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/point/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: "Update Point Name"
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

    //  Delete point
    describe("DELETE /point/:pointId", () => {
        it('Should delete point', (done) => {
            Point
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newPoint = {
                        "name": name
                    };
                    Point
                        .create(newPoint)
                        .then((point) => {
                            const id = point._id;
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
                                        const url = `/point/${id}`;
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
                                                    Point.findOne({
                                                            id: id
                                                        })
                                                        .then(deletedPoint => {
                                                            assert.equal(deletedPoint, null);
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
                    const url = `/point/${id}`;
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
                    const url = `/point/${id}`;
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
                            assert.equal("Point does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/point/${id}`;
            chai.request(app)
                .delete(url)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(401);
                    done();
                })
        }).timeout(20000);


    });

    //  List points without pagination
    describe("GET /point/all", () => {

        it('Should get all points without pagination', (done) => {
            Point
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newPoint = [{
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

                    Point
                        .insertMany(newPoint)
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
                                            .get(`/point/all`)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('array');

                                                    Point
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