import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { SOURCE_FILES } from '../scripts/build.mjs';

const read = (file) => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');

test('idosos.html opens with three doors: seek help, caregiver, want to help', async () => {
  const page = await read('idosos.html');
  const doors = page.match(/<nav class="guide-doors"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(doors, 'idosos.html sem as portas de entrada');
  for (const href of ['#procuro', '#quem-cuida', './ajudar.html']) {
    assert.ok(doors.includes(`href="${href}"`), `porta para ${href} ausente`);
  }
  for (const id of ['procuro', 'quem-cuida']) assert.ok(page.includes(`id="${id}"`), `seção #${id} ausente`);
});

test('the helper track is a published page with its four sections', async () => {
  assert.ok(SOURCE_FILES.includes('ajudar.html'));
  const page = await read('ajudar.html');
  for (const id of ['alguem-que-conheco', 'sinais-de-risco', 'voluntariado', 'acao-coletiva']) {
    assert.ok(page.includes(`id="${id}"`), `ajudar.html sem #${id}`);
  }
  assert.match(page, /Content-Security-Policy/);
  assert.match(page, /href="\.\/idosos\.html"/, 'ajudar.html deve voltar às portas');
});

test('every phone link on the new tracks dials a valid number', async () => {
  for (const file of ['ajudar.html', 'idosos.html']) {
    const page = await read(file);
    for (const [, number] of page.matchAll(/href="tel:([^"]+)"/g)) {
      assert.match(number, /^(\+55\d{10,11}|1\d{2}|135)$/, `${file}: tel:${number} inválido`);
    }
  }
});

test('emergency and reporting channels on the helper page come with their source', async () => {
  const page = await read('ajudar.html');
  const risk = page.match(/<section id="sinais-de-risco"[\s\S]*?<\/section>/)[0];
  for (const tel of ['tel:190', 'tel:100']) assert.ok(risk.includes(`href="${tel}"`), `${tel} ausente`);
  assert.ok(risk.includes('gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos'), 'Disque 100 sem fonte oficial');
  assert.ok(risk.includes('cidadania.sorocaba.sp.gov.br/destaques/creas'), 'CREAS sem fonte oficial');
});
