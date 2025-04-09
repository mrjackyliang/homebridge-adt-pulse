import { execSync } from 'node:child_process';

if (process.env.npm_config_omit !== 'dev') {
  console.info('Running post-install commands ...');

  execSync('npm run build', {
    stdio: 'inherit',
  });
} else {
  console.info('Skipping post-install commands ...');
}
