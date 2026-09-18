# Documentation Conventions

Rules for writing Docusaurus MDX documentation pages.

## General Rules

### Opening Paragraph

- Every page starts with a single sentence after imports, before any heading.
- Verb-first, states what the feature does.

```mdx
<!-- GOOD — verb-first, single sentence -->
Require blank lines between specific statement patterns so code stays visually organized and easy to scan.

<!-- BAD — noun-first, passive -->
A blank-line enforcement rule that keeps code visually organized.

<!-- BAD — starts with "This page" -->
This page explains how to require blank lines between statement patterns.
```

### Paragraph Length

- No paragraph has more than 2 sentences. Start a new paragraph or bullet at the third sentence.
- Bullet points are strictly limited to 2 sentences.

### Scannable Structure

- Prefer bullet lists over paragraphs for sequential or parallel points.
- One idea per bullet.
- Long sections (more than 10 lines of prose) should break into H3 subsections.

### Voice and Tone

- Recommends, never commands. Use "it is recommended" over imperative "Always do X."
- Address the reader as "you" (second person).
- Contractions allowed ("don't", "you're", "it's").
- Present tense, active voice.
- Benefits first, mechanics second.

```mdx
<!-- GOOD — recommends, benefit-focused -->
Keeps your imports organized so you can find modules at a glance.

<!-- BAD — commands, consequence-focused -->
You must organize your imports. Failure to do so will result in messy code.
```

## Audience and Technical Depth

Every page has a primary audience. Pick it before writing, then calibrate vocabulary, examples, and assumed prerequisites to match.

The right reader should feel informed; the wrong reader should not feel talked down to or scared off.

### Tiers

| Tier                     | Reader profile                                                          | Assumed knowledge                                            | Jargon policy                                                               |
|--------------------------|-------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------|
| End user                 | Interacts with the final product — UI, generated output, deployed site. | None beyond the product's own surface.                       | No implementation terms. Describe outcomes and visible behavior only.       |
| Moderately technical     | Runs commands, edits config files, follows setup steps.                 | Terminal basics, JSON/YAML, environment variables.           | Domain terms allowed if wrapped in `<Term>`. No internal module names.      |
| Developer                | Consumes the public API in their own code.                              | The host language and framework. Reads types and signatures. | Public API names, types, and framework terms expected. No internals.        |
| Contributor / Maintainer | Modifies the source of the project or package the page describes.       | Repository layout, build tooling, testing conventions.       | Internal architecture, private modules, and build pipeline details allowed. |

### Page Type → Default Tier

| Page Type                | Default Tier             |
|--------------------------|--------------------------|
| Landing / overview       | End user                 |
| Quickstart               | Moderately technical     |
| Installation / setup     | Moderately technical     |
| CLI command              | Developer                |
| ESLint rule              | Developer                |
| Toolkit battery          | Developer                |
| Preset                   | Developer                |
| Configuration reference  | Developer                |
| Architecture / internals | Contributor / Maintainer |
| Contributing guide       | Contributor / Maintainer |

### Rules

- **Signal the tier through vocabulary, not a header.** Readers should never have to be told "this page is for developers" — the prose tells them.
- **Do not mix tiers within a section.** If a page must serve two tiers, lead with the higher-level framing and push lower-level detail into a later section (e.g., "How It Works") or an `:::info` admonition.
- **Implementation detail a reader cannot touch stays out.** Private classes, non-exported helpers, internal build steps, and paths outside the public surface do not appear on End-user or Moderately-technical pages. On Developer pages, mention them only when they affect observable behavior, and label them as internal when you do.
- **Do not punch up or down.** Developer pages should not explain what a terminal is; End-user pages should not assume familiarity with package managers.
- **When a feature spans tiers, split it.** Prefer two focused pages over one sprawling page that tries to be everything to everyone.

## Frontmatter

### Documentation Pages

Every documentation page requires these fields:

