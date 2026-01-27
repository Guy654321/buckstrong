#!/usr/bin/env node
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const targets = [
  join(projectRoot, 'dist'),
  join(projectRoot, '.vercel', 'output', 'static')
];

async function collectHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

const PRESERVE_TAGS = new Set(['pre', 'textarea', 'script', 'style']);

function stripComments(html) {
  return html.replace(/<!--(?!\[if|<!\[endif)([\s\S]*?)-->/g, '');
}

function collapseWhitespace(html) {
  const tokens = html.split(/(<[^>]+>)/g);
  let preserveDepth = 0;
  let output = '';

  for (const token of tokens) {
    if (!token) continue;

    if (token.startsWith('<')) {
      const tagMatch = /^<\s*(\/)?\s*([a-zA-Z0-9:-]+)/.exec(token);
      if (tagMatch) {
        const isClosing = Boolean(tagMatch[1]);
        const tagName = tagMatch[2].toLowerCase();

        if (PRESERVE_TAGS.has(tagName)) {
          if (!isClosing && !token.endsWith('/>')) {
            preserveDepth += 1;
          } else if (isClosing && preserveDepth > 0) {
            preserveDepth -= 1;
          }
        }
      }

      const compactTag = token
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*(=)\s*/g, '$1')
        .replace(/\s+>/g, '>');
      output += compactTag;
      continue;
    }

    if (preserveDepth > 0) {
      output += token;
      continue;
    }

    if (!token.trim()) {
      const lastChar = output.slice(-1);
      if (lastChar && !/\s/.test(lastChar)) {
        output += ' ';
      }
      continue;
    }

    const leading = /^\s/.test(token);
    const trailing = /\s$/.test(token);
    let collapsed = token.replace(/\s+/g, ' ').trim();

    if (leading) {
      collapsed = ` ${collapsed}`;
    }

    if (trailing) {
      collapsed = `${collapsed} `;
    }

    output += collapsed;
  }

  return output
    .replace(/\s+<\//g, '</')
    .replace(/>\s*\n+\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function minifyHtmlContent(html) {
  const withoutComments = stripComments(html);
  return collapseWhitespace(withoutComments);
}

async function minifyHtmlFile(filePath) {
  const original = await readFile(filePath, 'utf8');
  const trimmed = original.trim();

  if (!trimmed) {
    return false;
  }

  const result = minifyHtmlContent(original);

  if (result === original) {
    return false;
  }

  await writeFile(filePath, `${result}\n`, 'utf8');
  return true;
}

async function processDirectory(dir) {
  try {
    const stats = await stat(dir);
    if (!stats.isDirectory()) {
      return { dir, processed: 0 };
    }
  } catch {
    return { dir, processed: 0 };
  }

  const files = await collectHtmlFiles(dir);
  let processed = 0;

  for (const file of files) {
    const changed = await minifyHtmlFile(file);
    if (changed) {
      processed += 1;
    }
  }

  return { dir, processed };
}

async function main() {
  const results = await Promise.all(targets.map(processDirectory));
  const total = results.reduce((sum, { processed }) => sum + processed, 0);

  for (const { dir, processed } of results) {
    if (processed > 0) {
      console.log(`[html-minify] Minified ${processed} HTML file(s) in ${relative(projectRoot, dir)}`);
    } else {
      console.log(`[html-minify] No HTML files minified in ${relative(projectRoot, dir)}`);
    }
  }

  if (total === 0) {
    console.log('[html-minify] No HTML files were minified.');
  } else {
    console.log(`[html-minify] Minified ${total} HTML file(s) total.`);
  }
}

main().catch(error => {
  console.error('[html-minify] Failed to minify HTML output.');
  console.error(error);
  process.exit(1);
});
