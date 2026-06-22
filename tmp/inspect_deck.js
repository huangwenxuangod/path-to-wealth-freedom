const puppeteer = require('C:/Users/37453/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('=== Loading deck.html ===');
  await page.goto('http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  console.log('=== URL:', page.url());
  
  const inspect = await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    return Array.from(slides).slice(0, 3).map((s, i) => {
      const cs = getComputedStyle(s);
      const r = s.getBoundingClientRect();
      return {
        i, classes: s.className,
        opacity: cs.opacity, transform: cs.transform,
        position: cs.position, width: cs.width, height: cs.height,
        top: cs.top, left: cs.left, zIndex: cs.zIndex,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        firstChildText: s.firstElementChild ? s.firstElementChild.textContent.slice(0, 50) : ''
      };
    });
  });
  console.log('=== Initial state ===');
  console.log(JSON.stringify(inspect, null, 2));
  
  console.log('\n=== Pressing ArrowRight ===');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 1500));
  
  const inspect2 = await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    return Array.from(slides).slice(0, 3).map((s, i) => {
      const cs = getComputedStyle(s);
      return { i, classes: s.className, opacity: cs.opacity, transform: cs.transform, zIndex: cs.zIndex };
    });
  });
  console.log('=== After ArrowRight ===');
  console.log(JSON.stringify(inspect2, null, 2));
  
  await page.screenshot({ path: 'D:/path-to-wealth-freedom/.workbuddy/screenshots/deck-page2-puppeteer.png', fullPage: false });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
