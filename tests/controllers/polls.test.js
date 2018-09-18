const request = require('supertest');
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const User = require("../../models/User");
const Poll = require("../../models/Poll");
const app = require('../../app');

request.agent.prototype._saveCookies = function(res) {
  const cookies = res.headers['set-cookie'];
  if (cookies) this.jar.setCookies(cookies[0].split(","));
};

const signIn = async (credentials) => {
  const agent = request.agent(app);
  await agent.post('/login')
      .type("form")
      .send(credentials);

  return agent;
}

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
    await Poll.create({
      name: "Poll 1",
      description: "Description 1",
      options: [
        { text: "Option 1" },
        { text: "Option 2" }
      ]
    });
    await Poll.create({
      name: "Poll 2",
      description: "Description 2",
      options: [
        { text: "Option 1" },
        { text: "Option 2" }
      ]
    });

    const response = await request(app).get('/');

    const $ = cheerio.load(response.text);
    expect($(".poll").length).toBe(2);
  });

  test("doesn't show new poll button if not authenticated", async () => {
    const response = await request(app).get('/');
    const $ = cheerio.load(response.text);
    expect($('a[href="/polls/new"]').length).toBe(0);
  });

  test("shows new poll button if authenticated", async () => {
    const credentials = { email: "pedro@gmail.com", password: "test1234" };
    const user = await User.create(credentials);
    const agent = await signIn(credentials);

    const response = await agent.get('/');
    expect(response.statusCode).toBe(200);

    const $ = cheerio.load(response.text);
    expect($('a[href="/polls/new"]').length).toBe(1);
  });
});

describe("GET /polls/new", () => {
  test("redirects to login if not authenticated", async () => {
    const response = await request(app).get('/polls/new');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/login");
  });

  test("responds with success code if authenticated", async () => {
    const credentials = { email: "pedro@gmail.com", password: "test1234" };
    const user = await User.create(credentials);
    const agent = await signIn(credentials);

    const response = await agent.get("/polls/new");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /polls", async () => {
  test("creates a poll and redirects", async () => {
    const credentials = { email: "pedro@gmail.com", password: "test1234" };
    const user = await User.create(credentials);
    const agent = await signIn(credentials);

    const response = await agent.post("/polls")
        .type("form")
        .send({ name: "Poll 1" })
        .send({ description: "Desc 1" })
        .send({ "options[0][text]": "Option 1" })
        .send({ "options[1][text]": "Option 2" });

    expect(await Poll.countDocuments({})).toBe(1);

    const poll = await Poll.findOne({});
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/polls/${poll._id}/results`);

    expect(poll.name).toBe("Poll 1");
    expect(poll.description).toBe("Desc 1");
    expect(poll.options.length).toBe(2);
  });

  test("shows errors in form", async () => {
    const credentials = { email: "pedro@gmail.com", password: "test1234" };
    const user = await User.create(credentials);
    const agent = await signIn(credentials);

    const response = await agent.post("/polls").type("form");

    expect(response.statusCode).toBe(200);

    const $ = cheerio.load(response.text);
    expect($("#name").hasClass("is-danger")).toBeTruthy();
  });
})
