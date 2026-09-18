# PROJECT_RULES.md

## Project Identity

### Name and Description

- **Project name:** Homebridge ADT Pulse (published to npm as `homebridge-adt-pulse`; the monorepo root manifest is named `homebridge-adt-pulse-project`)
- **Description:** Control your ADT Pulse security system and view sensor status through the Home app.
- **Primary language:** TypeScript
- **Framework / runtime:** Turborepo-orchestrated npm workspaces monorepo containing a Homebridge platform plugin (Node.js), a Vite + React 19 custom config UI, and a Docusaurus 3.10 documentation site
- **Ownership:** Personally authored and owned by Jacky Liang (`mrjackyliang`) under the MIT license. CBN Ventures supports the project by supplying its build tooling and conventions through `@cbnventures/nova` and `@cbnventures/docusaurus-preset-nova`.

### Repository URL

- **URL:** https://github.com/mrjackyliang/homebridge-adt-pulse

## Repository Layout

```
homebridge-adt-pulse/
├── .github/                    — GitHub Actions workflows and issue templates
├── apps/
│   ├── config-ui/              — Plugin's custom config UI (Vite + React 19 frontend)
│   └── docs/                   — Documentation site (Docusaurus 3.10 + Nova preset)
├── conventions/                — Nova-generated coding convention files (do not edit)
├── packages/
│   └── homebridge-adt-pulse/   — The published Homebridge plugin
├── scripts/                    — Root-level Node scripts (link-nova)
├── .editorconfig                — Editor formatting rules
├── .env / .env.sample           — Root environment variables (`ROOT_` prefix)
├── .gitignore                   — Git ignore patterns
├── AGENTS.md                    — Nova-generated agent entry point (do not edit)
├── CLAUDE.md                    — Nova-generated agent entry point (do not edit)
├── eslint.config.mts            — Root ESLint flat config (covers scripts/ only; apps/ and packages/ are excluded and lint themselves)
├── LICENSE                      — MIT license
├── nova.config.json             — Nova project, workspace, and workflow configuration
├── package.json                 — Workspace root manifest and turbo scripts
├── package-lock.json            — Local npm lockfile shared by every workspace (not committed)
├── PROJECT_RULES.md             — This file
├── README.md                    — Project overview and badges
├── SPONSOR_EXEMPT                — Usernames exempt from sponsor-gated support
├── tsconfig.json                — Root TypeScript project references
├── tsconfig.config.json         — Type-checks eslint.config.mts
├── tsconfig.scripts.json        — Type-checks scripts/**/*.mjs
├── turbo.json                   — Turborepo pipeline configuration
└── VISION.md                    — Purpose, marketing copy, and glossary
```

## Source Structure

The repository has three workspaces, each structurally independent. Unqualified `src/` paths in the rest of this document refer to `packages/homebridge-adt-pulse/src/` unless a workspace is stated otherwise.

### `packages/homebridge-adt-pulse/` — the plugin

