// Convierte tablas Lua del wiki oficial de DBD (Module:Datatable) a JSON.
// Uso: node tools/lua2json.mjs data/raw/Datatable.lua data/raw/datatable.json killers maps realms survivors dlcs
import fs from 'node:fs';

const [, , input, output, ...names] = process.argv;
const src = fs.readFileSync(input, 'utf8');

function tokenize(s) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (s.startsWith('--[[', i)) { const e = s.indexOf(']]', i); i = e < 0 ? s.length : e + 2; continue; }
    if (s.startsWith('--', i)) { while (i < s.length && s[i] !== '\n') i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, v = '';
      while (j < s.length && s[j] !== c) { if (s[j] === '\\') { j++; v += s[j] === 'n' ? '\n' : s[j]; } else v += s[j]; j++; }
      t.push({ k: 'str', v }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(s[i + 1]))) {
      const m = /^-?[0-9]+(\.[0-9]+)?/.exec(s.slice(i)); t.push({ k: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(s.slice(i)); t.push({ k: 'id', v: m[0] }); i += m[0].length; continue;
    }
    if (s.startsWith('..', i)) { t.push({ k: 'p', v: '..' }); i += 2; continue; }
    t.push({ k: 'p', v: c }); i++;
  }
  return t;
}

function parseFrom(tokens, pos) {
  let p = pos;
  const peek = () => tokens[p];
  const next = () => tokens[p++];
  function value() {
    let v = atom();
    while (peek() && peek().k === 'p' && peek().v === '..') { next(); const r = atom(); v = String(v ?? '') + (r === null ? '' : String(r)); }
    return v;
  }
  function atom() {
    const t = next();
    if (!t) throw new Error('EOF');
    if (t.k === 'str' || t.k === 'num') return t.v;
    if (t.k === 'id') {
      if (t.v === 'true') return true;
      if (t.v === 'false') return false;
      if (t.v === 'nil') return null;
      // llamadas tipo i("x") / b("x"): devolvemos el argumento
      if (peek() && peek().k === 'p' && peek().v === '(') {
        next(); let depth = 1, arg = null;
        while (depth > 0) { const x = next(); if (x.v === '(' && x.k === 'p') depth++; else if (x.v === ')' && x.k === 'p') depth--; else if (arg === null && (x.k === 'str')) arg = x.v; }
        return arg ?? '';
      }
      return t.v === 'br' ? '<br>' : t.v === 'space' ? ' ' : '';
    }
    if (t.k === 'p' && t.v === '{') return table();
    if (t.k === 'p' && t.v === '-') return -atom();
    throw new Error('Token inesperado ' + JSON.stringify(t));
  }
  function table() {
    const arr = [], obj = {};
    let keyed = false;
    while (peek() && !(peek().k === 'p' && peek().v === '}')) {
      const a = peek(), b = tokens[p + 1];
      if (a.k === 'id' && b && b.k === 'p' && b.v === '=') { next(); next(); obj[a.v] = value(); keyed = true; }
      else if (a.k === 'p' && a.v === '[') {
        next(); const key = value(); next(); next(); obj[key] = value(); keyed = true;
      } else arr.push(value());
      if (peek() && peek().k === 'p' && (peek().v === ',' || peek().v === ';')) next();
    }
    next();
    if (keyed) { arr.forEach((v, i) => { obj[i + 1] = v; }); return obj; }
    return arr;
  }
  return value();
}

const out = {};
for (const name of names) {
  const re = new RegExp('^\\s*(?:p\\.)?' + name + '\\s*=\\s*\\{', 'm');
  const m = re.exec(src);
  if (!m) { console.error('No encontrado:', name); continue; }
  const start = m.index + m[0].length - 1;
  // cortar hasta la llave que cierra (contando llaves fuera de strings)
  let depth = 0, i = start, inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === '\\') i++; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (src.startsWith('--', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '{') depth++;
    if (c === '}') { depth--; if (depth === 0) break; }
  }
  const toks = tokenize(src.slice(start, i + 1));
  out[name] = parseFrom(toks, 0);
  console.log(name, Array.isArray(out[name]) ? out[name].length : Object.keys(out[name]).length);
}
fs.writeFileSync(output, JSON.stringify(out, null, 1));
