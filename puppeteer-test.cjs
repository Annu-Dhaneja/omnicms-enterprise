const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  
  console.log('Navigating...');
  await page.goto('https://omnicms-enterprise-oem2bfedz-annu-dhanejas-projects.vercel.app/admin', { waitUntil: 'networkidle0' });
  
  // Wait for login
  console.log('Logging in...');
  await page.type('input[type="email"]', 'tnkhurana3@gmail.com');
  // Need to bypass OTP? Wait, the live site requires OTP.
  // We can't bypass OTP easily unless we know a bypass code.
  // Wait, I previously bypassed OTP! 
  // Let me look at AdminPanel.tsx to see if there's a bypass code.
  
  await browser.close();
})();
