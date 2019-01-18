const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs-extra');

let Credentials, driver;
// get the Chrome driver here: http://chromedriver.storage.googleapis.com/index.html
// them put it on your $PATH.

async function login() {

  // reads credentials from credentials.json file
  try {
    Credentials = await fs.readJson('credentials.json');
  } catch (err) {
    console.error('Credentials file not found, see credentials.sample.json');
    return ;
  }

  /**
   * The login process is as follows:
   * 1) go to the home page
   * 2) click the login button
   * 3) wait until the login form is revealed
   * 4) enter username into the corresponding field
   * 5) enter password into the corresponding field
   * 6) press enter
   * 7) wait until the user's account menu is show
   * 8) fail if it's not show 
   */

  await driver.get('https://letterboxd.com/');

  // the login button has no set class or id. finds it by path and clicks it 
  await driver.findElement(By.css('li.navitem:nth-child(2) > a:nth-child(1)')).click();

  // finds the username and password fields
  const $txt_username = await driver.findElement(By.css('#username'));
  const $txt_password = await driver.findElement(By.css('#password'));

  // waits for form to be visible, then inputs credentials and presses enter
  await driver.wait(until.elementIsVisible($txt_username), 5000);
  await $txt_username.sendKeys(Credentials.username);
  await $txt_password.sendKeys(Credentials.password, Key.RETURN);

  try {
    // waits to see if the user account menu will show 
    // if it doesn't, login has failed for some reason
    return await driver.wait(until.elementLocated(By.css('li.navitem.nav-account')), 12000);
  } catch (err) {
    console.error('Login failed');
    return false;
  }
}

(async function main() {

  driver = await new Builder().forBrowser('chrome').build();
  await login();
  
  try {

  } finally {
    await driver.quit();
  }

})();