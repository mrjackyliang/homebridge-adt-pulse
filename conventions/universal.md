# Universal Coding Conventions

Rules that apply across all programming languages and platforms.

## AI Agent Behavior

### Supported Agents

Nova officially supports Claude Code and Codex. Follow the shared rules in this
file on both platforms, then apply the explicitly labeled platform instructions
when their tools or interaction models differ.

Other coding agents may use these conventions, but they must translate the
Claude Code and Codex instructions to their closest supported capabilities.

### Task Tracking

Every top-level user request must be tracked as a task. Break multi-step requests
into discrete sub-tasks. Mark each task as in progress before starting and
completed when done.

**Claude Code:**

| Tool         | Purpose                                                                    |
|--------------|----------------------------------------------------------------------------|
| `TaskCreate` | Create a new task with subject, description, and optional spinner text.    |
| `TaskGet`    | Retrieve a task by ID to check its current state.                          |
| `TaskList`   | List all tasks to find the next available work.                            |
| `TaskUpdate` | Update status (`pending` / `in_progress` / `completed`), add dependencies. |

**Codex:**

| Tool / command | Purpose                                                                                      |
|----------------|----------------------------------------------------------------------------------------------|
| `update_plan`  | Create and maintain the current task's ordered steps and their progress.                     |
| `create_goal`  | Start a persistent goal after the user explicitly requests Goal mode.                        |
| `get_goal`     | Read the active goal's objective, status, budget, and progress.                              |
| `update_goal`  | Complete an achieved goal, pause it when requested, or report a repeated blocking condition. |
| `/plan`        | Let the user request investigation and planning before implementation.                       |
| `/goal`        | Let the user start or inspect a persistent objective.                                        |
| `/goal pause`  | Let the user pause the active goal.                                                          |
| `/goal resume` | Let the user resume a paused goal.                                                           |
| `/goal clear`  | Let the user remove the active goal.                                                         |

Use `update_plan` for ordinary multi-step work when the tool is available. Use a
persistent goal only when the user explicitly requests one or invokes `/goal`;
do not create a goal for a one-off edit.

**Unsupported agents:**

Use the platform's closest task-tracking equivalent. If none exists, maintain a
checklist in progress updates. State what is about to happen and confirm each
completed checkpoint before moving on.

### Scope Confirmation

Confirm the understood scope and intended approach before acting on every user
request. If the user already explicitly requested implementation, this
confirmation is a progress update, not a second approval gate. Wait only when an
unresolved decision would materially change the result or requires authority the
user has not granted.

Honor the platform's active permission mode. Auto or auto-accept modes allow
explicitly authorized work to continue without repeated approval prompts; they
do not expand the user's requested scope.

### Working Copy and Authorization

Inspect the working copy before material edits. Preserve unrelated user changes,
including uncommitted and untracked files, and never revert or reformat them as
part of another task.

Do not commit, tag, push, publish, deploy, delete material data, or mutate an
external system unless the user explicitly authorizes that action. Resolve exact
targets with read-only checks before any destructive operation.

### Command Output Caching

Cache command output when it is expensive to reproduce, nondeterministic,
crash-prone, likely to be truncated, or needed after a pause or context
compaction. Examples include long builds, virtual-machine runs, crash logs,
repository-wide audits, and release verification.

Store cached output in a task-specific temporary directory, read from that file
instead of rerunning the command, and remove it when the evidence is no longer
needed. Do not cache trivial commands such as `pwd`, `git status`, or small
searches.

### File Writes

Use your platform's dedicated file-editing tool to create or modify files. In Claude Code, that is `Write` or `Edit`; in Codex CLI, `apply_patch`; other agents have equivalents. Do not write files through shell redirection (`cat > file`, `echo >>`, `tee`, heredocs), in-place editors (`sed -i`, `awk -i`), inline scripts (`node -e`, `python -c`, PowerShell `Set-Content`), or any other script- or batch-file-driven write. Shell-driven writes routinely produce malformed output — quoting errors, encoding mismatches, missing newlines, partial writes — that then has to be repaired by hand.

Reading files via the shell (`cat`, `head`, `tail`, `grep`, `rg`) is fine. The restriction applies only to writes.

