import "@babel/polyfill";
import chrome from "selenium-webdriver/chrome";
import { Builder, By, Key, Capabilities } from "selenium-webdriver";
import assert from "assert";
import { path } from "chromedriver";
let driver = null;
// const chromeOptions = new chrome.Options().headless();
const chromeOptions = new chrome.Options();
const URL = "https://glideskyhy.appspot.com";
const webdriver = require('selenium-webdriver');

describe("Selenium", () => {
  beforeEach(async () => {
    driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions).build();
    await driver.get(URL);
    driver.manage().setTimeouts({implicit :10*1000});
  });

  afterEach(async () => {
    await driver.quit();
  });

  it("should render a welcome message on login", async () => {
    // 1. click login menutitle
    console.log("11");
    const loginTitle = await driver.findElement(By.id("currTitle4"));
    console.log("11-1");
    loginTitle.click();
    // 2. input id/pwd
    console.log("22");
    const username = await driver.findElement(By.id("u_name"));
    username.sendKeys("sunghoon");
    console.log("33");
    const password = await driver.findElement(By.id("pass_wd"));
    password.sendKeys("Sunghoon!");
    // 3. click login button
    console.log("44");
    const btn_login = await driver.findElement(By.className("btn-primary active"));
    await btn_login.click();
    // 4. check cookie
    console.log("55");
    const cookie_id = await driver.manage().getCookies("_id");
    assert.notEqual(cookie_id, null);
  });
});
