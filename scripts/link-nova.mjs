import { execSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Link Nova - Link Nova.
 *
 * Detects the @cbnventures packages this repo installs and links any that are
 * globally npm-linked, exiting quietly when none are found.
 *
 * @returns {void}
 *
 * @since 0.0.0
 */
function linkNova() {
  const novaScope = join(process.cwd(), 'node_modules', '@cbnventures');
  const packages = ((existsSync(novaScope) === true) ? readdirSync(novaScope) : [])
    .filter((name) => name.startsWith('.') === false)
    .map((name) => `@cbnventures/${name}`);

  if (packages.length === 0) {
    process.stdout.write('link-nova: No @cbnventures packages installed. Skipping.\n');

    return;
  }

  const globalModules = execSync('npm root --global', { encoding: 'utf-8' }).trim();
  const missingLinks = [];

  for (const packageName of packages) {
    const globalPath = join(globalModules, packageName);
    const isLinked = existsSync(globalPath) === true && lstatSync(globalPath).isSymbolicLink() === true;

    if (isLinked === false) {
      missingLinks.push(packageName);
    }
  }

  if (missingLinks.length > 0) {
    process.stdout.write(`link-nova: Global links not found for ${missingLinks.join(', ')}. Skipping.\n`);

    return;
  }

  process.stdout.write(`link-nova: Linking ${packages.join(', ')} ...\n`);

  execSync(`npm link ${packages.join(' ')}`, { stdio: 'inherit' });

  for (const packageName of packages) {
    const localPath = join(process.cwd(), 'node_modules', packageName);
    const isLinked = existsSync(localPath) === true && lstatSync(localPath).isSymbolicLink() === true;

    if (isLinked === false) {
      throw new Error(`link-nova: ${packageName} is a package copy, not a symlink. Run "npm link ${packages.join(' ')}" manually.`);
    }
  }

  process.stdout.write('link-nova: Done.\n');

  return;
}

linkNova();
