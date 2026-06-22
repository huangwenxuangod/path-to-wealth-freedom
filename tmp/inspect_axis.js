const puppeteer = require('C:/Users/37453/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // 跳到 page 6
  await page.evaluate(() => {
    document.querySelectorAll('.slide').forEach((s, j) => s.classList.toggle('is-active', j === 5));
  });
  await new Promise(r => setTimeout(r, 600));

  const inspect = await page.evaluate(() => {
    const axis = document.querySelector('.matrix-axis');
    const axisMid = document.querySelector('.matrix-axis .ax-mid');
    const axisBottom = document.querySelector('.matrix-axis-bottom');
    const matrix = document.querySelector('.matrix');
    const fmt = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, position: cs.position, transform: cs.transform });
    };
    return {
      matrix: fmt(matrix),
      axis: fmt(axis),
      axisMid: fmt(axisMid),
      axisBottom: fmt(axisBottom),
      axisInner: axis ? axis.innerHTML : null,
    };
  });
  console.log(JSON.stringify(inspect, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });