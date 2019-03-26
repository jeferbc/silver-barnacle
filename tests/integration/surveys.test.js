const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Poll = require("../../models/Poll");
const app = require("../../app");

let server;
let page;
let browser;
const width = 1920;
const height = 1080;
beforeAll(async () => {
  server = app.listen(3000);

  browser = await puppeteer.launch({
    headless: true,
    // slowMo: 80,
    args: [`--window-size=${width},${height}`, '–no-sandbox', '–disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
  browser.close();
});

test("should list polls and vote", async () => {
  await Poll.create({
    name: "Poll 1",
    description: "Description 1",
    options: [
      { text: "Option 1" },
      { text: "Option 2" }
    ]
  });

  await page.goto("http://localhost:3000/");
  let nav = page.waitForNavigation();
  await page.click(".poll a");
  await nav;

  await page.click("input[type=radio]");
  nav = page.waitForNavigation();
  await page.click("button[type=submit]");
  await nav;

  const spans = await page.$$(".options .option .option-label span");
  const s1 = await page.evaluate(span => span.innerText, spans[0]);
  expect(s1).toBe("1 votes");

  const s2 = await page.evaluate(span => span.innerText, spans[1]);
  expect(s2).toBe("0 votes");
})
