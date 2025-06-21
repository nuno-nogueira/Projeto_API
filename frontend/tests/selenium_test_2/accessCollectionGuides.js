// Selenium script to test the simple login form without fixed ChromeDriver
const { Builder, By } = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");

(async function testCollectionGuide() {
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

        // Fill in credentials as admin
        await driver.findElement(By.id('tin-input')).sendKeys(237890123);
        await driver.findElement(By.id('pass-input')).sendKeys('gru789');
        await driver.findElement(By.className('confirm-login')).click();
        console.log('✅ Login done successfully');

        await driver.sleep(1500);

        // Access Collection Guides
        await driver.get('http://localhost:5173/guide-list');
        console.log('✅ Collection Guides List page loaded successfully');

        // Choose a collection guide
        await driver.findElement(By.xpath('//*[@id="app"]/div[2]/div[1]/table/tbody/tr[1]/td[6]/a/span[3]'));
        console.log('✅ Collection Guide chosen');

    } catch (error) {
        console.error("❌ Erro no teste:", error);
    } finally {
        await driver.quit();
    }
})();