```
packages/homebridge-adt-pulse/
├── src/
│   ├── config-ui/
│   │   └── server.ts            — Config UI backend; runs inside the Homebridge UI and exposes
│   │                               /initialize, /get-methods, /request-code, /validate,
│   │                               /generate-config request handlers
│   ├── lib/
│   │   ├── accessory.ts         — Bridges one ADT Pulse device into HomeKit services and
│   │   │                           characteristics, keeps values in sync with portal state
│   │   ├── api.ts               — Portal driver (ADTPulseAPI): browser-emulated session,
│   │   │                           login/logout, gateway/panel/sensor reads, arm/disarm
│   │   ├── auth.ts              — MFA workflow (ADTPulseAuth): validate credentials, register
│   │   │                           trusted devices, fetch the sensor list
│   │   ├── browser-releases.ts  — Fetches Stable browser versions and resolves cached or
│   │   │                           packaged fallbacks for new fingerprints
│   │   ├── detect.ts            — Compares parsed portal data against documented baselines and
│   │   │                           reports undocumented shapes to the plugin author
│   │   ├── fake.ts              — Fabricates browser fingerprint components (fonts, plugins,
│   │   │                           screen, timezone, user agent, Dynatrace header)
│   │   ├── items.ts             — Catalogs of known portal shapes (do submit handlers, orb
│   │   │                           security buttons, sensor actions, gateways, panels)
│   │   ├── platform.ts          — Homebridge platform (ADTPulsePlatform): lifecycle, accessory
│   │   │                           cache, polling timers, session keep-alive
│   │   ├── regex.ts             — Central registry of every regex pattern in the plugin
│   │   ├── schema.ts            — Zod schemas (platform config, config UI forms and server
│   │   │                           bodies, portal MFA/OTP responses); imported directly by
│   │   │                           apps/config-ui across the workspace boundary
│   │   └── utility.ts           — Shared helpers (parsing, logging, PII redaction, detect
│   │                               report URL, package version)
│   ├── cli/
│   │   ├── generate-browser-snapshot.ts — Writes the build's browser-version fallback
│   │   ├── generate-identity-snapshot.ts — Writes the build's Nova identity fallback
│   │   ├── identity.ts          — Reads live Nova identity in source or its packaged snapshot
│   │   ├── repl.ts              — Interactive console exposing the API and auth helpers
│   │   └── test-api.ts          — End-to-end portal exercise using the local Homebridge config
│   ├── tests/
│   │   ├── fixtures/            — Saved portal HTML (gateway-information.html, panel-status.html)
│   │   ├── lib/                 — One suite per src/lib module
│   │   ├── index.test.ts
│   │   └── type-declarations.test.ts — Nova type-declaration meta-test suite
│   ├── types/                   — Mirrors src/ one-to-one (one .d.ts per source file)
│   │   ├── config-ui/server.d.ts
│   │   ├── lib/*.d.ts           — One per src/lib module (no regex.d.ts or schema.d.ts; neither
│   │   │                           module currently exports a type consumed elsewhere)
│   │   ├── cli/*.d.ts           — One per src/cli module
│   │   ├── constant.d.ts        — Constant union types (device categories, statuses, types)
│   │   ├── index.d.ts           — Types for src/index.ts
│   │   └── shared.d.ts          — Shared type aliases used across domains
│   └── index.ts                 — Entry point; registers ADTPulsePlatform under "ADTPulse"
├── config.schema.json           — Homebridge plugin schema + custom UI registration
├── eslint.config.mts            — ESLint flat config (Nova presets + per-file overrides)
├── package.json
├── tsconfig.json / tsconfig.config.json / tsconfig.tests.json
└── vitest.config.mts / vitest.setup.ts
```

### `apps/config-ui/` — the setup wizard and settings frontend

```
apps/config-ui/
├── src/
│   ├── assets/                  — Logo images (setup-logo.png, complete-logo.png)
│   ├── components/              — Shared components (fingerprint-table, screen-toggle)
│   ├── lib/theme.ts             — Mirrors Homebridge theme colors into the isolated UI
│   ├── pages/                   — Setup wizard (welcome, login, request-code, validate,
│   │                               sensors, complete) and settings screens (general, login,
│   │                               fingerprint, plugin, sensors, classic), plus the setup.tsx
│   │                               and settings.tsx layout wrappers that router.tsx renders
│   ├── styles/                  — Isolated CSS and style objects for components and pages
│   ├── tests/                   — Theme, navigation, settings, and type-declaration tests
│   ├── types/config-ui.d.ts     — Single aggregate types file (predates the plugin's per-file
│   │                               twin-tree layout; imports Zod schemas directly from
│   │                               ../../../../packages/homebridge-adt-pulse/src/lib/schema)
│   ├── index.tsx                — Frontend entry point; mounts React in a shadow root
│   └── router.tsx               — Routes to the setup wizard or the settings screens
├── public/                      — Static assets (favicon.ico)
├── index.html                   — HTML shell
├── package.json
├── tsconfig.json
├── vite-env.d.ts                — Vite client type reference
└── vite.config.mjs              — Builds to ./build; copied into the plugin at build time
```

