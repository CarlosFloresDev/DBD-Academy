// Revisa dist/: enlaces internos rotos e imagenes locales inexistentes.
import fs from 'node:fs';
import path from 'node:path';

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') files.push(p);
  }
})('dist');

const have = new Set(['/']);
for (const f of files) {
  const rel = path.relative('dist', path.dirname(f)).split(path.sep).join('/');
  have.add(rel ? `/${rel}/` : '/');
}
const bad = new Map();
const imgs = new Map();
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) {
    const u = m[1];
    if (u.startsWith('/_astro') || /\.\w{2,4}$/.test(u)) continue;
    if (!have.has(u) && !have.has(u + '/')) bad.set(u, f);
  }
  for (const m of h.matchAll(/src="(\/img\/[^"?]*)/g)) {
    if (!fs.existsSync('dist' + m[1])) imgs.set(m[1], f);
  }
}
console.log('paginas', files.length);
console.log('enlaces rotos', [...bad].slice(0, 30));
console.log('imagenes rotas', imgs.size, [...imgs.keys()].slice(0, 8));