- `id` — kebab-case, matches filename without extension. No prefixes. For `index.mdx` files that serve as a category landing page, use a descriptive id that reflects the page's purpose (e.g., `overview`) instead of `index`.
- `title` — Title Case, 1-5 words. Unique enough to distinguish pages in a sidebar. No trailing periods.
- `description` — One sentence, 120-160 characters. Starts with a verb or the feature name (never "This page explains...", "Learn how to...", or "Discover how...").
- `keywords` — 3-8 terms. Project name first, then feature name, category, and synonyms. Serves Docusaurus local search only (Google has not used meta keywords for ranking since 2009). Do not repeat the same word in different forms (e.g., "lint" and "linting").
- `tags` — 1-5 terms. First tag is the category (cli, rules, toolkit, quickstart). Optimized for Docusaurus local search, not external SEO.

```yaml
---
id: require-padding-lines
title: Require Padding Lines
description: Require blank lines between specific statement patterns for improved readability and visual organization.
keywords:
  - nova
  - eslint rule
  - padding lines
  - blank lines
  - readability
  - code style
  - linting
tags:
  - rules
  - eslint
  - code style
---
```

### Blog Posts

Blog post frontmatter follows the same field set with adjusted ranges for headlines and social sharing:

- `title` — Title Case, no word limit. Target under 60 characters for search engine display; subtitles after a colon are acceptable.
- `description` — One sentence, 120-160 characters. Core message in the first 120 characters (mobile search results truncate there).
- `keywords` — 3-8 terms.
- `tags` — 1-5 terms.

## SEO

- `description` reads as a natural sentence that a search engine would display as a snippet. Write the core message in the first 120 characters for mobile display; use up to 160 for desktop completeness.
- Start with a verb or the feature name, never "This page explains...", "Learn how to...", or "Discover how..."
- `keywords` serve Docusaurus local search only. Google has not used the meta keywords tag for ranking since 2009; Bing treats keyword-stuffed meta keywords as a spam signal.
- `tags` are optimized for Docusaurus local search, not external SEO.

## Page Templates

### Universal Base

Every documentation page requires these sections:

1. **Opening paragraph** — verb-first, single sentence, no heading.
2. **Why Use This ___?** — Numbered list, benefit-focused. 3-5 items.
3. **Usage** or **Examples** — Code samples showing how to use the feature.

Pages within the same group should share a similar section order and structure for visual consistency.

### Fallback

Pages that don't fit a category template must still follow:

- Opening paragraph (verb-first, single sentence).
- At least one H2 section.
- Voice and tone rules.
- Frontmatter rules.

### CLI Command Docs

Includes recipe docs (`nova recipe` commands).

**Required:**

1. Opening paragraph
2. Why Use This Command? (numbered list)
3. Requirements (bold-label bullets)
4. Usage (tabs: installed vs npx)
5. Options (table)

**Optional (include when applicable):**

- **Config Fields** — when the command reads from `nova.config.json`.
- **Output Files** — when the command creates files on disk.
- **Supported ___** — when the command offers a curated selection (e.g., licenses, workflows).
- **How It Works** — when the command has complex behavior worth explaining with H3 subsections.

### ESLint Rule Docs

**Required:**

1. Opening paragraph
2. Summary (2-5 bullets)
3. Why Use This Rule? (numbered list)
4. Examples (tabs: Correct / Incorrect)
5. Configuration
6. Troubleshooting (3-7 bullet items)

### Toolkit Battery Docs

**Required:**

1. Opening paragraph
2. Summary (2-5 bullets)
3. Why Use This Battery? (numbered list)
4. Usage (tabs by feature area)
5. Settings (table)
6. Output Examples (tabs)

## Section Formatting

### Why Use This ___?

Heading changes by page type:

