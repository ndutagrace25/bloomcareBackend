import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    IssueType
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

const name = "Test Issue Type";

describe("IssueType", () => {

    //  Create issue-type
    describe("POST /issue-type", () => {
        it('Should save a issue-type', (done) => {
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

                        IssueType
                            .deleteMany({
                                "name": name
                            })
                            .then(() => {
                                chai.request(app)
                                    .post("/issue-type")
                                    .send({
                                        "name": name
                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            IssueType
                                                .findOne({
                                                    "name": name
                                                })
                                                .then(issueType => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);

                                                    //Validate issue-type
                                                    assert.equal(name, issueType.name);

                                                    IssueType
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

        it('Should return error if issue-type exist', (done) => {
            IssueType
                .deleteMany({
                    name: name
                })
                .then(() => {
                    IssueType
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
                                            .post("/issue-type")
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
                                                    assert.equal("Issue type already exist", res.body.error.name);
                                                    IssueType
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
            const newIssueType = {
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
                            .post("/issue-type")
                            .send(newIssueType)
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
                .post(`/issue-type`)
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

    //  List issue-type
    describe("GET /issue-type", () => {
        it('Should get all issue-type', (done) => {
            IssueType
                .deleteMany({
                    "name": name
                })
                .then(() => {

                    const newIssueType = [{
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

                    IssueType
                        .insertMany(newIssueType)
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
                                            .get(`/issue-type?page=0&limit=5`)
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

                                                    IssueType
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

        it('Should search issue-type by name', (done) => {
            IssueType
                .deleteMany({
                    "name": name
                })
                .then(() => {
                    const newIssueType = {
                        "name": name
                    };
                    IssueType
                        .create(newIssueType)
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
                                            .get(`/issue-type?page=0&limit=5&name=${name}`)
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

                                                    IssueType
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
                .get(`/issue-type`)
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

    //  Patch request on issue-type
    describe("PATCH /issue-type/:issueTypeId", () => {
        it('Should update issue-type', (done) => {
            IssueType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update issue type name"
                    }]
                })
                .then(() => {
                    const newIssueType = {
                        "name": name
                    };
                    IssueType
                        .create(newIssueType)
                        .then((issueType) => {
                            const id = issueType._id;
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
                                    const url = `/issue-type/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send({
                                            name: "update issue type name"
                                        })
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                IssueType
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(issueType => {
                                                        // console.log(tolerance-type);
                                                        res.should.have.status(200);
                                                        res.should.be.a('object');
                                                        res.body.message.should.not.be.undefined;
                                                        assert.equal("Success", res.body.message);

                                                        //Validate tolerance-type
                                                        assert.equal("update issue type name", issueType.name);

                                                        IssueType
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "update issue type name"
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
            IssueType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update issue type name"
                    }]
                })
                .then(() => {
                    const newIssueType = {
                        "name": name
                    };
                    IssueType
                        .create(newIssueType)
                        .then((issueType) => {
                            const id = issueType._id;
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
                                    const url = `/issue-type/${id}`;
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

                                                IssueType
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

        it('Should return error if issue-type exist', (done) => {
            IssueType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update issue type name"
                    }]
                })
                .then(() => {
                    const newIssueType = {
                        "name": name
                    };
                    IssueType
                        .create(newIssueType)
                        .then((issueType) => {
                            const id = issueType._id;
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
                                    const url = `/issue-type/${id}`;
                                    chai.request(app)
                                        .patch(url)
                                        .set('Authorization', 'Bearer ' + accessToken)
                                        .send(newIssueType)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            } else {
                                                IssueType
                                                    .findOne({
                                                        "_id": id
                                                    })
                                                    .then(issueType => {
                                                        // console.log(tolerance-type);
                                                        res.should.have.status(400);
                                                        res.should.be.a('object');
                                                        res.body.error.name.should.not.be.undefined;
                                                        assert.equal("Issue type already exist", res.body.error.name);

                                                        IssueType
                                                            .deleteMany({
                                                                $or: [{
                                                                    "name": name
                                                                }, {
                                                                    "name": "New Issue Name"
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
                    const url = `/issue-type/${id}`;
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
            const id = "5d7cf0699f9e4b1c48e1910a";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/issue-type/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "Disease"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            // res.body.error.id.should.not.be.undefined;
                            // assert.equal("Issue Type does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
            const url = `/issue-type/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: "New Issue Name"
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

    //  Delete issue-type
    describe("DELETE /issue-type/:issueTypeId", () => {

        it('Should delete issue-type', (done) => {
            IssueType
                .deleteMany({
                    $or: [{
                        "name": name
                    }, {
                        "name": "update issue type name"
                    }]
                })
                .then(() => {
                    const newIssueType = {
                        "name": name
                    };
                    IssueType
                        .create(newIssueType)
                        .then((issueType) => {
                            const id = issueType._id;
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
                                        const url = `/issue-type/${id}`;
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
                                                    IssueType.findOne({
                                                            id: id
                                                        })
                                                        .then(deletedIssueType => {
                                                            assert.equal(deletedIssueType, null);
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
                    const url = `/issue-type/${id}`;
                    chai.request(app)
                        .delete(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            //console.log(res.body)
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Invalid issueType id", res.body.error.id);
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
                    const url = `/issue-type/${id}`;
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
                            assert.equal("Issue Type does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
            const url = `/tolerance/${id}`;
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

    // List issue-type without pagination
    describe("GET /issue-type/all", () => {
        it('Should get all issue types without pagination', (done) => {
            IssueType
                .deleteMany({
                    "name": name
                })
                .then(() => {

                    const newIssueType = [{
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

                    IssueType
                        .insertMany(newIssueType)
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
                                            .get(`/issue-type/all`)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('array');
                                                    IssueType
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