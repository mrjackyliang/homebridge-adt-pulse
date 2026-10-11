import {
  dxCodeStyle,
  dxIgnore,
  langJavascript,
  langTypescript,
  runtimeBrowser,
  toolVite,
} from '@cbnventures/nova/presets/eslint';
import { novaRules } from '@cbnventures/nova/rules/eslint';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

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
  ...runtimeBrowser,
  ...toolVite,
  {
    name: 'custom-ignores',
    ignores: [
      'eslint.config.mts',
      'vite.config.mjs',
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
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    name: 'react-rules',
    files: [
      '**/*.jsx',
      '**/*.tsx',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/incompatible-library': 'off',
    },
  },
  {
    name: 'config-ui-browser-console-override',
    files: ['src/**'],
    rules: {
      // The plugin custom UI runs in the browser where the console is the standard
      // error sink; the pages report caught errors via console.error.
      'no-console': [
        'error',
        {
          allow: ['error'],
        },
      ],
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
          ignoreFiles: [
            './src/types/config-ui.d.ts',
          ],
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
      '@cbnventures/nova/require-type-naming': [
        'error',
        {
          ignoreFiles: [
            './src/types/config-ui.d.ts',
          ],
        },
      ],
    },
  },
];
