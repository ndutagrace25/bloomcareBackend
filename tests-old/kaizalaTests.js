// import chai from 'chai';
// import chaiHttp from 'chai-http';

// import app from '../server';
// const {
//     Scout
// } = require('../models');

// // Configure chai
// chai.use(chaiHttp);
// chai.should();
// const expect = chai.expect;
// let assert = chai.assert;


// describe("Scout", () => {

//     //   Create bed
//     describe("POST /scout", () => {

//         it('Should create a scout', (done) => {
//             const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNGJmNDZiMjYzMjk1MTcwNDg2MmEwZiIsImZpcnN0X25hbWUiOiJBZG1pbiIsImxhc3RfbmFtZSI6IkFkbWluIiwicGhvbmUiOiIwNzAwMDAwMDAwIiwic3RhdHVzIjoxLCJpYXQiOjE1NjU3OTc2NDMsImV4cCI6MTU2NTg4NDA0M30.AYXhUCkMU9rWPVVhBn7CANE66t7NU5vpUJf9_36uqhg";
//             const attributes = {
//                 "date": new Date(),
//                 "plant": "5d4bf46d2632951704862a15",
//                 "entry": "5d4bf46d2632951704862a15",
//                 "point": "5d4bf46d2632951704862a12",
//                 "issue": "5d4c0b17f45a442ae02ac86b",
//                 "issueCategory": "5d4d3b912950a90930269362",
//                 "value": "5",
//                 "block": "5d50182b8dd94830b06471d0",
//                 "bed": "5d5018858dd94830b06471d3",
//                 "flower": "5d4bf46d2632951704862a15",
//                 "longitude": "0.0223319",
//                 "latitude": "37.0722295"
//             };

//             chai.request(app)
//                 .post("/scout")
//                 .send(attributes)
//                 .set('Authorization', 'Bearer ' + accessToken)
//                 .end((err, res) => {
//                     console.log(res.body);
//                     if (err) {
//                         return done(err);
//                     } else {
//                         res.should.have.status(200);
//                         res.should.be.a('object');
//                         res.body.message.should.not.be.undefined;
//                         assert.equal("Success", res.body.message);
//                         Scout
//                             .deleteMany(attributes)
//                             .then(() => {
//                                 done();
//                             })
//                             .catch(err => {
//                                 return done(err);
//                             })
//                     }
//                 });
//         }).timeout(20000);

//     });

// });