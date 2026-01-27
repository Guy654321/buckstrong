import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_RUNTIME = process.env.VERCEL_SERVERLESS_RUNTIME ?? 'nodejs20.x';
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const functionsDir = join(projectRoot, '.vercel', 'output', 'functions');

async function findVcConfigFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findVcConfigFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name === '.vc-config.json') {
      files.push(fullPath);
    }
  }

  return files;
}

async function updateRuntime(configPath) {
  const raw = await readFile(configPath, 'utf8');
  let data;

  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to parse JSON from ${configPath}`, { cause: error });
  }

  if (typeof data.runtime !== 'string' || !data.runtime.startsWith('nodejs')) {
    return false;
  }

  if (data.runtime === TARGET_RUNTIME) {
    return false;
  }

  data.runtime = TARGET_RUNTIME;
  const formatted = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(configPath, formatted, 'utf8');
  return true;
}

async function main() {
  try {
    await stat(functionsDir);
  } catch {
    console.log('No serverless functions generated — skipping runtime enforcement.');
    return;
  }

  const configFiles = await findVcConfigFiles(functionsDir);

  if (configFiles.length === 0) {
    console.log('No Vercel function configuration files found.');
    return;
  }

  let updates = 0;

  for (const file of configFiles) {
    const updated = await updateRuntime(file);

    if (updated) {
      updates += 1;
      console.log(`Set runtime to ${TARGET_RUNTIME} in ${relative(projectRoot, file)}`);
    }
  }

  if (updates === 0) {
    console.log(`All serverless function runtimes already set to ${TARGET_RUNTIME}.`);
  } else {
    console.log(`Updated ${updates} serverless function configuration file(s).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