| Page Type       | Heading                   |
|-----------------|---------------------------|
| CLI command     | Why Use This Command?     |
| ESLint rule     | Why Use This Rule?        |
| Toolkit battery | Why Use This Battery?     |
| Preset          | Why Use This Preset?      |
| Quickstart      | (no "Why" section needed) |

Content is a numbered list. Each item follows the pattern: [Feature/capability] so [benefit]. Numbers make every page scan the same way; their order does not imply an execution sequence.

```mdx
## Why Use This Command?

1. Supports 13 open-source licenses so you can pick the right one from the config.
2. Auto-fills legal boilerplate so the license stays accurate when the year rolls over or ownership changes.
3. Pulls the license type, author name, and starting year directly from `nova.config.json`, eliminating manual edits.
```

### Requirements

Bold label + em-dash + explanation.

```mdx
## Requirements

- **Node.js runtime** — Use any Node.js LTS release.
- **Project root** — Run the command from the directory containing the top-level `package.json`.
- **`nova.config.json`** — A valid config file must exist at the project root with the fields listed below.
```

### Usage

Tabs with exact structure. `groupId` is `"install-state"`. Show both original and shorthand commands inside each tab.

````mdx
<Tabs groupId="install-state">
  <TabItem value="nova" label="nova (installed)" default>

    ```bash
    # Original
    nova generate must-haves license

    # Shorthand
    nova gen must lic
    ```

  </TabItem>
  <TabItem value="npx" label="npx (no install)">

    ```bash
    # Original
    npx --yes @cbnventures/nova@latest generate must-haves license

    # Shorthand
    npx --yes @cbnventures/nova@latest gen must lic
    ```

  </TabItem>
</Tabs>
````

## Components

### Tabs

**Required for:**

- CLI usage — `groupId="install-state"` with labels `"nova (installed)"` and `"npx (no install)"`.
- ESLint examples — `groupId="{page-id}-examples"` with labels `"Correct"` and `"Incorrect"`.

**Plain code blocks for:**

- Single code examples.
- Configuration snippets.
- Inline demonstrations.

### Admonitions

- `:::danger` — Non-zero exit codes, data loss, breaking changes. State only the risk, do not append general advice.
- `:::warning` — Important caveats, deprecations, required manual steps. Single concern per box.
- `:::tip` — Best practices, shortcuts, recommendations. May include gentle guidance.
- `:::info` — Neutral context, background, "good to know" details.

Do not repeat the same advice across multiple admonitions on the same page. Each admonition addresses a single concern.

### Tables

- Left-align all columns, except emoji columns (checkmarks, x-marks) which are centered.
- Use backticks for code values, field names, and types in cells.
- Options tables use two columns: Flag | Description.
- Config tables use two columns: Field | Description.
- Maximum 4-5 columns. If more data is needed, use subsections instead.
- Pad columns for visual alignment in source markdown.

```markdown
<!-- GOOD — left-aligned text columns, centered emoji columns -->
| Feature     | macOS | Linux | Windows |
|-------------|:-----:|:-----:|:-------:|
| Auto-detect |   ✓   |   ✓   |    ✗    |
| Hot reload  |   ✓   |   ✓   |    ✓    |
```

### Glossary Terms

Use the `<Term>` component for domain-specific jargon. Link to the terminology page with the appropriate anchor.

What counts as domain-specific jargon is tier-relative — see **Audience and Technical Depth**. A term that is table stakes for the page's tier does not need `<Term>`.

- Use `<Term>` on every occurrence of the word, not just the first. Readers should not have to scroll back to find a definition.
- `title` text is a brief definition (under 10 words).
- `to` path always points to `/docs/quickstart/terminology` with the section anchor.

```mdx
<Term title="long term support" to="/docs/quickstart/terminology#fundamentals">LTS</Term>
<Term title="command line interface" to="/docs/quickstart/terminology#fundamentals">CLI</Term>
<Term title="Nova config" to="/docs/quickstart/terminology#nova-concepts">`nova.config.json`</Term>
```

