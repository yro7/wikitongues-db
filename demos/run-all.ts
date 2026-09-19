/**
 * Runs every demo script in order.
 *
 *   npm run demo
 */

import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const dir = __dirname;
const scripts = readdirSync(dir).filter((f) => /^\d\d-.*\.ts$/.test(f)).sort();

for (const script of scripts) {
  console.log(`\n${'═'.repeat(72)}\n  ${script}\n${'═'.repeat(72)}`);
  const result = spawnSync('npx', ['tsx', join(dir, script)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
