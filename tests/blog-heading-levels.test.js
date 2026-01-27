import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

const h1HeadingPattern = /(^|\n)[ \t]*#(?!#)(?=\s)/;

const stripFrontmatter = (content) => {
  if (!content.startsWith('---')) {
    return content;
  }

  const frontmatterMatch = content.match(/^---[\s\S]*?---\s*/);
  return frontmatterMatch ? content.slice(frontmatterMatch[0].length) : content;
};

test('blog content does not include level-1 markdown headings', () => {
  const entries = readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name));

  const violations = entries
    .map((entry) => {
      const filePath = path.join(BLOG_CONTENT_DIR, entry.name);
      const rawContent = readFileSync(filePath, 'utf8');
      const contentWithoutFrontmatter = stripFrontmatter(rawContent);

      return h1HeadingPattern.test(contentWithoutFrontmatter) ? entry.name : null;
    })
    .filter((name) => name !== null);

  assert.equal(
    violations.length,
    0,
    `Found disallowed level-1 headings in: ${violations.join(', ')}`,
  );
});