### Links

- Internal links use absolute paths from the docs root: `/docs/path/to/page`.
- Always include anchors for specific sections: `/docs/path/to/page#section`.
- External links use the full URL.
- Do not use relative paths for cross-page links.

### Images

- Store images in an `_assets_/` subdirectory adjacent to the MDX file.
- File names follow the MDX file name with a numeric suffix (e.g., `logger.mdx` → `logger-1.png`, `logger-2.png`).
- Import images as React components at the top of the file.
- Always include `alt`, `width`, `height`, and `style={{maxWidth: '100%', height: 'auto'}}`.

```mdx
import loggerBasics from './_assets_/logger-1.png';

<img src={loggerBasics} alt="Logger basics preview" width={792} height={435} style={{maxWidth: '100%', height: 'auto'}} />
```

### Code Blocks

- Always include a language identifier after the opening triple backticks (`ts`, `bash`, `json`, `yaml`, `markdown`).
- Use the `title` attribute for file paths or filenames.
- Use inline comments for context within the code, not prose above the block.
- Do not use line highlighting (Docusaurus `{1,3-5}` syntax). Keep blocks short enough that the relevant lines are obvious.

````mdx
```ts title="src/cli/index.ts"
// Register the generate command group.
const generate = program
  .command('generate')
  .alias('gen');
```
````

## Full Examples

### CLI Command Page

````mdx
---
id: license
title: License (LICENSE)
description: Generate a LICENSE file populated with license type, author, and year information from nova.config.json.
keywords:
  - nova
  - nova generate
  - license
  - mit
  - apache
  - gpl
  - bsd
  - copyright
  - legal
tags:
  - cli
  - generator
  - must-haves
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Create a `LICENSE` file populated with the chosen license type, author legal name, and year range from the Nova config.

## Why Use This Command?

1. Supports 13 open-source licenses so you can pick the right one from the config.
2. Auto-fills legal boilerplate so the license stays accurate when the year rolls over or ownership changes.
3. Pulls the license type, author name, and starting year directly from `nova.config.json`, eliminating manual edits.

## Requirements

- **Node.js runtime** — Use any Node.js <Term title="long term support" to="/docs/quickstart/terminology#fundamentals">LTS</Term> release.
- **Project root** — Run the command from the directory containing the top-level `package.json`.
- **<Term title="Nova config" to="/docs/quickstart/terminology#nova-concepts">`nova.config.json`</Term>** — A valid config file must exist at the project root with the fields listed below.

## Usage

<Tabs groupId="install-state">
  <TabItem value="nova" label="nova (installed)" default>

    ```bash
    # Original
    nova generate must-haves license

    # Shorthand
    nova gen must lic
    ```

  </TabItem>
  <TabItem value="npx" label="npx (no install)">

    ```bash
    # Original
    npx --yes @cbnventures/nova@latest generate must-haves license

    # Shorthand
    npx --yes @cbnventures/nova@latest gen must lic
    ```

  </TabItem>
</Tabs>

## Options

| Flag                 | Description                                                            |
|----------------------|------------------------------------------------------------------------|
| `-d, --dry-run`      | Preview the target file path without writing anything to disk.         |
| `-r, --replace-file` | Overwrite the existing file instead of creating a `.nova-backup` copy. |

## Config Fields

| Field                  | Description                                                                              |
|------------------------|------------------------------------------------------------------------------------------|
| `project.legalName`    | The legal name used in the copyright notice.                                             |
| `project.license`      | SPDX license identifier. If not set, you are prompted to select a license interactively. |
| `project.startingYear` | The year the project was first published (defaults to now).                              |

## Output Files

| File      | Description                                             |
|-----------|---------------------------------------------------------|
| `LICENSE` | License file populated with author name and year range. |
````

### ESLint Rule Page

