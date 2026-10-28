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

test('contains a recognizable welcome screen when parsed by a real browser', (t) => {
  if (process.env.RUN_BROWSER_SMOKE !== '1') {
    t.skip('Set RUN_BROWSER_SMOKE=1 in an environment allowed to launch Chrome');
    return;
  }
  const chrome = findChrome();
  if (!chrome) {
    t.skip('Chrome/Chromium is not available on this host');
    return;
  }

  const profileDirectory = mkdtempSync(join(tmpdir(), 'compromisso-chrome-'));
  const indexPath = fileURLToPath(new URL('../src/index.html', import.meta.url));
  const result = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDirectory}`,
    '--dump-dom',
    pathToFileURL(indexPath).href
  ], { encoding: 'utf8', timeout: 15_000 });
  rmSync(profileDirectory, { recursive: true, force: true });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /data-step="welcome"/);
  assert.match(result.stdout, /Começar minha escolha/);
  assert.match(result.stdout, /Base desta jornada/);
  assert.match(result.stdout, /discurso de vitória de Lula/i);
  assert.match(result.stdout, /outubro de 2026/i);
});
