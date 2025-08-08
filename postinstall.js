import { execSync } from 'node:child_process';

const isGlobal = process.env.npm_config_global === 'true';
const isDevOmitted = process.env.npm_config_omit === 'dev';

if (!isGlobal && !isDevOmitted) {
  console.info('Running post-install commands ...');

  execSync('npm run build', {
    stdio: 'inherit',
  });
} else {
  console.info('Skipping post-install commands ...');
}
