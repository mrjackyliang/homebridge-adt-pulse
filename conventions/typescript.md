# TypeScript / JavaScript Conventions

Quotes: Single. Indentation: 2-space. File naming: kebab-case (e.g., `markdown-table.ts`, `cli-header.d.ts`).

## Documentation Style

- Comment syntax: `/** */`
- Padding tag: `@since UNRELEASED` (JSDoc) — tag new or changed API with `@since UNRELEASED`; the release process stamps the real version automatically, so never hand-write a version number.
- Param format: `@param {TypeName} name - Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `@returns {TypeName}`
- Include `@private` tag for private members.

### JSDoc `@param` Alignment

- When multiple `@param` lines exist, pad so **both** param names AND `-` dashes align vertically.
- Pad after `}` so param names start at the same column (minimum 1 space).
- Pad after param name so all `-` dashes align at the same column.
- Optional params use `[name]` syntax in JSDoc.

```ts
// GOOD — param names aligned, dashes aligned
/**
 * @param {Cli_Changelog_Write_PackageDir}  packageDir  - Package dir.
 * @param {Cli_Changelog_Write_PackageName} packageName - Package name.
 * @param {Cli_Changelog_Write_Version}     version     - Version.
 * @param {Cli_Changelog_Write_Entries}     entries     - Entries.
 */

// GOOD — same-length types, 1 space after } suffices
/**
 * @param {Task_Runner_Constructor_Headers} headers   - Headers.
 * @param {Task_Runner_Constructor_Options} [options] - Options.
 */

// BAD — no alignment
/**
 * @param {Cli_Changelog_Write_PackageDir} packageDir - Package dir.
 * @param {Cli_Changelog_Write_PackageName} packageName - Package name.
 * @param {Cli_Changelog_Write_Version} version - Version.
 */
```

### Doc Comment Hierarchy

Class doc uses pretty name derived from the file's path segments (directories AND filename) joined with ` - `. Every segment is included verbatim. The single exception: when the filename is `index`, only the directories are used — the directory IS the identity (e.g., `src/toolkit/index.ts` → `Toolkit`, not `Toolkit - Index`). Member docs chain from the class pretty name. Known names (brands, abbreviations, compounds) are preserved: e.g., `eslint` → `ESLint`, `package-json` → `package.json`, `nextjs` → `Next.js`.

Note on JSDoc vs type-name divergence on `index`: JSDoc display names strip `index`; type-name prefixes do NOT (`src/cli/index.ts` → JSDoc `CLI`, type prefix `Cli_Index`). The type-naming system treats the path as identity verbatim — see "Named Type Naming" below.

### Full Documentation Example

The example below is for the file `src/cli/utility/changelog.ts`. The class is named `Runner` (per the "Class Name Is `Runner`" rule below), but type-name prefixes still derive from the file path — every type name starts with `Cli_Utility_Changelog_Runner_*`.

```ts
/**
 * CLI - Utility - Changelog.
 *
 * @since UNRELEASED
 */
export class Runner {
  /**
   * CLI - Utility - Changelog - Run.
   *
   * @param {Cli_Utility_Changelog_Runner_Run_Options} options - Options.
   *
   * @returns {Cli_Utility_Changelog_Runner_Run_Returns}
   *
   * @since UNRELEASED
   */
  public static async run(options: Cli_Utility_Changelog_Runner_Run_Options): Cli_Utility_Changelog_Runner_Run_Returns {
  }

  /**
   * CLI - Utility - Changelog - Fetch Data.
   *
   * @private
   *
   * @returns {Cli_Utility_Changelog_Runner_FetchData_Returns}
   *
   * @since UNRELEASED
   */
  private static async fetchData(): Cli_Utility_Changelog_Runner_FetchData_Returns {
  }

  /**
   * CLI - Utility - Changelog - Format Line.
   *
   * @param {Cli_Utility_Changelog_Runner_FormatLine_Prefix}  prefix  - Prefix.
   * @param {Cli_Utility_Changelog_Runner_FormatLine_Message} message - Message.
   *
   * @private
   *
   * @returns {Cli_Utility_Changelog_Runner_FormatLine_Returns}
   *
   * @since UNRELEASED
   */
  private static formatLine(prefix: Cli_Utility_Changelog_Runner_FormatLine_Prefix, message: Cli_Utility_Changelog_Runner_FormatLine_Message): Cli_Utility_Changelog_Runner_FormatLine_Returns {
  }
}
```

## Type System

### No Inline Types in Code Files

> Inline examples in this section (and elsewhere in this doc) use a short prefix like `Runner_*`, `Validator_*`, `Syncer_*`, `MarkdownTable_*`, `Fetcher_*` for brevity — read it as the full form `{PathPrefix}_Runner_*` (e.g., `Cli_Utility_Foo_Runner_*` for `cli/utility/foo.ts`). Real `.d.ts` files always include the full path prefix. The "Named Type Naming" section below covers the full pattern.

Every `const`/`let` declaration in a method body uses a named alias from a `.d.ts` file. No exceptions — even when TypeScript can infer the type, the explicit named annotation is required for traceability. This applies to all forms: array literals, Sets, Records, Maps, union types, generics, and inferred primitives.

**Excluded from this rule** (rely on TypeScript inference):
- Callback parameters (`.map((item) => ...)`, `.filter((key) => ...)`)
- `for...of` loop variables (`for (const entry of entries)`)
- `for...in` loop variables (`for (const property in object)`)
- `for` loop indices (`for (let i = 0; ...)`)

```ts
// BAD — inline types
const entries: TaskEntry[] = [];
const files: string[] = [];
let selectedPackage: string | undefined;
const allowedKeys = new Set<string>([...]);
const reordered: Record<string, unknown> = {};

