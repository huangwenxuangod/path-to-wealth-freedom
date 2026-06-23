// 截 deck.html 14 张 1920x1080 PNG，每张对应 PPT 一页
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
  await new Promise(r => setTimeout(r, 2000));

  // 截 14 页（deck 共 14 个 .slide）
  const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log('Total slides:', total);

  for (let i = 1; i <= total; i++) {
    // 用 hash 跳到对应页
    await page.goto(`http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html#/${i}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));  // 等字体 + 渲染稳定

    const file = path.join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, type: 'png', fullPage: false, omitBackground: false });
    console.log(`  page ${i}: ${file}`);
  }

  await browser.close();
  console.log('Done. Images in:', OUT_DIR);
})().catch(e => { console.error(e); process.exit(1); });