This workspace tests theme synchronization, preview navigation, settings tabs and sensors, and type declarations with Vitest.

### `apps/docs/` — documentation site

```
apps/docs/
├── docs/
│   ├── overview.mdx             — Docs landing page (linked from the navbar logo and footer)
│   ├── getting-started/         — Installation, configuration, portal region, fingerprint,
│   │                               supported devices
│   ├── configuration/           — Advanced options, operational mode, sensors and zones,
│   │                               synchronization speed
│   ├── arming/                  — Arm Night, force arming, temperature sensors
│   ├── operations/              — Debug mode, detection and privacy, scripts, stale accessories
│   ├── platform-support/        — HOOBS
│   └── reference/                — Config schema, credits, FAQ
├── src/
│   ├── pages/index.tsx           — Custom (non-MDX) landing route
│   └── tests/                    — dotenv, frontmatter, link, markdown-table, terminology, and
│                                    type-declarations suites
├── static/                       — Favicons, manifest, robots.txt, logo, thumbnail
├── docusaurus.config.ts          — Site config (Nova "lantern" preset)
├── sidebars.ts                   — Fully autogenerated sidebar
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.config.json / tsconfig.tests.json
└── vitest.config.mts / vitest.setup.ts
```

## Key Files

| File                                                    | Purpose                                              | When to modify                                             |
|---------------------------------------------------------|------------------------------------------------------|------------------------------------------------------------|
| `packages/homebridge-adt-pulse/src/index.ts`            | Plugin entry point; registers the platform           | Almost never                                               |
| `packages/homebridge-adt-pulse/src/lib/platform.ts`     | Plugin lifecycle, accessory cache, polling           | Changing lifecycle, polling, or state handling             |
| `packages/homebridge-adt-pulse/src/lib/api.ts`          | Portal driver (login, status reads, arm/disarm)      | Portal request or scraping changes                         |
| `packages/homebridge-adt-pulse/src/lib/auth.ts`         | MFA workflow and fingerprint enrollment              | Changing the setup and verification flow                   |
| `packages/homebridge-adt-pulse/src/lib/accessory.ts`    | Device-to-HomeKit mapping                            | Changing services or characteristics per device type       |
| `packages/homebridge-adt-pulse/src/lib/regex.ts`        | Central regex registry for the plugin                | Any new pattern (inline regex literals are banned by lint) |
| `packages/homebridge-adt-pulse/src/lib/schema.ts`       | Zod schemas, shared with `apps/config-ui`            | Config shape or portal response shape changes              |
| `packages/homebridge-adt-pulse/config.schema.json`      | Homebridge config UI schema + custom UI registration | Config shape changes; keep in sync with `platformConfig`   |
| `packages/homebridge-adt-pulse/src/config-ui/server.ts` | Config UI backend endpoints                          | Setup wizard changes                                       |
| `apps/config-ui/src/router.tsx`                         | Chooses the setup vs. settings screen                | Changing top-level config UI routing                       |
| `apps/docs/docusaurus.config.ts`                        | Docs site configuration                              | Navbar, footer, preset, or SEO changes                     |
| `nova.config.json`                                      | Nova project, workspace, and workflow configuration  | Identity, workspace, workflow, or environment changes      |
| `turbo.json`                                            | Turborepo task pipeline                              | Adding or changing a cross-workspace task                  |
| `package.json` (root)                                   | Workspace root manifest and turbo scripts            | Adding workspaces, changing root scripts                   |

## Build and Tooling

### Prerequisites

