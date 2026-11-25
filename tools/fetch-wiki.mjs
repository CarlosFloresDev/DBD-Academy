// Descarga descripciones e imágenes del wiki oficial (deadbydaylight.wiki.gg) a data/ y public/img/.
// Uso: node tools/fetch-wiki.mjs   (requiere data/raw/datatable.json y data/raw/loadout.json)
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://deadbydaylight.wiki.gg';
const UA = 'Mozilla/5.0 (DBD-Academy fan project; educational)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dt = JSON.parse(fs.readFileSync('data/raw/datatable.json', 'utf8'));
const lo = JSON.parse(fs.readFileSync('data/raw/loadout.json', 'utf8'));

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const unent = (s) => s.replace(/&amp;/g, '&').replace(/&#160;|&nbsp;/g, ' ').replace(/&#37;/g, '%').replace(/&quot;/g, '"').replace(/&#39;|&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function page(title) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${BASE}/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&redirects=1&disablelimitreport=1`, { headers: { 'User-Agent': UA } });
      const j = await r.json();
      if (j.parse) return j.parse.text['*'];
    } catch { /* reintento */ }
    await sleep(800);
  }
  return null;
}
const text = (h) => unent(h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
function firstImg(h, re) {
  for (const m of h.matchAll(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"/g)) {
    if (re.test(unent(m[1]))) return m[2];
  }
  return null;
}
const full = (src) => { const u = src.split('?')[0]; const m = /\/thumb\/(?:[^/]+\/[^/]+\/)?([^/]+)\//.exec(u); return BASE + (m ? '/images/' + m[1] : u); };
async function download(src, dest) {
  if (!src || fs.existsSync(dest)) return !!src;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const r = await fetch(full(src), { headers: { 'User-Agent': UA } });
    if (!r.ok) return false;
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    return true;
  } catch { return false; }
}

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---- Perks ----
const ONLY = (process.env.ONLY || "perks,killers,survivors,maps,realms").split(",");
const old = fs.existsSync("data/raw/perk-desc.json") ? JSON.parse(fs.readFileSync("data/raw/perk-desc.json", "utf8")) : {};
const perkOut = {};
const perkNames = Object.keys(lo.perks);
log('perks', perkNames.length);
let n = 0;
for (const name of ONLY.includes("perks") ? perkNames : []) {
  if (old[name]?.icon) { perkOut[name] = old[name]; continue; }
  const h = await page(name);
  n++;
  if (!h) { log('FALLO perk', name); continue; }
  const t = text(h);
  const a = t.indexOf(' Description ');
  const b = t.indexOf(' Contents ', a);
  const desc = a >= 0 ? t.slice(a + 13, b > a ? b : a + 900).trim() : '';
  const img = firstImg(h, /iconperks/i);
  const ok = await download(img, `public/img/perks/${slug(name)}.png`);
  perkOut[name] = { desc, icon: ok ? `/img/perks/${slug(name)}.png` : null };
  if (n % 25 === 0) log('perks', n);
  await sleep(150);
}
if (ONLY.includes("perks")) fs.writeFileSync('data/raw/perk-desc.json', JSON.stringify(perkOut, null, 1));

// ---- Killers ----
const killerOut = {};
for (const k of ONLY.includes("killers") ? dt.killers : []) {
  const h = await page('The ' + k.name) || await page(k.name);
  if (!h) { log('FALLO killer', k.name); continue; }
  const img = firstImg(h, /Portrait\.png$/);
  const ok = await download(img, `public/img/killers/${slug(k.name)}.png`);
  let powerText = '';
  {
    const t = text(h);
    const i = t.indexOf('Power: ' + (k.power || Object.entries(lo.powers).find(([, v]) => v.killer === k.id)?.[0] || '@@'), t.indexOf('Contents') + 100);
    if (i >= 0) {
      const first = t.indexOf(' [ edit ]', i);
      const second = t.indexOf(' [ edit ]', first + 10);
      let body = t.slice(first + 9, second > 0 ? second : first + 3000);
      const cut = Math.max(body.lastIndexOf('. '), body.lastIndexOf('.”'), body.lastIndexOf('% '));
      if (second > 0 && cut > 200) body = body.slice(0, cut + 1);
      powerText = body.trim().slice(0, 3000);
    }
  }
  killerOut[k.name] = { icon: ok ? `/img/killers/${slug(k.name)}.png` : null, powerText };
  log('killer', k.name, ok);
  await sleep(150);
}
if (ONLY.includes("killers")) fs.writeFileSync('data/raw/killer-extra.json', JSON.stringify(killerOut, null, 1));

// ---- Survivors ----
const survOut = {};
for (const s of ONLY.includes("survivors") ? dt.survivors : []) {
  const h = await page(s.name);
  if (!h) { log('FALLO survivor', s.name); continue; }
  const img = firstImg(h, /Portrait\.png$/);
  const ok = await download(img, `public/img/survivors/${slug(s.name)}.png`);
  survOut[s.name] = { icon: ok ? `/img/survivors/${slug(s.name)}.png` : null };
  log('survivor', s.name, ok);
  await sleep(150);
}
if (ONLY.includes("survivors")) fs.writeFileSync('data/raw/survivor-extra.json', JSON.stringify(survOut, null, 1));

// ---- Mapas ----
const mapOut = {};
for (const m of dt.maps) {
  const h = await page(m.name);
  if (!h) { log('FALLO mapa', m.name); continue; }
  const img = firstImg(h, /Outline\.png$/);
  const ok = await download(img, `public/img/maps/${slug(m.name)}.png`);
  mapOut[m.name] = { icon: ok ? `/img/maps/${slug(m.name)}.png` : null };
  log('mapa', m.name, ok);
  await sleep(150);
}
fs.writeFileSync('data/raw/map-extra.json', JSON.stringify(mapOut, null, 1));

// ---- Realms ----
const realmOut = {};
for (const r of dt.realms) {
  const h = await page(r.name);
  if (!h) { log('FALLO realm', r.name); continue; }
  const img = firstImg(h, /RealmKeyArt/);
  const ok = await download(img, `public/img/realms/${slug(r.name)}.png`);
  realmOut[r.name] = { icon: ok ? `/img/realms/${slug(r.name)}.png` : null };
  log('realm', r.name, ok);
  await sleep(150);
}
fs.writeFileSync('data/raw/realm-extra.json', JSON.stringify(realmOut, null, 1));
log('LISTO');
