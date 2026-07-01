const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  
  console.log('Navigating to http://localhost:3003/admin...');
  await page.goto('http://localhost:3003/admin', { waitUntil: 'domcontentloaded' });
  
  // Login Bypass
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'admin@example.com');
  const requestButton = await page.$('button[type="submit"]');
  await requestButton.click();
  await page.waitForSelector('input[type="text"][placeholder="xxxxxx"]', { visible: true, timeout: 5000 });
  await page.type('input[type="text"][placeholder="xxxxxx"]', '123456');
  const confirmButton = await page.$('button[type="submit"]');
  await confirmButton.click();
  
  // Wait for Dashboard to load
  await page.waitForFunction('document.querySelector("body").innerText.includes("Enterprise CMS Console")');
  console.log('Admin Dashboard loaded.');
  
  // Click on a few tabs to trigger the black screen
  const tabsToClick = ['CRM & Lead Bookings', 'Seeker', 'System Health', 'Content', 'Theme'];
  for (const tabName of tabsToClick) {
    console.log(`Clicking "${tabName}"...`);
    await page.evaluate((name) => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const tab = tabs.find(b => b.innerText.includes(name));
      if (tab) tab.click();
    }, tabName);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const text = await page.evaluate(() => document.body.innerText);
  if (!text || text.trim() === '') {
    console.log('SCREEN IS BLACK (Body is empty)');
  } else {
    console.log('SCREEN IS NOT BLACK. Length:', text.length);
  }
  
  await browser.close();
})();
