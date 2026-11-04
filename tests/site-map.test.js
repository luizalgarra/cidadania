import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { SOURCE_FILES } from '../scripts/build.mjs';

const read = (file) => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
const pages = SOURCE_FILES.filter((file) => file.endsWith('.html'));

test('publishes the site map', () => {
  assert.ok(SOURCE_FILES.includes('mapa.html'));
});

test('site map links every published page', async () => {
  const map = await read('mapa.html');
  for (const page of pages.filter((p) => p !== 'mapa.html')) {
    const href = page === 'index.html' ? './' : `./${page}`;
    assert.ok(map.includes(`href="${href}"`), `mapa.html não leva a ${page}`);
  }
});

test('every section anchor in the site map exists on its page', async () => {
  const map = await read('mapa.html');
  const anchors = [...map.matchAll(/href="\.\/([\w-]+\.html)#([\w-]+)"/g)];
  assert.ok(anchors.length > 0);
  for (const [, page, id] of anchors) {
    assert.ok((await read(page)).includes(`id="${id}"`), `${page}#${id} não existe`);
  }
});

test('every other page links back to the site map', async () => {
  for (const page of pages.filter((p) => p !== 'mapa.html')) {
    assert.ok((await read(page)).includes('href="./mapa.html"'), `${page} sem link para o mapa`);
  }
});

test('flow graph follows the real journey steps, in order', async () => {
  const map = await read('mapa.html');
  const graph = map.match(/<figure class="flow-map"[\s\S]*?<\/figure>/)?.[0];
  assert.ok(graph, 'mapa.html sem o grafo de fluxo');
  assert.equal((graph.match(/class="flow-track /g) ?? []).length, 3, 'o grafo deve ter três trilhas');

  const app = await read('app.js');
  const meta = app.match(/const STAGE_META = \{([\s\S]*?)\};/)[1];
  const labels = [...meta.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
  let cursor = -1;
  for (const label of labels) {
    const at = graph.indexOf(label);
    assert.ok(at > cursor, `etapa "${label}" ausente ou fora de ordem no grafo`);
    cursor = at;
  }
});
