const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get footer info
  const footerBox = await page.locator('#footer').boundingBox();
  const footerComputed = await page.locator('#footer').evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      left: style.left,
      right: style.right,
      width: style.width,
      height: style.height,
      bottom: style.bottom
    };
  });
  
  console.log('Footer boundingBox:', footerBox);
  console.log('Footer computed:', footerComputed);
  
  const windowWidth = await page.evaluate(() => window.innerWidth);
  console.log('Window width:', windowWidth);
  
  // Get arrow
  const arrowBox = await page.locator('.scroll-down-arrow').first().boundingBox();
  console.log('Arrow boundingBox:', arrowBox);
  
  await browser.close();
})();
