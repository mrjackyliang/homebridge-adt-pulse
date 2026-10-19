import {
  dxCodeStyle,
  dxIgnore,
  langJavascript,
  langTypescript,
  novaRules,
  runtimeNode,
} from '@cbnventures/nova/presets/eslint';

/**
 * ESLint Configuration.
 *
 * Composes nova preset configs with project-local rule options and applies
 * the full nova custom rule set across the repo's bootstrap scripts.
 *
 * @since 0.21.0
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langJavascript,
  ...langTypescript,
  ...runtimeNode,
  {
    name: 'custom-ignores',
    ignores: [
      'apps/**',
      'packages/**',
    ],
  },
  {
    name: 'custom-tsconfig',
    files: [
      '**/*.cts',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.config.json',
          './tsconfig.scripts.json',
          './tsconfig.tests.json',
        ],
      },
    },
  },
  ...novaRules,
  {
    name: 'scripts-overrides',
    files: ['scripts/**/*.mjs'],
    rules: {
      // Run-directly scripts are entry points (invoked as `node scripts/x.mjs`,
      // never imported), so process.exit is the correct way to set a precise
      // exit code - nova-run-scripts relies on it to propagate child exit codes,
      // and throwing would collapse every failure to code 1. The rule targets
      // importable modules, so it is a false positive on these files.
      'no-process-exit': 'off',
      'n/no-process-exit': 'off',

      // no-inline-type-annotation is a TypeScript-only rule (it wants a named
      // .d.ts type in place of an inferred one), which untyped .mjs JavaScript
      // cannot satisfy. It stays registered on every extension in the rules
      // block above - kept armed against JavaScript so a rule bug there would
      // surface rather than be silently scoped away - and is switched off only
      // for these script files.
      '@cbnventures/nova/no-inline-type-annotation': 'off',
    },
  },
];
