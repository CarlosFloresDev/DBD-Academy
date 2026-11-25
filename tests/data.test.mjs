import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => JSON.parse(fs.readFileSync(`src/data/${f}.json`, 'utf8'));
const killers = read('killers');
const perks = read('perks');
const maps = read('maps');
const survivors = read('survivors');
const clock = read('clock');
const rules = read('comp-rules');

test('hay 45 killers y el ultimo es Terrifier', () => {
  assert.equal(killers.length, 45);
  assert.equal(killers.at(-1).slug, 'terrifier');
  assert.equal(killers.at(-1).chapter.date, '24.11.2026');
});

test('cada killer tiene 3 perks propios que existen', () => {
  const names = new Set(perks.map((p) => p.name));
  for (const k of killers) {
    assert.equal(k.perks.length, 3, `${k.name} deberia tener 3 perks propios`);
    for (const p of k.perks) assert.ok(names.has(p), `${k.name}: perk ${p} no existe`);
  }
});

test('constantes del reloj coinciden con el wiki', () => {
  const g = clock.generador.porNumeroDeSobrevivientes;
  assert.equal(clock.generador.cargasTotales, 90);
  assert.equal(g[0].segundos, 90);
  assert.ok(Math.abs(g[1].segundos - 90 / 1.7) < 0.05);
  assert.ok(Math.abs(g[2].segundos - 90 / 2.1) < 0.05);
  assert.ok(Math.abs(g[3].segundos - 90 / 2.2) < 0.05);
  assert.equal(clock.gancho.etapa1Segundos, 70);
});

test('mapas y survivors', () => {
  assert.equal(maps.length, 47);
  assert.ok(maps.some((m) => m.slug === 'hartshorne-mall'));
  assert.equal(survivors.length, 55);
  assert.ok(survivors.some((s) => s.slug === 'sienna-shaw'));
});

test('el pool 1v1 referencia killers y mapas reales', () => {
  const mk = new Set(killers.map((k) => k.name));
  const mm = new Set(maps.map((m) => m.name));
  for (const r of rules.reglasPorKiller) {
    assert.ok(mk.has(r.killer), `killer ${r.killer}`);
    assert.ok(mm.has(r.mapa), `mapa ${r.mapa}`);
  }
});

test('builds usan perks existentes', { skip: !fs.existsSync('src/data/builds.json') }, () => {
  const builds = read('builds');
  const bySide = { killer: new Set(perks.filter((p) => p.side === 'killer').map((p) => p.name)), survivor: new Set(perks.filter((p) => p.side === 'survivor').map((p) => p.name)) };
  for (const b of builds) {
    assert.ok(b.perks.length >= 2 && b.perks.length <= 4, `${b.id}: nº de perks`);
    for (const p of b.perks) assert.ok(bySide[b.lado].has(p), `${b.id}: perk inexistente o del bando equivocado -> ${p}`);
    assert.equal(new Set(b.perks).size, b.perks.length, `${b.id}: perks repetidos`);
  }
});
