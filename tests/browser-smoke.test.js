import test from 'node:test';
import assert from 'node:assert/strict';
import { accessSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
];

function findChrome() {
  return chromeCandidates.find((candidate) => {
    try {
      accessSync(candidate);
      return true;
    } catch {
      return false;
    }
  }) ?? null;
}

function dumpLandingDom(chrome, search = '') {
  const profileDirectory = mkdtempSync(join(tmpdir(), 'compromisso-chrome-'));
  const indexPath = fileURLToPath(new URL('../src/index.html', import.meta.url));
  const indexUrl = pathToFileURL(indexPath);
  indexUrl.search = search;
  const result = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--allow-file-access-from-files',
    `--user-data-dir=${profileDirectory}`,
    '--dump-dom',
    indexUrl.href
  ], { encoding: 'utf8', timeout: 15_000 });
  rmSync(profileDirectory, { recursive: true, force: true });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function dumpSourcesDom(chrome) {
  const profileDirectory = mkdtempSync(join(tmpdir(), 'compromisso-sources-chrome-'));
  const sourcesPath = fileURLToPath(new URL('../src/fontes.html', import.meta.url));
  const result = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--allow-file-access-from-files',
    `--user-data-dir=${profileDirectory}`,
    '--dump-dom',
    pathToFileURL(sourcesPath).href
  ], { encoding: 'utf8', timeout: 15_000 });
  rmSync(profileDirectory, { recursive: true, force: true });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('renders the direct popular landing on the main URL', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpLandingDom(chrome);

  assert.match(dom, /data-step="landing"/);
  assert.match(dom, /data-landing-variant="popular"/);
  assert.match(dom, /class="popular-landing"/);
  assert.match(dom, /O que você pode fazer/i);
  assert.match(dom, /Descobrir meu primeiro passo/i);
  assert.doesNotMatch(dom, /class="landing-process"/);
});

test('does not restore the archived editorial landing from its old URL', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpLandingDom(chrome, '?landing=editorial');

  assert.match(dom, /class="popular-landing"/);
  assert.match(dom, /O que você pode fazer/i);
  assert.doesNotMatch(dom, /class="landing-process"/);
});

test('shows the verified Sorocaba snapshots in the public sources catalogue', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpSourcesDom(chrome);

  assert.equal((dom.match(/class="local-snapshot"/g) ?? []).length, 2);
  assert.match(dom, /114\.769 pessoas/);
  assert.match(dom, /19\.784 matrículas/);
  assert.match(dom, /código IBGE 3552205/);
});

test('renders the elderly search result and all generation rows', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpSourcesDom(chrome);

  assert.match(dom, /id="elderly-result-value">114\.769</);
  assert.equal((dom.match(/class="elderly-ruler__row"/g) ?? []).length, 9);
  assert.match(dom, /60 a 64/);
  assert.match(dom, /100 ou mais/);
});

test('renders elderly individual income as a separate autonomy estimate', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpSourcesDom(chrome);

  assert.match(dom, /id="elderly-autonomy"/);
  assert.match(dom, /id="autonomy-median-value">R\$ 1\.500,00</);
  assert.equal((dom.match(/class="autonomy-ledger__row"/g) ?? []).length, 5);
  assert.match(dom, /Estimativa da amostra do Censo 2022/);
  assert.match(dom, /não mede patrimônio, dívidas nem controle sobre os recursos/i);
});

test('renders accessibility and the four elderly investigations without merging their universes', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpSourcesDom(chrome);

  assert.match(dom, /id="elderly-accessibility"/);
  assert.match(dom, /id="accessibility-result-value">96,3%/);
  assert.equal((dom.match(/class="accessibility-street__row"/g) ?? []).length, 5);
  assert.equal((dom.match(/<details class="elderly-inquiry"/g) ?? []).length, 4);
  assert.match(dom, /id="elderly-care"[^>]*open/);
  assert.match(dom, /O cuidado está chegando\?/);
  assert.match(dom, /id="elderly-health"/);
  assert.match(dom, /21,89/);
  assert.match(dom, /id="elderly-protection"/);
  assert.match(dom, /3\.890<\/strong>\s*pessoas idosas/);
  assert.match(dom, /107\.178/);
  assert.match(dom, /Competência: julho de 2025/);
  assert.doesNotMatch(dom, /consulta atualizável60\+/i);
  assert.match(dom, /id="elderly-network"/);
  assert.match(dom, /Equipes de APS financiadas/);
});
