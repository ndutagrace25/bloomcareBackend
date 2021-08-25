import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    Variety
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

const name = "Test variety";

describe("Variety", () => {
    // Create variety
    describe("POST /variety", () => {
        it('Should save a variety', (done) => {
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

                        Variety
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                chai.request(app)
                                    .post("/variety")
                                    .send({
                                        "name": name
                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            Variety
                                                .findOne({
                                                    "name": name
                                                })
                                                .then(variety => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);

                                                    //Validate variety
                                                    assert.equal(name, variety.name);

                                                    Variety
                                                        .find({
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

        it('Should return error if variety exist', (done) => {
            Variety
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    Variety
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
                                            .post("/variety")
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
                                                    assert.equal("Variety already exist", res.body.error.name);
                                                    Variety
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
            const newVariety = {
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
                            .post("/variety")
                            .send(newVariety)
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
                .post(`/variety`)
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

    //  List varieties
    describe("GET /variety", () => {
        it('Should get all varieties', (done) => {
            Variety
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newvariety = [{
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

                    Variety
                        .insertMany(newvariety)
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
                                            .get(`/variety?page=0&limit=5`)
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

                                                    Variety
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

        it('Should search variety by name', (done) => {
            Variety
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newVariety = {
                        "name": name
                    };

                    Variety
                        .create(newVariety)
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
                                            .get(`/variety?page=0&limit=5&name=${name}`)
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
                                                    // assert.equal(name, res.body.items[0].name);

                                                    Variety
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
                .get(`/variety`)
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

    // Patch request on variety
    describe("PATCH /variety/:varietyId", () => {
        it('Should update variety', (done) => {
            Variety
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "Update Variety Name"
                    }]
                })
                .then(() => {
                    const newVariety = {
                        "name": name
                    };
                    Variety
                        .create(newVariety)
                        .then((variety) => {
                            const id = variety._id;
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
                                    const url = `/variety/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: "Update Variety Name"
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                Variety
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(variety => {
                                                        res.should.have.status(200);
                                                        res.should.be.a('object');
                                                        res.body.message.should.not.be.undefined;
                                                        assert.equal("Success", res.body.message);

                                                        //Validate variety
                                                        assert.equal("Update Variety Name", variety.name);

                                                        Variety
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "Update Variety Name"
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
            Variety
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "Update Variety Name"
                    }]
                })
                .then(() => {
                    const newVariety = {
                        "name": name
                    };
                    Variety
                        .create(newVariety)
                        .then((variety) => {
                            const id = variety._id;
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
                                    const url = `/variety/${id}`;
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

                                                Variety
                                                    .deleteMany({
                                                        $or: [{
                                                            "name": name
                                                        }, {
                                                            "name": "Update Variety Name"
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
            Variety
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "Update Variety Name"
                    }]
                })
                .then(() => {
                    const newVariety = {
                        "name": name
                    };
                    Variety
                        .create(newVariety)
                        .then((variety) => {
                            const id = variety._id;
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
                                    const url = `/variety/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send(newVariety)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                res.should.have.status(400);
                                                res.should.be.a('object');
                                                res.body.error.name.should.not.be.undefined;
                                                assert.equal("Variety already exist", res.body.error.name);

                                                Variety
                                                    .deleteMany({
                                                        $or: [{
                                                            "name": name
                                                        }, {
                                                            "name": "Update Variety Name"
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
                    const url = `/variety/${id}`;
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
                    const url = `/variety/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "variety34"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Variety does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/variety/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: "New Variety Name"
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

    //  Delete variety
    describe("DELETE /variety/:varietyId", () => {
        it('Should delete variety', (done) => {
            Variety
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "Update Variety Name"
                    }]
                })
                .then(() => {
                    const newVariety = {
                        "name": name
                    };
                    Variety
                        .create(newVariety)
                        .then((variety) => {
                            const id = variety._id;
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
                                        const url = `/variety/${id}`;
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
                                                    Variety.findOne({
                                                            id: id
                                                        })
                                                        .then(deletedVariety => {
                                                            assert.equal(deletedVariety, null);
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
                    const url = `/variety/${id}`;
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
                    const url = `/variety/${id}`;
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
                            assert.equal("Variety does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/variety/${id}`;
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

    //  List varieties without pagination
    describe("GET /variety/all", () => {

        it('Should get all varieties without pagination', (done) => {
            Variety
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "Update Variety Name"
                    }]
                })
                .then(() => {
                    const newVariety = [{
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

                    Variety
                        .insertMany(newVariety)
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
                                            .get(`/variety/all`)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('array');

                                                    Variety
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