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

describe("GET /register", () => {
  test("responds with success code", async () => {
    const response = await request(app).get('/register');
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /register", () => {
  test('redirects to login', async () => {
    const response = await request(app).post('/register')
            .send("email=pedro@gmail.com&password=test1234");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/login");
  });
});
