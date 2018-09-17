const request = require('supertest');
const mongoose = require("mongoose");
const User = require("../../models/User");
const app = require('../../app');

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("GET /login", () => {
  test("responds with success code", async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /login", () => {
  test("redirects to root route", async () => {
    await User.create({ email: "pedro@gmail.com", password: "test1234" });
    const response = await request(app)
        .post('/login')
        .type("form")
        .send({ email: "pedro@gmail.com", password: "test1234" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });
})
