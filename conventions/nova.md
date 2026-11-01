# Nova Conventions

Rules for agents and developers working in repositories managed by Nova. Read
this file with `universal.md`, the applicable language conventions,
`nova.config.json`, `VISION.md`, and `PROJECT_RULES.md`.

## Source of Truth

- `nova.config.json` defines project identity, workspace roles, version
  strategy, enabled recipes, workflows, deployment targets, and Nova behavior.
- `package.json` scripts are the public project interface. Use the root scripts
  before invoking underlying tools directly.
- `VISION.md` defines product purpose and boundaries. `PROJECT_RULES.md` defines
  repository-specific structure and exceptions.
- Generated files remain generated. Change the Nova template or configuration
  that owns a file, then regenerate it; do not patch generated output as the
  primary fix.
- Never infer a Nova contract from another consumer unless the user explicitly
  asks for comparison or consistency across a named group of repositories.

## Work from the Project Root

Run Nova from the repository root containing `nova.config.json`. Workspace
commands still use the root orchestration unless project rules explicitly say
otherwise.

```bash
cd /absolute/path/to/project
npm run check
npm run build
```

Do not bypass the root with direct workspace commands merely because they are
faster. Focused checks are useful during implementation, but the configured root
check and build remain the final repository contract.

## Configuration

- Prefer `nova utility configure` for supported configuration changes. Every
  supported `nova.config.json` field must remain editable through that utility.
- Read the current value before changing it; do not replace sibling settings or
  custom workflow data while updating one field.
- Use `nova recipe nova-config normalize-order` only to normalize key order. It
  does not decide project semantics.
- Do not place secrets, tokens, private keys, or credential paths in
  `nova.config.json`. Use the vendor's official credential location or the
  environment contract documented for that integration.

## Command Boundaries

### Generate

`nova generate` creates or synchronizes project-level files. It does not create
application or package workspaces. Configure prerequisites first, then run the
specific generator.

### Recipe

`nova recipe <category>` opens that category's interactive menu. It is not a
batch command. Run a specific recipe when reviewing one transformation, or run
`nova utility run-recipes` to execute every individually enabled recipe in
registry order.

Recipes preserve existing project commands and content unless the documented
recipe contract explicitly owns them. They may add missing standard structure;
they must not silently replace a consumer's custom implementation.

### Scaffold

`nova scaffold` creates a new Nova project or adds one supported workspace to an
existing Nova monorepo. Scaffolds collect all interactive answers before writing
files, install dependencies by default, register the workspace and platforms,
and leave project-level generators as separate opt-in work.

Treat scaffold templates as user-facing source code. Generated applications
must remain readable, editable, translation-ready where the platform supports
it, and free of tests that police Nova's template implementation after the user
starts customizing the project.

### Utility

- `nova utility changelog --record` records a user-visible change.
- `nova utility changelog --release` applies the configured release strategy,
  regenerates release state, and stamps supported unreleased annotations.
- `nova utility run-recipes` runs every enabled recipe.
- `nova utility run-workspaces <script>` executes the configured dependency
  graph with the project's concurrency and cache settings. For a configured
  final product, add `--artifact <name>` so Nova builds its workspace closure
  and assembles the declared root `build/<name>/` layout.
- `nova utility run-scripts` coordinates related scripts inside one workspace.

Keep workspace build outputs independent. The top-level `artifacts` map owns
any deliberate combination into the root `build/` staging area; do not add
ad-hoc copy steps between unrelated workspace build folders.

Use command help and the generated docs for additional utilities. Do not invent
new aliases, categories, or command semantics from memory.

## Changelog and Versioning

- Record changelog fragments through Nova's changelog command. Do not hand-edit
  generated `CHANGELOG.md` release sections.
- Read the configured workspace policy and version strategy before proposing a
  version. `freezable`, `trackable`, and `distributable` have different release
  contracts; SemVer and CalVer have different next-version rules.
- `0.0.0` is the reserved freezable sentinel. Do not reuse it as a generic
  starting version for trackable or distributable workspaces.
- Add `UNRELEASED` annotations only in syntaxes the Nova stamper supports and
  only where the declaration convention requires one.
- A release command does not authorize commit, tag, push, publish, deployment,
  or consumer rollout. Those remain separate user decisions.

## Recipes and Generated State

- Recipe toggles are individual, not category-wide. Preserve each repository's
  deliberate exceptions while moving shared defaults into Nova.
- Run recipes after configuration and templates are correct, not as a substitute
  for understanding an unexplained diff.
- Review the working-copy diff after recipe execution. A recipe must not rewrite
  unrelated custom scripts, deployment commands, documentation, or project
  content.
- Use `--dry-run` when available to inspect a broad or unfamiliar operation
  before allowing writes.

## Linked Nova Development

Some Nova-owned consumers intentionally use `link-nova` so their checks exercise
the local Nova checkout before publication. Treat that as a maintainer workflow,
not a scaffold default or a requirement for third-party consumers.

- Preserve a repository's established `link-nova` integration when the project
  is owned by the Nova maintainer and actively develops against Nova.
- Do not add it to generated scaffolds.
- Do not add it to client or third-party repositories unless the user explicitly
  requests local Nova development there.
- Before a consumer release, replace development-only linkage with the published
  Nova version through the repository's approved rollout workflow.

## Verification

1. Run focused checks for the affected workspace while iterating.
2. Run the root `npm run check` after the logical change is complete.
3. Run the root `npm run build` when the change affects emitted artifacts,
   templates, packages, applications, or deployment output.
4. Run scaffold contract coverage when a template, generator, dependency
   snapshot, or scaffold option changes.
5. Inspect generated files for user-facing quality; a passing snapshot does not
   replace semantic review.

When a required service is installed but stopped, use the repository's supported
test harness to start it when authorized. Do not silently skip container-native
or platform-native validation merely because the engine was initially stopped.

## Release Handoff

Before presenting release material, confirm the changelog command has produced
the intended released section and that check/build evidence belongs to the
current working copy. Present the repository's preferred commit message and the
complete GitHub release block separately. Do not include procedural phrases such
as “release Nova” or dependency-only upgrade summaries unless they describe the
actual user-visible change.
