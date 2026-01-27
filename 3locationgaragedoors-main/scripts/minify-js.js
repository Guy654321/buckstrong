import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const targetDirs = [
  // Astro-built assets
  join(projectRoot, 'dist', '_astro'),
  join(projectRoot, '.vercel', 'output', 'static', '_astro'),
  // Static assets served directly from the public directory
  join(projectRoot, 'public', 'scripts'),
  join(projectRoot, 'dist', 'scripts'),
  join(projectRoot, '.vercel', 'output', 'static', 'scripts')
];

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function collectJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectJsFiles(fullPath)));
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function minifyFile(path) {
  const original = await readFile(path, 'utf8');
  const { code } = await transform(original, {
    minify: true,
    legalComments: 'none',
    loader: 'js',
    target: 'es2018'
  });

  if (code === original) {
    return false;
  }

  await writeFile(path, code, 'utf8');
  return true;
}

async function minifyDirectory(dir) {
  if (!(await pathExists(dir))) {
    return { processed: 0, changed: 0 };
  }

  const files = await collectJsFiles(dir);
  let changed = 0;

  for (const file of files) {
    try {
      const didChange = await minifyFile(file);
      if (didChange) {
        changed += 1;
      }
    } catch (error) {
      console.error(`[js-minify] Failed to minify ${relative(projectRoot, file)}`);
      console.error(error);
    }
  }

  return { processed: files.length, changed };
}

async function main() {
  let totalProcessed = 0;
  let totalChanged = 0;

  for (const dir of targetDirs) {
    const { processed, changed } = await minifyDirectory(dir);
    totalProcessed += processed;
    totalChanged += changed;

    if (processed > 0) {
      if (changed > 0) {
        console.log(`[js-minify] Minified ${changed}/${processed} JavaScript file(s) in ${relative(projectRoot, dir)}`);
      } else {
        console.log(`[js-minify] JavaScript already minified in ${relative(projectRoot, dir)}`);
      }
    }
  }

  if (totalProcessed === 0) {
    console.log('[js-minify] No JavaScript assets found to minify.');
  } else if (totalChanged > 0) {
    console.log(`[js-minify] Minified ${totalChanged}/${totalProcessed} JavaScript file(s) total.`);
  } else {
    console.log(`[js-minify] All ${totalProcessed} JavaScript file(s) were already minified.`);
  }
}

main().catch((error) => {
  console.error('[js-minify] Failed to minify JavaScript output.');
  console.error(error);
  process.exitCode = 1;
});
