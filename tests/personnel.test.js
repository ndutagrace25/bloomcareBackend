const app = require('../server');
const request = require('supertest');

const {
    Personnel,
    PersonnelType
} = require('../models');

const {
    userPhone,
    userPassword
} = require("./config");

const first_name = "Mary";
const last_name = "kawira";
const phone = "0700000000";
const password = "123456";
const newPhone = "0700112233"
const status = 1;


describe("Personnel", () => {

    //  login
    describe("POST /personnel/login", () => {


        test("Should login a personnel", async () => {

            const res = await request(app)
                .post('/personnel/login')
                .send({
                    'phone': '0700000000',
                    'password': '123456'
                });
            expect(res.statusCode).toEqual(200);
        })

        test("Should not login a personnel if wrong password is given", async () => {

            const res = await request(app)
                .post('/personnel/login')
                .send({
                    'phone': '0700000000',
                    'password': '123455'
                });
            // console.log(res.body);
            expect(res.statusCode).toEqual(400);
        })
    });

    //  Reset password
    describe("PATCH /personnel/reset_password", () => {

        test("Should reset  a personnel password", async () => {

            await Personnel
                .update({
                    reset_password: 1
                }, {
                    where: {
                        phone: phone
                    }
                })
                .then(async () => {
                    const res = await request(app)
                        .patch('/personnel/reset_password')
                        .send({
                            phone: phone,
                            password: password
                        });

                    expect(res.statusCode).toEqual(200);
                    //expect(res.body).toHaveProperty('reset_password');
                })
        })
    });

    describe("POST /personnel/", () => {


    });



});