| Tool       | Version                                 | Purpose                                                                                             |
|------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------|
| Node.js    | `^22` or `^24`                          | Runtime (from the root `engines` field; identical in every workspace)                               |
| npm        | `11.18.0` (pinned via `packageManager`) | Package manager; CI enables npm through Corepack before installing                                  |
| Turborepo  | `2.10.11`                               | Orchestrates `dev` / `prod` / `build` / `check` / `deploy` / `clean` across the three workspaces    |
| Homebridge | `^1.11.0` or `^2.0.0-beta.0`            | Host platform (plugin's `engines` field); `1.8.5` is pinned as a dev dependency to back `npm start` |

Dependency versions are pinned exactly in every workspace (no caret or tilde ranges), enforced by Nova's `normalize-dependencies` recipe. The one exception is a transitive `overrides.webpack` range (`>=5.95.0 <5.106.0`) at the root, required by the Docusaurus 3.10 toolchain. Key tooling shared across workspaces: TypeScript `6.0.3`, ESLint `9.39.5`, and `@cbnventures/nova` `0.27.1`. `apps/docs` additionally pins Docusaurus `3.10.2` and `@cbnventures/docusaurus-preset-nova` `0.27.0`; `apps/config-ui` pins Vite `7.3.6` and React `19.2.8`; the plugin pins Vitest `4.1.11`.

### Commands

Root-level, Turborepo-orchestrated:

| Command             | What it does                                                                                                                                                                                                      |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `npm install`       | Install every workspace's dependencies; `postinstall` runs `scripts/link-nova.mjs`, which npm-links any `@cbnventures/*` package that is already globally linked                                                  |
| `npm run dev`       | `turbo run dev` — `apps/config-ui` runs Vite, `apps/docs` runs Docusaurus start via portless; the plugin defines no `dev` task                                                                                    |
| `npm run prod`      | `turbo run prod` — depends on `check` + `build`, then `apps/docs` serves its built site; the other workspaces define no `prod` task                                                                               |
| `npm run build`     | Builds all three workspaces in dependency order through Turborepo                                                                                                                                                 |
| `npm run check`     | `turbo run check --concurrency=2` (lint + type-check + test per workspace), then root lint, config/scripts/tests type-checks, and Vitest tests                                                                    |
| `npm run deploy`    | `turbo run deploy --concurrency=2` — depends on `check` + `build`; no workspace currently defines its own `deploy` script, so this is presently equivalent to `check` + `build`. Actual publishing happens in CI. |
| `npm run clean`     | `turbo run clean` — only `apps/docs` defines a `clean` task (removes `build/` and clears the Docusaurus cache)                                                                                                    |
| `npm run changelog` | `nova utility changelog` — records or releases changelog entries                                                                                                                                                  |
| `npm run recipes`   | `nova utility run-recipes --replace-file` — applies the Nova recipes configured in `nova.config.json` (README, LICENSE, `package.json` normalization, etc.)                                                       |

Workspace-level scripts worth knowing:

- `packages/homebridge-adt-pulse`: `npm start` (`homebridge --debug --keep-orphans --plugin-path $(pwd)`), `npm run repl`, and `npm run test-api` all execute compiled files from `build/`, so run `npm run build` first. The package also exposes `hap-repl` and `hap-test-api` bins. Its build snapshots Nova identity and current Stable browser versions, then copies `apps/config-ui/build` into `build/config-ui/public`.
- `apps/config-ui`: `npm run dev` (Vite dev server), `npm run build` (`vite build` into `./build`).
- `apps/docs`: `npm run dev` (Docusaurus start on a portless-assigned port) and `npm run i18n` / `i18n:check` / `i18n:coverage` (theme-nova i18n sync).

### Environment Variables

| Scope                               | Prefix     | Where it applies                                                                                                                                   |
|-------------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Project (repo-wide CI secrets/vars) | `PROJECT_` | e.g. `secrets.PROJECT_NPM_TOKEN` in `nova-publish-project.yml`                                                                                     |
| Root workspace (`./`)               | `ROOT_`    | `.env` / `.env.sample` at the repo root                                                                                                            |
| `apps/docs` workspace               | `DOCS_`    | `apps/docs/.env` / `.env.sample`                                                                                                                   |
| `sponsor-check` workflow            | `SGS_`     | GitHub Actions vars/secrets consumed by `nova-check-sponsor-gated-issues-sponsor-check.yml` (e.g. `SGS_ISSUE_LABELS`, `SGS_PERSONAL_ACCESS_TOKEN`) |

Both `.env.sample` templates (root and `apps/docs`) currently define only the Node.js/Nova boilerplate (`NODE_ENV`, `LOG_LEVEL`, `LOG_TIME`) with an empty "Project - Variables" section — no project-specific variables are defined under `ROOT_` or `DOCS_` yet. The actual `.env` files are gitignored and were not inspected here. `apps/config-ui` and `packages/homebridge-adt-pulse` have no `.env` files and no configured prefix. The plugin itself reads no environment variables at runtime; all runtime configuration comes from the plugin's platform block in Homebridge's `config.json`, validated by the `platformConfig` Zod schema.

## Workspace Rules

### Naming Conventions

| Entity                  | Convention                                                                                                            | Example                                                                                      |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Workspace package names | kebab-case, `homebridge-adt-pulse-*` for apps                                                                         | `homebridge-adt-pulse-docs`, `homebridge-adt-pulse-app-config-ui`                            |
| Source files            | kebab-case                                                                                                            | `test-api.ts`, `fingerprint-table.tsx`                                                       |
| Core plugin classes     | PascalCase with an `ADTPulse` prefix                                                                                  | `ADTPulsePlatform`, `ADTPulseAPI`, `ADTPulseAuth`, `ADTPulseAccessory`                       |
| Functions/variables     | camelCase                                                                                                             | `generateFakeLoginFingerprint`, `platformConfig`                                             |
| Type aliases            | `UnderscorePascalCase`, prefixed by the file-path hierarchy chain (`require-jsdoc-hierarchy` / `require-type-naming`) | `Lib_Platform_ADTPulsePlatform_...`, `ConfigUi_Server_ADTPulseConfigServer_Validate_Returns` |
| Regex patterns          | camelCase, grouped by kind, centralized in `packages/homebridge-adt-pulse/src/lib/regex.ts`                           | `requestPathKeepAlive`, `textOneTimePasscode`                                                |
| Config keys             | camelCase                                                                                                             | `adtName`, `disableAlarmRingingSwitch`                                                       |

JSDoc is mandatory in every workspace: every documentable block carries `@since`, summaries follow the file-path-derived hierarchy chain, and `@param` lines are vertically aligned (`require-jsdoc-*` rules). Each workspace enforces this independently through its own `eslint.config.mts` rather than inheriting from the root config, because the root config explicitly ignores `apps/**` and `packages/**`.

### Do / Don't

**Do:**

- Keep the three workspaces' roles separate. `packages/homebridge-adt-pulse` is the published npm plugin, `apps/config-ui` is its custom-UI frontend, and `apps/docs` is the documentation site. `apps/config-ui` imports the plugin's Zod schemas straight from its TypeScript source (not a built or published artifact), and the plugin copies `apps/config-ui`'s built output into its own `build/config-ui/public` at build time.
- Centralize every regex in `packages/homebridge-adt-pulse/src/lib/regex.ts` and choose flags at the call site with `new RegExp(pattern, flags)`; inline regex literals and literal flags are banned by lint in every workspace (`no-regex-literals`, `no-regex-literal-flags`). `apps/config-ui` and `apps/docs` enforce the same rule but have not yet needed to create their own `regex.ts`.
- Keep all type definitions in `.d.ts` files under each workspace's `src/types/` — mirrored one-to-one with `src/` in the plugin, a single aggregate file in `apps/config-ui`. Inline type annotations in code files are banned (`no-inline-type-annotation`).
- Validate every external input with Zod: the platform config block, config UI form and server bodies, and portal MFA/OTP responses (`packages/homebridge-adt-pulse/src/lib/schema.ts`).
- Keep `config.schema.json` and the `platformConfig` Zod schema in sync whenever the config shape changes; both describe the same platform block.
- Route new portal shapes through the catalogs in `src/lib/items.ts` and the baselines in `src/lib/detect.ts` so undocumented shapes keep triggering detect reports.
- Redact personally identifiable information with `removePersonalIdentifiableInformation` before any detect report leaves the user's machine.
- Run `npm run build` in `packages/homebridge-adt-pulse` before `npm run repl` or `npm run test-api`; both execute compiled files from `build/`.
- Run `npm run check` from the root before committing; it lints, type-checks, and tests every workspace through Turborepo.

**Don't:**

- Don't edit `CLAUDE.md`, `AGENTS.md`, or `conventions/*.md`; they are generated by Nova's agent-conventions generator and will be overwritten on its next run.
- Don't hand-edit `nova.config.*.nova-backup.json` snapshot files; Nova writes them automatically before mutating `nova.config.json`.
- Don't assume `apps/config-ui`'s types are workspace-local. `src/types/config-ui.d.ts` imports Zod schemas directly from `packages/homebridge-adt-pulse/src/lib/schema` via a relative path that npm workspaces does not model as a dependency, so changes to those schemas can silently break the config UI's typecheck.
- Don't add Z-Wave accessory support; the README rules it out due to implementation complexity and platform instability.
- Don't reintroduce a separate plugin debug setting; debug mode intentionally activates only when Homebridge debug mode is on.
- Don't commit or hand-edit any workspace's `build/`; it is generated output and gitignored everywhere.
- Don't throw from API/auth methods for expected failures; they return typed success/failure result objects and callers branch on `success`.
- Don't add a `deploy` script to a workspace without checking `turbo.json`'s `deploy` task first; today it is a `check` + `build` alias, and actual publishing lives entirely in `nova-publish-project.yml`.

## Project-Specific Patterns

### Architecture

A layered Homebridge platform plugin, with its custom config UI and its documentation site split into their own Turborepo workspaces:

```
Homebridge (HAP)
  |
  v
packages/homebridge-adt-pulse/src/index.ts (registers the "ADTPulse" platform)
  |
  v
ADTPulsePlatform (src/lib/platform.ts)
  lifecycle, accessory cache, state, polling timers
  |
  |--> ADTPulseAPI (src/lib/api.ts)
  |      browser-emulated portal session (axios + cookie jar + jsdom)
  |      helpers: fake.ts (fingerprints), regex.ts (patterns),
  |               items.ts (known shapes), detect.ts (anomaly checks)
  |
  `--> ADTPulseAccessory (src/lib/accessory.ts)
         one per device; maps portal state onto HAP services

Homebridge UI (custom config UI, customUiPath: ./build/config-ui)
  |
  v
apps/config-ui (Vite + React 19; separate workspace) - setup wizard + settings
  imports Zod schemas straight from packages/homebridge-adt-pulse/src/lib/schema
  |  built to apps/config-ui/build, then copied into
  |  packages/homebridge-adt-pulse/build/config-ui/public by build:copy-ui
  v
packages/homebridge-adt-pulse/src/config-ui/server.ts (backend request handlers)
  |
  `--> ADTPulseAuth (src/lib/auth.ts) - MFA login, trusted device, fingerprint

Standalone CLI entry points (src/cli/repl.ts, src/cli/test-api.ts)
drive ADTPulseAPI and ADTPulseAuth directly from the terminal.

apps/docs (Docusaurus 3.10; independent workspace)
  publishes user-facing documentation; not part of the runtime plugin
```

### Data Flow

1. **Registration** - Homebridge loads the plugin and calls `initialize`, which registers `ADTPulsePlatform`. Module: `packages/homebridge-adt-pulse/src/index.ts`.
2. **Config validation** - The platform block from Homebridge's `config.json` is validated with the `platformConfig` Zod schema so misconfigured credentials, modes, or sensors fail fast. Module: `src/lib/schema.ts` (consumed by `src/lib/platform.ts`, and imported directly by `apps/config-ui` for the frontend form).
3. **Login** - `ADTPulseAPI` performs a browser-emulated portal login using axios with a cookie jar and fabricated fingerprint components. Modules: `src/lib/api.ts`, `src/lib/fake.ts`.
4. **Polling** - A synchronize interval (scaled by the `speed` setting) dispatches sync checks and keep-alives, then fetches gateway, panel, and sensor information when the portal reports changes. Module: `src/lib/platform.ts`.
5. **Parsing and detection** - Portal responses are parsed with jsdom and the shared regex patterns; parsed shapes are compared against the known catalogs, and unknown shapes are dispatched as redacted detect reports. Modules: `src/lib/api.ts`, `src/lib/regex.ts`, `src/lib/items.ts`, `src/lib/detect.ts`, `src/lib/utility.ts`.
6. **HomeKit updates** - The platform unifies portal devices with the accessory cache (`unifyDevices`, `pollAccessories`), and each `ADTPulseAccessory` maps device state onto services and characteristics. Arm/disarm requests flow back through `ADTPulseAPI.setPanelStatus`, force-arming open sensors when needed. Modules: `src/lib/platform.ts`, `src/lib/accessory.ts`, `src/lib/api.ts`.
7. **First-time setup (config UI)** - The `apps/config-ui` frontend (built separately and copied into the plugin's `build/config-ui/public`) walks `/initialize` -> `/get-methods` -> `/request-code` -> `/validate` -> `/generate-config`, calling into `packages/homebridge-adt-pulse/src/config-ui/server.ts`, which uses `ADTPulseAuth` to complete MFA and produce a config with the device fingerprint. Modules: `apps/config-ui/src/router.tsx`, `packages/homebridge-adt-pulse/src/config-ui/server.ts`, `src/lib/auth.ts`.

### Error Strategy

| Layer                                                                      | Strategy                                                                                                                                                                          |
|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Config validation                                                          | Zod schema check at startup; misconfiguration fails fast with clear messages                                                                                                      |
| API / auth methods                                                         | Return typed `{ success, info }` result objects instead of throwing; callers branch on `success`                                                                                  |
| Portal anomalies                                                           | `detect.ts` compares parsed content to documented baselines; unknown shapes are reported to the author (PII redacted), not crashed on                                             |
| Logging                                                                    | `debugLog` writes through the Homebridge logger and falls back to the console; `stackTracer` prints serialized errors; debug output only appears when Homebridge debug mode is on |
| Config UI server (`packages/homebridge-adt-pulse/src/config-ui/server.ts`) | Request bodies validated with the `configServer*` Zod schemas before any portal request is made                                                                                   |
| Config UI frontend (`apps/config-ui`)                                      | Form input validated with the `configUi*` Zod schemas via react-hook-form; caught errors reported through `console.error`                                                         |
| CLI entry points (`src/cli/`)                                              | May write to the console and set process exit codes (permitted by dedicated lint overrides)                                                                                       |

## Documentation Site

### Framework

- **Framework:** Docusaurus `3.10.2`, themed by `@cbnventures/docusaurus-preset-nova` `0.27.0` (preset identity `lantern`), React `19.2.8`
- **Source directory:** `apps/docs`

### Site Structure

`apps/docs/docs/` holds MDX content organized into six categories plus a top-level landing page:

- `overview.mdx` - docs landing page, linked from the navbar logo and footer
- `getting-started/` - installation, configuration, portal region, fingerprint retrieval, supported devices
- `configuration/` - advanced options, operational mode, sensors and zones, synchronization speed
- `arming/` - Arm Night, force arming, temperature sensors
- `operations/` - debug mode, detection and privacy, scripts, stale accessories
- `platform-support/` - HOOBS
- `reference/` - config schema, credits, FAQ

The sidebar (`sidebars.ts`) is fully autogenerated from the `docs/` directory tree; category ordering comes from each folder's `_category_.json`. `src/pages/index.tsx` is the only custom (non-MDX) route. Internationalization is configured for `en` only today (`i18n.locales: ['en']`); the `theme-nova i18n` commands are wired for future locales. Search, sitemap, and analytics all flow through the Nova Docusaurus preset's config block in `docusaurus.config.ts` (local search indexing docs and pages, weekly-changefreq sitemap excluding `/docs/tags/**`).

### Commands

| Command                                         | What it does                                                                                    |
|-------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `npm run dev` (in `apps/docs`)                  | `docusaurus start` on a portless-assigned port (`0.0.0.0`, no auto-open)                        |
| `npm run build`                                 | Sequential: `docusaurus build`, then transpile `src/pages` under `tsconfig.app.json`            |
| `npm run prod`                                  | `docusaurus serve` on a portless-assigned port                                                  |
| `npm run check`                                 | Sequential: ESLint, type-check `tsconfig.app.json` and `tsconfig.tests.json`, then `vitest run` |
| `npm run i18n` / `i18n:check` / `i18n:coverage` | Sync, check, or report translation coverage via `theme-nova i18n`                               |
| `npm run clean`                                 | Remove `build/` and clear the Docusaurus cache                                                  |

## Publishing and Deployment

### Release Process

1. Review the pending `.changelog/` entries against the working copy, then preview the versions and release notes with `npm run changelog -- --release --dry-run`.
2. Run `npm run changelog -- --release` when the preview is correct. Nova consumes the entries, updates both workspace changelogs, and bumps the plugin and config UI to the same version because `settings.lockStepVersioning` is enabled. The freezable root and `apps/docs` workspaces remain at `0.0.0`; Nova stamps their `UNRELEASED` source tags without creating changelog sections for them.
3. Run `npm run check`, `npm run build`, and `npm pack --dry-run --workspace packages/homebridge-adt-pulse`. Review the resulting diff, then commit and push the release changes.
4. Publish a GitHub Release tagged `vX.Y.Z`, using the plugin's new version. The release triggers `nova-publish-project.yml`, which runs `turbo run check` and `turbo run build` across the project, publishes the plugin to npm.js and GitHub Packages, and deploys `apps/docs` to GitHub Pages (skipped automatically if Pages isn't enabled on the repository). Manual `workflow_dispatch` runs default to a dry run unless `dry-run` is explicitly set to false.

### CI/CD Workflows

| Workflow file                                       | Trigger                                  | What it does                                                                                                                                                                                          |
|-----------------------------------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nova-publish-project.yml`                          | Release published, or manual dispatch    | Turbo-builds all three workspaces, then publishes the plugin to npm.js (GitHub OIDC, `id-token: write`) and GitHub Packages (scoped to the repository owner), and deploys `apps/docs` to GitHub Pages |
| `nova-check-sponsor-gated-issues-sponsor-check.yml` | Issues opened/closed, issue comments     | Runs the `mrjackyliang/sponsor-gated-support` action; usernames listed in `SPONSOR_EXEMPT` bypass the sponsor requirement                                                                             |
| `nova-lock-inactive-issues-lock-inactive.yml`       | Weekly cron (Sunday), or manual dispatch | Runs the `mrjackyliang/lock-inactive-threads` action to lock issues and pull requests inactive for 30+ days                                                                                           |

### Environments

| Environment     | URL / Identifier                                     | Purpose                                                                 |
|-----------------|------------------------------------------------------|-------------------------------------------------------------------------|
| npm.js          | https://www.npmjs.com/package/homebridge-adt-pulse   | Public package registry (primary distribution)                          |
| GitHub Packages | `@mrjackyliang/homebridge-adt-pulse`                 | Scoped mirror publish                                                   |
| GitHub Pages    | https://mrjackyliang.github.io/homebridge-adt-pulse/ | Documentation site (`apps/docs`), deployed by the same release workflow |
| Homebridge      | User-installed via npm or the Homebridge Config UI   | Runtime target on end-user machines                                     |
