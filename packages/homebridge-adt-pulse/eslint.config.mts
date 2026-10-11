import {
  dxCodeStyle,
  dxIgnore,
  langJavascript,
  langTypescript,
  runtimeNode,
} from '@cbnventures/nova/presets/eslint';
import { novaRules } from '@cbnventures/nova/rules/eslint';

/**
 * ESLint Configuration.
 *
 * Defines the full set of custom lint rules and presets used
 * across all source files in this package.
 *
 * @since 1.0.0
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
      'src/tests/**',
      'src/types/tests/**',
      'eslint.config.mts',
      'vitest.config.mts',
      'vitest.setup.ts',
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
          './tsconfig.source.json',
          './tsconfig.config.json',
          './tsconfig.tests.json',
        ],
      },
    },
  },
  {
    name: 'cli-overrides',
    files: ['src/cli/**'],
    rules: {
      'no-console': 'off',
      'no-process-exit': 'off',
      'n/no-process-exit': 'off',
    },
  },
  {
    name: 'utility-logger-fallback-override',
    files: ['src/lib/utility.ts'],
    rules: {
      // debugLog falls back to the console when no homebridge logger was provided, and
      // stackTracer prints directly by design; these are the file's logging outlets.
      'no-console': [
        'error',
        {
          allow: [
            'error',
            'info',
            'warn',
          ],
        },
      ],
    },
  },
  {
    name: 'node-import-resolution',
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
    ],
    rules: {
      // Workaround: eslint-plugin-n resolves imports against the built output on disk, so
      // the ".js" extensions on these ESM source imports point at ".ts" files it cannot see;
      // typed compilation already validates every import, so the rule only adds value for plain JS.
      'n/no-missing-import': 'off',
    },
  },
  ...novaRules,
  {
    name: 'custom-nova-rules',
    files: [
      '**/*.cjs',
      '**/*.cts',
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: './src/lib/regex.ts',
        },
      ],
      '@cbnventures/nova/no-shared-type-import': [
        'error',
        {
          ignoreFiles: [],
          sharedFiles: ['./src/types/shared.d.ts'],
        },
      ],
      '@cbnventures/nova/require-jsdoc-body': [
        'error',
        {
          ignoreFiles: [],
          maxLines: 3,
          maxWidth: 90,
          minLines: 2,
          skipDirectories: [
            'styles',
            'tests',
            'types',
          ],
        },
      ],
      '@cbnventures/nova/require-jsdoc-hierarchy': [
        'error',
        {
          anchorDirectories: ['src'],
          ignoreFiles: [],
          knownNames: {},
          stripDirectories: ['types'],
        },
      ],
      '@cbnventures/nova/require-jsdoc-presence': [
        'error',
        {
          ignoreFiles: [],
          skipDirectories: [
            'tests',
            'types',
          ],
        },
      ],
      '@cbnventures/nova/require-kebab-case-filename': [
        'error',
        {
          extraExtensions: [],
          ignoreFiles: [],
        },
      ],
    },
  },
];