### Command Transparency

Run shell commands from explicit, full directory paths so every invocation is
unambiguous. Prefix shell commands with `cd` to the absolute target directory so
the working directory is visible in the output. When a native tool exposes a
dedicated working-directory field instead of a shell, set that field and report
the directory in the progress update.

```bash
# BAD — ambiguous which workspace
npm run build

# GOOD — explicit directory
cd /path/to/packages/nova && npm run build
```

### Browser and UI Work

Use the narrowest available capability before general computer control.

**Claude Code:**

1. Prefer a purpose-built connector or MCP tool.
2. Use Claude in Chrome or Desktop Preview for rendered pages and interaction.
3. Use computer use only when a narrower tool cannot complete the task.
4. Use `agent-browser` for headless checks or screenshots that must be saved as files.

**Codex:**

1. Prefer a purpose-built connector or app tool.
2. Use the Codex in-app browser or preview for rendered pages.
3. Use browser control or computer-use automation for interaction.
4. Use available headless browser tooling when those surfaces are unavailable or an artifact must be saved.

On both platforms, use plain HTTP clients for API and transport checks, not for
tasks that require rendering, clicking, visual inspection, or browser state.

### Web Research

When stuck on an unfamiliar API, error message, library behavior, or design choice, do web research before guessing. The right direction or answer turns up the majority of the time. Cite URLs so the user can verify.

Before searching, check what you already have. If the answer lives in the repo, the dependency's source, `--help`, a man page, a `README`, or a `CHANGELOG.md`, read those first — web research for local-knowledge questions is wasted motion. When you do search, sanitize the query: no secrets, internal URLs, proprietary code, or unique identifiers — strip to a generic reproduction.

Prefer authoritative sources in this order: official docs → source code → GitHub issues → Stack Overflow → other. Check each result's date and the library version it covers against yours; articles age and APIs deprecate. Treat AI-generated SEO content as untrustworthy by default — verify every claim against an authoritative source before applying it.

If a search returns no useful results, that is ambiguous: it may mean the **query** is wrong (wrong terms, too narrow), or that the **approach** is wrong (unusual framing of the problem). Reformulate the query 2–3 times before concluding the approach itself is off; when it is, step back and restate the problem rather than searching harder. Watch for confirmation bias — once early results push you toward a hypothesis, follow-up searches will keep surfacing "evidence" for it; periodically ask whether you're searching to understand or to justify. Conversely, when the first few authoritative results all agree "this isn't supported" or "isn't possible," that *is* the answer — don't keep searching for a workaround the ecosystem clearly hasn't built.

### Honest Acknowledgment

Don't open responses with performative agreement like "you're right" or "great catch." It hides the reasoning behind your change, obscures what's actually being updated, and lets the same class of mistake recur silently elsewhere. The user can't correct compounding behavior they haven't seen disclosed.

When the user corrects you, state what you're actually updating, why the prior approach was wrong, and whether the same fix needs to apply elsewhere. Push back if the correction is itself mistaken — silent compliance is worse than honest disagreement.

## Workflow

### Scope

- **Only apply version and changelog rules to user-requested product changes.** Process-only edits, tooling updates, and non-product changes do not trigger version bumps or changelog entries.
- **Match the implementation to the requested outcome.** Do not add neighboring features, refactors, or cleanup unless they are necessary to complete the authorized task.

### Per-Change Mechanics

- **Use the project's changelog mechanism.** Record user-visible product changes through the repository's configured tooling. Do not manually edit generated release artifacts or infer a release format from memory.
- **Verify every logical change.** After each approved logical change or repository batch, run proportionate focused checks and the applicable build before starting unrelated work. A multi-file implementation is one logical checkpoint, not one checkpoint per file.
- **Do not add changelog entries for version bumps alone** or for incidental implementation fallout unless there is a clear user-visible behavior change.

### Version and Release Boundaries

- **Read the repository's configured strategy before changing versions.** Do not assume semver, calver, build-number behavior, workspace release roles, or version-file locations.
- **Do not start or cut a release without explicit authorization.** A product change does not independently authorize a version bump, release cut, commit, tag, push, publication, or deployment.
- **Keep generated release state synchronized through project tooling.** Do not hand-edit version stamps or released changelog output unless the repository explicitly documents that workflow and the user requests it.

