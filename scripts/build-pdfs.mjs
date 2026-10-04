// Re-renders the PDF guides for the newer lessons from their HTML sources.
//
//   docs/pdf-sources/<name>.html  ->  public/pdfs/<name>.pdf
//
// Each HTML file lays itself out into fixed A4 "page" blocks with a small script (long cards continue on
// the next page, footers get "page N of M"), so the dark background fills every page edge to edge in any
// PDF viewer — the @page margin is 0.
//
// Needs Playwright with a Chromium it can launch. Usage:
//   node scripts/build-pdfs.mjs [name ...]      (no names = every file in docs/pdf-sources)
import { readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const sourceDir = resolve('docs/pdf-sources');
const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(sourceDir).filter((f) => f.endsWith('.html')).map((f) => basename(f, '.html'));

const browser = await chromium.launch();
for (const name of names) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(sourceDir, `${name}.html`)).href);
  await page.pdf({
    path: resolve('public/pdfs', `${name}.pdf`),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log('wrote public/pdfs/' + name + '.pdf');
  await page.close();
}
await browser.close();
