#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Hap Repl - Root.
 *
 * Resolves the package root directory relative to this trampoline file so the
 * compiled REPL entry point can be located regardless of the working directory.
 *
 * @since 1.0.0
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Hap Repl - CLI.
 *
 * Points to the compiled REPL entry point that this trampoline loads once the
 * package has been built.
 *
 * @since 1.0.0
 */
const cli = resolve(root, 'build', 'cli', 'repl.js');

if (existsSync(cli) === false) {
  process.stderr.write('CLI has not been built yet. Run "npm run build" first.\n');

  throw new Error('CLI build output not found');
}

import(cli);
