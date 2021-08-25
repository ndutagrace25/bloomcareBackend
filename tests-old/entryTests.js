import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const {
    Entry
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

const name = "Test entry";
describe("Entry", () => {
    //  Create entry
    describe("POST /entry", () => {
        it('Should save a entry', (done) => {
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

                        Entry
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                chai.request(app)
                                    .post("/entry")
                                    .send({
                                        "name": name
                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            Entry
                                                .findOne({
                                                    "name": name
                                                })
                                                .then(entry => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);

                                                    //Validate entry
                                                    assert.equal(name, entry.name);

                                                    Entry
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

        it('Should return error if entry exist', (done) => {
            Entry
                .deleteMany({
                    name: name
                })
                .then(() => {
                    Entry
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
                                            .post("/entry")
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
                                                    assert.equal("Entry already exist", res.body.error.name);
                                                    Entry
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
            const newEntry = {
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
                            .post("/entry")
                            .send(newEntry)
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
                .post(`/entry`)
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

    //   List entries
    describe("GET /entry", () => {
        it('Should get all entries', (done) => {
            Entry
                .deleteMany({
                    "name": name
                })
                .then(() => {

                    const newEntry = [{
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

                    Entry
                        .insertMany(newEntry)
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
                                            .get(`/entry?page=0&limit=5`)
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

                                                    Entry
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

        it('Should search entry by name', (done) => {
            Entry.deleteMany({
                "name": name
            })
                .then(() => {
                    const newEntry = {
                        "name": name
                    };

                    Entry
                        .create(newEntry)
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
                                            .get(`/entry?page=0&limit=5&name=${name}`)
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

                                                    Entry
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
                .get(`/entry`)
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

    //  Patch request on entry
    describe("PATCH /entry/:entryId", () => {

        it('Should update entry', (done) => {
            Entry
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "New Entry Name"
                    }]
                })
                .then(() => {
                    const newEntry = {
                        "name": name
                    };
                    Entry
                        .create(newEntry)
                        .then((entry) => {
                            const id = entry._id;
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
                                    const url = `/entry/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: "New Entry Name"
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                Entry
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(entry => {
                                                        res.should.have.status(200);
                                                        res.should.be.a('object');
                                                        res.body.message.should.not.be.undefined;
                                                        assert.equal("Success", res.body.message);

                                                        //Validate tolerance-type
                                                        assert.equal("New Entry Name", entry.name);

                                                        Entry
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "New Entry Name"
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

            Entry
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "New Entry Name"
                    }]
                })
                .then(() => {
                    const newEntry = {
                        "name": name
                    };
                    Entry
                        .create(newEntry)
                        .then((entry) => {
                            const id = entry._id;
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
                                    const url = `/entry/${id}`;
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

                                                Entry
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

        it('Should return error if update data exist for another entry', (done) => {
            Entry
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "New Entry Name"
                    }]
                })
                .then(() => {
                    const newEntry = {
                        "name": name
                    };
                    Entry
                        .create(newEntry)
                        .then((entry) => {
                            const id = entry._id;
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
                                    const url = `/entry/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send(newEntry)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                Entry
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(entry => {
                                                        res.should.have.status(400);
                                                        res.should.be.a('object');
                                                        res.body.error.name.should.not.be.undefined;
                                                        assert.equal("Entry already exist", res.body.error.name);

                                                        Entry
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "New Entry Name"
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
                    const url = `/entry/${id}`;
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
                    const url = `/entry/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "entry34"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Entry does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/entry/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: "New Entry Name"
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

    //  Delete entry
    describe("DELETE /entry/:entryId", () => {

        it('Should delete entry', (done) => {
            Entry
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "New Entry Name"
                    }]
                })
                .then(() => {
                    const newEntry = {
                        "name": name
                    };
                    Entry
                        .create(newEntry)
                        .then((entry) => {
                            const id = entry._id;
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
                                        const url = `/entry/${id}`;
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
                                                    Entry.findOne({
                                                        id: id
                                                    })
                                                        .then(deletedEntry => {
                                                            assert.equal(deletedEntry, null);
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
                    const url = `/entry/${id}`;
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
                    const url = `/entry/${id}`;
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
                            assert.equal("Entry does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/entry/${id}`;
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

    //  Get all entries without pagination
    describe("GET /entries", () => {
        it('Should get all entries without pagination', (done) => {
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
                            .get(`/entry/all`)
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    done();
                                }
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .get(`/entry/all`)
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
})