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

test('contains a recognizable landing page before the application welcome screen', (t) => {
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
  assert.match(dom, /Do compromisso público/i);
  assert.match(dom, /ao primeiro passo possível/i);
  assert.match(dom, /Conhecer a jornada/);
  assert.match(dom, /Íntegra e vídeo do pronunciamento/i);
  assert.match(
    dom,
    /href="https:\/\/www\.poder360\.com\.br\/poder-eleicoes-2026\/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2\/"/
  );
  assert.doesNotMatch(dom, /transcrição fornecida/i);
  assert.match(dom, /discurso de vitória de Lula/i);
  assert.match(dom, /outubro de 2026/i);
  assert.match(dom, /class="national-color-ribbon"/);
  assert.match(dom, /class="national-color-ribbon__green"/);
  assert.match(dom, /class="national-color-ribbon__yellow"/);
});

test('renders the direct popular landing when the A/B URL requests it', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const dom = dumpLandingDom(chrome, '?landing=popular');

  assert.match(dom, /class="popular-landing"/);
  assert.match(dom, /O que você pode fazer/i);
  assert.match(dom, /por um Brasil melhor/i);
  assert.match(dom, /Descobrir meu primeiro passo/i);
  assert.match(dom, /100% gratuito/i);
  assert.doesNotMatch(dom, /class="landing-process"/);
});
