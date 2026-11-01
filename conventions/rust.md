# Rust Conventions

Formatting: `rustfmt`. Linting: Clippy with the workspace's configured lint
levels. File and module naming: snake_case. Type and trait naming: PascalCase.

These rules preserve the intent of Nova's TypeScript conventions while using
idiomatic Rust. They do not translate TypeScript syntax mechanically.

## Documentation Style

- Public items use Rustdoc comments (`///`); modules and crates use inner
  Rustdoc comments (`//!`).
- Start with a one-sentence summary, then a 2–3 line body explaining why the
  item exists, who uses it, or when it matters.
- Add standard sections such as `# Errors`, `# Panics`, and `# Safety` when the
  contract exposes those behaviors.
- New or changed items end with `Since: UNRELEASED`. Nova stamps that sentinel
  during the workspace release; never write the release version by hand.
- Document private items when their invariants, concurrency, unsafe behavior,
  or side effects are not obvious from the implementation.

### Example

```rust
/// Publishes prepared release artifacts.
///
/// Command handlers use this client after validation so provider access stays
/// separate from version preparation and local release state.
///
/// # Errors
///
/// Returns an error when the provider rejects or cannot receive the artifact.
///
/// Since: UNRELEASED
pub trait PublishClient {
    fn publish(&self, request: &PublishRequest) -> Result<(), PublishError>;
}

/// Publishes one validated artifact.
///
/// The method adds artifact context while preserving the provider error as the
/// source so callers can inspect the complete failure chain.
///
/// # Errors
///
/// Returns an error when the configured client cannot publish the artifact.
///
/// Since: UNRELEASED
pub fn publish(
    client: &dyn PublishClient,
    request: &PublishRequest,
) -> Result<(), PublishError> {
    client
        .publish(request)
        .map_err(|source| PublishError::Publish {
            name: request.name.clone(),
            source,
        })
}
```

## Naming and Modules

- Crates, modules, functions, methods, local variables, and files use
  snake_case.
- Structs, enums, traits, variants, and type aliases use PascalCase.
- Constants and statics use SCREAMING_SNAKE_CASE.
- Lifetimes use short lowercase names that communicate their relationship; use
  descriptive names when several lifetimes coexist.
- Avoid project-invented abbreviations. Preserve established domain and Rust
  initialisms when changing them would make the API less recognizable.
- Keep `mod.rs` only where the existing project intentionally uses that layout;
  otherwise prefer `module.rs` plus `module/` children.

## Imports and Visibility

- Group `use` declarations by standard library, external crates, then local
  crate modules, separated by blank lines.
- Prefer explicit imports over glob imports. A prelude or test module may use a
  glob only when that is its deliberate public contract.
- Keep visibility as narrow as possible: private first, then `pub(super)` or
  `pub(crate)`, and `pub` only for the external contract.
- Re-export an item only when the parent module intentionally owns the public
  path.

## Ownership and Types

### Borrow Before Cloning

- Accept borrowed values when the function only reads them.
- Return owned values when ownership must leave the function.
- Clone deliberately at an ownership boundary; do not add `.clone()` merely to
  silence a borrow-checker error without understanding the lifetime.
- Prefer `&str` over `&String` and slices over borrowed `Vec` values.

### Domain Types over Primitive Flags

Use enums, newtypes, and structs for states with distinct meaning. Avoid boolean
parameters whose meaning is unclear at the call site and raw strings for closed
sets of supported values.

```rust
// BAD — intent is hidden at the call site.
publish(request, true)?;

// GOOD — the domain state is explicit.
publish(request, DeploymentEnvironment::Production)?;
```

### Traits at Real Boundaries

- Introduce a trait when multiple implementations, external integration, or a
  test seam is part of the design—not only to wrap one function mechanically.
- Prefer static dispatch with generics unless runtime polymorphism is required.
- Keep traits small and behavior-focused.

## Error Handling

- Use `Result` for recoverable failure and `Option` for absence.
- Propagate errors with `?` and add operation/subject context at system
  boundaries.
- Preserve error sources. Structured libraries should expose typed errors;
  applications may add broader contextual reports at their outer boundary.
- Do not use `unwrap()` or `expect()` in production paths unless an invariant is
  proven locally and the message explains why violation is impossible.
- Reserve `panic!` for broken invariants, not invalid user input or provider
  failure.
- Never discard a `Result` silently. If failure is intentionally ignored,
  explain the safety argument in a nearby comment.

## Control Flow

### Early Returns and Pattern Matching

- Handle invalid or exceptional states first and keep the successful path at
  the lowest indentation level.
- Prefer exhaustive `match` expressions when every variant carries meaningful
  behavior.
- Use `if let` or `let ... else` for a single relevant pattern when the other
  state exits or is intentionally ignored.
- Avoid wildcard arms when adding a new enum variant should force callers to
  make a decision.

### Iterators and Loops

- Use iterator adapters when they express a transformation clearly.
- Use a `for` loop when control flow, side effects, or error context becomes
  clearer than a long adapter chain.
- Name closure parameters after the singular collection element; avoid opaque
  one-letter names outside tiny mathematical scopes.
- Break complex iterator chains into typed intermediate values before the chain
  becomes difficult to inspect or debug.

## Concurrency and Async

- Do not hold a blocking or asynchronous lock across `.await` unless the lock
  type and design explicitly support it.
- Every spawned task has an owner, completion strategy, and cancellation path.
- Propagate cancellation and timeout decisions from the caller rather than
  hiding unbounded waits inside helpers.
- Use channels for ownership transfer and synchronization primitives for shared
  state; do not rely on task scheduling order.
- Require `Send` and `Sync` only where the actual boundary needs them.

## Unsafe Code

- Avoid `unsafe` when a safe abstraction can express the same contract.
- Every `unsafe` block has an adjacent `// SAFETY:` comment that states the
  invariant making the operation sound.
- Every unsafe public function has a Rustdoc `# Safety` section describing the
  caller's obligations.
- Keep unsafe code inside the smallest practical module and expose a safe API
  around it.

## Code Organization

- Keep public contracts discoverable before private implementation details.
- Separate parsing, validation, side effects, and presentation when they fail
  for different reasons or require different tests.
- Extract nested calls into named values when doing so clarifies ownership,
  error context, or side effects.
- Separate distinct operations with blank lines; keep comments attached to the
  code whose intent they explain.
- Do not introduce macros for ordinary reuse. Use a macro when syntax-level
  generation is genuinely the clearest contract, and document its accepted
  forms and expansion assumptions.

## Tests

- Unit tests live beside private implementation in `#[cfg(test)]` modules;
  integration tests live in `tests/` and use the public API.
- Name tests after the behavior and condition being verified.
- Use table-like case arrays when several inputs share one contract, but keep
  assertion failures readable for each case.
- Keep tests deterministic and isolated from the network, wall clock, and user
  machine unless the suite explicitly provides those dependencies.
- Use temporary directories and fixtures with automatic cleanup.
- Test important errors and boundary conditions, not only the happy path.

```rust
#[cfg(test)]
mod tests {
    use super::{parse_mode, DeploymentEnvironment};

    #[test]
    fn parse_mode_accepts_production() {
        let actual = parse_mode("production").expect("production is valid");

        assert_eq!(actual, DeploymentEnvironment::Production);
    }
}
```

## Verification

Run the project's configured commands. When working directly with a Rust
workspace, the minimum language checks are:

```bash
cargo fmt --check
cargo check --all-targets
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets --all-features
```

Use the repository's Nova scripts when they wrap these commands; do not bypass
additional project checks defined in `nova.config.json` or `package.json`.
