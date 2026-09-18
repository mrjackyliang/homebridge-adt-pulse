# AGENTS.md

Read and follow the conventions and rules defined in the files below.

## Vision and Purpose

- [VISION.md](VISION.md) — Purpose, marketing copy, and glossary.

## Project Rules

- [PROJECT_RULES.md](PROJECT_RULES.md) — Project identity, repository layout, source structure, key files, build tooling, workspace rules, project-specific patterns, documentation site, and publishing/deployment.

## Coding Conventions

### Universal

- [conventions/universal.md](conventions/universal.md) — Workflow, general code style, documentation style, platform build rules, and release notes format.
- [conventions/documentation.md](conventions/documentation.md) — Documentation conventions (Docusaurus MDX page structure, voice, and style).

### Per Language

- [conventions/typescript.md](conventions/typescript.md) — TypeScript / JavaScript conventions (type system, imports, class structure, code style, TSConfig).
- [conventions/swift.md](conventions/swift.md) — Swift conventions (documentation style, code style).
- [conventions/java.md](conventions/java.md) — Java conventions (documentation style, code style).
- [conventions/kotlin.md](conventions/kotlin.md) — Kotlin conventions (documentation style, code style).
- [conventions/csharp.md](conventions/csharp.md) — C# conventions (documentation style, code style).
- [conventions/php.md](conventions/php.md) — PHP conventions (documentation style, code style).
- [conventions/python.md](conventions/python.md) — Python conventions (documentation style, code style).
- [conventions/css.md](conventions/css.md) — CSS conventions (documentation style, code style).
- [conventions/docker.md](conventions/docker.md) — Docker conventions (documentation style, code style).
- [conventions/shell.md](conventions/shell.md) — Shell conventions (documentation style, code style).

## Agent Directives

- **Plan before acting.** For non-trivial changes that span multiple files, outline the planned modifications and wait for approval before proceeding. The cost of pausing to align is low; the cost of unwanted changes across a codebase is high.
- **Match the scope of changes to what was requested.** Do not add features, refactor surrounding code, introduce documentation, or make improvements beyond the immediate task. If a bug fix is requested, fix the bug — do not clean up neighboring code.
- **Read before writing.** Always read existing code before suggesting modifications. Understand the patterns, conventions, and intent already present in the file before making changes.
- **Ask when intent is unclear.** If a request is ambiguous or could be interpreted multiple ways, ask for clarification rather than guessing. A wrong assumption can be more expensive than a short pause.
- **Verify your work.** After making changes, run the project's build, lint, or test commands to confirm nothing is broken. Do not leave verification to the user unless the commands are unavailable.

## Sensitive Files

These files contain critical project information — architectural decisions, identity, and positioning that are difficult to reconstruct if lost. Edit with care and do not overwrite or remove existing content without explicit instruction.

- `VISION.md`
- `PROJECT_RULES.md`

## Restricted Files

These files are managed by Nova's agent-conventions generator (`nova generate must-haves agent-conventions`) and kept in sync across environments. Do not edit them locally; the generator overwrites them on its next run, so local changes are lost and cause drift.

- `CLAUDE.md`
- `AGENTS.md`
- `conventions/*.md`
