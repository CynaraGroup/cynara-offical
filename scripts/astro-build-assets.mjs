import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { cynaraConfig } from './load-cynara-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pagefindCli = path.join(rootDir, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs');

function toFilePath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }

  return String(input);
}

function runPagefind(distDir) {
  if (!fs.existsSync(pagefindCli)) {
    console.warn('[cynara-build] Pagefind CLI was not found. Search index was skipped.');
    return;
  }

  const result = spawnSync(process.execPath, [pagefindCli, '--site', distDir], {
    cwd: rootDir,
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: '1',
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Pagefind failed with exit code ${result.status ?? 1}`);
  }
}

async function generateSitemap(distDir) {
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

  const sitemap = new SitemapStream({ hostname: cynaraConfig.site.url });
  for (const entry of entries) {
    sitemap.write(entry);
  }
  sitemap.end();

  const xml = await streamToPromise(sitemap);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml.toString(), 'utf8');
}

export default function cynaraBuildAssets() {
  return {
    name: 'cynara-build-assets',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = toFilePath(dir);

        if (!fs.existsSync(distDir)) {
          throw new Error(`Build output directory does not exist: ${distDir}`);
        }

        runPagefind(distDir);
        await generateSitemap(distDir);
      },
    },
  };
}
