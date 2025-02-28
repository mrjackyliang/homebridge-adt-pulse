import javascriptPlugin from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

/**
 * ESLint config.
 *
 * @type {import('eslint').Linter.Config[]}
 *
 * @since 1.0.0
 */
const eslintConfig = [
  {
    name: 'all-rules',
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.jsx',
      '**/*.ts',
      '**/*.mts',
      '**/*.cts',
      '**/*.tsx',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@stylistic': stylisticPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...javascriptPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...stylisticPlugin.configs['recommended-flat'].rules,
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/member-delimiter-style': ['error', {
        singleline: {
          requireLast: true,
        },
      }],
      '@stylistic/multiline-ternary': ['off'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      'import/newline-after-import': ['error', {
        count: 1,
      }],
      'import/no-named-as-default': ['off'],
      'import/order': ['error', {
        alphabetize: {
          order: 'asc',
        },
      }],
      'no-console': ['warn', {
        allow: [
          'error',
          'info',
          'warn',
        ],
      }],
      'no-irregular-whitespace': ['error', {
        skipComments: true,
      }],
      'object-curly-newline': ['error', {
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      }],
    },
  },
  {
    name: 'typescript-rules',
    files: [
      '**/*.ts',
      '**/*.mts',
      '**/*.cts',
      '**/*.tsx',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-unused-vars': ['off'],
    },
  },
  {
    name: 'typescript-declaration-rules',
    files: [
      '**/*.d.ts',
    ],
    rules: {
      'no-var': ['off'],
    },
  },
];

export default eslintConfig;
