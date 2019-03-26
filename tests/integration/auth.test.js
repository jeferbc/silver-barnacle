const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
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
    // slowMo: 40,
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

test("user can register and login", async () => {
  await page.goto("http://localhost:3000/");
  await page.click('a[href="/register"]');
  await page.waitFor('input[id=email]');
  await page.type("input[id=email]", "pedro@gmail.com");
  await page.type("input[id=password]", "test1234");
  const nav = page.waitForNavigation();
  await page.click("button[type=submit]");
  await nav;
  expect(page.url()).toMatch(/login$/);
}, 5000);