### Wrapping Up

- **Continue until the requested outcome is genuinely complete.** Stop at explicit user review, approval, or manual-intervention boundaries.
- **Report evidence.** Summarize the changed files, checks and builds run, unresolved issues, and any manual action that remains.
- **Do not infer commit authorization from completion.** Prepare a commit message or release notes when requested, but leave repository and remote state unchanged unless the user explicitly asks for the corresponding action.

## General Code Style

- Semicolons at statement ends.
- Commas as separators in arrays, dictionaries, and argument lists (not semicolons).
- Trailing commas in multiline constructs.
- Ternary form: `(condition) ? valueA : valueB` — parenthesized condition, single-line.
- Curly braces required for all control structures (no braceless `if`/`else`/`for`).
- LF line endings.
- Final newline required at end of file.
- No abbreviations in variable names, type names, or any identifiers — spell everything out fully. External API names (e.g., `tmpdir()`) are fine as-is, but the variable storing the result must be spelled out.

### Quotes and Indentation

| Language                | Quotes                           | Indentation |
|-------------------------|----------------------------------|-------------|
| TypeScript / JavaScript | Single                           | 2-space     |
| Go                      | Double (string literals)         | Tabs        |
| Rust                    | Double (string literals)         | 4-space     |
| Swift                   | Double (only option)             | 4-space     |
| Java                    | Double (only option)             | 4-space     |
| Kotlin                  | Double (only option)             | 4-space     |
| C#                      | Double (only option)             | 4-space     |
| PHP                     | Single (non-interpolated)        | 4-space     |
| Python                  | Double (Black/Google convention) | 4-space     |
| CSS                     | N/A                              | 2-space     |
| Docker                  | Double (for variable expansion)  | 2-space     |
| Shell                   | Double (for variable expansion)  | 2-space     |

### File Naming

| Language                | Convention                       | Example                                       |
|-------------------------|----------------------------------|-----------------------------------------------|
| TypeScript / JavaScript | kebab-case                       | `markdown-table.ts`, `cli-header.d.ts`        |
| Go                      | lowercase snake_case             | `release_client.go`, `release_client_test.go` |
| Rust                    | snake_case                       | `release_client.rs`                           |
| Swift                   | PascalCase + role suffix         | `TunnelFormView.swift`, `TunnelModel.swift`   |
| Java                    | PascalCase matching class name   | `EntityRepository.java`                       |
| Kotlin                  | PascalCase matching class name   | `EntityRepository.kt`                         |
| C#                      | PascalCase matching class name   | `EntityRepository.cs`                         |
| PHP                     | PascalCase (PSR-4) or snake_case | `EntityRepository.php`                        |
| Python                  | snake_case (PEP 8)               | `entity_repository.py`                        |
| CSS                     | kebab-case                       | `user-profile.css`                            |
| Docker                  | kebab-case                       | `api-gateway.Dockerfile`                      |
| Shell                   | kebab-case                       | `backup-config.sh`                            |

## Documentation Style

### General Rules

- Every member documented — public, private, protocol stubs (`var body`). No exceptions.
- Required body paragraph: every doc comment MUST include a body paragraph after the summary line that explains why the declaration exists, who uses it, or when it matters. Body must be 2–3 lines, max 80 characters per line (not counting the comment prefix). Prefer 2 lines — fill the first line as fully as possible, remainder on line 2. Use 3 lines only when content truly needs it. For 3-line bodies, the second line must be the longest (diamond/belly shape) — keep the 1st and 3rd lines at reasonable length. Structured tags (`- Parameter`, `- Returns`, `- Throws`, `@param`, `@returns`, etc.) go after the body.
- No file-level comments above imports.

### Summary Line Convention

- Summary line uses the hierarchy chain format: `ClassName - Member Name.`
- Summary line ends with a period.
- `var body: some View` is documented as `TypeName - Body.`

### Hierarchy Chain

- Top-level declarations: `ClassName.`
- Members: `ClassName - MemberName.`
- Nested types: `OuterClass.InnerClass - MemberName.`
- Enum cases: `EnumName - CaseName.`
