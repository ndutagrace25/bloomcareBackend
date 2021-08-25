import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';
const {
    Issue,
    IssueCategory,
    IssueType,
    ToleranceType,
    Score
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

const issueCategoryName = "issue category test name";
const issueTypeName = "Test Issue Type";
const toleranceTypeName = "Test Tolerance Type";
const issueName = "Test issue Name";
const scoreName = "Test Score Name"

describe("Issuecategory", () => {

    //   Create issue-category
    describe("POST /issue-category", () => {

        it('Should save a issue-category', (done) => {
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
                        IssueCategory
                            .deleteMany({
                                "name": issueCategoryName
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
                                                            .then((issue) => {

                                                                chai.request(app)
                                                                    .post("/issue-category")
                                                                    .send({
                                                                        "name": issueCategoryName,
                                                                        "issue": issue._id,
                                                                    })
                                                                    .set('Authorization', 'Bearer ' + accessToken)
                                                                    .end((err, res) => {
                                                                        if (err) {
                                                                            return done(err);
                                                                        } else {
                                                                            IssueCategory
                                                                                .findOne({
                                                                                    "name": issueCategoryName
                                                                                })
                                                                                .then(issueCategory => {
                                                                                    res.should.have.status(200);
                                                                                    res.should.be.a('object');
                                                                                    res.body.message.should.not.be.undefined;
                                                                                    assert.equal("Success", res.body.message);
                                                                                    //Validate issue-category
                                                                                    expect(issueCategory).to.have.property('name');
                                                                                    expect(issueCategory).to.have.property('issue');

                                                                                    issueCategory.name.should.not.be.undefined;
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(() => {
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

        it('Should return error if issue-category exist', (done) => {
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
                        IssueCategory
                            .deleteMany({
                                "name": issueCategoryName
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
                                                            .then((issue) => {
                                                                IssueCategory
                                                                    .create({
                                                                        "name": issueCategoryName,
                                                                        "issue": issue._id,
                                                                    })
                                                                    .then(() => {
                                                                        chai.request(app)
                                                                            .post("/issue-category")
                                                                            .send({
                                                                                "name": issueCategoryName,
                                                                                "issue": issue._id,
                                                                            })
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {
                                                                                    IssueCategory
                                                                                        .findOne({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(issueCategory => {
                                                                                            res.should.have.status(400);
                                                                                            res.should.be.a('object');
                                                                                            res.body.error.issueCategory.should.not.be.undefined;
                                                                                            assert.equal("Issue category already exist", res.body.error.issueCategory);
                                                                                            IssueCategory
                                                                                                .deleteMany({
                                                                                                    "name": issueCategoryName
                                                                                                })
                                                                                                .then(() => {
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
                        chai.request(app)
                            .post("/issue-category")
                            .send({
                                "name": "",
                                "issue": "",
                            })
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    res.should.have.status(400);
                                    res.should.be.a('object');
                                    res.body.error.name.should.not.be.undefined;
                                    res.body.error.issue.should.not.be.undefined;
                                    assert.equal("Name is required", res.body.error.name);
                                    assert.equal("Issue is required", res.body.error.issue);
                                    done();
                                }
                            });
                    }
                })
        }).timeout(20000);

        it('Should return error if invalid issue id are provided', (done) => {
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
                        chai.request(app)
                            .post("/issue-category")
                            .send({
                                "name": issueCategoryName,
                                "issue": "ASDF",
                            })
                            .set('Authorization', 'Bearer ' + accessToken)
                            .end((err, res) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    res.should.have.status(400);
                                    res.should.be.a('object');
                                    res.body.error.issue.should.not.be.undefined;
                                    assert.equal("Invalid issue provided", res.body.error.issue);
                                    done();
                                }
                            });
                    }
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .post(`/issue-category`)
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

    //  List issue-category
    describe("GET /issue-category", () => {

        it('Should get all issue-category', (done) => {
            IssueCategory
                .deleteMany({
                    "name": issueCategoryName
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
                                                .then((issue) => {

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    const saveIssueCategory = [newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory];
                                                    IssueCategory
                                                        .insertMany(saveIssueCategory)
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
                                                                            .get(`/issue-category?page=0&limit=5`)
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
                                                                                    res.body.items[1].issue.should.not.be.undefined;
                                                                                    assert.isAtMost(5, res.body.items.length);
                                                                                    res.body.items[1].issue.should.be.a('object');
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue-category by issue', (done) => {
            IssueCategory
                .deleteMany({
                    "name": issueCategoryName
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
                                                .then((issue) => {
                                                    const issue1 = issue._id;
                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    const saveIssueCategory = [newIssueCategory];
                                                    IssueCategory
                                                        .create(saveIssueCategory)
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
                                                                            .get(`/issue-category?page=0&limit=5&issue=${issue1}`)
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
                                                                                    res.body.items[0].issue.should.not.be.undefined;

                                                                                    res.body.items[0].issue.should.be.a('object');
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should search issue-category by issue category name', (done) => {
            IssueCategory
                .deleteMany({
                    "name": issueCategoryName
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
                                                .then((issue) => {
                                                    const issue1 = issue._id;
                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    const saveIssueCategory = [newIssueCategory];
                                                    IssueCategory
                                                        .create(saveIssueCategory)
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
                                                                            .get(`/issue-category?page=0&limit=5&name=${issueCategoryName}`)
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
                                                                                    res.body.items[0].issue.should.not.be.undefined;

                                                                                    res.body.items[0].issue.should.be.a('object');
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            chai.request(app)
                .get(`/issue-category`)
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

    //  Patch request on issue-category
    describe("PATCH /issue-category/:issueCategoryId", () => {

        it('Should update issueCategory', (done) => {
            IssueCategory
                .deleteMany({
                    $or: [{
                        "name": issueCategoryName
                    }, {
                        "name": "update issue category name"
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

                                            Issue
                                                .create({
                                                    "issue_name": issueName,
                                                    "score": score._id,
                                                    "issue_type": issuetype._id,
                                                    "tolerance_type": tolerancetype._id
                                                })
                                                .then((issue) => {
                                                    const issue1 = issue._id;

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    IssueCategory
                                                        .create(newIssueCategory)
                                                        .then((issueCategory) => {
                                                            const id = issueCategory._id;
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
                                                                        const url = `/issue-category/${id}`;
                                                                        chai.request(app)
                                                                            .patch(url)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .send({
                                                                                name: "update issue category name",
                                                                                issue: issue1,
                                                                            })
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, resUpdate) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {
                                                                                    IssueCategory
                                                                                        .findOne({
                                                                                            "_id": id
                                                                                        })
                                                                                        .then((issueCategory) => {
                                                                                            resUpdate.should.have.status(200);
                                                                                            resUpdate.should.be.a('object');
                                                                                            resUpdate.body.message.should.not.be.undefined;
                                                                                            assert.equal("Success", resUpdate.body.message);
                                                                                            //Validate issue-category
                                                                                            assert.equal("update issue category name", issueCategory.name);
                                                                                            IssueCategory
                                                                                                .deleteMany({
                                                                                                    $or: [{
                                                                                                        "name": issueCategoryName
                                                                                                    }, {
                                                                                                        "name": "update issue category name"
                                                                                                    }]
                                                                                                })
                                                                                                .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if empty fields are provided', (done) => {
            IssueCategory
                .deleteMany({
                    $or: [{
                        "name": issueCategoryName
                    }, {
                        "name": "update issue category name"
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

                                            Issue
                                                .create({
                                                    "issue_name": issueName,
                                                    "score": score._id,
                                                    "issue_type": issuetype._id,
                                                    "tolerance_type": tolerancetype._id
                                                })
                                                .then((issue) => {
                                                    const issue1 = issue._id;

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    IssueCategory
                                                        .create(newIssueCategory)
                                                        .then((issueCategory) => {
                                                            const id = issueCategory._id;
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
                                                                        const url = `/issue-category/${id}`;

                                                                        chai.request(app)
                                                                            .patch(url)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .send({
                                                                                "name": "",
                                                                                "issue": "",
                                                                            })
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, resUpdate) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {

                                                                                    //console.log(resUpdate.body)
                                                                                    resUpdate.should.have.status(400);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.error.name.should.not.be.undefined;
                                                                                    assert.equal("Name is required", resUpdate.body.error.name);
                                                                                    resUpdate.body.error.issue.should.not.be.undefined;
                                                                                    assert.equal("Issue is required", resUpdate.body.error.issue);
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "name": issueCategoryName
                                                                                            }, {
                                                                                                "name": "update issue category name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if details of another issue category are given', (done) => {
            IssueCategory
                .deleteMany({
                    $or: [{
                        "name": issueCategoryName
                    }, {
                        "name": "update issue category name"
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

                                            Issue
                                                .create({
                                                    "issue_name": issueName,
                                                    "score": score._id,
                                                    "issue_type": issuetype._id,
                                                    "tolerance_type": tolerancetype._id
                                                })
                                                .then((issue) => {
                                                    const issue1 = issue._id;

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    IssueCategory
                                                        .create(newIssueCategory)
                                                        .then((issueCategory) => {
                                                            const id = issueCategory._id;
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
                                                                        const url = `/issue-category/${id}`;

                                                                        chai.request(app)
                                                                            .patch(url)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .send(newIssueCategory)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, resUpdate) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {

                                                                                    //console.log(resUpdate.body)
                                                                                    resUpdate.should.have.status(400);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.error.issueCategory.should.not.be.undefined;
                                                                                    assert.equal("Issue category already exist", resUpdate.body.error.issueCategory);
                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "name": issueCategoryName
                                                                                            }, {
                                                                                                "name": "update issue category name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
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
                    const url = `/issue-category/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "tole",
                            issue: "5d3f1179bfe5d81bd82c0f55",
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
                    const url = `/issue-category/${id}`;
                    chai.request(app)
                        .patch(url)
                        .set('Authorization', 'Bearer ' + accessToken)
                        .send({
                            name: "tole",
                            issue: "5d3f1179bfe5d81bd82c0f55",
                        })
                        .end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            res.should.have.status(400);
                            res.should.be.a('object');
                            res.body.error.id.should.not.be.undefined;
                            assert.equal("Issue category does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if invalid ids are provided', (done) => {
            IssueCategory
                .deleteMany({
                    $or: [{
                        "name": issueCategoryName
                    }, {
                        "name": "update issue category name"
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

                                            Issue
                                                .create({
                                                    "issue_name": issueName,
                                                    "score": score._id,
                                                    "issue_type": issuetype._id,
                                                    "tolerance_type": tolerancetype._id
                                                })
                                                .then((issue) => {
                                                    const issue1 = issue._id;

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    IssueCategory
                                                        .create(newIssueCategory)
                                                        .then((issueCategory) => {
                                                            const id = issueCategory._id;
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
                                                                        const url = `/issue-category/${id}`;

                                                                        chai.request(app)
                                                                            .patch(url)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .send({
                                                                                "name": issueCategoryName,
                                                                                "issue": "aSDF",
                                                                            })
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, resUpdate) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {

                                                                                    //console.log(resUpdate.body)
                                                                                    resUpdate.should.have.status(400);
                                                                                    resUpdate.should.be.a('object');
                                                                                    resUpdate.body.error.issue.should.not.be.undefined;
                                                                                    assert.equal("Invalid issue provided", resUpdate.body.error.issue);

                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            $or: [{
                                                                                                "name": issueCategoryName
                                                                                            }, {
                                                                                                "name": "update issue category name"
                                                                                            }]
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "8fb15451d578f906d8eb769c";
            chai.request(app)
            const url = `/issue-category/${id}`;

            chai.request(app)
                .patch(url)
                .send({
                    name: "New Issue category",
                    issue: "8fb15451d578f906d8eb769c"
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

    //  Delete issue-category
    describe("DELETE /issue-category/:issueCategoryId", () => {

        it('Should delete issueCategory', (done) => {
            IssueCategory
                .deleteMany({
                    $or: [{
                        "name": issueCategoryName
                    }, {
                        "name": "update issue category name"
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

                                            Issue
                                                .create({
                                                    "issue_name": issueName,
                                                    "score": score._id,
                                                    "issue_type": issuetype._id,
                                                    "tolerance_type": tolerancetype._id
                                                })
                                                .then((issue) => {
                                                    const issue1 = issue._id;

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    IssueCategory
                                                        .create(newIssueCategory)
                                                        .then((issueCategory) => {
                                                            const id = issueCategory._id;
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
                                                                        const url = `/issue-category/${id}`;

                                                                        chai.request(app)
                                                                            .delete(url)
                                                                            .set('Authorization', 'Bearer ' + accessToken)

                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {

                                                                                    //console.log(resUpdate.body)
                                                                                    res.should.have.status(200);
                                                                                    res.should.be.a('object');
                                                                                    res.body.message.should.not.be.undefined;
                                                                                    assert.equal("Success", res.body.message);

                                                                                    IssueCategory.findOne({
                                                                                            id: id
                                                                                        })
                                                                                        .then(deletedIssueCategory => {
                                                                                            assert.equal(deletedIssueCategory, null);
                                                                                            // done();
                                                                                            IssueCategory
                                                                                                .deleteMany({
                                                                                                    "name": issueCategoryName
                                                                                                })
                                                                                                .then(() => {
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
                    const url = `/issue-category/${id}`;
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
                    const url = `/issue-category/${id}`;
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
                            assert.equal("Issue category does not exist", res.body.error.id);
                            done();
                        })

                })
        }).timeout(20000);

        it('Should return error if personnel is not logged in', (done) => {
            const id = "5d47cf8c4e4ed5312ca5e326";
            chai.request(app)
            const url = `/issue-category/${id}`;
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


    //  List issue category without pagination
    describe("GET /issue-category/all", () => {
        it('Should get all issue-category', (done) => {
            IssueCategory
                .deleteMany({
                    "name": issueCategoryName
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
                                                .then((issue) => {

                                                    const newIssueCategory = {
                                                        "name": issueCategoryName,
                                                        "issue": issue._id,
                                                    };
                                                    const saveIssueCategory = [newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory, newIssueCategory];
                                                    IssueCategory
                                                        .insertMany(saveIssueCategory)
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
                                                                            .get(`/issue-category/all`)
                                                                            .set('Authorization', 'Bearer ' + accessToken)
                                                                            .end((err, res) => {
                                                                                if (err) {
                                                                                    return done(err);
                                                                                } else {
                                                                                    res.should.have.status(200);
                                                                                    res.body.should.be.a('array');

                                                                                    IssueCategory
                                                                                        .deleteMany({
                                                                                            "name": issueCategoryName
                                                                                        })
                                                                                        .then(() => {
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
                })
                .catch(err => {
                    return done(err);
                })
        }).timeout(20000);
    })

});