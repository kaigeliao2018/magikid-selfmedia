import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const jobs = [
  ['design/assets/logo-icon.svg', 'design/assets/logo-icon.png', 800, 800],
  ['design/assets/cover-xiaohongshu-v2.svg', 'design/assets/cover-xiaohongshu-v2.png', 1080, 1350],
  ['design/assets/cover-youtube-v2.svg', 'design/assets/cover-youtube-v2.png', 2560, 1440],
];

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function render(svgPath, pngPath, width, height) {
  const svgAbs = resolve(root, svgPath);
  const pngAbs = resolve(root, pngPath);
  const profile = mkdtempSync(resolve(tmpdir(), 'kai-render-'));
  if (existsSync(pngAbs)) {
    unlinkSync(pngAbs);
  }
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: #0A0A0A; }
      img { display: block; width: ${width}px; height: ${height}px; }
    </style>
  </head>
  <body><img src="${pathToFileURL(svgAbs).href}"></body>
</html>`;
  const htmlPath = resolve(profile, 'render.html');
  writeFileSync(htmlPath, html);

  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-crash-reporter',
    '--disable-sync',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${width},${height}`,
    `--user-data-dir=${profile}`,
    `--screenshot=${pngAbs}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });

  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (existsSync(pngAbs) && statSync(pngAbs).size > 10000) {
      child.kill('SIGTERM');
      await wait(250);
      return;
    }
    await wait(250);
  }

  child.kill('SIGKILL');
  throw new Error(`Timed out rendering ${svgPath}`);
}

for (const job of jobs) {
  await render(...job);
}
