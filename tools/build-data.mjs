// Une los JSON crudos del wiki (data/raw) con las notas competitivas y escribe src/data/*.json.
// Uso: node tools/build-data.mjs
import fs from 'node:fs';

const raw = (f) => JSON.parse(fs.readFileSync(`data/raw/${f}`, 'utf8'));
const dt = raw('datatable.json');
const lo = raw('loadout.json');
const perkDesc = fs.existsSync('data/raw/perk-desc.json') ? raw('perk-desc.json') : {};
const killerExtra = fs.existsSync('data/raw/killer-extra.json') ? raw('killer-extra.json') : {};
const survExtra = fs.existsSync('data/raw/survivor-extra.json') ? raw('survivor-extra.json') : {};
const mapExtra = fs.existsSync('data/raw/map-extra.json') ? raw('map-extra.json') : {};
const realmExtra = fs.existsSync('data/raw/realm-extra.json') ? raw('realm-extra.json') : {};
const tiers = JSON.parse(fs.readFileSync('data/comp-tiers.json', 'utf8'));

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = (s) => (typeof s === 'string' ? s.replace(/<br>/g, ', ').replace(/\[\[|\]\]/g, '').trim() : s);
const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dlcById = Object.fromEntries(dt.dlcs.map((d) => [d.id, d]));
const realmById = Object.fromEntries(dt.realms.map((r) => [r.id, r]));
const iconIf = (p) => (p && fs.existsSync('public' + p) ? p : null);

// ---- Perks ----
const perks = [];
for (const [name, p] of Object.entries(lo.perks)) {
  const dlcNum = null;
  perks.push({
    slug: slug(name),
    name,
    side: p.charType === 'K' ? 'killer' : 'survivor',
    ownerId: p.character ?? null,
    values: p.values ?? [],
    tags: p.tags ?? [],
    patch: p.patch ?? null,
    desc: (perkDesc[name]?.desc ?? '').split(' History [ edit ]')[0].trim(),
    icon: iconIf('/img/perks/' + slug(name) + '.png'),
  });
}
const perkNames = new Set(perks.map((p) => p.name));

// ---- Killers ----
const killerById = Object.fromEntries(dt.killers.map((k) => [k.id, k]));
const survivorById = Object.fromEntries(dt.survivors.map((s) => [s.id, s]));
const speedMs = (k) => (Array.isArray(k.speed) ? k.speed[0] : k.speed);
const killers = dt.killers.map((k) => {
  const powerName = k.power || Object.entries(lo.powers).find(([, v]) => v.killer === k.id)?.[0] || null;
  const power = powerName ? lo.powers[powerName] : null;
  const t = tiers.killers[k.name] ?? null;
  const dlc = arr(k.dlc)[0] != null ? dlcById[arr(k.dlc)[0]] : null;
  const radiusList = Array.isArray(k.radius) ? k.radius : [[k.radius, null]];
  return {
    slug: slug(k.name),
    id: k.id,
    name: k.name,
    title: `The ${k.name}`,
    realName: clean(k.realName ?? null),
    aliases: arr(k.altName).map(clean),
    gender: clean(k.gender ?? null),
    origin: clean(k.origin ?? null),
    weapon: k.weapon || null,
    power: powerName,
    powerText: killerExtra[k.name]?.powerText ?? '',
    powerStats: power ? Object.fromEntries(Object.entries(power).filter(([key]) => !['killer', 'patch', 'tags'].includes(key))) : {},
    speed: speedMs(k),
    speedPct: Math.round((speedMs(k) / 4) * 100),
    speedNote: Array.isArray(k.speed) ? k.speed[1] : null,
    altSpeeds: arr(k.altSpeed).map((a) => ({ speed: a[0], label: a[1] })),
    terror: radiusList.map((r) => ({ radius: Array.isArray(r) ? r[0] : r, label: Array.isArray(r) ? r[1] : null })),
    height: { T: 'Alto', A: 'Medio', S: 'Bajo' }[k.height] ?? null,
    difficulty: k.diff ?? null,
    chapter: dlc ? { id: dlc.id, name: dlc.name, date: dlc.rDate, patch: dlc.release } : null,
    actor: arr(k.actor).map(clean),
    perks: perks.filter((p) => p.side === 'killer' && p.ownerId === k.id).map((p) => p.name),
    comp: t, // { tier, win, note } o null
    icon: iconIf(killerExtra[k.name]?.icon),
  };
});

