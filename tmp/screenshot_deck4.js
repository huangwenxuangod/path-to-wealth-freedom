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

  // 首次加载，让 runtime.js 启动
  await page.goto('http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));

  // 检查 runtime.js 是否加载（关键）
  const hasRuntime = await page.evaluate(() => typeof go === 'function' || document.querySelectorAll('.slide').length > 0);
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`Initial: slides=${slideCount}, hasGo=${hasRuntime}`);

  for (let i = 1; i <= 14; i++) {
    // 用 evaluate 强制调用 go() 函数（runtime.js 暴露）
    await page.evaluate((idx) => {
      if (typeof go === 'function') {
        go(idx - 1);
      } else {
        // fallback: 手动设置 is-active
        const slides = document.querySelectorAll('.slide');
        slides.forEach((s, j) => {
          s.classList.toggle('is-active', j === idx - 1);
        });
      }
    }, i);
    await new Promise(r => setTimeout(r, 1500));

    const activeIdx = await page.evaluate(() => {
      const slides = document.querySelectorAll('.slide');
      let active = -1;
      slides.forEach((s, idx) => {
        if (s.classList.contains('is-active')) active = idx;
      });
      return active;
    });

    const file = path.join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, type: 'png', fullPage: false });
    const size = fs.statSync(file).size;
    console.log(`page ${i}: active=${activeIdx} (${size} bytes)`);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
