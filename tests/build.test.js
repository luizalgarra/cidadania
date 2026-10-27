import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { buildSite } from '../scripts/build.mjs';

test('build copies only the declared static files and removes stale output', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'compromisso-build-'));
  const source = join(root, 'src');
  const destination = join(root, 'dist');
  await mkdir(source);
  await mkdir(destination);
  await writeFile(join(source, 'index.html'), '<h1>Compromisso</h1>');
  await writeFile(join(source, 'app.js'), 'export const ready = true;');
  await writeFile(join(destination, 'stale.txt'), 'remove me');
  t.after(() => rm(root, { recursive: true, force: true }));

  const result = await buildSite({
    sourceDirectory: source,
    destinationDirectory: destination,
    files: ['index.html', 'app.js']
  });

  assert.deepEqual(result, ['index.html', 'app.js']);
  assert.equal(await readFile(join(destination, 'index.html'), 'utf8'), '<h1>Compromisso</h1>');
  await assert.rejects(readFile(join(destination, 'stale.txt'), 'utf8'), { code: 'ENOENT' });
});

test('build fails rather than publishing when a declared source file is missing', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'compromisso-build-missing-'));
  const source = join(root, 'src');
  const destination = join(root, 'dist');
  await mkdir(source);
  t.after(() => rm(root, { recursive: true, force: true }));

  await assert.rejects(
    buildSite({ sourceDirectory: source, destinationDirectory: destination, files: ['index.html'] }),
    /Missing static source file: index\.html/
  );
});
