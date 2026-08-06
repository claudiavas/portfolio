const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('=== BEFORE SCROLL ===');
  let footerBox = await page.locator('#footer').boundingBox();
  let arrowBox = await page.locator('.scroll-down-arrow').first().boundingBox();
  console.log('Footer:', footerBox);
  console.log('Arrow:', arrowBox);
  
  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  
  console.log('\n=== AFTER SCROLL DOWN ===');
  footerBox = await page.locator('#footer').boundingBox();
  arrowBox = await page.locator('.scroll-down-arrow').first().boundingBox();
  console.log('Footer:', footerBox);
  console.log('Arrow:', arrowBox);
  
  // Get footer computed styles
  const footerStyles = await page.locator('#footer').evaluate(el => {
    const style = window.getComputedStyle(el);
    return { width: style.width, height: style.height };
  });
  console.log('Footer computed:', footerStyles);
  
  await browser.close();
})();
