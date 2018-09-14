const request = require('supertest');
const cheerio = require('cheerio')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Survey = require("../../models/Survey");
const app = require('../../app');

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /', () => {
  test('responds with success code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test("shows existing polls", async () => {
    await User.create({ email: "pedro@gmail.com", password: "test1234" });
    await Survey.create({
      name: "Poll 1",
      description: "Description 1",
      options: [
        { text: "Option 1" },
        { text: "Option 2" }
      ]
    });
    await Survey.create({
      name: "Poll 2",
      description: "Description 2",
      options: [
        { text: "Option 1" },
        { text: "Option 2" }
      ]
    });

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);
    expect($(".survey").length).toBe(2);
  });

  test("doesn't show new survey button if not authenticated", async () => {
    const response = await request(app).get('/');
    const $ = cheerio.load(response.text);
    expect($('a[href="/surveys/new"]').length).toBe(0);
  });

  test("shows new survey button if authenticated", async () => {
    const user = await User.create({ email: "pedro@gmail.com", password: "test1234" });
    const token = jwt.sign({ userId: user._id }, "secretcode");
    const response = await request(app)
      .get('/')
      .set("Cookie", [`token=${token}`]);

    const $ = cheerio.load(response.text);
    expect($('a[href="/surveys/new"]').length).toBe(1);
  });
});

describe("GET /surveys/new", () => {
  test("redirects to login if not authenticated", async () => {
    const response = await request(app).get('/surveys/new');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/login");
  });

  test("responds with success code if authenticated", async () => {
    const user = await User.create({ email: "pedro@gmail.com", password: "test1234" });
    const token = jwt.sign({ userId: user._id }, "secretcode");
    const response = await request(app)
        .get("/surveys/new")
        .set("Cookie", [`token=${token}`]);
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /surveys", async () => {
  test("creates a survey and redirects", async () => {
    const user = await User.create({ email: "pedro@gmail.com", password: "test1234" });
    const token = jwt.sign({ userId: user._id }, "secretcode");
    const response = await request(app)
        .post("/surveys")
        .type("form")
        .set("Cookie", [`token=${token}`])
        .send({ name: "Poll 1" })
        .send({ description: "Desc 1" })
        .send({ "options[0][text]": "Option 1" })
        .send({ "options[1][text]": "Option 2" });

    expect(await Survey.countDocuments({})).toBe(1);

    const poll = await Survey.findOne({});
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/surveys/${poll._id}/results`);

    expect(poll.name).toBe("Poll 1");
    expect(poll.description).toBe("Desc 1");
    expect(poll.options.length).toBe(2);
  });

  test("shows errors in form", async () => {
    const user = await User.create({ email: "pedro@gmail.com", password: "test1234" });
    const token = jwt.sign({ userId: user._id }, "secretcode");
    const response = await request(app)
        .post("/surveys")
        .type("form")
        .set("Cookie", [`token=${token}`]);

    expect(response.statusCode).toBe(200);

    const $ = cheerio.load(response.text);
    expect($("#name").hasClass("is-danger")).toBeTruthy();
  });
})
