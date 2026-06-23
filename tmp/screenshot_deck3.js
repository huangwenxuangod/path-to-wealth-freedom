const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'D:/path-to-wealth-freedom/.workbuddy/deck-images';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  // 关键修复：每页用 location.hash 跳 + 监听 hashchange + 强制重新加载 runtime.js 状态
  for (let i = 1; i <= 14; i++) {
    await page.goto(`http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html#/${i}`, { waitUntil: 'networkidle0' });
    // 等 runtime.js 把对应 slide 标 is-active + 字体加载
    await new Promise(r => setTimeout(r, 2500));

    // 检查当前 slide 是否 active（双保险）
    const activeIdx = await page.evaluate(() => {
      const slides = document.querySelectorAll('.slide');
      let active = -1;
      slides.forEach((s, idx) => {
        if (s.classList.contains('is-active')) active = idx;
      });
      return active;
    });
    console.log(`page ${i}: active=${activeIdx}`);

    const file = path.join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, type: 'png', fullPage: false });
    const size = fs.statSync(file).size;
    console.log(`  saved ${file} (${size} bytes)`);
  }

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
