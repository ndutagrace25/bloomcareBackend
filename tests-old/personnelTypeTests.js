import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const {
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


describe("GET /personnel-type", () => {
    it('Should get all personneltype', (done) => {
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
                        .get(`/personnel-type`)
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