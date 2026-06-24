const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    executablePath: '/snap/bin/chromium', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 800});
  await page.goto('http://localhost:8080', {waitUntil: 'networkidle0', timeout: 30000});
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const vh = window.innerHeight;
    const htmlH = document.documentElement.scrollHeight;
    const footer = document.querySelector('footer');
    const footerBottom = footer ? footer.getBoundingClientRect().bottom + window.scrollY : null;
    
    const all = document.querySelectorAll('*');
    let deepestBottom = 0;
    let deepestEl = null;
    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      const bottom = rect.bottom + window.scrollY;
      if (bottom > deepestBottom && rect.width > 0) {
        deepestBottom = bottom;
        deepestEl = { tag: el.tagName, id: el.id, cls: (el.className || '') + '', bottom: Math.round(bottom), height: Math.round(rect.height) };
      }
    });
    
    const scrollW = document.documentElement.scrollWidth;
    
    return {
      viewportHeight: vh,
      htmlScrollHeight: htmlH,
      footerBottom: footerBottom,
      deepestElement: deepestEl,
      scrollWidth: scrollW
    };
  });

  console.log(JSON.stringify(info));
  
  const heights = [];
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(600);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    heights.push(h);
  }
  console.log('heights:', JSON.stringify(heights));
  
  await browser.close();
})();
