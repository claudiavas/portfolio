const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/tmp/mobile_footer.png', fullPage: true });
  console.log('Screenshot saved');
  
  const footer = await page.locator('#footer').boundingBox();
  const footerText = await page.locator('#footer').textContent();
  
  console.log('Footer box:', footer);
  console.log('Footer text:', footerText);
  
  await browser.close();
})();