// BAD — relying on inference for body variable
const header = this.formatRow(this.#headers, columnWidths);
const directory = path.dirname(filePath);

// GOOD — named types from .d.ts
const entries: Runner_Parse_Entries = [];
const files: Runner_Parse_Files = [];
let selectedPackage: Runner_Run_SelectedPackage;
const allowedKeys: Validator_Check_AllowedKeys = new Set([...]);
const reordered: Syncer_HandleReorder_Reordered = {};

// GOOD — named types even for inferred primitives
const header: MarkdownTable_Render_Header = this.formatRow(this.#headers, columnWidths);
const directory: Runner_SaveFile_Directory = path.dirname(filePath);

// GOOD — inference OK for these (excluded from rule)
items.filter((item) => item.length > 0);
for (const entry of entries) { ... }
for (let i = 0; i < count; i += 1) { ... }
```

### Types in Separate `.d.ts` Files

```
src/cli/utility/changelog.ts → types live in:
src/types/cli/utility.d.ts   → domain types
src/types/shared.d.ts        → shared types (only imported by .d.ts files)
```

### Mirrored Directory Structure

Category folders (`types/`, `tests/`, and in Next.js `styles/`) mirror the source path. Each source file gets its own corresponding file. Exception: `.d.ts` files are only created when there are actual types to export — don't create empty stubs just to satisfy the mirror structure.

```
src/lib/utility.ts            → src/types/lib/utility.d.ts
src/lib/utility.ts            → src/tests/lib/utility.test.ts
src/toolkit/markdown-table.ts → src/types/toolkit/markdown-table.d.ts
src/cli/utility/changelog.ts  → src/types/cli/utility/changelog.d.ts
src/cli/utility/initialize.ts → src/types/cli/utility/initialize.d.ts
```

### Type Layering

`shared.d.ts` → domain `.d.ts` files → `.ts` code files. Shared types only imported by `.d.ts` files, never by `.ts` code.

```ts
// shared.d.ts
export type EntryCategory = 'added' | 'updated' | 'fixed' | 'removed';

// types/cli/runner.d.ts — imports from shared.d.ts
import type { EntryCategory } from '@/types/shared.d.ts';
export type Cli_Runner_Record_SelectedCategory = EntryCategory;

// cli/runner.ts — imports from runner.d.ts, NEVER from shared.d.ts
import type { Cli_Runner_Record_SelectedCategory } from '@/types/cli/runner.d.ts';
```

### Type Ordering in `.d.ts` Files

**Sections** are in alphabetical order by their full section prefix (path + class + method/function/(string, fn) chunks). **Within each section**, types are ordered by first-use, first-listed (first come, first serve): parameters first (used first in the signature), then return/typeguard (used next in the signature), then body variable types in the sequential order they appear in the method body. This is strictly code-order, NOT alphabetical.

The reason for first-come-first-serve ordering: the `.d.ts` file reads as a parallel of the `.ts` file. When reading the implementation top to bottom and encountering a type, it appears at the same relative position in the `.d.ts`. The `.d.ts` is a table of contents for the implementation — same order, same flow, no hunting.

The **only** valid forward references: return-position type aliases — `Returns`, `TypeGuard`, and the singular `Return` — referencing a type defined later in the same section. The return-position alias still comes first because it's used first (in the signature). This covers two patterns: the alias referencing a body variable the method returns, and the alias referencing a return object type whose properties are defined after it. All other types must be defined before use.

(Reminder: examples use `Runner_*` shorthand — see the note at the top of "No Inline Types in Code Files" for the full `{PathPrefix}_Runner_*` form.)

```ts
/** Runner - Execute. */
export type Runner_Execute_Options = { ... };                                // param (used first)
export type Runner_Execute_Returns = Promise<void>;                          // return (used next)
export type Runner_Execute_Config = Record<...>;                             // body variable (used later, sequential order)

/** Runner - Group items. */
export type Runner_GroupItems_Items = ...;                                   // param (used first)
export type Runner_GroupItems_Returns = Runner_GroupItems_Grouped;           // return (used next, forward ref OK)
export type Runner_GroupItems_Grouped = Map<...>;                            // body variable (used later, owns the definition)
export type Runner_GroupItems_Processed = Set<...>;                          // body variable (used later, sequential order)

/** Runner - Detect platform. */
export type Runner_DetectPlatform_Url = string;                              // param (used first)
export type Runner_DetectPlatform_Returns = Runner_DetectPlatform_Platform;  // return (forward ref OK)
export type Runner_DetectPlatform_Platform_Id = 'a' | 'b';                   // return object property
export type Runner_DetectPlatform_Platform_Url = string;                     // return object property
export type Runner_DetectPlatform_Platform = {                               // return object (owns the definition)
  id: Runner_DetectPlatform_Platform_Id;
  url: Runner_DetectPlatform_Platform_Url;
};
```

### Named Type Naming

Pattern: `{PathPrefix}_{ClassName}_{MethodName}_{VariableName}` — chunks joined by underscores, each chunk PascalCase. The path prefix is derived from the file path: every path segment becomes one chunk (PascalCase, with hyphenated names like `package-json` flattened to `PackageJson` within the chunk). No segments are stripped — the path is the identity verbatim. The type naming system does NOT use brand casing (e.g., `Cli` not `CLI`, `Api` not `API`, `Eslint` not `ESLint`). Brand casing is reserved for JSDoc hierarchy display only.

**Pattern slots are conditional, not always present.** Each of the four slots is only filled when applicable to the source file:

- `{PathPrefix}` — **always present** (derived from the file path).
- `{ClassName}` — present only when the source file has a class declaration. Uniformly the literal `Runner` (see "Class Name Is `Runner`" below).
- `{MethodName}` — present only when the source has methods, functions, or function-typed `const`s. Top-level types defined outside any function/method skip this slot.
- `{VariableName}` — present only when the type names a specific variable, parameter, property, or return value. Types that describe the section itself (not a specific identifier within it) skip this slot.

Examples spanning the slot combinations:

```
// All four slots — class + method + body variable
src/api/node-releases.ts → Api_NodeReleases_Runner_FetchLtsVersions_ResponseData

// No class slot — file has functions only, no class declaration
src/tests/type-declarations.ts → Tests_TypeDeclarations_ExtractObjectTypes_ObjectType

// Only path prefix + variable — top-level type, no class, no method
src/lib/constants.ts → Lib_Constants_DocsBaseUrl
```

```
src/cli/utility/changelog.ts           → Cli_Utility_Changelog
src/cli/generate/must-haves/dotenv.ts  → Cli_Generate_MustHaves_Dotenv
src/cli/recipe/package-json/cleanup.ts → Cli_Recipe_PackageJson_Cleanup
src/cli/index.ts                       → Cli_Index
src/toolkit/index.ts                   → Toolkit_Index
```

Type prefixes are built from the source mechanically. Each level adds a chunk:

| Source                                               | Adds a chunk | Chunk content                                                        |
|------------------------------------------------------|--------------|----------------------------------------------------------------------|
| File path segment                                    | yes          | segment PascalCased (verbatim, no segments stripped)                 |
| Class declaration                                    | yes          | class name PascalCased                                               |
| Constructor                                          | yes          | literal `Constructor`                                                |
| Method declaration                                   | yes          | method name PascalCased (incl. private `#name`)                      |
| Top-level function declaration                       | yes          | function name PascalCased                                            |
| Top-level function-typed `const`                     | yes          | const name PascalCased                                               |
| Nested function declaration / function-typed `const` | yes          | name PascalCased                                                     |
| `(string, fn)` call expression                       | yes          | string parsed (split on non-word, PascalCase each part, concatenate) |
| Body variable / parameter                            | yes          | title-cased var/param name (the leaf)                                |
| Object property                                      | yes          | property key PascalCased (chained on the parent object's type name)  |

```
Cli_Utility_Changelog                  → file path
  Runner                               → class chunk
    Release                            → method
      Release                          → object variable
        PackageName                    → property
= Cli_Utility_Changelog_Runner_Release_Release_PackageName
```

Repetition (e.g., `Release_Release`) is expected when a method name matches the variable name — the `release()` method produces `release` objects. The convention does not deduplicate — each chunk maps to one level, keeping the namespace unambiguous, and the underscore makes the boundary visible.

The variable name must match the actual parameter/variable name in the code. The method name must match the method where the type is used — don't reuse a type from another method even if the underlying type is the same.

```ts
// BAD — type name references filter, but used in categorize
private static categorize(items: Cli_Foo_Runner_Filter_Items): ...

// GOOD — type name matches the method it's used in
private static categorize(items: Cli_Foo_Runner_Categorize_Items): ...
```

**Generic `(string, fn)` call expressions.** Any call where the first argument is a string literal AND a later argument is a function expression adds a chunk dynamically — the string parsed via `parseDescribeString` (split on non-alphanumeric, PascalCase each piece, concatenate). This applies recursively at any depth and is not limited to test framework calls. Examples that match: `describe('Db', ...)`, `it('does X', ...)`, `app.get('/users', handler)`, `db.transaction('init', tx => ...)`, `button.addEventListener('click', () => ...)`. Template strings with interpolation (`` `test ${i}` ``) and variable arguments do NOT match — only string literals.

**Source-identifier-based section detection.** The section a type belongs to is derived from source-code identifiers (class/method/function names, `(string, fn)` call arguments), NOT from JSDoc summary comments. JSDoc remains as documentation but plays no role in section computation — comments drift, identifiers can't. The meta-test parses the source file's AST to determine which section each line belongs to; types in `.d.ts` must use the corresponding section prefix.

### Class Name Is `Runner`

Files that declare a single primary class use the literal name `Runner` for that class. The class name is purely a placeholder slot in the type-naming pattern — its semantic meaning comes from the file path, not from the identifier.

Why generic? Three reasons:

1. **The path already carries the meaning.** A file at `src/api/node-releases.ts` is unambiguously about Node releases. Naming the class `ApiNodeReleases` doubles the information already present in the import path — and bloats every type name with `Api_NodeReleases_ApiNodeReleases_*`.
2. **Type names stay short and consistent.** With `Runner` as a fixed slot, the pattern reads as `{PathPrefix}_Runner_{MethodName}_{VariableName}` for every class file. No surprises, no per-file naming negotiation.
3. **Refactoring is cheaper.** Renaming the file (or moving it) updates the path prefix mechanically; the class identifier never has to change.

```ts
// src/api/node-releases.ts
// BAD — class name duplicates the file path
export class ApiNodeReleases {
  public static async fetchLtsVersions(...): ... { }
}

// GOOD — class is `Runner`, path conveys meaning
export class Runner {
  public static async fetchLtsVersions(...): ... { }
}
```

Consumers import the generic name and rely on the path for context:

```ts
// some-consumer.ts
import { Runner } from '../api/node-releases.js';

const versions = await Runner.fetchLtsVersions();
```

If a consumer wants to import the class under a domain-specific local name, use an import alias or a barrel re-export:

```ts
// Option A — import alias at the call site
import { Runner as NodeReleases } from '@/api/node-releases.js';

// Option B — barrel re-export
// src/api/index.ts
export { Runner as NodeReleases } from './node-releases.js';
// consumer
import { NodeReleases } from '@/api/index.js';
```

This also satisfies the older "Identifier Names Cannot Equal File Name" rule (no `Changelog` class in `changelog.ts`) — `Runner` never equals a file name, so type-name doubling like `Cli_Utility_Changelog_Changelog_*` cannot occur.

### Function and Const Names Cannot Equal File Name (C2, C3)

Top-level function and function-typed `const` names must NOT equal the file name (PascalCased, with hyphens flattened). Forces meaningful identifiers and prevents type-name doubling like `Lib_Utility_Utility_*`.

```ts
// lib/utility.ts — file name "utility" → "Utility"
export function utility(): ... {}                  // BAD — function name == file name
export function getCurrentTimestamp(): ... {}      // GOOD

const utility: ... = () => {};                     // BAD — const name == file name
const formatRow: ... = () => {};                   // GOOD
```

### Filename and Path Segment Rules (EC19, EC20, EC21)

Path segments (each directory and the file basename) must match `/^[a-z][a-z0-9-]*$/` after stripping the recognized suffixes (`.d.ts`, `.tsx`, `.ts`, `.test`). The strip-list is fixed and minimal — no other dotted suffixes are recognized.

```
foo.ts          → GOOD
foo-bar.ts      → GOOD (hyphens flatten in PascalCasing)
foo123.ts       → GOOD (digits OK, just not as the first character)
foo.test.ts     → GOOD (`.test` recognized and stripped)
foo.bar.ts      → BAD (`.bar` not recognized; rename to foo-bar.ts)
foo.spec.ts     → BAD (`.spec` not recognized; use `.test` or `-spec`)
123foo.ts       → BAD (starts with a digit)
foo_bar.ts      → BAD (underscore)
foo$bar.ts      → BAD (special char)
foo bar.ts      → BAD (space)
```

### Named Type Alias per Param and Return

Each function parameter and return value gets its own named type alias. The full type-name prefix includes the `Runner` class slot when the source file declares a class (see "Class Name Is `Runner`").

```ts
// types/toolkit/markdown-table.d.ts
export type Toolkit_MarkdownTable_Runner_Constructor_Headers = string[];
export type Toolkit_MarkdownTable_Runner_AddRow_Row = string[];
export type Toolkit_MarkdownTable_Runner_AddRow_Returns = void;

// toolkit/markdown-table.ts
/**
 * Toolkit - Markdown Table - Add row.
 *
 * @param {Toolkit_MarkdownTable_Runner_AddRow_Row} row - Row.
 *
 * @returns {Toolkit_MarkdownTable_Runner_AddRow_Returns}
 *
 * @since UNRELEASED
 */
public addRow(row: Toolkit_MarkdownTable_Runner_AddRow_Row): Toolkit_MarkdownTable_Runner_AddRow_Returns { ... }
```

### `satisfies` vs `:` Type Annotation

- `satisfies` — shape validation while keeping specific literal types. Use for object literals and config objects where you want autocomplete on exact keys and typo detection.
- `:` annotation — when the variable should be treated as the broader type. Use for function params, class fields, and variables that get reassigned.

```ts
// satisfies — keeps literal types, catches bad key access
const config = {
  name: 'nova',
  version: '1.0.0',
} satisfies Record<string, string>;
config.name;     // type is 'nova' (literal)
config.anything; // ERROR

// : annotation — widens to the annotated type
const config: Record<string, string> = {
  name: 'nova',
  version: '1.0.0',
};
config.name;     // type is string
config.anything; // no error
```

### Type Guards Use `TypeGuard` Suffix, Not `Returns`

Type guard methods/functions use `TypeGuard` instead of `Returns` for the narrowed type. No `Returns` type exists for type guards.

```ts
// .d.ts
export type Runner_IsErrorResponse_Value = unknown;
export type Runner_IsErrorResponse_TypeGuard = ErrorResponse;

// .ts
private static isErrorResponse(value: Runner_IsErrorResponse_Value): value is Runner_IsErrorResponse_TypeGuard {
  return (
    typeof value === 'object'
    && value !== null
    && 'code' in value
    && 'message' in value
  );
}
```

`TypeGuard` (and `Returns` and the singular `Return`) are reserved for return positions only — they MUST NOT appear at body-variable or parameter positions. The meta-test enforces this.

### Variable Type Symmetry

Every typed declaration in source code must follow rules 7.1–7.8. The meta-test (`packages/nova/src/tests/type-declarations.test.ts`) walks every `.ts` source file and enforces these mechanically — there is no "common sense" exception.

**7.1 Leaf must equal title-cased var name.** A typed body variable / parameter named `xxx` must use a type whose leaf chunk is `Xxx` (title-cased), and whose preceding chunks match the surrounding source section (class + method / function / `describe` string).

```ts
// GOOD — leaf 'Items' matches var name 'items'
const items: Cli_Utility_DoThing_Items = ...;

// GOOD — class-prefix passthrough (skips the method chunk) is also valid
const items: Cli_Utility_Items = ...;

// BAD — leaf 'Things' does not match var name 'items'
const items: Cli_Utility_DoThing_Things = ...;
```

**7.2 Cross-module body-variable types are forbidden — no alias loophole.** A `.ts` body variable's type must be defined in the corresponding `.d.ts` (the same module) AND must NOT be a direct alias to a foreign type. Three escape hatches:

```ts
// BAD — local definition but only an alias to a foreign type
import type { Lib_Utility_FetchData_Returns } from '@/types/lib/utility.d.ts';
export type Cli_Foo_Run_Data = Lib_Utility_FetchData_Returns;

// (a) Promote the shape to shared.d.ts
// types/shared.d.ts
export type FetchedConfigData = { name: string; version: string };
// types/cli/foo.d.ts
import type { FetchedConfigData } from '@/types/shared.d.ts';
export type Cli_Foo_Run_Data = FetchedConfigData;

// (b) Redefine the concrete shape locally
export type Cli_Foo_Run_Data = { name: string; version: string };

// (c) Don't store in a typed body var — let inference work
const result = await fetchData();
```

**7.3 Return-position-only suffixes (`Returns`, `TypeGuard`, `Return`) are banned at body/param positions.** These suffixes are reserved for function return type aliases.

**7.4 Inline typed callbacks are forbidden.** Anonymous arrow callbacks with typed parameters must be extracted to a named `const` so they follow rule 7.1 like any other function-typed `const`. Untyped inline callbacks (relying on TypeScript inference) remain allowed.

```ts
// BAD — inline anonymous typed callback
items.filter((value: Runner_Foo_Item): boolean => value.active);

// GOOD — extracted to named const, which then follows rule 7.1
const isActive: Runner_Foo_IsActive = (value: Runner_Foo_IsActive_Value): boolean => value.active;
items.filter(isActive);

// GOOD — untyped inline callback is fine (inference)
items.filter((value) => value.active);
```

**7.5 Function returns must end in `Returns` (plural).** Regular (non-type-guard) function return type aliases use the plural form.

**7.6 Singular `Return` is banned at return positions.** Use `Returns` instead.

**7.7 `TypeGuard` only at type-guard return positions.** A return type ending in `TypeGuard` must be on a function written as `value is T`. Conversely, `value is T` return positions must use a `TypeGuard`-suffixed type.

**7.8 Two declarations in the same `.ts` file may not produce the same expected type name.** The most common trigger is two `describe(string, ...)` blocks with identical strings, or two extracted typed callbacks with the same chosen const name in the same enclosing method. The meta-test catches this before the duplicate `export type` lands in the `.d.ts`, with a clearer error than TypeScript's "duplicate identifier" message.

### Standalone Type Files (S1, S2, S3, S4)

Files listed in the meta-test's `testConfig.standaloneTypeFiles` (typically `shared.d.ts`, `fetch-response.d.ts`) follow a separate rule set. They contain domain concepts that are imported by multiple modules; they are NOT mirrors of source files.

**S1. PascalCase identifiers, no brand casing.** Top-level type names are PascalCase glued; nested property types use `Parent_Property` form. Brand casing (3+ consecutive uppercase letters) is forbidden — `Url` not `URL`, `Api` not `API`.

**S2. Path prefix is kept like every other file.** Standalone files are NOT exempt from the path-prefix rule — `shared.d.ts` types start with `Shared_`, `fetch-response.d.ts` types start with `FetchResponse_`, and so on. The path is the identity verbatim, the same as for domain `.d.ts` files. (The earlier rule that stripped the prefix for standalone files has been removed.)

```ts
// shared.d.ts
// BAD (old behavior) — prefix stripped
export type BorderCharacters = { ... };

// GOOD — prefix kept, same as every other file
export type Shared_BorderCharacters = { ... };
```

**S3. Object property types follow `Parent_Property` form, composed with the path prefix.** When a property uses a local type, the property type name must start with the parent object's name plus an underscore. The `Parent_Property` form **composes with** the path prefix rather than replacing it — the prefix stays in front, the `Parent_Property` chain extends behind it. Add an intermediate alias if needed.

```ts
// shared.d.ts
// BAD (old behavior) — standalone file stripped the prefix
export type BorderCharacters_TopLeft = string;
export type BorderCharacters = {
  topLeft: BorderCharacters_TopLeft;
};

// GOOD — prefix kept, Parent_Property chains behind it
export type Shared_BorderCharacters_TopLeft = string;
export type Shared_BorderCharacters = {
  topLeft: Shared_BorderCharacters_TopLeft;
};

// Deeper chains compose the same way
export type Shared_ApiFormResponse_Info_Message = string;
export type Shared_ApiFormResponse_Info = {
  message: Shared_ApiFormResponse_Info_Message;
};
export type Shared_ApiFormResponse = {
  info: Shared_ApiFormResponse_Info;
};
```

External API payloads commonly use snake_case or kebab-case keys. The property type name PascalCases the key — underscores and hyphens flatten, exactly like file paths. The literal key in the object type stays quoted in its original form so it serializes correctly:

```ts
// shared.d.ts — external API response (e.g., Cloudflare Turnstile)
export type Shared_TurnstileResponse_ChallengeTs = string;     // snake_case key 'challenge_ts'
export type Shared_TurnstileResponse_ErrorCodes = string[];    // kebab-case key 'error-codes'
export type Shared_TurnstileResponse = {
  'challenge_ts': Shared_TurnstileResponse_ChallengeTs;
  'error-codes': Shared_TurnstileResponse_ErrorCodes;
};
```

Top-level enum-like aliases also keep the prefix:

```ts
// shared.d.ts
export type Shared_EntryCategory = 'added' | 'updated' | 'fixed' | 'removed';
export type Shared_EntryBump = 'major' | 'minor' | 'patch';

export type Shared_EntryItem_Category = Shared_EntryCategory;
export type Shared_EntryItem_PackageName = string;
export type Shared_EntryItem = {
  category: Shared_EntryItem_Category;
  packageName: Shared_EntryItem_PackageName;
};
```

**S4. Array element types defined before the array.** Same as E3 in domain `.d.ts` files.

```ts
export type Shared_EntryItem_Tag = string;
export type Shared_EntryItem_Tags = Shared_EntryItem_Tag[];
```

### No Redundant Intermediate Type Aliases

Don't create a type alias that only exists to be referenced by one other type. But if param and return have the same underlying type, keep them separate — they're semantically different (input vs output). Don't reference the param type from the return type.

```ts
// BAD — Filtered only exists to be referenced by Returns
export type Runner_Filter_Items = Item[];
export type Runner_Filter_Filtered = Item[];
export type Runner_Filter_Returns = Runner_Filter_Filtered;

// BAD — Returns references Items (input ≠ output semantically)
export type Runner_Filter_Items = Item[];
export type Runner_Filter_Returns = Runner_Filter_Items;

// GOOD — same underlying type, but defined independently
export type Runner_Filter_Items = Item[];
export type Runner_Filter_Returns = Item[];

// BAD — Response only exists to be referenced by Returns
export type Fetcher_GetData_Response = z.infer<typeof FetcherResponseSchema>;
export type Fetcher_GetData_Returns = Promise<Fetcher_GetData_Response | undefined>;

// GOOD — z.infer inlined directly into Returns
export type Fetcher_GetData_Returns = Promise<z.infer<typeof FetcherResponseSchema> | undefined>;
```

### Never Flatten Types in `.d.ts` Files

Always reference named types, never resolve to their primitive. Maintains the type path so changes propagate.

```ts
// shared.d.ts
export type EntryPackage = string;
export type EntryMessage = string;

// BAD — flattened to primitive, loses the type path
export type Runner_Parse_EntryPackage = string | undefined;
export type Runner_Write_ByCategory = Map<EntryCategory, string[]>;

// GOOD — references the shared type
export type Runner_Parse_EntryPackage = EntryPackage | undefined;
export type Runner_Write_ByCategory = Map<EntryCategory, EntryMessage[]>;

// BAD — nested array, loses the type path
export type Runner_Group_Rows = string[][];

// GOOD — singular references primitive, plural references singular
export type Runner_Group_Row = string[];
export type Runner_Group_Rows = Runner_Group_Row[];
```

When creating a `= string` type, check if it represents a domain concept that has a shared type. If so, reference it. Genuinely `string` types include: generated file names, directory paths, version strings, CLI formatting strings, generic utility returns, external API data, prompt output keys, test setup paths.

### Shared Type Consolidation Rule

Two triggers for moving a type into `shared.d.ts`:

1. **Cross-section reference**: A type in one section of a `.d.ts` file references a type from another section in the same file. Even a single cross-section reference means the dependency belongs in `shared.d.ts`.
2. **Multiple dependents**: More than 1 type in a `.d.ts` file depends on the same type (from the same file or another domain `.d.ts` file).

Both prevent fragile cross-references where removing one type silently breaks others.

```ts
// GOOD — shared type in shared.d.ts, imported once by domain .d.ts
import type { EntryBump } from '@/types/shared.d.ts';
export type Runner_Record_SelectedBump = EntryBump;
export type Runner_Release_HighestBump = EntryBump;
export type Runner_Parse_EntryBump = EntryBump | undefined;
```

### Object Property Types Form a Hierarchy

Object property types belong to their parent object — they are scoped to that specific context. Each property gets its own named type whose name literally starts with the parent object's name (e.g., property `packageName` of `Runner_Release_Release` uses type `Runner_Release_Release_PackageName`). The property type must be defined on a line *before* the object type that references it.

**Array element types follow the same rule.** When `Items = Item[]`, the element type `Item` must be defined in the same file (or imported) and on a line *before* `Items`. The exception: when the array type's name ends in `Returns`, `TypeGuard`, or the singular `Return` (return positions are exempt). The meta-test enforces both rules.

If a variable in a different method needs the same underlying type, it must NOT import from another method's object hierarchy. That creates cross-dependencies between unrelated methods. Instead, the common base type goes into `shared.d.ts`. Both the object property type and the unrelated variable type reference `shared.d.ts` independently — no lateral dependencies.

```ts
// shared.d.ts
export type ChangelogEntryPackage = string;

// GOOD — release method's object hierarchy references shared.d.ts
export type Runner_Release_Release_PackageName = ChangelogEntryPackage;
export type Runner_Release_Release = {
  packageName: Runner_Release_Release_PackageName;
};

// GOOD — record method also references shared.d.ts independently
export type Runner_Record_SelectedPackage = ChangelogEntryPackage | undefined;

// BAD — record method reaching into release method's object hierarchy
export type Runner_Record_SelectedPackage = Runner_Release_Release_PackageName | undefined;
```

Within the same method, a standalone variable and an object property that share the same domain concept also define their types independently — both reference the base type, neither references the other.

```ts
// GOOD — both reference shared.d.ts, neither references the other
export type Runner_Release_Release_HighestBump = ChangelogEntryBump;
export type Runner_Release_Release = {
  highestBump: Runner_Release_Release_HighestBump;
};
export type Runner_Release_HighestBump = ChangelogEntryBump;
```

### Tight Types over Loose Types

Define the exact shape. No `Record<string, string>` when fields are known.

```ts
// BAD — frontmatter has known fields
export type Runner_Parse_FrontMatter = Record<string, string>;

// GOOD — define exact shape with named field types
export type Runner_Parse_FrontMatter_Package = string;
export type Runner_Parse_FrontMatter_Category = EntryCategory;
export type Runner_Parse_FrontMatter_Bump = EntryBump;
export type Runner_Parse_FrontMatter = {
  package: Runner_Parse_FrontMatter_Package;
  category: Runner_Parse_FrontMatter_Category;
  bump: Runner_Parse_FrontMatter_Bump;
};
```

### `as` Casts — Avoid Unless Compiler-Forced

Avoid `as` casts — they bypass type safety and can crash at runtime. Prefer `.find()` or type guards.

However, some `as` casts are unavoidable because TypeScript's type system loses information. The forced patterns:

| Pattern                                  | Why forced                                                  |
|------------------------------------------|-------------------------------------------------------------|
| `Object.fromEntries()`                   | Returns `{ [k: string]: any }` — can't narrow keys          |
| `Object.keys()`                          | Returns `string[]` — TypeScript won't narrow to actual keys |
| `new Command()`                          | Commander's generic type doesn't match custom CLI type      |
| String indexing a union-keyed object     | `string` can't index a union-key type                       |
| Literal array to tuple/union type        | Widens to `string` without cast                             |
| Regex captures                           | Always `string`, can't narrow to union                      |
| `Record<string, unknown>` bracket access | Returns `unknown`, can't narrow                             |

Type guard internals do NOT need `as` — use `in` narrowing instead after `null`/`typeof` guard.

```ts
// BAD — as cast when .find() can replace it
selectedCategory = options.category as Runner_Record_SelectedCategory;

// GOOD — .find() validates AND narrows
const validCategory = validCategories.find(
  (validCategory) => validCategory === options.category,
);
selectedCategory = validCategory;
```

### External API Responses — Validate with Zod

`response.json()` returns `unknown`. Don't blindly cast with `as` — the data comes from an external source and its shape is not guaranteed. Define a Zod schema in `src/lib/schema.ts` and use `.parse()` for runtime validation. Derive the `.d.ts` type with `z.infer<typeof Schema>`.

```ts
// GOOD — Zod runtime validation
const responseData = await response.json();
const data: Fetcher_GetData_Response = FetcherResponseSchema.parse(responseData);

// BAD — blind cast, no runtime validation
const data: Fetcher_GetData_Response = await response.json() as Fetcher_GetData_Response;
```

This applies to all external API boundaries (`fetch`, webhook payloads, etc.). Internal typed data (e.g., `Object.fromEntries`, `Object.keys`) still uses `as` casts where compiler-forced.

### Local Files with Unpredictable Shapes

Files like `package.json` have too many optional/third-party fields to define a Zod schema. Use the absorb-into-typed-container pattern with `Record<string, unknown>` and `as` casts for bracket access.

```ts
const config: Runner_Run_Config = JSON.parse(configRaw);
const configItems = config['items'] as Runner_Filter_Items;
```

### `JSON.parse` — Type the Result Immediately

`JSON.parse` returns implicit `any`. Never let it float around — annotate with a named type (e.g., `Record<string, unknown>`) immediately. Then access fields via bracket notation. Don't wrap in an extra object unless the surrounding code already needs one (like pushing into an array with multiple fields).

```ts
// GOOD — typed directly
const config: Runner_Run_Config = JSON.parse(configRaw);
const configItems = config['items'] as Runner_Filter_Items;

// GOOD — absorbed into existing structure
const parsedFile = JSON.parse(rawFile);
dataFiles.push({
  manifest: itemManifest,
  filePath: absolutePath,
  fileContents: parsedFile, // absorbed into Record<string, unknown>
});
// later: fileContents['name'], fileContents['version'], etc.

// BAD — implicit any floating around
const config = JSON.parse(configRaw);
const items = config.items ?? []; // any propagates

// BAD — unnecessary wrapping object
const config: Runner_Run_Config = {
  fileContents: JSON.parse(configRaw),
};
```

### Variables from `Record<string, unknown>` Need Explicit Types

When accessing a field from a `Record<string, unknown>` container (e.g., from `JSON.parse`), the result is `unknown`. Annotate with a named type.

```ts
// BAD — result is unknown, no annotation
const configItems = config.fileContents['items'];

// GOOD — explicit type annotation
const configItems: Runner_Filter_Items = config.fileContents['items'];
```

### `as const` Is Acceptable

Used for narrowing literals. Consistent patterns:
- Prompt choices — `{ type: 'select' as const }` (required by prompts library)
- `Object.fromEntries()` tuples — `['key', value] as const` (preserves tuple position types)
- Fixed arrays for property access — `['author', 'contributor'] as const`

### Use `.find()` to Validate AND Narrow Types

Replaces `.includes()` + `as` casts in one step.

```ts
// BAD — .includes() doesn't narrow, needs unsafe cast
if (!validCategories.includes(options.category as typeof selectedCategory)) { ... }
selectedCategory = options.category as typeof selectedCategory;

// GOOD — .find() narrows the return type
const matchedCategory = validCategories.find(
  (validCategory) => validCategory === options.category,
);
if (matchedCategory === undefined) { ... return; }
selectedCategory = matchedCategory;
```

## Import Rules

### Import Ordering (6 Groups)

Groups separated by a blank line, alphabetical within each group. Specifiers within each `import { ... }` must also be alphabetical.

1. Node built-ins (e.g., `child_process`, `fs`, `os`, `path`) — detected by name, `node:` prefix not required
2. Third-party packages (e.g., `chalk`, `prompts`)
3. Local imports (e.g., `@/lib/utility`, `@/toolkit/logger`)
4. `import type` from Node built-ins
5. `import type` from third-party
6. `import type` from local (`@/`, `./`, `../`)

Type imports maintain the same node → third-party → local sub-ordering as regular imports. In practice, `.ts` source files only have group 6 (type imports from local `@/types/...`). Groups 4 and 5 only appear in `.d.ts` files (e.g., `import type { Dirent } from 'fs'`).

```ts
import { promises as fs } from 'fs';
import { resolve } from 'path';

import chalk from 'chalk';
import prompts from 'prompts';

import { validCategories } from '@/lib/item.js';
import { Logger } from '@/toolkit/index.js';

import type {
  Runner_Record_Options,
  Runner_Record_Returns,
} from '@/types/cli/runner.d.ts';
```

### Barrel Exports

Some directories have an `index.ts` barrel file that re-exports sibling modules. Not every directory gets one.

- All files (`.ts` and `.d.ts`) import through the barrel when one exists.
- Siblings within the barrel directory still go through the barrel (not `./sibling.js`).
- Directories without a barrel — import directly from the source module.

```ts
// Barrel file — src/toolkit/index.ts
export { default as CliHeader } from './cli-header.js';
export { default as Logger } from './logger.js';
export { default as MarkdownTable } from './markdown-table.js';

// .ts code files — through the barrel
import { CliHeader, Logger } from '@/toolkit/index.js';

// .d.ts type files — also through the barrel
import type { MarkdownTable } from '@/toolkit/index.ts';

// Siblings within the barrel directory — still through the barrel
// src/toolkit/cli-header.ts
import { Logger } from '@/toolkit/index.js';

// No barrel exists — import directly
import { CliRecipeSyncPackages } from '@/cli/recipe/sync-packages.js';
import { LIB_REGEX_PATTERN_LEADING_V } from '@/lib/regex.js';
```

### Prefer Named Imports over Namespace/Default

When a module supports named exports, use `import { specific } from 'module'` instead of `import * as module` or `import module from 'module'`. Only use default/namespace imports when the module doesn't support named exports (e.g., `chalk` only has a default export).

**Compiler-forced `import * as`:** CJS packages with `module.exports` and no default export (e.g., `eslint-mdx`, `eslint-plugin-mdx`) require `import * as`. Default import causes TS1192. This is not a convention violation.

When a named import conflicts with a local variable, keep the import name unchanged and rename only the conflicting local variable (e.g., `current` prefix). Use `as` aliasing on the import only when renaming the local variable is impractical. Only rename what's forced — don't cascade renames to variables that don't conflict.

```ts
// BAD — namespace import when named exports are available
import * as path from 'path';
path.resolve(process.cwd(), 'config.json');

// GOOD — named import (tree-shakeable)
import { resolve } from 'path';
resolve(process.cwd(), 'config.json');

// GOOD — import keeps its name, local variable gets `current` prefix
import { platform, version } from 'os';
const currentPlatform = platform();
let currentVersion = version();

// OK — chalk only has a default export
import chalk from 'chalk';
```

### One Specifier per Line

ESLint `@stylistic/object-curly-newline` triggers at 4+ properties for `ImportDeclaration`.

```ts
// BAD — squished on one line
import type { TypeA, TypeB, TypeC, TypeD } from '@/types/cli/runner.d.ts';

// GOOD — one per line
import type {
  TypeA,
  TypeB,
  TypeC,
  TypeD,
} from '@/types/cli/runner.d.ts';
```

## Class Structure

### Explicit Accessibility Modifiers

All class members require explicit `public` or `private`.

```ts
public static async run(options: ...): ... { }
private static getConfigPath(project: ...): ... { }
public constructor(headers: ...) { }
```

### Class Shapes

Two shapes, chosen by whether the module holds per-instance state:

| Shape           | When to use                      | Constructor            | Fields            | Methods                            |
|-----------------|----------------------------------|------------------------|-------------------|------------------------------------|
| **Static-only** | Stateless utilities, API clients | None                   | `static #field`   | `public static` / `private static` |
| **Instance**    | Per-caller isolated state        | `public constructor()` | `readonly #field` | `public` / `private` instance      |

Static-only (stateless utilities) — file `src/cli/utility/changelog.ts`:
```ts
export class Runner {
  public static async run(options: ...): ... { }
  private static async record(options: ...): ... { }
  private static generateFileName(): ... { }
}
// Called as (consumer aliases at import site for a domain-specific local name):
// import { Runner as CliUtilityChangelog } from '@/cli/utility/changelog.js';
// CliUtilityChangelog.run(options);
```

Instance (per-caller state) — file `src/toolkit/markdown-table.ts`:
```ts
export default class Runner {
  readonly #headers: Toolkit_MarkdownTable_Runner_Constructor_Headers;

  public constructor(headers: ..., options?: ...) {
    this.#headers = headers;
  }

  public addRow(row: ...): ... { }
}
// Called as (consumer aliases the default import to a domain-specific local name):
// import MarkdownTable from '@/toolkit/markdown-table.js';
// new MarkdownTable(headers).addRow(row);
```

### `#` Private Fields over `private` Keyword

Use `#` (runtime-enforced) for private class **fields only**. Methods stay as `private static` / `private`. Originally an IntelliJ recommendation — kept for consistency.

```ts
// GOOD — field uses #hash
static #cache: SomeType;
readonly #headers: MarkdownTable_Constructor_Headers;

// GOOD — method uses private keyword
private static async fetchData(): FetcherFetchDataReturns { }
private static formatLine(prefix: ...): FormatLineReturns { }

// BAD — don't use #hash for methods
static #fetchData(): FetcherFetchDataReturns { }
```

### `readonly` on Private Fields

- `readonly` — field set once in the constructor, never reassigned after. Prevents `=` reassignment, not mutation (`.push()`, `.set()` still allowed).
- No `readonly` — field that gets reassigned during the class lifecycle.

### Private Fields and Caching

```ts
// Private fields use #hash notation
readonly #headers: MarkdownTable_Constructor_Headers;

// Static caching pattern
static #cache: SomeType;
static #populated: boolean = false;
```

### Export Rules

- `export default class` — public API classes (barrel indexes, package `exports`).
- `export class` — internal classes.
- Default to `export class` (named export) — this is the preference.
- `export default class` only for public API classes — so consumers can choose named or default import style. It's an accommodation, not a preference.

### Method Ordering

1. Public methods first.
2. Private async methods (grouped).
3. Private non-async helpers (grouped).

Each method separated by a blank line. No blank line after opening brace or before closing brace of the class.

### Alphabetical Ordering (Broad Rule)

Most named declarations are ordered alphabetically:
- Constant arrays in `src/lib/item.ts`
- Regex patterns in `src/lib/regex.ts`
- Type sections in `.d.ts` files (by method name)
- Import specifiers within each group

**Exception**: class methods — grouped by visibility/async, not alphabetical.

## Code Style

### Comment Placement in Method Bodies

Comments describe the process/intent — written so the code makes sense 6 months later. Placement rules:
- Comment sits above the code block it describes.
- Blank line before the comment (except at the start of a scope).
- No comment needed on the first block if it's self-explanatory.
- No trailing comments (same-line comments after code). Exception: multi-line conditions may use inline `//` comments after each condition line to explain the check.

```ts
const configPath = resolve(process.cwd(), 'config.json');
const configRaw = await fs.readFile(configPath, 'utf-8');

// Parse the configuration file.
const config: Runner_Run_Config = JSON.parse(configRaw);
const configItems = config['items'] as Runner_Run_ConfigItems;

// Filter and group items by category.
const filtered = Runner.filterItems(configItems);
const grouped = Runner.groupItems(filtered);
```

### Switch Statements — Always Block-Scoped

Every `case` and `default` uses block scoping with `{ }`. Always include a `default` case, even if there's nothing to handle. Separate non-empty cases with a blank line. Empty fallthrough cases may be grouped without blank lines.

```ts
switch (category) {
  case 'added': {
    Logger.info('New feature.');
    break;
  }

  case 'fixed': {
    Logger.info('Bug fix.');
    break;
  }

  default: {
    Logger.warn('Unknown category.');
    break;
  }
}
```

### Function Overloads vs Union Parameters

- Prefer overloads when the return type or behavior differs per input type — stricter for callers.
- Union parameter is fine when the handling is identical regardless of input type.

```ts
// GOOD — overloads (different behavior per type)
private static format(value: string): FormatReturns;
private static format(value: number): FormatReturns;
private static format(value: string | number): FormatReturns {
  if (typeof value === 'string') {
    return value.trim();
  }

  return value.toFixed(2);
}

// GOOD — union (same handling regardless)
private static validate(value: string | number): ValidateReturns {
  return value !== undefined;
}
```

### No Rest Parameters

List function parameters explicitly. Rest parameters (`...args`) obscure the expected inputs and bypass arity checks. Variadic utility functions (e.g., logging wrappers) are an acceptable exception.

```ts
// BAD — rest parameters
function log(...args: string[]): void { ... }
const sum = (...numbers: number[]) => ...;

// GOOD — explicit parameters
function log(message: string, level: string, context: string): void { ... }
```

### `Reflect.set()` for Dynamic Property Assignment

Prefer `Reflect.set()` over direct bracket assignment (`target[key] = value`). Also required by `no-param-reassign` with `props: true` when the target is a function parameter.

```ts
// GOOD
Reflect.set(target, key, value);

// BAD
target[key] = value;
```

### Dot Notation for Method Calls

Don't call methods using bracket notation with static string keys. Use dot notation for readability. Bracket notation for property *reads* on `Record`/plain objects is fine — this applies only to method *calls*.

```ts
// BAD — bracket notation for method call
obj['toString']();
arr['push'](item);

// GOOD — dot notation for method calls
obj.toString();
arr.push(item);

// OK — dynamic key (not a static string)
obj[methodName]();

// OK — bracket notation for property reads on Record/plain objects
const configItems = config['items'] as Runner_Filter_Items;
```

### No Exponentiation Operator

Use `Math.pow()` instead of `**`. Clearer intent and consistent with other `Math` utilities.

```ts
// BAD
const area = r ** 2;
value **= 10;

// GOOD
const area = Math.pow(r, 2);
value = Math.pow(value, 10);
```

### No Binary, Octal, or Hexadecimal Literals

Use `parseInt()` with an explicit radix instead of numeric literal prefixes. Hex literals for color codes, bit masks, and hardware registers are an acceptable exception.

```ts
// BAD
const mask = 0xFF;
const bits = 0b1010;
const perms = 0o755;

// GOOD
const mask = parseInt('FF', 16);
const bits = parseInt('1010', 2);
const perms = parseInt('755', 8);
```

### Spread over `Array.from()` for Converting Iterables

```ts
// BAD
const keys = Array.from(grouped.keys());

// GOOD
const keys = [...grouped.keys()];
```

### Optional Chaining and Nullish Coalescing

- Avoid optional chaining (`?.`) — prefer explicit checks.
- Nullish coalescing (`??`) is fine for providing defaults.
- Don't combine them (`config?.name ?? 'default'`) — break into explicit steps.

```ts
// BAD — optional chaining
const name = config?.name;

// GOOD — explicit check
if (config === undefined) {
  return;
}

const name = config.name;

// GOOD — nullish coalescing for defaults
const timeout = options.timeout ?? 5000;
const label = config.name ?? 'default';
```

### Ternary Expressions

- Simple ternary is OK — single condition, short values.
- No nested ternaries.
- No ternaries inside template literals — extract to a variable first.

```ts
// GOOD — simple ternary
const label = (isActive === true) ? 'enabled' : 'disabled';

// BAD — nested ternary
const label = (isActive === true) ? 'enabled' : (isPending === true) ? 'waiting' : 'disabled';

// BAD — ternary inside template literal
Logger.info(`Status: ${(isActive === true) ? 'enabled' : 'disabled'}`);

// GOOD — extracted to variable
const label = (isActive === true) ? 'enabled' : 'disabled';
Logger.info(`Status: ${label}`);
```

### No Template Literal Syntax in Regular Strings

Regular strings containing `${...}` almost always mean the backticks are missing.

```ts
// BAD — likely a bug
const message = 'Hello ${name}!';

// GOOD
const message = `Hello ${name}!`;
```

### No Stacked Comments

```ts
// BAD — stacked comments
// Parse front matter.

// Split lines.
const lines = content.split('\n');

// GOOD — one descriptive comment per code block
// Parse front matter.
const lines = content.split('\n');
```

### Quote File Names in Comments and Log Messages

```ts
// GOOD
// Load "config.json" for workspace list.
Logger.error('Unable to read "package.json".');
Logger.info('Updated "CHANGELOG.md" successfully.');
```

### Mixed `&&`/`||` Conditions

Parenthesized groups with `(` and `)` on their own lines, each condition on its own line.

```ts
if (
  (
    options.package === undefined
    || options.category === undefined
    || options.bump === undefined
    || options.message === undefined
  )
  && (
    options.package !== undefined
    || options.category !== undefined
    || options.bump !== undefined
    || options.message !== undefined
  )
) {
```

### No `const hasAllFlags` Multi-Line Assignments

Inline conditions directly in `if` blocks.

```ts
// BAD
const hasAllFlags = options.package !== undefined
  && options.category !== undefined
  && options.bump !== undefined;
if (hasAllFlags) { ... }

// GOOD
if (
  options.package !== undefined
  && options.category !== undefined
  && options.bump !== undefined
) { ... }
```

### One Entry per Line in Arrays

```ts
// Both .d.ts tuple types and .ts constant arrays
const categoryOrder: Runner_Release_CategoryOrder = [
  'updated',
  'fixed',
  'added',
  'removed',
];
```

### Descriptive Callback Parameter Names

Derive from the array/collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally.

```ts
// BAD
validCategories.find((c) => c === value)
validBumps.find((b) => b === value)

// GOOD
validCategories.find((validCategory) => validCategory === value)
validBumps.find((validBump) => validBump === value)

// More examples:
categoryKeys.map((categoryKey) => ...)
validRoles.map((validRole) => ...)
rawPaths.map((rawPath) => ...)
allowedPolicies.map((allowedPolicy) => ...)
```

### No Destructuring in Callback Parameters

Use the singular of the collection as the param, then access via index inside a block body with intermediate constants.

```ts
// BAD — destructuring in callback param
workspaces.filter(([, config]) => config.policy !== 'freezable')
workspaces.find(([_path, config]) => config.name === options.package)

// GOOD — no destructuring, block body, intermediate constants
workspaces.filter((workspace) => {
  const workspaceConfig = workspace[1];
  const workspaceConfigPolicy = workspaceConfig.policy;

  return workspaceConfigPolicy !== 'freezable';
});

// GOOD — simple direct comparison stays as expression body
validCategories.find(
  (validCategory) => validCategory === options.category,
)
```

Note: `for...of` destructuring is used with `Object.entries()` (which returns tuples), but NOT with Maps. For Maps, use `entry[0]`/`entry[1]` pattern:
```ts
// GOOD — Object.entries() destructuring (returns tuples)
for (const [key, entry] of Object.entries(schedule)) { ... }

// BAD — Map destructuring
for (const [categoryName, categoryItems] of grouped) { ... }

// GOOD — Map iteration without destructuring
for (const entry of grouped) {
  const entryCategory = entry[0];
  const entryItems = entry[1];
}
```

### Variable Names Chain from Parent

When extracting properties from an intermediate constant, the name chains from the parent variable name.

```ts
// Tuple elements get semantic names
const key = supportedItem[0];
const appName = supportedItem[1];

// Domain objects chain from parent name
const workspaceConfig = workspace[1];
const workspaceConfigPolicy = workspaceConfig.policy;

const eligibleConfig = eligible[1];
const eligibleConfigName = eligibleConfig.name;
const eligibleConfigRole = eligibleConfig.role;
const eligibleConfigPolicy = eligibleConfig.policy;
```

### Block Body vs Expression Body in Callbacks

- **Block body** (`=> { ... return; }`): When accessing properties/elements of the callback param, or when multiple statements needed.
- **Expression body** (`=> value`): When the callback is a direct comparison or single method call on a primitive.

```ts
// Block body — accessing tuple elements, multiple properties
items.map((item) => {
  const itemConfig = item[1];
  const itemConfigName = itemConfig.name;
  const itemConfigRole = itemConfig.role;

  return {
    title: itemConfigName,
    description: itemConfigRole,
    value: itemConfigName,
  };
});

// Expression body — direct comparison on primitive
validCategories.find(
  (validCategory) => validCategory === value,
)

// Expression body — single property check
.filter((result) => result.status === 'fulfilled')
.map((result) => result.value)
.filter((value) => value !== null)
```

### Blank Lines between Distinct Operations

Separate method calls, `await` statements, and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

```ts
// BAD — everything stuck together
Runner.print(grouped);
await Runner.writeOutput({ ... });
await Runner.runParallel();

// GOOD — each operation gets breathing room
Runner.print(grouped);

await Runner.writeOutput({
  filePath: 'output.json',
  content: JSON.stringify(grouped),
});

await Runner.runParallel();

// BAD — declarations and loop stuck together
const grouped: Runner_GroupItems_Grouped = new Map();
const processed: Runner_GroupItems_Processed = new Set();
for (const category of validPolicies) {

// GOOD — blank line before loop
const grouped: Runner_GroupItems_Grouped = new Map();
const processed: Runner_GroupItems_Processed = new Set();

for (const category of validPolicies) {

// BAD — declaration and method call stuck together
const existing = grouped.get(entry.package) ?? [];
existing.push(entry);

// GOOD — blank line before method call on the variable
const existing = grouped.get(entry.package) ?? [];

existing.push(entry);
```

### Bare `await` Gets Its Own Visual Group

When an `await` call has no assignment (return value unused), separate it from surrounding `const` assignments with a blank line.

```ts
// BAD — bare await mixed with const assignments
await Runner.fetchData();
const filtered = Runner.filterItems(configItems);

// GOOD — bare await has its own group
await Runner.fetchData();

const filtered = Runner.filterItems(configItems);
```

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

```ts
// BAD — redundant intermediate variable
const filtered = items.filter((item) => {
  ...
});

return filtered;

// GOOD — return directly
return items.filter((item) => {
  ...
});
```

### Explicit `return;` in Void Functions

Every void function and method must end with an explicit `return;` statement. Arrow function callbacks, constructors, and setters are acceptable exceptions.

```ts
// BAD — implicit return
function greet(name: string): void {
  Logger.info(name);
}

// GOOD — explicit return
function greet(name: string): void {
  Logger.info(name);

  return;
}
```

### Extract Nested Function Calls into Variables

Don't nest `resolve()` inside `fs.readFile()` or `fs.writeFile()`. Extract into its own variable for readability.

```ts
// BAD — hard to read
const configRaw = await fs.readFile(resolve(process.cwd(), 'config.json'), 'utf-8');
await fs.writeFile(resolve(process.cwd(), options.filePath), options.content, encoding);

// GOOD — path on its own line
const configPath = resolve(process.cwd(), 'config.json');
const configRaw = await fs.readFile(configPath, 'utf-8');

const outputPath = resolve(process.cwd(), options.filePath);
await fs.writeFile(outputPath, options.content, encoding);
```

### `for...of` vs Array Methods vs Traditional `for`

- `.filter()`, `.map()`, `.find()` — transforming or searching, returns a new value.
- `for...of` — side effects (logging, mutating external collections, async operations).
- `.reduce()` — acceptable, but `for...of` with a mutable accumulator is also fine. Either approach works.
- Traditional `for` — only when index access is needed. Otherwise always `for...of`.

### Static Caching Pattern

- Private static fields with no inline initialization — start as `undefined` naturally.
- Guard field typed as `true` (not `boolean`), checked with `=== true` explicitly — don't rely on truthiness of `undefined`.
- Cache field type includes `| undefined` to account for uninitialized state.
- On failure, set guard to `true` to prevent retrying — return `undefined`.

```ts
static #cache: CacheType;
static #populated: PopulatedType;

public static async fetch(): FetchReturns {
  if (ClassName.#populated === true) {
    return ClassName.#cache;
  }

  // ... fetch, parse, handle errors ...

  ClassName.#cache = result;
  ClassName.#populated = true;

  return ClassName.#cache;
}
```

### `undefined` vs `null`

- **Value** — a box with stuff in it.
- **`null`** — an empty box (explicitly set to nothing, intentionally cleared).
- **`undefined`** — no box at all (never assigned, doesn't exist).

Use `undefined` for optional/missing values (params not passed, uninitialized). Use `null` when something was intentionally set to empty (user clears a field, external API returns null).

### Explicit `= undefined` for Uninitialized Variables

`let` declarations without a value must explicitly assign `undefined`. Makes the initial state visible.

```ts
// BAD — implicit undefined
let selectedPackage;

// GOOD — explicit undefined
let selectedPackage: Runner_Run_SelectedPackage = undefined;
```

### Error Handling

- **Creator** (function designer): may design a function to `throw` on failure — that's the API contract.
- **Consumer** (function caller): always wraps calls to throwing functions in `try/catch`.
- Public `run` methods on CLI classes (CLI entry points) never `throw` — set `process.exitCode = 1` and `return`.

### Explicit Equality Checks — No Truthy/Falsy

Always use explicit checks. No truthy/falsy shortcuts.

- `=== undefined` — no box.
- `=== null` — empty box.
- `== null` — check for both undefined and null at the same time (only valid use of `==` instead of `===`).
- `=== true` — explicit boolean.
- `> 0` / `=== 0` — explicit length.


### `catch (error)` — No `: unknown` Annotation

TypeScript defaults catch clause variables to `unknown`. Don't annotate redundantly.

```ts
// BAD — redundant
} catch (error: unknown) {

// GOOD
} catch (error) {
```

### `process.exitCode = 1` then Blank Line then `return`

Separate the exit code assignment from the return statement with a blank line.

```ts
// BAD — too close
process.exitCode = 1;
return;

// GOOD
process.exitCode = 1;

return;
```

### Unused Return Values — Don't Assign

If a function's return value is never read, don't assign it to a variable.

```ts
// BAD — data is never used
const data = await Runner.fetchData();

// GOOD — just await
await Runner.fetchData();
```

### No Variables Before Definition

Variables and constants must be defined before use. Functions, classes, and types may be forward-referenced — this allows alphabetical method ordering without dependency issues.

```ts
// BAD — variable used before definition
const x = y + 1;
const y = 5;

// GOOD — defined before use
const y = 5;
const x = y + 1;

// GOOD — functions can forward-reference (alphabetical ordering)
function filterItems() { return processItems(); }
function processItems() { ... }
```

### Promise Parallelism — Use `Promise.all`

Use `Promise.all` for parallel execution. Cleaner than separate task variables, and rejects immediately if one fails instead of leaving dangling promises.

```ts
// GOOD — Promise.all
const packageJsonPath = resolve(process.cwd(), 'package.json');

const [data, packageJsonRaw] = await Promise.all([
  Runner.fetchData(),
  fs.readFile(packageJsonPath, 'utf-8'),
]);

// BAD — .then() chains (hard to read)
// BAD — separate task variables (dangling promises on rejection)
```

### No `await` in Loops

Don't `await` inside loops. Use `Promise.all()` for parallel execution. Sequential iteration where order matters (e.g., database migrations) and polling/retry loops with backoff are acceptable exceptions.

```ts
// BAD — sequential, one at a time
for (const url of urls) {
  await fetch(url);
}

// GOOD — parallel
await Promise.all(urls.map((url) => fetch(url)));
```

### Return Types — Use Named Alias, Not Inline Promise

Method return types should use the named type alias from `.d.ts`, not an inline `Promise<Type>`.

```ts
// BAD — inline Promise type
private static async fetchData(): Promise<FetcherResponse> {

// GOOD — named return type
private static async fetchData(): FetcherFetchDataReturns {
```

### Readability — All Generated Code Must Be Human-Readable

Don't inline complex expressions into template literals or other expressions. Break them into named variables so each step is clear.

```ts
// BAD — JSON.stringify jammed into a template literal
await fs.writeFile(filePath, `${JSON.stringify({ name: 'test' }, null, 2)}\n`, 'utf-8');

// GOOD — separated into readable variables
const packageJson = JSON.stringify({ name: 'test' }, null, 2);
const packageContents = `${packageJson}\n`;

await fs.writeFile(filePath, packageContents, 'utf-8');
```

### Multiline Content — Use Arrays, Not Embedded Newlines

Don't embed multiline content in string literals using `\n`. Instead, build an array of lines and join them.

```ts
// BAD — multiline content embedded in a string literal
const text = 'Required Secrets:\n  - PERSONAL_ACCESS_TOKEN\n  - DEPLOY_KEY';

// GOOD — array of lines joined with \n
const lines = [
  'Required Secrets:',
  '  - PERSONAL_ACCESS_TOKEN',
  '  - DEPLOY_KEY',
];
const text = lines.join('\n');
```

### No `javascript:` URLs

Disallow `javascript:` URLs. Legacy anchor elements that must prevent navigation without `href="#"` may use `javascript:void(0)` as an acceptable exception.

```ts
// BAD
href = 'javascript:alert("XSS")';
href = 'javascript:doSomething()';

// GOOD
href = '#';
href = '/path/to/page';
```

### No `any` Type

Don't use `any`. Use `unknown` (via a named type alias in `.d.ts`) and narrow with type guards, or define a specific type.

```ts
// BAD
function parse(input: any): any { ... }
const data = response.json() as any;

// GOOD — named type aliases (defined as unknown in .d.ts)
function parse(input: Runner_Parse_Input): Runner_Parse_Returns { ... }
const data: Fetcher_GetData_Response = FetcherResponseSchema.parse(response.json());
```

## Regex Patterns

### Centralize Regex in a Shared File

Don't use inline regex literals. Define patterns in a shared file (e.g., `regex.ts`) and import them. The shared regex source file itself is excluded from this rule.

```ts
// BAD — inline regex
version.replace(/^v/, '');

// GOOD — centralized pattern
import { LIB_REGEX_PATTERN_LEADING_V } from '@/lib/regex.js';
version.replace(LIB_REGEX_PATTERN_LEADING_V, '');
```

### No Flags on Regex Patterns

Keep regex patterns flag-free. Apply flags at the call site with `new RegExp()`.

```ts
// BAD — flag on the pattern
const LIB_REGEX_PATTERN_DIGITS = /\d+/g;

// GOOD — flag-free pattern, flag at call site
const LIB_REGEX_PATTERN_DIGITS = /\d+/;
const allDigits = new RegExp(LIB_REGEX_PATTERN_DIGITS, 'g');
```

## TSConfig Conventions

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",              // Always pair module with moduleResolution
    "moduleResolution": "nodenext",
    // "incremental": false,           // NEVER — non-deterministic
    // "composite": false,             // NEVER — requires incremental
    // "typeRoots": [],                // NEVER
  }
}
```

- No `assumeChangesOnlyAffectDirectDependencies` (non-deterministic).
- No relative paths in exported TSConfig presets (TS resolves from config location).
- If project uses own build tool: `isolatedModules: true` + `noEmit: true`.
