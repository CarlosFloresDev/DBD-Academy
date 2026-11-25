// Genera capturas y fotogramas para el README (docs/media). Requiere playwright-core en D:\DevTools\pw y Edge.
// Uso: node tools/capture.mjs [urlBase]
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire('D:/DevTools/pw/package.json');
const { chromium } = require('playwright-core');
const BASE = process.argv[2] || 'https://dbd-academy.pages.dev';
const out = 'docs/media';
fs.mkdirSync(`${out}/frames-reloj`, { recursive: true });
fs.mkdirSync(`${out}/frames-killers`, { recursive: true });
fs.mkdirSync(`${out}/frames-home`, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);

async function shot(path, name, { full = false, scrollY = 0, clip } = {}) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await wait(1200);
  if (scrollY) { await page.evaluate((y) => window.scrollTo(0, y), scrollY); await wait(900); }
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full, clip });
}

await shot('/', 'home');
await shot('/', 'home-terrifier', { scrollY: 850 });
await shot('/killers/', 'killers', { scrollY: 380 });
await shot('/killers/nurse/', 'killer-nurse');
await shot('/killers/terrifier/', 'killer-terrifier', { scrollY: 0 });
await shot('/mapas/', 'mapas', { scrollY: 300 });
await shot('/builds/', 'builds', { scrollY: 700 });
await shot('/competitivo/', 'competitivo', { scrollY: 600 });
await shot('/reloj/', 'reloj', { scrollY: 760 });

// ---- GIF reloj: 1 a 4 survivors y patadas ----
await page.goto(BASE + '/reloj/', { waitUntil: 'networkidle' });
await wait(1000);
await page.evaluate(() => window.scrollTo(0, 760));
await wait(900);
let n = 0;
const frame = async (dir) => { await page.screenshot({ path: `${out}/${dir}/f${String(n++).padStart(3, '0')}.png` }); };
const clickBtn = async (text, idx = 0) => {
  await page.evaluate(([t, i]) => [...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === t)[i].click(), [text, idx]);
  await wait(450);
};
for (const s of ['1', '2', '3', '4']) { await clickBtn(s, 0); await frame('frames-reloj'); await frame('frames-reloj'); }
await clickBtn('2', 0);
for (const k of ['1', '3', '5']) { await clickBtn(k, k === '5' ? 0 : 1); await frame('frames-reloj'); await frame('frames-reloj'); }
await clickBtn('4', 0);
await clickBtn('0', 0);
await frame('frames-reloj');
await clickBtn('x10', 0);
await clickBtn('Iniciar', 0);
for (let i = 0; i < 10; i++) { await wait(380); await frame('frames-reloj'); }

// ---- GIF killers: filtros ----
n = 0;
await page.goto(BASE + '/killers/', { waitUntil: 'networkidle' });
await wait(900);
await page.evaluate(() => window.scrollTo(0, 340));
await wait(700);
await frame('frames-killers');
for (const t of ['S', 'A', 'B', 'C', 'D', 'Sin tier', 'Todos']) {
  await page.evaluate((x) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === x)?.click(), t);
  await wait(650);
  await frame('frames-killers'); await frame('frames-killers');
}

// ---- GIF home: scroll suave ----
n = 0;
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await wait(1500);
for (let y = 0; y <= 2600; y += 130) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await wait(160);
  await frame('frames-home');
}
await browser.close();
console.log('listo');