// ---- Survivors ----
const survivors = dt.survivors.map((s) => {
  const dlc = s.dlc != null ? dlcById[arr(s.dlc)[0]] : null;
  return {
    slug: slug(s.name),
    id: s.id,
    name: s.name,
    role: s.role ?? null,
    gender: s.gender ?? null,
    origin: clean(s.origin ?? null),
    actor: arr(s.actor).map(clean),
    chapter: dlc ? { id: dlc.id, name: dlc.name, date: dlc.rDate } : null,
    perks: perks.filter((p) => p.side === 'survivor' && p.ownerId === s.id).map((p) => p.name),
    icon: iconIf(survExtra[s.name]?.icon),
  };
});

// ---- Realms y mapas ----
const maps = dt.maps.map((m) => {
  const vars = m.variations ?? null;
  const main = vars ? vars.filter((v) => !v.altVarSuffix).slice(-1)[0] : null;
  const sizeTiles = main ? main.size : typeof m.size === 'number' ? m.size : null;
  const r = realmById[m.realm];
  return {
    slug: slug(m.name),
    id: m.id,
    name: m.name,
    codeName: m.altName ?? null,
    realmId: m.realm,
    realm: r ? r.name : null,
    sizeTiles: sizeTiles || null, // en "tiles" de 8x8 m
    areaM2: sizeTiles ? sizeTiles * 64 : null,
    floors: Array.isArray(m.size) ? m.size.map((x) => ({ tiles: x[0], label: x[1] })) : null,
    variations: vars ? vars.map((v) => ({ tiles: v.size, patch: v.release, twoVsEight: !!v.altVarSuffix })) : null,
    release: m.release ?? (vars ? vars[0].release : null),
    landmark: m.landmark ?? null,
    icon: iconIf(mapExtra[m.name]?.icon),
    comp: tiers.maps[m.name] ?? null, // { killers: [...], note }
  };
});
const realms = dt.realms.map((r) => ({
  slug: slug(r.name),
  id: r.id,
  name: r.name,
  codeName: r.codeName,
  location: r.location ?? null,
  color: r.color ? '#' + r.color : null,
  maps: maps.filter((m) => m.realmId === r.id).map((m) => m.slug),
  icon: iconIf(realmExtra[r.name]?.icon),
}));

fs.mkdirSync('src/data', { recursive: true });
const write = (f, d) => fs.writeFileSync(`src/data/${f}.json`, JSON.stringify(d, null, 1));
write('killers', killers);
write('survivors', survivors);
write('perks', perks);
write('maps', maps);
write('realms', realms);
fs.copyFileSync('data/clock.json', 'src/data/clock.json');
fs.copyFileSync('data/comp-rules.json', 'src/data/comp-rules.json');
fs.copyFileSync('data/callouts.json', 'src/data/callouts.json');
if (fs.existsSync('data/balance-4v1.json')) fs.copyFileSync('data/balance-4v1.json', 'src/data/balance-4v1.json');
console.log({ killers: killers.length, survivors: survivors.length, perks: perks.length, maps: maps.length, realms: realms.length });
console.log('killers sin icono:', killers.filter((k) => !k.icon).map((k) => k.name).join(', ') || '-');
console.log('mapas sin icono:', maps.filter((m) => !m.icon).length, '| survivors sin icono:', survivors.filter((s) => !s.icon).length, '| perks sin icono:', perks.filter((p) => !p.icon).length, '| perks sin desc:', perks.filter((p) => !p.desc).length);
