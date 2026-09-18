import {
  dxCodeStyle,
  dxIgnore,
  fwDocusaurus,
  langMdx,
  langTypescript,
} from '@cbnventures/nova/presets/eslint';
import {
  NoAssignThenReturn,
  NoAwaitInLoop,
  NoBooleanVarForIf,
  NoBracketAssignment,
  NoBracketMethodCall,
  NoCatchUnknownAnnotation,
  NoComplexArrowConcise,
  NoDefaultExportDeclaration,
  NoDestructuring,
  NoExplicitAny,
  NoImplicitBoolean,
  NoInlineTypeAnnotation,
  NoLoggerDev,
  NoMultilineStrings,
  NoNumericLiterals,
  NoOptionalChaining,
  NoRawTextInCode,
  NoRegexLiteralFlags,
  NoRegexLiterals,
  NoRestParams,
  NoScriptUrl,
  NoSharedTypeImport,
  NoTemplateCurlyInString,
  NoTernaryInTemplateLiteral,
  NoUseBeforeDefine,
  RequireBracketPropertyAccess,
  RequireExplicitReturn,
  RequireHashPrivate,
  RequireImportOrder,
  RequireJsdocBody,
  RequireJsdocHierarchy,
  RequireJsdocParamAlignment,
  RequireJsdocParamName,
  RequireJsdocPresence,
  RequireJsdocPrivate,
  RequireJsdocReturns,
  RequireJsdocSince,
  RequireJsdocTagOrder,
  RequireKebabCaseFilename,
  RequireMultilineConditionGroups,
  RequireMultilineConditions,
  RequireNamingConvention,
  RequireNodeProtocol,
  RequirePaddingLines,
  RequireTernaryParens,
  RequireTypeNaming,
  RequireUndefinedInit,
  SwitchCaseBlocks,
} from '@cbnventures/nova/rules/eslint';

