# Go Conventions

Formatting: `gofmt`. Import grouping: `goimports`-compatible. File naming:
lowercase snake_case where separation improves readability (for example,
`release_client.go` and `release_client_test.go`).

These rules preserve the intent of Nova's TypeScript conventions while using
idiomatic Go. They do not translate TypeScript syntax mechanically.

## Documentation Style

- Comment syntax: `//` for declarations and packages.
- Exported declarations start with the declaration's exact name.
- Package comments start with `Package <name>` and appear once per package.
- Add a 2–3 line body explaining why the declaration exists, who uses it, or
  when it matters.
- New or changed declarations end with `Since: UNRELEASED`. Nova stamps that
  sentinel during the workspace release; never write the release version by
  hand.
- Document unexported declarations when their contract, concurrency, security,
  or side effects are not obvious from the implementation.

### Example

```go
// Package release coordinates validated project publication.
//
// The package keeps version preparation separate from provider-specific
// publishing so callers can verify the release state before any upload.
package release

// Client publishes prepared release artifacts.
//
// Command handlers depend on Client rather than a concrete provider so tests
// can exercise release behavior without external network calls.
//
// Since: UNRELEASED
type Client interface {
	Publish(ctx context.Context, request PublishRequest) error
}

// Publish sends a prepared artifact to the configured provider.
//
// Callers receive wrapped provider errors with enough context to identify the
// artifact and operation that failed.
//
// Since: UNRELEASED
func (runner *Runner) Publish(ctx context.Context, request PublishRequest) error {
	err := runner.client.Publish(ctx, request)
	if err != nil {
		return fmt.Errorf("publish %q: %w", request.Name, err)
	}

	return nil
}
```

## Naming and Files

- Package names are short, lowercase, singular words without underscores.
- Exported names use PascalCase; unexported names use camelCase.
- Initialisms use Go's established casing (`ID`, `URL`, `HTTP`), including
  inside longer identifiers such as `workspaceID` and `HTTPClient`.
- Test files end in `_test.go` and live beside the code they exercise.
- Platform files use Go build suffixes or build constraints rather than runtime
  branching when the implementation is genuinely platform-specific.
- Avoid abbreviations invented by the project. Established domain and Go
  initialisms remain acceptable.

## Imports

- Let `gofmt` preserve blocks and use `goimports` grouping semantics: standard
  library, blank line, third-party, blank line, project-local packages.
- Import packages by their declared name. Add an alias only to resolve a real
  collision or to clarify an otherwise misleading package name.
- Never use dot imports outside narrowly justified test helpers.
- Use blank imports only for deliberate registration side effects and explain
  the side effect in a nearby comment.

## Types and APIs

### Interfaces Belong to Consumers

Declare an interface where it is consumed, not beside the concrete type by
default. Keep interfaces as small as the behavior the consumer actually needs.
Return concrete types unless abstraction is part of the public contract.

```go
// GOOD — the consumer owns the capability it needs.
type tokenValidator interface {
	Validate(ctx context.Context, token string) error
}
```

### Context Placement

Functions that accept `context.Context` place it first and name it `ctx`. Do not
store contexts in structs. Propagate cancellation to every blocking operation
that supports it.

### Options and Zero Values

- Prefer a useful zero value when the type can provide one safely.
- Use an options struct when a function needs several related or optional
  values.
- Avoid boolean parameters whose meaning is unclear at the call site; use a
  named option or domain type instead.
- Do not add getters mechanically. Export a field only when it is intentionally
  part of the data contract; otherwise expose behavior.

### Pointer and Value Semantics

- Use pointer receivers when a method mutates the receiver, the type contains a
  synchronization primitive, or copying is materially expensive.
- Keep the receiver form consistent across a type's method set.
- Do not use a pointer solely to signal optionality when an explicit result or
  option type communicates the state better.
- Never copy values containing `sync.Mutex`, `sync.Once`, or related state.

## Control Flow

### Errors Are Explicit

- Handle every returned error unless the API contract proves it cannot matter.
- Return errors as the last result.
- Wrap errors with operation and subject context using `%w` so callers can use
  `errors.Is` and `errors.As`.
- Do not compare error strings.
- Reserve `panic` for broken invariants or process-startup conditions that
  cannot be represented as a recoverable error.

```go
contents, err := os.ReadFile(configPath)
if err != nil {
	return fmt.Errorf("read config %q: %w", configPath, err)
}
```

### Early Returns

Handle invalid input and failures first. Keep the successful path at the lowest
indentation level. Avoid `else` after a branch that returns, continues, breaks,
or panics.

### Switches

- Prefer a `switch` when one value or state has several meaningful branches.
- Keep each case focused and avoid implicit control flow through `fallthrough`.
- Include a default branch when unknown input is possible; omit it for a closed
  type switch only when the compiler and tests make completeness clear.

### Loops and Collections

- Use `range` when the index or key/value pair is meaningful.
- Name loop values after the singular collection element; do not use one-letter
  names except conventional, tiny mathematical scopes.
- Preallocate slices or maps when the final size is known and materially useful.
- Preserve the contract distinction between `nil` and empty collections when
  serializing or crossing an API boundary.

## Concurrency

- Every goroutine has an identifiable owner, completion path, and cancellation
  strategy.
- Do not start a goroutine merely to avoid blocking the current function.
- Close channels from the sending side. Do not close a channel when multiple
  senders cannot agree on ownership.
- Use `errgroup`-style coordination when sibling operations must cancel and
  report one another's errors.
- Protect shared mutable state explicitly; do not rely on timing or incidental
  execution order.
- Run the race detector for concurrency-sensitive changes when the environment
  supports it.

## Code Organization

- Keep declarations near the behavior they support rather than collecting
  unrelated helpers into a utility package.
- Order a file so its public contract is discoverable first: exported types,
  constructors, exported functions and methods, then private helpers.
- Keep initialization explicit. Avoid `init()` unless registration must happen
  before `main` and no ordinary constructor can express it.
- Extract nested calls into named values when doing so clarifies validation,
  error reporting, or side effects.
- Separate distinct operations with blank lines; do not stack process comments
  without the code they describe.

## Tests

- Prefer table-driven tests when several cases exercise the same contract.
- Give each case a stable descriptive name and run subtests with `t.Run`.
- Mark shared test helpers with `t.Helper()`.
- Keep tests deterministic and isolated from the network, wall clock, and user
  machine unless the suite explicitly provides those dependencies.
- Use temporary directories from `t.TempDir()` and automatic cleanup through
  `t.Cleanup()`.
- Test exported behavior and important failure paths; do not duplicate the
  implementation inside the assertion logic.

```go
func TestParseMode(t *testing.T) {
	tests := []struct {
		name string
		input string
		want Mode
	}{
		{
			name: "production",
			input: "production",
			want: ModeProduction,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := ParseMode(test.input)
			if err != nil {
				t.Fatalf("ParseMode() error = %v", err)
			}

			if got != test.want {
				t.Fatalf("ParseMode() = %q, want %q", got, test.want)
			}
		})
	}
}
```

## Verification

Run the project's configured commands. When working directly with a Go
workspace, the minimum language checks are:

```bash
go fmt ./...
go vet ./...
go test ./...
```

Use the repository's Nova scripts when they wrap these commands; do not bypass
additional project checks defined in `nova.config.json` or `package.json`.
