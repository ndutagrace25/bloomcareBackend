import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    IssueType,
    Issue,
    Score,
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

const issueTypeName = "Test Issue Type";
const toleranceTypeName = "Test Tolerance Type";
const issueName = "Test issue Name";
const scoreName = "Test Score Name"

describe("Issue", () => {

    //  Create issue
    describe("POST /issue", () => {
        it('Should save a issue', (done) => {
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
                        Issue
                            .deleteMany({
                                "issue_name": issueName
                            })
                            .then(() => {
                                IssueType
                                    .create({
                                        "name": issueTypeName,
                                    })
                                    .then((issuetype) => {
                                        ToleranceType
                                            .create({
                                                name: toleranceTypeName,
                                            })
                                            .then((tolerancetype) => {

                                                Score
                                                    .create({
                                                        "name": scoreName
                                                    })
                                                    .then((score) => {
                                                        chai.request(app)
                                                            .post("/issue")
                                                            .send({
                                                                "issue_name": issueName,
                                                                "score": score._id,
                                                                "issue_type": issuetype._id,
                                                                "tolerance_type": tolerancetype._id
                                                            })
                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                            .end((err, res) => {
                                                                if (err) {
                                                                    return done(err);
                                                                } else {
                                                                    Issue
                                                                        .findOne({
                                                                            "issue_name": issueName
                                                                        })
                                                                        .then(issue => {
                                                                            res.should.have.status(200);
                                                                            res.should.be.a('object');
                                                                            res.body.message.should.not.be.undefined;
                                                                            assert.equal("Success", res.body.message);
                                                                            //Validate issue
                                                                            expect(issue).to.have.property('issue_name');
                                                                            expect(issue).to.have.property('issue_type');
                                                                            expect(issue).to.have.property('tolerance_type');
                                                                            expect(issue).to.have.property('score');
                                                                            assert.equal(issueName, issue.issue_name);
                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                                                                                })
                                                                                .catch(err => {
                                                                                    return done(err);
                                                                                })
                                                                            //done();
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
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000);

        it('Should return error if issue exist', (done) => {
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
                        Issue
                            .deleteMany({
                                "issue_name": issueName
                            })
                            .then(() => {
                                IssueType
                                    .create({
                                        "name": issueTypeName,
                                    })
                                    .then((issuetype) => {
                                        ToleranceType
                                            .create({
                                                name: toleranceTypeName,
                                            })
                                            .then((tolerancetype) => {

                                                Score
                                                    .create({
                                                        "name": scoreName
                                                    })
                                                    .then((score) => {
                                                        Issue
                                                            .create({
                                                                "issue_name": issueName,
                                                                "score": score._id,
                                                                "issue_type": issuetype._id,
                                                                "tolerance_type": tolerancetype._id
                                                            })
                                                            .then(() => {
                                                                chai.request(app)
                                                                    .post("/issue")
                                                                    .send({
                                                                        "issue_name": issueName,
                                                                        "score": score._id,
                                                                        "issue_type": issuetype._id,
                                                                        "tolerance_type": tolerancetype._id
                                                                    })
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            Issue
                                                                                .findOne({
                                                                                    "issue_name": issueName
                                                                                })
                                                                                .then(issue => {
                                                                                    res.should.have.status(400);
                                                                                    res.should.be.a('object');
                                                                                    res.body.error.issue.should.not.be.undefined;
                                                                                    assert.equal("Issue already exist", res.body.error.issue);
                                                                                    Issue
                                                                                        .deleteMany({
                                                                                            issue_name: issueName
                                                                                        })
                                                                                        .then(() => {
                                                                                            Score
                                                                                                .deleteMany({
                                                                                                    name: scoreName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    ToleranceType
                                                                                                        .deleteMany({
                                                                                                            name: toleranceTypeName,
                                                                                                        })
                                                                                                        .then(() => {
                                                                                                            IssueType
                                                                                                                .deleteMany({
                                                                                                                    name: issueTypeName
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
                                                                                        })
                                                                                        .catch(err => {
                                                                                            return done(err);
                                                                                        })
                                                                                    //done();
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
                        Issue
                            .deleteMany({
                                "issue_name": issueName
                            })
                            .then(() => {
                                IssueType
                                    .create({
                                        "name": issueTypeName,
                                    })
                                    .then((issuetype) => {
                                        ToleranceType
                                            .create({
                                                name: toleranceTypeName,
                                            })
                                            .then((tolerancetype) => {

                                                Score
                                                    .create({
                                                        "name": scoreName
                                                    })
                                                    .then((score) => {
                                                        chai.request(app)
                                                            .post("/issue")
                                                            .send({
                                                                "issue_name": "",
                                                                "score": "",
                                                                "issue_type": "",
                                                                "tolerance_type": ""
                                                            })
                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                            .end((err, res) => {
                                                                if (err) {
                                                                    return done(err);
                                                                } else {
                                                                    Issue
                                                                        .findOne({
                                                                            "issue_name": issueName
                                                                        })
                                                                        .then(issue => {
                                                                            res.should.have.status(400);
                                                                            res.should.be.a('object');
                                                                            res.body.error.issue_name.should.not.be.undefined;
                                                                            res.body.error.issue_type.should.not.be.undefined;
                                                                            res.body.error.tolerance_type.should.not.be.undefined;
                                                                            res.body.error.score.should.not.be.undefined;
                                                                            assert.equal("Issue name is required", res.body.error.issue_name);
                                                                            assert.equal("Issue type is required", res.body.error.issue_type);
                                                                            assert.equal("Tolerance type is required", res.body.error.tolerance_type);
                                                                            assert.equal("Score is required", res.body.error.score);

                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                                                                                })
                                                                                .catch(err => {
                                                                                    return done(err);
                                                                                })
                                                                            //done();
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
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                })
        }).timeout(20000)

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/issue`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        res.should.have.status(401);
                        done();
                    }
                })
        }).timeout(20000)

    });

    //  List issues
    describe("GET /issue", () => {

        it('Should get all issue', (done) => {
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            const saveIssue = [newIssue, newIssue, newIssue, newIssue, newIssue];
                                            Issue
                                                .insertMany(saveIssue)
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
                                                                    .get(`/issue?page=0&limit=5`)
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
                                                                            res.body.items[1].issue_name.should.not.be.undefined;
                                                                            res.body.items[1].issue_type.should.not.be.undefined;
                                                                            res.body.items[1].tolerance_type.should.not.be.undefined;
                                                                            res.body.items[1].issue_type.should.be.a('object');
                                                                            res.body.items[1].tolerance_type.should.be.a('object');

                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue by issue name', (done) => {
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            Issue
                                                .create(newIssue)
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
                                                                    .get(`/issue?page=0&limit=5&issue_name=${issueName}`)
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
                                                                            res.body.items[0].issue_name.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.not.be.undefined;
                                                                            res.body.items[0].tolerance_type.should.not.be.undefined;
                                                                            res.body.items[0].score.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.be.a('object');
                                                                            res.body.items[0].tolerance_type.should.be.a('object');
                                                                            res.body.items[0].score.should.be.a('object');
                                                                            assert.equal(issueName, res.body.items[0].issue_name);
                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue by issue type', (done) => {
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            Issue
                                                .create(newIssue)
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
                                                                    .get(`/issue?page=0&limit=5&issue_type=${issuetype._id}`)
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
                                                                            res.body.items[0].issue_name.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.not.be.undefined;
                                                                            res.body.items[0].tolerance_type.should.not.be.undefined;
                                                                            res.body.items[0].score.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.be.a('object');
                                                                            res.body.items[0].tolerance_type.should.be.a('object');
                                                                            res.body.items[0].score.should.be.a('object');
                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            Issue
                                                .create(newIssue)
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
                                                                    .get(`/issue?page=0&limit=5&tolerance_type=${tolerancetype._id}`)
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
                                                                            res.body.items[0].issue_name.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.not.be.undefined;
                                                                            res.body.items[0].tolerance_type.should.not.be.undefined;
                                                                            res.body.items[0].score.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.be.a('object');
                                                                            res.body.items[0].tolerance_type.should.be.a('object');
                                                                            res.body.items[0].score.should.be.a('object');
                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue by score', (done) => {
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            Issue
                                                .create(newIssue)
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
                                                                    .get(`/issue?page=0&limit=5&score=${score._id}`)
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
                                                                            res.body.items[0].issue_name.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.not.be.undefined;
                                                                            res.body.items[0].tolerance_type.should.not.be.undefined;
                                                                            res.body.items[0].score.should.not.be.undefined;
                                                                            res.body.items[0].issue_type.should.be.a('object');
                                                                            res.body.items[0].tolerance_type.should.be.a('object');
                                                                            res.body.items[0].score.should.be.a('object');
                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                .get(`/issue`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        res.should.have.status(401);
                        done();
                    }
                })
        }).timeout(20000);
    })

    // Update issue
    describe("PATCH /issue/:issueId", () => {

        it('Should update issue', (done) => {
            Issue
                .deleteMany({
                    $or: [{
                        "issue_name": issueName
                    }, {
                        "issue_name": "update issue name"
                    }]
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            const newIssue = {
                                                "issue_name": issueName,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id,
                                                "score": score._id
                                            };
                                            Issue
                                                .create(newIssue)
                                                .then((issue) => {
                                                    const id = issue._id;
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
                                                                const url = `/issue/${id}`;
                                                                chai.request(app)
                                                                    .patch(url)
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .send({
                                                                        "issue_name": "update issue name",
                                                                        "issue_type": "5d7cf2369f9e4b1c48e1911c",
                                                                        "tolerance_type": "5d7cf2049f9e4b1c48e19119",
                                                                        "score": score._id
                                                                    })
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, resUpdate) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            Issue
                                                                                .findOne({
                                                                                    "_id": id
                                                                                })
                                                                                .then((issue) => {
                                                                                    resUpdate.should.have.status(200);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.message.should.not.be.undefined;
                                                                                    assert.equal("Success", resUpdate.body.message);
                                                                                    //Validate issue-category
                                                                                    assert.equal("update issue name", issue.issue_name);
                                                                                    Issue
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "issue_name": issueName
                                                                                            }, {
                                                                                                "issue_name": "update issue name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
                                                                                            Score
                                                                                                .deleteMany({
                                                                                                    name: scoreName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    ToleranceType
                                                                                                        .deleteMany({
                                                                                                            name: toleranceTypeName,
                                                                                                        })
                                                                                                        .then(() => {
                                                                                                            IssueType
                                                                                                                .deleteMany({
                                                                                                                    name: issueTypeName
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
                                                                                        })
                                                                                        .catch(err => {
                                                                                            return done(err);
                                                                                        })
                                                                                    //done();
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
            Issue
                .deleteMany({
                    $or: [{
                        "issue_name": issueName
                    }, {
                        "issue_name": "update issue name"
                    }]
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            const newIssue = {
                                                "issue_name": issueName,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id,
                                                "score": score._id
                                            };
                                            Issue
                                                .create(newIssue)
                                                .then((issue) => {
                                                    const id = issue._id;
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
                                                                const url = `/issue/${id}`;
                                                                chai.request(app)
                                                                    .patch(url)
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .send({
                                                                        "issue_name": "",
                                                                        "issue_type": "",
                                                                        "tolerance_type": "",
                                                                        "score": ""
                                                                    })
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, resUpdate) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            Issue
                                                                                .findOne({
                                                                                    "_id": id
                                                                                })
                                                                                .then((issue) => {
                                                                                    resUpdate.should.have.status(400);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.error.issue_name.should.not.be.undefined;
                                                                                    resUpdate.body.error.issue_type.should.not.be.undefined;
                                                                                    resUpdate.body.error.tolerance_type.should.not.be.undefined;
                                                                                    resUpdate.body.error.score.should.not.be.undefined;
                                                                                    assert.equal("Issue name is required", resUpdate.body.error.issue_name);
                                                                                    assert.equal("Issue type is required", resUpdate.body.error.issue_type);
                                                                                    assert.equal("Tolerance type is required", resUpdate.body.error.tolerance_type);
                                                                                    assert.equal("Score is required", resUpdate.body.error.score);
                                                                                    Issue
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "issue_name": issueName
                                                                                            }, {
                                                                                                "issue_name": "update issue name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
                                                                                            Score
                                                                                                .deleteMany({
                                                                                                    name: scoreName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    ToleranceType
                                                                                                        .deleteMany({
                                                                                                            name: toleranceTypeName,
                                                                                                        })
                                                                                                        .then(() => {
                                                                                                            IssueType
                                                                                                                .deleteMany({
                                                                                                                    name: issueTypeName
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
                                                                                        })
                                                                                        .catch(err => {
                                                                                            return done(err);
                                                                                        })
                                                                                    //done();
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
            Issue
                .deleteMany({
                    $or: [{
                        "issue_name": issueName
                    }, {
                        "issue_name": "update issue name"
                    }]
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            const newIssue = {
                                                "issue_name": issueName,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id,
                                                "score": score._id
                                            };
                                            Issue
                                                .create(newIssue)
                                                .then((issue) => {
                                                    const id = issue._id;
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
                                                                const url = `/issue/${id}`;
                                                                chai.request(app)
                                                                    .patch(url)
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .send(newIssue)
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, resUpdate) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            Issue
                                                                                .findOne({
                                                                                    "_id": id
                                                                                })
                                                                                .then((issue) => {
                                                                                    resUpdate.should.have.status(400);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.error.issue.should.not.be.undefined;
                                                                                    assert.equal("Issue already exist", resUpdate.body.error.issue);
                                                                                    Issue
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "issue_name": issueName
                                                                                            }, {
                                                                                                "issue_name": "update issue name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
                                                                                            Score
                                                                                                .deleteMany({
                                                                                                    name: scoreName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    ToleranceType
                                                                                                        .deleteMany({
                                                                                                            name: toleranceTypeName,
                                                                                                        })
                                                                                                        .then(() => {
                                                                                                            IssueType
                                                                                                                .deleteMany({
                                                                                                                    name: issueTypeName
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
                                                                                        })
                                                                                        .catch(err => {
                                                                                            return done(err);
                                                                                        })
                                                                                    //done();
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
                    const url = `/issue/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            "issue_name": "update issue name",
                            "issue_type": "8fb15451d578f906d8eb769c",
                            "tolerance_type": "8fb15451d578f906d8eb769c",
                            "score": "8fb15451d578f906d8eb769c"
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

        it('Should return error if issue id does not exist', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
                .post('/personnel/login')
                .send({
                    phone: userPhone,
                    password: userPassword
                })
                .end((err, res) => {
                    const accessToken = res.body.accessToken;
                    const url = `/issue/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            issue_name: "caterp",
                            issue_type: "8fb15451d578f906d8eb769c",
                            tolerance_type: "8fb15451d578f906d8eb769c",
                            score: "8fb15451d578f906d8eb769c",
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Issue does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
            const url = `/tolerance/${id}`;
            chai.request(app)
                .patch(url)
                .send({
                    issue_name: "caterp",
                    issue_type: "8fb15451d578f906d8eb769c",
                    tolerance_type: "8fb15451d578f906d8eb769c",
                    score: "8fb15451d578f906d8eb769c",
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

    //  Delete issue
    describe("DELETE /issue/:issueId", () => {

        it('Should delete issue', (done) => {
            Issue
                .deleteMany({
                    $or: [{
                        "name": issueName
                    }, {
                        "name": "update issue name"
                    }]
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            };
                                            Issue
                                                .create(newIssue)
                                                .then((issue) => {
                                                    const id = issue._id;
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
                                                                const url = `/issue/${id}`;

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

                                                                            Issue.findOne({
                                                                                    id: id
                                                                                })
                                                                                .then(deletedIssue => {
                                                                                    assert.equal(deletedIssue, null);
                                                                                    Issue
                                                                                        .deleteMany({
                                                                                            issue_name: issueName
                                                                                        })
                                                                                        .then(() => {
                                                                                            Score
                                                                                                .deleteMany({
                                                                                                    name: scoreName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    ToleranceType
                                                                                                        .deleteMany({
                                                                                                            name: toleranceTypeName,
                                                                                                        })
                                                                                                        .then(() => {
                                                                                                            IssueType
                                                                                                                .deleteMany({
                                                                                                                    name: issueTypeName
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
                    const url = `/issue/${id}`;
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
                    const url = `/issue/${id}`;
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
                            assert.equal("Issue does not exist", res.body.error.id);
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

    })

    //  List issue  without pagination
    describe("GET /issue/all", () => {

        it('Should get all issue', (done) => {
            Issue
                .deleteMany({
                    "issue_name": issueName
                })
                .then(() => {
                    IssueType
                        .create({
                            "name": issueTypeName,
                        })
                        .then((issuetype) => {
                            ToleranceType
                                .create({
                                    name: toleranceTypeName,
                                })
                                .then((tolerancetype) => {

                                    Score
                                        .create({
                                            "name": scoreName
                                        })
                                        .then((score) => {

                                            Issue
                                            const newIssue = {
                                                "issue_name": issueName,
                                                "score": score._id,
                                                "issue_type": issuetype._id,
                                                "tolerance_type": tolerancetype._id
                                            }
                                            const saveIssue = [newIssue, newIssue, newIssue, newIssue, newIssue];
                                            Issue
                                                .insertMany(saveIssue)
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
                                                                    .get(`/issue/all`)
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            res.should.have.status(200);
                                                                            res.body.should.be.a('array');

                                                                            Issue
                                                                                .deleteMany({
                                                                                    issue_name: issueName
                                                                                })
                                                                                .then(() => {
                                                                                    Score
                                                                                        .deleteMany({
                                                                                            name: scoreName,
                                                                                        })
                                                                                        .then(() => {
                                                                                            ToleranceType
                                                                                                .deleteMany({
                                                                                                    name: toleranceTypeName,
                                                                                                })
                                                                                                .then(() => {
                                                                                                    IssueType
                                                                                                        .deleteMany({
                                                                                                            name: issueTypeName
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
                        })
                        .catch(err => {
                            return done(err);
                        })
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);
    })
})