/**
 * ESLint Configuration.
 *
 * @since 0.11.0
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langMdx,
  ...langTypescript,
  ...fwDocusaurus,
  {
    name: 'custom-ignores',
    ignores: [],
  },
  {
    name: 'custom-tsconfig',
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.app.json',
          './tsconfig.config.json',
          './tsconfig.tests.json',
        ],
      },
    },
  },
  {
    name: 'nova-rules',
    files: [
      '**/*.js',
      '**/*.ts',
      '**/*.jsx',
      '**/*.tsx',
      '**/*.cjs',
      '**/*.cts',
      '**/*.mjs',
      '**/*.mts',
    ],
    plugins: {
      '@cbnventures/nova': {
        rules: {
          'no-assign-then-return': NoAssignThenReturn['rule'],
          'no-await-in-loop': NoAwaitInLoop['rule'],
          'no-boolean-var-for-if': NoBooleanVarForIf['rule'],
          'no-bracket-assignment': NoBracketAssignment['rule'],
          'no-bracket-method-call': NoBracketMethodCall['rule'],
          'no-catch-unknown-annotation': NoCatchUnknownAnnotation['rule'],
          'no-complex-arrow-concise': NoComplexArrowConcise['rule'],
          'no-default-export-declaration': NoDefaultExportDeclaration['rule'],
          'no-destructuring': NoDestructuring['rule'],
          'no-explicit-any': NoExplicitAny['rule'],
          'no-implicit-boolean': NoImplicitBoolean['rule'],
          'no-inline-type-annotation': NoInlineTypeAnnotation['rule'],
          'no-logger-dev': NoLoggerDev['rule'],
          'no-multiline-strings': NoMultilineStrings['rule'],
          'no-numeric-literals': NoNumericLiterals['rule'],
          'no-optional-chaining': NoOptionalChaining['rule'],
          'no-raw-text-in-code': NoRawTextInCode['rule'],
          'no-regex-literal-flags': NoRegexLiteralFlags['rule'],
          'no-regex-literals': NoRegexLiterals['rule'],
          'no-rest-params': NoRestParams['rule'],
          'no-script-url': NoScriptUrl['rule'],
          'no-shared-type-import': NoSharedTypeImport['rule'],
          'no-template-curly-in-string': NoTemplateCurlyInString['rule'],
          'no-ternary-in-template-literal': NoTernaryInTemplateLiteral['rule'],
          'no-use-before-define': NoUseBeforeDefine['rule'],
          'require-bracket-property-access': RequireBracketPropertyAccess['rule'],
          'require-explicit-return': RequireExplicitReturn['rule'],
          'require-hash-private': RequireHashPrivate['rule'],
          'require-import-order': RequireImportOrder['rule'],
          'require-jsdoc-body': RequireJsdocBody['rule'],
          'require-jsdoc-hierarchy': RequireJsdocHierarchy['rule'],
          'require-jsdoc-param-alignment': RequireJsdocParamAlignment['rule'],
          'require-jsdoc-param-name': RequireJsdocParamName['rule'],
          'require-jsdoc-presence': RequireJsdocPresence['rule'],
          'require-jsdoc-private': RequireJsdocPrivate['rule'],
          'require-jsdoc-returns': RequireJsdocReturns['rule'],
          'require-jsdoc-since': RequireJsdocSince['rule'],
          'require-jsdoc-tag-order': RequireJsdocTagOrder['rule'],
          'require-kebab-case-filename': RequireKebabCaseFilename['rule'],
          'require-multiline-condition-groups': RequireMultilineConditionGroups['rule'],
          'require-multiline-conditions': RequireMultilineConditions['rule'],
          'require-naming-convention': RequireNamingConvention['rule'],
          'require-node-protocol': RequireNodeProtocol['rule'],
          'require-padding-lines': RequirePaddingLines['rule'],
          'require-ternary-parens': RequireTernaryParens['rule'],
          'require-type-naming': RequireTypeNaming['rule'],
          'require-undefined-init': RequireUndefinedInit['rule'],
          'switch-case-blocks': SwitchCaseBlocks['rule'],
        },
      },
    },
    rules: {
      // Ban assigning to a variable only to return it on the next line.
      '@cbnventures/nova/no-assign-then-return': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban await inside loops so callers use Promise.all() for parallel work.
      '@cbnventures/nova/no-await-in-loop': [
        'error',
        {
          ignoreFiles: [],
          allowFor: false,
          allowForIn: false,
          allowForOf: true,
          allowWhile: true,
        },
      ],

      // Ban single-use boolean variables that exist only to feed the next if-statement.
      '@cbnventures/nova/no-boolean-var-for-if': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban bracket-notation assignment so mutations go through Reflect.set().
      '@cbnventures/nova/no-bracket-assignment': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban bracket-notation method calls with static strings so callers use dot notation.
      '@cbnventures/nova/no-bracket-method-call': [
        'error',
        {
          allowedMethods: [],
          ignoreFiles: [],
        },
      ],

      // Ban redundant `: unknown` on catch params since TypeScript already defaults to unknown.
      '@cbnventures/nova/no-catch-unknown-annotation': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban complex concise arrow bodies so deeply chained or nested callbacks use a block body.
      '@cbnventures/nova/no-complex-arrow-concise': [
        'error',
        {
          ignoreFiles: [],
          maxChainLength: 2,
          maxNestedArrows: 1,
        },
      ],

      // Ban attaching declarations to default exports so the export default stands alone at the bottom.
      '@cbnventures/nova/no-default-export-declaration': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban destructuring so property access stays explicit and readable.
      '@cbnventures/nova/no-destructuring': [
        'error',
        {
          assignmentExpressions: true,
          callbackParams: true,
          forOfLoops: true,
          functionParams: true,
          ignoreFiles: [],
          variableDeclarations: true,
        },
      ],

      // Ban the "any" type so callers use "unknown" with type guards or define a specific type.
      '@cbnventures/nova/no-explicit-any': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban truthy/falsy coercion in conditions so comparisons are always explicit.
      '@cbnventures/nova/no-implicit-boolean': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban inline type annotations in code files so all types live in named .d.ts aliases.
      '@cbnventures/nova/no-inline-type-annotation': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Warn whenever "Logger.dev" is used so dev-only statements stay noisy and get removed before release.
      '@cbnventures/nova/no-logger-dev': [
        'warn',
        {
          ignoreFiles: [],
        },
      ],

      // Ban multiline string content so callers use array joins for multi-line output.
      '@cbnventures/nova/no-multiline-strings': [
        'error',
        {
          allowEscapeSequences: false,
          ignoreFiles: [],
        },
      ],

      // Ban binary, octal, and hex literals so callers use parseInt() with an explicit base.
      '@cbnventures/nova/no-numeric-literals': [
        'error',
        {
          allowBinary: false,
          allowHex: false,
          allowOctal: false,
          ignoreFiles: [],
        },
      ],

      // Ban optional chaining (?.) so null checks are explicit and visible.
      '@cbnventures/nova/no-optional-chaining': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban flags on regex literals so callers choose flags at the call site via new RegExp(pattern, flags).
      '@cbnventures/nova/no-regex-literal-flags': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban inline regex literals so patterns are centralized in a shared patterns file.
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: '',
        },
      ],

      // Ban rest parameters so function signatures use explicit named parameters.
      '@cbnventures/nova/no-rest-params': [
        'error',
        {
          allow: [],
          ignoreFiles: [],
        },
      ],

      // Ban javascript: URLs to prevent XSS injection vectors.
      '@cbnventures/nova/no-script-url': [
        'error',
        {
          allowedPatterns: [],
          ignoreFiles: [],
        },
      ],

      // Ban importing shared.d.ts in code files so shared types flow only through domain .d.ts files.
      '@cbnventures/nova/no-shared-type-import': [
        'error',
        {
          ignoreFiles: [],
          sharedFiles: [],
        },
      ],

      // Ban ${} in regular strings so missing backticks are caught before literals appear in output.
      '@cbnventures/nova/no-template-curly-in-string': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban ternary expressions inside template literals so interpolations stay simple.
      '@cbnventures/nova/no-ternary-in-template-literal': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Ban referencing variables before their declaration so code reads top-to-bottom.
      '@cbnventures/nova/no-use-before-define': [
        'error',
        {
          classes: false,
          functions: false,
          ignoreFiles: [],
          types: false,
          variables: true,
        },
      ],

      // Require bracket notation for property access on project-defined plain objects.
      '@cbnventures/nova/require-bracket-property-access': [
        'error',
        {
          allowedProperties: [],
          ignoreFiles: [],
        },
      ],

      // Require an explicit "return;" at the end of void functions so control flow is always visible.
      '@cbnventures/nova/require-explicit-return': [
        'error',
        {
          excludeArrowFunctions: false,
          excludeConstructors: false,
          excludeSetters: false,
          ignoreFiles: [],
        },
      ],

      // Require #hash notation for private class fields instead of the private keyword.
      '@cbnventures/nova/require-hash-private': [
        'error',
        {
          ignoreFiles: [],
          skipMethods: true,
        },
      ],

      // Require 4-group import ordering: Node built-ins, third-party, local, then type imports.
      '@cbnventures/nova/require-import-order': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require a body description in JSDoc blocks between the summary and the first tag.
      '@cbnventures/nova/require-jsdoc-body': [
        'error',
        {
          ignoreFiles: [
            './docusaurus.config.ts',
            './eslint.config.mts',
            './sidebars.ts',
            './vitest.config.mts',
          ],
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

      // Require JSDoc summary lines to follow the file-path-derived hierarchy chain.
      '@cbnventures/nova/require-jsdoc-hierarchy': [
        'error',
        {
          anchorDirectories: [
            'src',
            'utils',
          ],
          ignoreFiles: [
            './docusaurus.config.ts',
            './eslint.config.mts',
            './sidebars.ts',
            './vitest.config.mts',
            './vitest.setup.ts',
          ],
          knownNames: {},
          stripDirectories: ['types'],
        },
      ],

      // Require vertical alignment of @param types, names, and dashes in JSDoc blocks.
      '@cbnventures/nova/require-jsdoc-param-alignment': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require @param descriptions to match the capitalized parameter name.
      '@cbnventures/nova/require-jsdoc-param-name': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require a leading JSDoc block on every documentable symbol.
      '@cbnventures/nova/require-jsdoc-presence': [
        'error',
        {
          ignoreFiles: [
            './docusaurus.config.ts',
            './eslint.config.mts',
            './sidebars.ts',
            './vitest.config.mts',
          ],
          skipDirectories: [
            'tests',
            'types',
          ],
        },
      ],

      // Require a @private tag in JSDoc blocks for private class members.
      '@cbnventures/nova/require-jsdoc-private': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require @returns tags to contain only a type in braces.
      '@cbnventures/nova/require-jsdoc-returns': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require a @since tag in every JSDoc block so additions are versioned.
      '@cbnventures/nova/require-jsdoc-since': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require canonical ordering and spacing of JSDoc tags.
      '@cbnventures/nova/require-jsdoc-tag-order': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require kebab-case filenames so naming stays consistent across the project.
      '@cbnventures/nova/require-kebab-case-filename': [
        'error',
        {
          extraExtensions: [],
          ignoreFiles: [
            './docusaurus.config.ts',
            './eslint.config.mts',
            './vitest.config.mts',
            './vitest.setup.ts',
          ],
        },
      ],

      // Require expanded formatting for parenthesized groups in mixed-operator logical expressions.
      '@cbnventures/nova/require-multiline-condition-groups': [
        'error',
        {
          groupStyle: 'operator-before-open',
          ignoreFiles: [],
        },
      ],

      // Require each operand on its own line when a logical expression exceeds the inline limit.
      '@cbnventures/nova/require-multiline-conditions': [
        'error',
        {
          ignoreFiles: [],
          maxInline: 2,
        },
      ],

      // Require PascalCase for classes, UnderscorePascalCase for type aliases, camelCase for functions/variables, UPPER_SNAKE for constants.
      '@cbnventures/nova/require-naming-convention': [
        'error',
        {
          classDeclaration: 'PascalCase',
          classMethod: 'camelCase',
          classProperty: 'camelCase',
          constant: 'UPPER_SNAKE_CASE',
          enum: 'PascalCase',
          enumMember: 'PascalCase',
          function: 'camelCase',
          ignoreFiles: [],
          interface: 'PascalCase',
          parameter: 'camelCase',
          reactComponent: 'PascalCase',
          typeAlias: 'UnderscorePascalCase',
          variable: 'camelCase',
        },
      ],

      // Require the "node:" protocol when importing Node.js built-in modules.
      '@cbnventures/nova/require-node-protocol': ['error'],

      // Require blank lines between declaration blocks and operations for visual separation.
      '@cbnventures/nova/require-padding-lines': [
        'error',
        {
          bareAwait: true,
          beforeLineComment: true,
          beforeLoops: true,
          betweenOperations: true,
          betweenSwitchCases: true,
          exitCodeBeforeReturn: true,
          ignoreFiles: [],
        },
      ],

      // Require parentheses around ternary conditions so the test expression is visually distinct.
      '@cbnventures/nova/require-ternary-parens': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require type alias names in .d.ts files to start with the class name prefix from the file path.
      '@cbnventures/nova/require-type-naming': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Require explicit "= undefined" for uninitialized variables so intent is never ambiguous.
      '@cbnventures/nova/require-undefined-init': [
        'error',
        {
          ignoreFiles: [],
        },
      ],

      // Enforce wrapping switch case bodies in braces to keep declarations scoped and avoid fallthrough surprises.
      '@cbnventures/nova/switch-case-blocks': [
        'error',
        {
          ignoreFiles: [],
          requireDefault: true,
        },
      ],
    },
  },
  {
    name: 'nova-rules/mdx',
    files: ['**/*.mdx'],
    plugins: {
      '@cbnventures/nova': {
        rules: {
          'no-raw-text-in-code': NoRawTextInCode['rule'],
        },
      },
    },
    rules: {
      // Ban raw text outside JSX elements in MDX files so all content is wrapped in proper markup.
      '@cbnventures/nova/no-raw-text-in-code': [
        'error',
        {
          ignoreFiles: [],
        },
      ],
    },
  },
];
