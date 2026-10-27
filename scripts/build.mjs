import { access, copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SOURCE_FILES = Object.freeze([
  'index.html',
  'styles.css',
  'app.js',
  'app-state.js',
  'logic.js',
  'commitments.js',
  'view-helpers.js'
]);

export async function buildSite({ sourceDirectory, destinationDirectory, files = SOURCE_FILES }) {
  for (const file of files) {
    try {
      await access(join(sourceDirectory, file));
    } catch {
      throw new Error(`Missing static source file: ${file}`);
    }
  }

  await rm(destinationDirectory, { recursive: true, force: true });
  await mkdir(destinationDirectory, { recursive: true });

  for (const file of files) {
    const output = join(destinationDirectory, file);
    await mkdir(dirname(output), { recursive: true });
    await copyFile(join(sourceDirectory, file), output);
  }

  return [...files];
}

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(scriptPath), '..');
const isDirectRun = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  const files = await buildSite({
    sourceDirectory: join(projectRoot, 'src'),
    destinationDirectory: join(projectRoot, 'dist')
  });
  process.stdout.write(`Built ${files.length} static files in dist/.\n`);
}
