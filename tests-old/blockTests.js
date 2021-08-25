import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    Block
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

const block_name = "Test parent block";
const block_number = "5";
const sub_block_name = "Test sub block name"


describe("Block", () => {

    //  Create block
    describe("POST /block", () => {

        it('Should save a parent block', (done) => {
            //login user

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
                        Block
                            .deleteMany({

                                $or: [{
                                    "name": block_name
                                },
                                {
                                    "name": sub_block_name
                                },
                                {
                                    "number": block_number
                                },
                                ]

                            })
                            .then(() => {
                                const accessToken = res.body.accessToken;
                                chai.request(app)
                                    .post("/block")
                                    .send({
                                        "name": block_name,
                                        "number": block_number,

                                    })
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done();
                                        } else {
                                            Block
                                                .findOne({
                                                    "name": block_name,
                                                    "number": block_number
                                                })
                                                .then(block => {
                                                    res.should.have.status(200);
                                                    res.should.be.a('object');
                                                    res.body.message.should.not.be.undefined;
                                                    assert.equal("Success", res.body.message);
                                                    Block
                                                        .deleteMany({
                                                            "name": block_name,
                                                            "number": block_number
                                                        })
                                                        .then(() => {
                                                            done();
                                                        })
                                                        .catch(err => {
                                                            done(err);
                                                        })
                                                })

                                                .catch(err => {
                                                    done(err);
                                                })
                                        }
                                    });
                            })
                            .catch(err => {
                                done(err);
                            })
                    }
                })
        }).timeout(200000);

        it('Should save a sub block', (done) => {
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
                        Block
                            .deleteMany({
                                $or: [{
                                    "name": block_name
                                },
                                {
                                    "name": sub_block_name
                                },
                                {
                                    "number": block_number
                                },
                                ]
                            })
                            .then(() => {
                                const accessToken = res.body.accessToken;
                                Block
                                    .create({
                                        "name": block_name,
                                        "number": block_number
                                    })
                                    .then(parentBlock => {
                                        chai.request(app)
                                            .post("/block")
                                            .send({
                                                "name": sub_block_name,
                                                "parent": parentBlock._id
                                            })
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done();
                                                } else {
                                                    Block
                                                        .findOne({
                                                            "name": sub_block_name,
                                                            "parent": parentBlock._id
                                                        })
                                                        .then(block => {
                                                            res.should.have.status(200);
                                                            res.should.be.a('object');
                                                            res.body.message.should.not.be.undefined;
                                                            assert.equal("Success", res.body.message);

                                                            Block
                                                                .deleteMany({
                                                                    "name": sub_block_name,
                                                                    "parent": parentBlock._id
                                                                })
                                                                .then(() => {
                                                                    Block
                                                                        .deleteMany({
                                                                            "name": block_name,
                                                                            "number": block_number
                                                                        })
                                                                        .then(() => {
                                                                            done();
                                                                        })
                                                                        .catch(err => {
                                                                            done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    done(err);
                                                                })
                                                        })
                                                        .catch(err => {
                                                            done(err);
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
                    }
                })
        }).timeout(200000);

        it('Should return error if parent block  exist', (done) => {
            const newBlock = {
                "name": block_name,
                "number": block_number
            };
            Block
                .deleteMany({

                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]

                })
                .then(() => {
                    Block
                        .create(newBlock)
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
                                            .post("/block")
                                            .send(newBlock)
                                            .set('Authorization', 'Bearer ' + accessToken)
                                            .end((err, res) => {
                                                if (err) {
                                                    return done();
                                                } else {
                                                    // console.log(res.body)
                                                    res.should.have.status(400);
                                                    res.should.be.a('object');
                                                    res.body.error.block.should.not.be.undefined;
                                                    assert.equal("Block already exist", res.body.error.block);
                                                    Block
                                                        .deleteMany({
                                                            "name": block_name,
                                                            "number": block_number
                                                        })
                                                        .then(() => {
                                                            done();
                                                        })
                                                        .catch(err => {
                                                            done();
                                                        })
                                                }
                                            })
                                    }
                                })
                        })
                        .catch(err => {
                            return done();
                        })

                        .catch(err => {
                            return done();
                        })
                })
                .catch(err => {
                    return done();
                })
        }).timeout(20000);

        it('Should return error if sub block  exist', (done) => {
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
                        Block
                            .deleteMany({

                                $or: [{
                                    "name": block_name
                                },
                                {
                                    "name": sub_block_name
                                },
                                {
                                    "number": block_number
                                },
                                ]

                            })
                            .then(() => {
                                Block
                                    .create({
                                        "name": block_name,
                                        "number": block_number
                                    })
                                    .then(parentBlock => {
                                        Block
                                            .create({
                                                "name": sub_block_name,
                                                "parent": parentBlock._id
                                            })
                                            .then(() => {
                                                chai.request(app)
                                                    .post("/block")
                                                    .send({
                                                        "name": sub_block_name,
                                                        "parent": parentBlock._id
                                                    })
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done();
                                                        } else {
                                                            Block
                                                                .findOne({
                                                                    "name": sub_block_name,
                                                                    "parent": parentBlock._id
                                                                })
                                                                .then(block => {
                                                                    res.should.have.status(400);
                                                                    res.should.be.a('object');
                                                                    res.body.error.block.should.not.be.undefined;
                                                                    assert.equal("Block already exist", res.body.error.block);
                                                                    Block
                                                                        .deleteMany({
                                                                            "name": sub_block_name,
                                                                            "parent": parentBlock._id
                                                                        })
                                                                        .then(() => {
                                                                            Block
                                                                                .deleteMany({
                                                                                    "name": block_name,
                                                                                    "number": block_number
                                                                                })
                                                                                .then(() => {
                                                                                    done();
                                                                                })
                                                                                .catch(err => {
                                                                                    done(err);
                                                                                })
                                                                        })
                                                                        .catch(err => {
                                                                            done(err);
                                                                        })
                                                                })
                                                                .catch(err => {
                                                                    done(err);
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
                    }
                })
        }).timeout(200000);

        it('Should return error if empty name field is  provided', (done) => {
            const newBlock = {
                "name": "",
                "number": ""

            };
            Block
                .deleteMany({

                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]

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
                                    .post("/block")
                                    .send(newBlock)
                                    .set('Authorization', 'Bearer ' + accessToken)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            res.should.have.status(400);
                                            res.should.be.a('object');
                                            res.body.error.name.should.not.be.undefined;
                                            assert.equal("Block name is required", res.body.error.name);
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

        it('Should return error if personnel creating block is not logged in', (done) => {
            chai.request(app)
                .post(`/block`)
                .end((err, res) => {
                    if (err) {
                        return done();
                    } else {
                        res.should.have.status(401);
                        done();
                    }
                })
        }).timeout(20000);
    });

    //  List blocks
    describe("GET /block", () => {

        it('Should get all blocks', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock, newSubBlock, newSubBlock, newSubBlock, newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                    .get(`/block?page=0&limit=5`)
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
                                                            res.body.items[0].number.should.not.be.undefined;
                                                            assert.isAtMost(5, res.body.items.length);
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

        it('Should search block by name', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                    .get(`/block?page=0&limit=5&name=${sub_block_name}`)
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
                                                            res.body.items[0].parent.should.not.be.undefined;
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

        it('Should search block by parent', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                const parent = parentBlock._id;
                                                chai.request(app)
                                                    .get(`/block?page=0&limit=5&parent=${parent}`)
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
                                                            res.body.items[0].parent.should.not.be.undefined;
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

    })

    //  Patch request on block
    describe("PATCH /block/:Id", () => {
        it('Should update a parent', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": "updated block name"
                    },
                    {
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                const id = parentBlock._id;
                                                const url = `/block/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        name: "updated block name",
                                                        number: "60000"
                                                    })
                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            Block
                                                                .findOne({
                                                                    "_id": id
                                                                })
                                                                .then(block => {
                                                                    resUpdate.should.have.status(200);
                                                                    resUpdate.should.be.a('object');
                                                                    resUpdate.body.message.should.not.be.undefined;
                                                                    assert.equal("Success", resUpdate.body.message);
                                                                    assert.equal("updated block name", block.name);
                                                                    assert.equal("60000", block.number);
                                                                    Block
                                                                        .deleteMany({
                                                                            $or: [{
                                                                                "name": "updated block name"
                                                                            },
                                                                            {
                                                                                "name": block_name
                                                                            },
                                                                            {
                                                                                "name": sub_block_name
                                                                            },
                                                                            {
                                                                                "number": block_number
                                                                            },
                                                                            ]
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

        }).timeout(200000);

        it('Should update a sub block', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": "updated  sub block name"
                    },
                    {
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }

                            Block
                                .create(newSubBlock)
                                .then(subblock => {
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
                                                const id = subblock._id
                                                const url = `/block/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        name: "updated  sub block name",
                                                        parent: parentBlock._id
                                                    })
                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            Block
                                                                .findOne({
                                                                    "_id": id
                                                                })
                                                                .then(block => {
                                                                    resUpdate.should.have.status(200);
                                                                    resUpdate.should.be.a('object');
                                                                    resUpdate.body.message.should.not.be.undefined;
                                                                    assert.equal("Success", resUpdate.body.message);
                                                                    assert.equal("updated  sub block name", block.name);
                                                                    Block
                                                                        .deleteMany({
                                                                            $or: [{
                                                                                "name": "updated  sub block name"
                                                                            },
                                                                            {
                                                                                "name": block_name
                                                                            },
                                                                            {
                                                                                "name": sub_block_name
                                                                            },
                                                                            {
                                                                                "number": block_number
                                                                            },
                                                                            ]
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

        }).timeout(200000);

        it('Should not updated a sub block with existing subblock details', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": "updated  sub block name"
                    },
                    {
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }

                            Block
                                .create(newSubBlock)
                                .then(subblock => {
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
                                                const id = subblock._id
                                                const url = `/block/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send(newSubBlock)
                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {

                                                            resUpdate.should.have.status(400);
                                                            resUpdate.should.be.a('object');
                                                            resUpdate.body.error.block.should.not.be.undefined;
                                                            assert.equal("Block already exist", resUpdate.body.error.block);

                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": "updated  sub block name"
                                                                    },
                                                                    {
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

        it('Should not updated a parentblock with existing parent details', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": "updated block name"
                    },
                    {
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                const id = parentBlock._id;
                                                const url = `/block/${id}`;
                                                chai.request(app)
                                                    .patch(url)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .send({
                                                        "name": block_name,
                                                        "number": block_number
                                                    })
                                                    .end((err, resUpdate) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            resUpdate.should.have.status(400);
                                                            resUpdate.should.be.a('object');
                                                            resUpdate.body.error.block.should.not.be.undefined;
                                                            assert.equal("Block already exist", resUpdate.body.error.block);
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": "updated block name"
                                                                    },
                                                                    {
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

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
                    const url = `/block/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: block_name,
                            number: block_number,
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
                    const url = `/block/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: block_name,
                            number: block_number,
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }

                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Block does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/block/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    name: block_name,
                    number: block_number,
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

    //  Delete block
    describe("DELETE /block/:blockId", () => {

        it('Should  delete  parent block with its children', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {

                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock, newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                const id = parentBlock._id;
                                                const url = `/block/${id}`;
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
                                                            assert.equal("Success", res.body.message)
                                                            Block.findOne({
                                                                id: id
                                                            })
                                                                .then(deletedBlock => {
                                                                    assert.equal(deletedBlock, null);
                                                                    done();
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

        }).timeout(200000);

        it('Should  delete a sub block ', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {

                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }

                            Block
                                .create(newSubBlock)
                                .then((subblock) => {
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
                                                const id = subblock._id;
                                                const url = `/block/${id}`;
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
                                                            assert.equal("Success", res.body.message)
                                                            Block.findOne({
                                                                id: id
                                                            })
                                                                .then(deletedBlock => {
                                                                    assert.equal(deletedBlock, null);
                                                                    Block
                                                                        .deleteMany({
                                                                            "name": block_name
                                                                        })
                                                                        .then(() => {
                                                                            done();
                                                                        })
                                                                        .catch(err => {
                                                                            return done(err);
                                                                        });

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

        }).timeout(200000);

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
                    const url = `/block/${id}`;
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
                    const url = `/block/${id}`;
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
                            assert.equal("Block does not exist", res.body.error.id);
                            done();
                        })

                })

        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/block/${id}`;
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

    //  List blocks parent block
    describe("GET /block/parent-block", () => {

        it('Should get all parent blocks', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                    .get(`/block/parent-block`)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            console.log(res.body)
                                                            res.should.have.status(200);
                                                            res.body.should.be.a('array');
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);

    })

    //  List all  blocks wthout pagination
    describe("GET /block/all", () => {
        it('Should get all blocks', (done) => {
            Block
                .deleteMany({
                    $or: [{
                        "name": block_name
                    },
                    {
                        "name": sub_block_name
                    },
                    {
                        "number": block_number
                    },
                    ]
                })
                .then(() => {
                    Block
                        .create({
                            "name": block_name,
                            "number": block_number
                        })
                        .then(parentBlock => {
                            const newSubBlock = {
                                "name": sub_block_name,
                                "parent": parentBlock._id
                            }
                            const saveSubBlock = [newSubBlock, newSubBlock, newSubBlock, newSubBlock, newSubBlock]
                            Block
                                .create(saveSubBlock)
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
                                                    .get(`/block/all`)
                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                    .end((err, res) => {
                                                        if (err) {
                                                            return done(err);
                                                        } else {
                                                            console.log(res.body)
                                                            res.should.have.status(200);
                                                            res.body.should.be.a('array');
                                                            Block
                                                                .deleteMany({
                                                                    $or: [{
                                                                        "name": block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "name": sub_block_name
                                                                    },
                                                                    {
                                                                        "number": block_number
                                                                    },
                                                                    ]
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

        }).timeout(200000);
    })
})