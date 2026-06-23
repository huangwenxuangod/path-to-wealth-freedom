const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'D:/path-to-wealth-freedom/.workbuddy/deck-images';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: path.join(OUT_DIR, 'slide-01.png'), type: 'png', fullPage: false });
  console.log('shot 1');

  for (let i = 2; i <= 14; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`), type: 'png', fullPage: false });
    console.log(`shot ${i}`);
  }

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
