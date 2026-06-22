const puppeteer = require('C:/Users/37453/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log('Total slides:', total);

  for (let i = 0; i < Math.min(total, 14); i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => s.classList.toggle('is-active', j === idx));
    }, i);
    await new Promise(r => setTimeout(r, 600));
    const padded = String(i + 1).padStart(2, '0');
    const out = `D:/path-to-wealth-freedom/.workbuddy/screenshots/v8-page${padded}.png`;
    await page.screenshot({ path: out, fullPage: false });
    console.log('shot', padded, '→', out);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });