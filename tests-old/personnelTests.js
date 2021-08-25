import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    Personnel,
    PersonnelType
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

const first_name = "Mary";
const last_name = "kawira";
const newPhone = "0726149351";
const status = "1";

describe("Personnel", () => {
    //  login
    describe("POST /personnel/login", () => {
        it("Should login a personnel", (done) => {

            Personnel.updateOne({
                    phone: userPhone
                }, {
                    reset_password: 0
                })
                .then(() => {
                    chai.request(app)
                        .post('/personnel/login')
                        .send({
                            'phone': userPhone,
                            'password': userPassword
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.accessToken.should.not.be.undefined;
                            res.body.expires_in.should.not.be.undefined;
                            done();
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

        it("Should return invalid phone number", (done) => {
            chai.request(app)
                .post('/personnel/login')
                .type('form')
                .send({
                    'phone': '07261493513333',
                    'password': userPassword
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    assert.equal('Phone does not exist', res.body.error.phone);
                    done();
                });
        }).timeout(15000);

        it("Should return error if passwords do not match", (done) => {
            const phone = userPhone;
            Personnel.updateOne({
                    phone: userPhone
                }, {
                    reset_password: 0
                })
                .then(() => {
                    chai.request(app)
                        .post('/personnel/login')
                        .type('form')
                        .send({
                            'phone': userPhone,
                            'password': '12345'
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.error.password.should.not.be.undefined;
                            assert.equal('You have entered an incorrect password', res.body.error.password);

                            Personnel.updateOne({
                                phone: userPhone
                            }, {
                                reset_password: 1
                            })
                            done();
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

        it("Should return error if password needs to be reset", (done) => {
            const phone = userPhone;
            Personnel.updateOne({
                    phone: userPhone
                }, {
                    reset_password: 1
                })
                .then(() => {
                    chai.request(app)
                        .post('/personnel/login')
                        .type('form')
                        .send({
                            'phone': userPhone,
                            'password': '12345'
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.error.password.should.not.be.undefined;
                            assert.equal('Please reset your password', res.body.error.password);

                            Personnel.findOneAndUpdate({
                                    phone: phone
                                }, {
                                    $set: {
                                        reset_password: 0
                                    }
                                }, {
                                    new: true,
                                    useFindAndModify: false
                                })
                                .then(() => {
                                    done();
                                })
                                .catch(err => {
                                    return done(err);
                                })
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

        it("Should return error if phone or password are not provided", (done) => {
            chai.request(app)
                .post('/personnel/login')
                .type('form')
                .send({
                    'phone': '',
                    'password': ''
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(400);
                    const errors = res.body.error;
                    errors.should.be.a('object');
                    errors.phone.should.not.be.undefined;
                    errors.password.should.not.be.undefined;
                    assert.equal('Phone field is required', errors.phone);
                    assert.equal('Password field is required', errors.password);
                    done();
                });
        }).timeout(15000);
    });

    //   Reset password
    describe("POST /personnel/reset_password", () => {
        it("Should return error if phone and password are not provided", (done) => {
            chai.request(app)
                .patch('/personnel/reset_password')
                .type('form')
                .send({
                    'phone': '',
                    'password': ''
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(400);
                    const errors = res.body.error;
                    errors.should.be.a('object');
                    errors.phone.should.not.be.undefined;
                    errors.password.should.not.be.undefined;
                    assert.equal('Phone field is required', errors.phone);
                    assert.equal('Password field is required', errors.password);
                    done();
                });
        }).timeout(15000);

        it("Should return error if personnel does not have permission to change password", (done) => {
            Personnel.updateOne({
                    phone: userPhone
                }, {
                    reset_password: 0
                })
                .then(() => {
                    chai.request(app)
                        .patch('/personnel/reset_password')
                        .type('form')
                        .send({
                            'phone': userPhone,
                            'password': userPassword
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.error.password.should.not.be.undefined;
                            assert.equal('Please request an admin permission to reset your password', res.body.error.password);
                            Personnel.updateOne({
                                phone: userPhone
                            }, {
                                reset_password: 0
                            });
                            done();
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

        it("Should return an error if the phone number does not exist", (done) => {
            Personnel.updateOne({
                    phone: userPhone
                }, {
                    reset_password: 1
                })
                .then(() => {
                    chai.request(app)
                        .patch('/personnel/reset_password')
                        .type('form')
                        .send({
                            'phone': '077262622',
                            'password': userPassword
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.error.phone.should.not.be.undefined;
                            assert.equal('Phone number does not exist', res.body.error.phone);
                            Personnel.updateOne({
                                phone: userPhone
                            }, {
                                reset_password: 0
                            });

                            done();
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

        it("Should change a user's password", (done) => {
            Personnel
                .updateOne({
                    phone: userPhone
                }, {
                    reset_password: 1
                })
                .then(() => {
                    chai.request(app)
                        .patch('/personnel/reset_password')
                        .type('form')
                        .send({
                            'phone': userPhone,
                            'password': userPassword
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(200);
                            done();
                        });
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(15000);

    });

    //  Create personnel
    describe("POST /personnel", () => {
        it('Should save a personnel', (done) => {
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

                        Personnel
                            .deleteMany({
                                "phone": newPhone
                            })
                            .then(() => {
                                PersonnelType
                                    .findOne()
                                    .then((personnelType) => {
                                        chai.request(app)
                                            .post("/personnel")
                                            .send({
                                                "first_name": first_name,
                                                "last_name": last_name,
                                                "phone": newPhone,
                                                "status": status,
                                                "personnel_type_id": personnelType._id,
                                            })
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    Personnel
                                                        .findOne({
                                                            "phone": newPhone
                                                        })
                                                        .then(personnel => {

                                                            res.should.have.status(200);
                                                            res.should.be.a('object');
                                                            res.body.message.should.not.be.undefined;
                                                            assert.equal("Success", res.body.message);

                                                            //Validate personnel
                                                            assert.equal(first_name, personnel.first_name);
                                                            assert.equal(last_name, personnel.last_name);
                                                            assert.equal(newPhone, personnel.phone);
                                                            assert.equal(status, personnel.status);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if personnel exist', (done) => {
            PersonnelType
                .findOne()
                .then((personnelType) => {
                    const newPersonnel = {
                        "first_name": first_name,
                        "last_name": last_name,
                        "phone": newPhone,
                        "status": status,
                        "personnel_type_id": personnelType._id,
                    };

                    Personnel
                        .create(newPersonnel)
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
                                            .post("/personnel")
                                            .send(newPersonnel)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done(err);
                                                } else {
                                                    res.should.have.status(400);
                                                    res.should.be.a('object');
                                                    res.body.error.phone.should.not.be.undefined;
                                                    assert.equal("Phone already exist", res.body.error.phone);
                                                    Personnel
                                                        .deleteMany({
                                                            "phone": newPhone
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
            const newPersonnel = {
                "first_name": "",
                "last_name": "",
                "phone": "",
                "status": "",
                "personnel_type_id": "",
            };

            Personnel
                .deleteMany({
                    "phone": newPhone
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
                                return done();
                            } else {
                                const accessToken = res.body.accessToken;
                                chai.request(app)
                                    .post("/personnel")
                                    .send(newPersonnel)
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            res.should.have.status(400);
                                            res.should.be.a('object');
                                            res.body.error.first_name.should.not.be.undefined;
                                            res.body.error.last_name.should.not.be.undefined;
                                            res.body.error.phone.should.not.be.undefined;
                                            res.body.error.status.should.not.be.undefined;
                                            res.body.error.personnel_type_id.should.not.be.undefined;
                                            assert.equal("First name is required", res.body.error.first_name);
                                            assert.equal("Last name is required", res.body.error.last_name);
                                            assert.equal("Phone is required", res.body.error.phone);
                                            assert.equal("Status is required", res.body.error.status);
                                            assert.equal("Personnel type is required", res.body.error.personnel_type_id);
                                            done();
                                        }
                                    })
                            }
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/personnel`)
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

    // Get request on personnel
    describe("GET /personnel", () => {
        it('Should get all personnel', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const newPersonnel = [{
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }, {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }, {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }, {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }, {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }, {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            }];

                            Personnel
                                .insertMany(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5`)
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
                                                            res.body.items[1].first_name.should.not.be.undefined;
                                                            res.body.items[1].last_name.should.not.be.undefined;
                                                            res.body.items[1].phone.should.not.be.undefined;
                                                            res.body.items[1].status.should.not.be.undefined;
                                                            res.body.items[1].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[1]).to.not.have.property('password');
                                                            assert.isAtMost(5, res.body.items.length);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should search personnel by first name', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            };

                            Personnel
                                .create(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5&first_name=${first_name}`)
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
                                                            res.body.items[0].first_name.should.not.be.undefined;
                                                            res.body.items[0].last_name.should.not.be.undefined;
                                                            res.body.items[0].phone.should.not.be.undefined;
                                                            res.body.items[0].status.should.not.be.undefined;
                                                            res.body.items[0].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[0]).to.not.have.property('password');
                                                            assert.equal(first_name, res.body.items[0].first_name);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should search personnel by last name', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            };

                            Personnel
                                .create(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5&last_name=${last_name}`)
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
                                                            res.body.items[0].first_name.should.not.be.undefined;
                                                            res.body.items[0].last_name.should.not.be.undefined;
                                                            res.body.items[0].phone.should.not.be.undefined;
                                                            res.body.items[0].status.should.not.be.undefined;
                                                            res.body.items[0].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[0]).to.not.have.property('password');
                                                            assert.equal(last_name, res.body.items[0].last_name);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should search personnel by phone', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            };

                            Personnel
                                .create(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5&phone=${newPhone}`)
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
                                                            res.body.items[0].first_name.should.not.be.undefined;
                                                            res.body.items[0].last_name.should.not.be.undefined;
                                                            res.body.items[0].phone.should.not.be.undefined;
                                                            res.body.items[0].status.should.not.be.undefined;
                                                            res.body.items[0].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[0]).to.not.have.property('password');
                                                            assert.equal(newPhone, res.body.items[0].phone);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should search personnel by status', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnelType._id,
                            };

                            Personnel
                                .create(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5&status=${status}`)
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
                                                            res.body.items[1].first_name.should.not.be.undefined;
                                                            res.body.items[1].last_name.should.not.be.undefined;
                                                            res.body.items[1].phone.should.not.be.undefined;
                                                            res.body.items[1].status.should.not.be.undefined;
                                                            res.body.items[1].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[1]).to.not.have.property('password');
                                                            assert.equal(status, res.body.items[1].status);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should search personnel by personnel type', (done) => {
            Personnel
                .deleteMany({
                    "phone": newPhone,
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const personnel_type_id = personnelType._id;
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnel_type_id,
                            };

                            Personnel
                                .create(newPersonnel)
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
                                                    .get(`/personnel?page=0&limit=5&personnel_type_id=${personnel_type_id}`)
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
                                                            res.body.items[0].first_name.should.not.be.undefined;
                                                            res.body.items[0].last_name.should.not.be.undefined;
                                                            res.body.items[0].phone.should.not.be.undefined;
                                                            res.body.items[0].status.should.not.be.undefined;
                                                            res.body.items[0].personnel_type_id.should.not.be.undefined;
                                                            expect(res.body.items[0]).to.not.have.property('password');
                                                            assert.equal(personnel_type_id, res.body.items[0].personnel_type_id);

                                                            Personnel
                                                                .deleteMany({
                                                                    "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                });
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .get(`/personnel`)
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

    // Patch request on personnel
    describe("PATCH /personnel/:personnelId", () => {

        it('Should update personnel', (done) => {
            Personnel
                .deleteMany({
                    $or: [{
                        "phone": newPhone,
                    }, {
                        phone: "0722222222"
                    }]
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const personnel_type_id = personnelType._id;
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnel_type_id,
                            };
                            Personnel
                                .create(newPersonnel)
                                .then((personnel) => {
                                    const id = personnel._id;
                                    chai.request(app)
                                        .post('/personnel/login')
                                        .send({
                                            phone: userPhone,
                                            password: userPassword
                                        })
                                        .end((err, res) => {
                                            const accessToken = res.body.accessToken;
                                            const url = `/personnel/${id}`;
                                            chai.request(app)
                                                .patch(url)
                                                .set('Authorization', 'Bearer ' + accessToken)
                                                .send({
                                                    first_name: "Martin",
                                                    last_name: "Njoroge",
                                                    phone: "0722222222",
                                                    status: "2",
                                                    personnel_type_id: personnel_type_id,
                                                })
                                                .end((err, resUpdate) => {
                                                    if (err) {
                                                        return done(err);
                                                    } else {
                                                        Personnel
                                                            .findOne({
                                                                "_id": id
                                                            })
                                                            .then(personnel => {
                                                                // console.log(personnel);
                                                                resUpdate.should.have.status(200);
                                                                resUpdate.should.be.a('object');
                                                                resUpdate.body.message.should.not.be.undefined;
                                                                assert.equal("Success", resUpdate.body.message);

                                                                //Validate personnel
                                                                assert.equal("Martin", personnel.first_name);
                                                                assert.equal("Njoroge", personnel.last_name);
                                                                assert.equal("0722222222", personnel.phone);
                                                                assert.equal("2", personnel.status);

                                                                Personnel
                                                                    .deleteMany({
                                                                        $or: [{
                                                                            "phone": newPhone
                                                                        }, {
                                                                            "phone": "0722222222"
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if empty fields are provided', (done) => {
            Personnel
                .deleteMany({
                    $or: [{
                        "phone": newPhone,
                    }, {
                        phone: "0722222222"
                    }]
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const personnel_type_id = personnelType._id;
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnel_type_id,
                            };
                            Personnel
                                .create(newPersonnel)
                                .then((personnel) => {
                                    const id = personnel._id;
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
                                            const url = `/personnel/${id}`;
                                            chai.request(app)
                                                .patch(url)
                                                .set('Authorization', 'Bearer ' + accessToken)
                                                .send({
                                                    first_name: "",
                                                    last_name: "",
                                                    phone: "",
                                                    status: "",
                                                    personnel_type_id: "",
                                                })
                                                .end((err, res) => {
                                                    if (err) {
                                                        return done();
                                                    } else {
                                                        Personnel
                                                            .findOne({
                                                                "_id": id
                                                            })
                                                            .then(personnel => {
                                                                // console.log(personnel);
                                                                res.should.have.status(400);
                                                                res.should.be.a('object');
                                                                res.body.error.first_name.should.not.be.undefined;
                                                                res.body.error.last_name.should.not.be.undefined;
                                                                res.body.error.phone.should.not.be.undefined;
                                                                res.body.error.status.should.not.be.undefined;
                                                                res.body.error.personnel_type_id.should.not.be.undefined;
                                                                assert.equal("First name is required", res.body.error.first_name);
                                                                assert.equal("Last name is required", res.body.error.last_name);
                                                                assert.equal("Phone is required", res.body.error.phone);
                                                                assert.equal("Status is required", res.body.error.status);
                                                                assert.equal("Personnel type is required", res.body.error.personnel_type_id);

                                                                Personnel
                                                                    .deleteMany({
                                                                        "phone": newPhone
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel details exist', (done) => {
            Personnel
                .deleteMany({
                    $or: [{
                        "phone": newPhone,
                    }, {
                        phone: "0722222222"
                    }]
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const personnel_type_id = personnelType._id;
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnel_type_id,
                            };
                            Personnel
                                .create(newPersonnel)
                                .then((personnel) => {
                                    const id = personnel._id;
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
                                            const url = `/personnel/${id}`;
                                            chai.request(app)
                                                .patch(url)
                                                .set('Authorization', 'Bearer ' + accessToken)
                                                .send(newPersonnel)
                                                .end((err, res) => {
                                                    if (err) {
                                                        return done();
                                                    } else {
                                                        Personnel
                                                            .findOne({
                                                                "_id": id
                                                            })
                                                            .then(personnel => {
                                                                // console.log(personnel);
                                                                res.should.have.status(400);
                                                                res.should.be.a('object');
                                                                res.body.error.phone.should.not.be.undefined;
                                                                assert.equal("Phone already exist", res.body.error.phone);

                                                                Personnel
                                                                    .deleteMany({
                                                                        $or: [{
                                                                            "phone": newPhone,
                                                                        }, {
                                                                            phone: "0722222222"
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
                    const url = `/personnel/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            first_name: "Martin",
                            last_name: "Njoroge",
                            phone: "0722222222",
                            status: "2",
                            personnel_type_id: "9"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
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
                    const url = `/personnel/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            first_name: "Martin",
                            last_name: "Njoroge",
                            phone: "0722222222",
                            status: "2",
                            personnel_type_id: "8fb15451d578f906d8eb769c"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Personnel does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel type id is invalid', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/personnel/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            first_name: "Martin",
                            last_name: "Njoroge",
                            phone: "0722222222",
                            status: "2",
                            personnel_type_id: "3"
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.personnel_type_id.should.not.be.undefined;
                            assert.equal("Invalid personnel type provided", res.body.error.personnel_type_id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/personnel`)
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

    //  Delete personnel
    describe("DELETE /personnel/:personnelId", () => {
        it('Should delete personnel', (done) => {
            Personnel
                .deleteMany({
                    $or: [{
                        "phone": newPhone,
                    }, {
                        phone: "0722222222"
                    }]
                })
                .then(() => {
                    PersonnelType
                        .findOne()
                        .then((personnelType) => {
                            const personnel_type_id = personnelType._id;
                            const newPersonnel = {
                                "first_name": first_name,
                                "last_name": last_name,
                                "phone": newPhone,
                                "status": status,
                                "personnel_type_id": personnel_type_id,
                            };
                            Personnel
                                .create(newPersonnel)
                                .then((personnel) => {
                                    const id = personnel._id;
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
                                                const url = `/personnel/${id}`;
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
                                                            Personnel.findOne({
                                                                    id: id
                                                                })
                                                                .then(deletedPersonnel => {
                                                                    assert.equal(deletedPersonnel, null);
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
                    const url = `/personnel/${id}`;
                    chai.request(app)
                        .delete(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
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
                    const url = `/personnel/${id}`;
                    chai.request(app)
                        .delete(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            // console.log(res.body);
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Personnel does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/personnel`)
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

    //  Get Scouts
    describe("GET /personnel/scouts", () => {

        it('Should return all scouts', (done) => {

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
                            .get(`/personnel/scouts`)
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

    });

});