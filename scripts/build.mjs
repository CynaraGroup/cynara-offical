import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { cynaraConfig } from './load-cynara-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const astroCli = path.join(rootDir, 'node_modules', 'astro', 'astro.js');
const pagefindCli = path.join(rootDir, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs');
const distDir = path.join(rootDir, 'dist');

const baseEnv = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
};

function run(command, args, env = baseEnv) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function generateSitemap() {
  const hostname = cynaraConfig.site.url;
  const entries = [];

  function walk(currentDir) {
    const dirEntries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of dirEntries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.name !== 'index.html' || fullPath.includes(`${path.sep}_astro${path.sep}`)) {
        continue;
      }

      const relativePath = path.relative(distDir, fullPath).replace(/\\/g, '/');
      const urlPath = relativePath === 'index.html'
        ? '/'
        : `/${relativePath.replace(/index\.html$/, '')}`;

      entries.push({
        url: urlPath,
        changefreq: 'weekly',
      });
    }
  }

  walk(distDir);

  const sitemap = new SitemapStream({ hostname });
  for (const entry of entries) {
    sitemap.write(entry);
  }
  sitemap.end();

  const xml = await streamToPromise(sitemap);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml.toString(), 'utf8');
}

run(process.execPath, [astroCli, 'check']);
run(process.execPath, [astroCli, 'build']);
run(process.execPath, [pagefindCli, '--site', 'dist']);
await generateSitemap();