````mdx
---
id: require-padding-lines
title: Require Padding Lines
description: Require blank lines between specific statement patterns for improved readability and visual organization.
keywords:
  - nova
  - eslint rule
  - padding lines
  - blank lines
  - readability
  - code style
  - linting
tags:
  - rules
  - eslint
  - code style
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Require blank lines between specific statement patterns so code stays visually organized and easy to scan.

## Summary

- Enforces blank lines before and after `return`, `throw`, `if`, `for`, `switch`, and other block-level statements.
- Keeps code visually grouped by intent rather than letting everything run together.

## Why Use This Rule?

1. Prevents walls of code where unrelated operations blur together.
2. Makes control flow boundaries visible at a glance so reviewers can scan faster.
3. Produces consistent spacing across the entire codebase without manual effort.

## Examples

<Tabs groupId="require-padding-lines-examples">
  <TabItem value="correct" label="Correct" default>

    ```ts
    const config = loadConfig();

    if (config === undefined) {
      return;
    }

    const items = config.items;
    ```

  </TabItem>
  <TabItem value="incorrect" label="Incorrect">

    ```ts
    const config = loadConfig();
    if (config === undefined) {
      return;
    }
    const items = config.items;
    ```

  </TabItem>
</Tabs>

## Configuration

Enable the rule in your ESLint flat config:

```ts title="eslint.config.ts"
import { novaRules } from '@cbnventures/nova';

export default [
  ...novaRules,
];
```

## Troubleshooting

- **False positives in object literals** — The rule does not apply inside object or array literals. Check that the flagged line is a statement, not a property.
- **Conflicts with Prettier** — Disable Prettier's blank-line collapsing for the affected file or section.
````

### Toolkit Battery Page

````mdx
---
id: logger
title: Logger
description: Deliver consistent log output across local runs and CI without wiring custom formatting by hand.
keywords:
  - nova
  - toolkit
  - logger
  - logging
  - console
  - output
  - cli
tags:
  - toolkit
  - logging
  - battery
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Deliver consistent log output across local runs and CI without wiring custom formatting by hand.

## Summary

- Formats log messages with a consistent prefix, timestamp, and log level.
- Supports scoped loggers for isolating output by module or command.
- Automatically adjusts verbosity based on the `LOG_LEVEL` environment variable.

## Why Use This Battery?

1. Eliminates hand-rolled `console.log` wrappers so every module logs the same way.
2. Scoped loggers let you filter noise during debugging without editing source files.
3. Works out of the box with zero configuration for the default use case.

## Usage

<Tabs groupId="logger-usage">
  <TabItem value="basics" label="Basics" default>

    ```ts
    import { Logger } from '@cbnventures/nova';

    Logger.info('Build complete.');
    Logger.warn('Deprecated option used.');
    Logger.error('Failed to read config.');
    ```

  </TabItem>
  <TabItem value="scoped" label="Scoped logger">

    ```ts
    import { Logger } from '@cbnventures/nova';

    Logger.customize({
      name: 'CLIUtilityChangelog.run',
      purpose: 'release',
    }).info('Changelog generated.');
    ```

  </TabItem>
</Tabs>

## Settings

| Setting     | Type     | Default  | Description                             |
|-------------|----------|----------|-----------------------------------------|
| `name`      | `string` | `"Nova"` | Logger name displayed in the prefix.    |
| `purpose`   | `string` | `""`     | Purpose label appended after the name.  |
| `padTop`    | `number` | `0`      | Blank lines printed before the message. |
| `padBottom` | `number` | `0`      | Blank lines printed after the message.  |

## Output Examples

<Tabs groupId="logger-output">
  <TabItem value="info" label="Info" default>

    ```
    [Nova] Build complete.
    ```

  </TabItem>
  <TabItem value="scoped" label="Scoped">

    ```
    [CLIUtilityChangelog.run · release] Changelog generated.
    ```

  </TabItem>
</Tabs>
````
