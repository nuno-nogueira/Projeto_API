// Selenium script to test the simple login form without fixed ChromeDriver
const { Builder, By } = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");

(async function testUserProfile() {
    console.log("🚀 Teste iniciado");

    let driver = await new Builder()
        .forBrowser('chrome') // Let Selenium manage the driver
        .setChromeOptions(new chrome.Options())
        .build();

    try {
        // Open local page served via Live Server (adjust if needed)
        await driver.get('http://localhost:5173/');

        // Access login page
        await driver.get('http://localhost:5173/login');
        console.log('✅ Login page loaded successfully');

        // Fill in credentials
        await driver.findElement(By.id('tin-input')).sendKeys(251234567);
        await driver.findElement(By.id('pass-input')).sendKeys('maria12345');
        await driver.findElement(By.className('confirm-login')).click();
        console.log('✅ Login done successfully');

        await driver.sleep(2000);

        // Activate door to door service
        await driver.findElement(By.xpath('//*[@id="app"]/div[2]/div[2]/div/div[2]/div/div[2]/div/button')).click();
        console.log('✅ Door to Door service activated');

        // Logout
         await driver.findElement(By.className('logout-button')).click();
         console.log('✅ Logout done');

         console.log('🎉 Test done successfully');
         
    } catch (error) {
        console.error("❌ Erro no teste:", error);
    } finally {
        await driver.quit();
  }
})();