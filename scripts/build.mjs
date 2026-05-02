import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const astroCli = path.join(rootDir, 'node_modules', 'astro', 'astro.js');

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

run(process.execPath, [astroCli, 'check']);
run(process.execPath, [astroCli, 'build']);
