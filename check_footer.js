const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get footer before scroll
  const footerBoxBefore = await page.locator('#footer').boundingBox();
  console.log('Footer BEFORE scroll:', footerBoxBefore);
  
  // Scroll
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  
  // Get footer after scroll
  const footerBoxAfter = await page.locator('#footer').boundingBox();
  console.log('Footer AFTER scroll:', footerBoxAfter);
  
  // Get footer content alignment
  const footerContent = await page.locator('#footer .container').boundingBox();
  console.log('Footer container:', footerContent);
  
  await browser.close();
})();
