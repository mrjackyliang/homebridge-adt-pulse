import { execFileSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

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
  const projectRoot = process.cwd();
  const rootPackageJsonPath = join(projectRoot, 'package.json');
  const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf-8'));
  const workspacePatterns = [];
  const workspacePackageJsonPaths = [];

  if (Array.isArray(rootPackageJson.workspaces) === true) {
    workspacePatterns.push(...rootPackageJson.workspaces);
  } else if (
    rootPackageJson.workspaces !== undefined
    && Array.isArray(rootPackageJson.workspaces.packages) === true
  ) {
    workspacePatterns.push(...rootPackageJson.workspaces.packages);
  }

  for (const workspacePattern of workspacePatterns) {
    const wildcardIndex = workspacePattern.indexOf('*');

    if (wildcardIndex === -1) {
      const packageJsonPath = join(projectRoot, workspacePattern, 'package.json');

      if (existsSync(packageJsonPath) === true) {
        workspacePackageJsonPaths.push(packageJsonPath);
      }

      continue;
    }

    let workspaceRoot = workspacePattern.slice(0, wildcardIndex);

    while (workspaceRoot.endsWith('/') === true) {
      workspaceRoot = workspaceRoot.slice(0, -1);
    }

    const workspaceRootPath = join(projectRoot, workspaceRoot);
    const workspaceNames = (existsSync(workspaceRootPath) === true) ? readdirSync(workspaceRootPath) : [];

    for (const workspaceName of workspaceNames) {
      const packageJsonPath = join(workspaceRootPath, workspaceName, 'package.json');

      if (existsSync(packageJsonPath) === true) {
        workspacePackageJsonPaths.push(packageJsonPath);
      }
    }
  }

  const packageJsonPaths = [
    rootPackageJsonPath,
    ...workspacePackageJsonPaths,
  ];
  const packageLocations = new Map();

  for (const packageJsonPath of packageJsonPaths) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.optionalDependencies,
      ...packageJson.peerDependencies,
    };

    for (const packageName of Object.keys(dependencies)) {
      if (packageName.startsWith('@cbnventures/') === false) {
        continue;
      }

      const locations = packageLocations.get(packageName) ?? [];

      locations.push(dirname(packageJsonPath));

      packageLocations.set(packageName, locations);
    }
  }

  const packages = [...packageLocations.keys()].sort();

  if (packages.length === 0) {
    process.stdout.write('link-nova: No @cbnventures packages declared. Skipping.\n');

    return;
  }

  const globalModules = execFileSync(
    'npm',
    [
      'root',
      '--global',
    ],
    {
      encoding: 'utf-8',
    },
  ).trim();
  const linkedPackages = [];
  const missingLinks = [];

  for (const packageName of packages) {
    const globalPath = join(globalModules, packageName);
    const isLinked = existsSync(globalPath) === true && lstatSync(globalPath).isSymbolicLink() === true;

    if (isLinked === false) {
      missingLinks.push(packageName);

      continue;
    }

    const globalTarget = realpathSync(globalPath);
    const packageDirectories = packageLocations.get(packageName) ?? [];

    for (const packageDirectory of packageDirectories) {
      const localPath = join(packageDirectory, 'node_modules', packageName);
      const hasMatchingLink = existsSync(localPath) === true
        && lstatSync(localPath).isSymbolicLink() === true
        && realpathSync(localPath) === globalTarget;

      if (hasMatchingLink === true) {
        continue;
      }

      rmSync(localPath, {
        force: true,
        recursive: true,
      });
      mkdirSync(dirname(localPath), { recursive: true });

      const symlinkType = (process.platform === 'win32') ? 'junction' : 'dir';

      symlinkSync(globalTarget, localPath, symlinkType);
    }

    linkedPackages.push(packageName);
  }

  if (missingLinks.length > 0) {
    process.stdout.write(`link-nova: Global links not found for ${missingLinks.join(', ')}. Skipping those packages.\n`);
  }

  if (linkedPackages.length === 0) {
    return;
  }

  process.stdout.write(`link-nova: Linked ${linkedPackages.join(', ')} across their declaring workspaces.\n`);

  return;
}

linkNova();
