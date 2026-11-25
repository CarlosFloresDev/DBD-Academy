// Completa iconos de perks faltantes (via Module:Datatable/Icons) y baja fotos de mapas del wiki oficial.
// Uso: node tools/fetch-icons.mjs
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://deadbydaylight.wiki.gg';
const UA = 'Mozilla/5.0 (DBD-Academy fan project; educational)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const perks = JSON.parse(fs.readFileSync('src/data/perks.json', 'utf8'));
const maps = JSON.parse(fs.readFileSync('src/data/maps.json', 'utf8'));
const lua = fs.readFileSync('data/raw/Datatable_Icons.lua', 'utf8');

async function save(file, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const r = await fetch(`${BASE}/images/${encodeURIComponent(file.replace(/ /g, "_"))}`, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) return false;
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  return true;
}

// ---- perks ----
let ok = 0, fail = [];
for (const p of perks.filter((x) => !x.icon)) {
  const esc = p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`\\["${esc}"\\]\\s*=\\s*\\{iconFile\\s*=\\s*"([^"]+)"`).exec(lua);
  if (!m) { fail.push(p.name); continue; }
  if (await save(m[1], `public/img/perks/${slug(p.name)}.png`)) ok++; else fail.push(p.name);
  await sleep(120);
}
console.log('perks iconos nuevos', ok, 'fallidos', fail);

// ---- fotos de mapas ----
const photos = {};
for (const m of maps) {
  const r = await fetch(`${BASE}/api.php?action=query&titles=${encodeURIComponent(m.name)}&prop=images&imlimit=100&redirects=1&format=json`, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const page = Object.values(j.query.pages)[0];
  const files = (page.images || []).map((i) => i.title.replace(/^File:/, ''));
  const cands = files.filter((f) => /\.(jpe?g|png)$/i.test(f) && !/^(Icon|Ach|Status|Quotes|T UI|DailyRitual|CategoryIcon|Map|AltMap|Realm|Outline)/i.test(f) && !/Outline|Icon|Ach|Quote|Favor|Tote/i.test(f));
  photos[m.slug] = cands;
  await sleep(120);
}
fs.writeFileSync('data/raw/map-photo-candidates.json', JSON.stringify(photos, null, 1));
console.log('mapas con candidatas', Object.values(photos).filter((a) => a.length).length, '/', maps.length);
