import { execSync } from 'node:child_process';
import fs from 'node:fs';

if (
  process.env.npm_config_omit !== 'dev'
  && !fs.existsSync('./build')
) {
  console.info('Running post-install commands ...');

  execSync('npm run build', {
    stdio: 'inherit',
  });
} else {
  console.info('Skipping post-install commands ...');
}
