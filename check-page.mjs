import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ 
  headless: 'new', 
  executablePath: '/snap/bin/chromium', 
  args: ['--no-sandbox', '--disable-setuid-sandbox'] 
});
const page = await browser.newPage();
await page.setViewport({width: 1280, height: 800});

// Capture console messages
const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => consoleMsgs.push('ERROR: ' + err.message));

await page.goto('http://localhost:8080', {waitUntil: 'networkidle0', timeout: 30000});
await new Promise(r => setTimeout(r, 3000));

// Check what's actually on screen
const visCheck = await page.evaluate(() => {
  const preloader = document.getElementById('preloader');
  return {
    preloaderHidden: preloader ? preloader.classList.contains('hidden') : 'not-found',
    preloaderDisplay: preloader ? preloader.style.display : 'not-found',
    bodyChildCount: document.body.children.length,
    sections: Array.from(document.querySelectorAll('section')).map(s => s.id || s.className.slice(0,40)),
    bodyOverflowY: getComputedStyle(document.body).overflowY,
    htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
    bodyHeight: getComputedStyle(document.body).height,
    htmlHeight: getComputedStyle(document.documentElement).height,
    bodyScrollHeight: document.body.scrollHeight,
    htmlScrollHeight: document.documentElement.scrollHeight,
  };
});

console.log('VISUAL CHECK:', JSON.stringify(visCheck, null, 2));
console.log('CONSOLE ERRORS:', JSON.stringify(consoleMsgs, null, 2));

await page.screenshot({path: '/tmp/csmun-page.png', fullPage: true});
console.log('Screenshot saved to /tmp/csmun-page.png');

// Check individual section sizes
const sectionSizes = await page.evaluate(() => {
  const sections = document.querySelectorAll('section, footer');
  return Array.from(sections).map(s => ({
    tag: s.tagName,
    id: s.id,
    cls: (s.className || '').slice(0,40),
    rect: (() => {
      const r = s.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height, width: r.width };
    })(),
    position: getComputedStyle(s).position,
    display: getComputedStyle(s).display,
    visibility: getComputedStyle(s).visibility,
  }));
});
console.log('SECTION SIZES:');
sectionSizes.forEach(s => console.log(JSON.stringify(s)));

await browser.close();
