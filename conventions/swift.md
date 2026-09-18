# Swift Conventions

Quotes: Double (only option). Indentation: 4-space. File naming: PascalCase + role suffix (e.g., `TunnelFormView.swift`, `TunnelModel.swift`).

## Documentation Style

- Comment syntax: `///`
- Padding tag: `- Since: 1.0.0` (DocC callout)
- Param format: `- Parameter name: Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `- Returns: Description.`
- Throws format: `- Throws: Description.`
- Blank `///` at top and bottom of every comment block.
- No `@private` tag needed (access control is in the declaration).

### Example

```swift
///
/// Tunnel Store.
///
/// - Since: 1.0.0
///
@MainActor
final class TunnelStore: ObservableObject {
    ///
    /// Tunnel Store - Managed Tunnels.
    ///
    /// - Since: 1.0.0
    ///
    @Published private(set) var managedTunnels: [Tunnel] = []

    ///
    /// Tunnel Store - Constructor.
    ///
    /// - Since: 1.0.0
    ///
    init() { ... }

    ///
    /// Tunnel Store - Bootstrap If Needed.
    ///
    /// - Parameter force: Force.
    ///
    /// - Since: 1.0.0
    ///
    func bootstrapIfNeeded(force: Bool = false) async { ... }

    ///
    /// Tunnel Store - Body.
    ///
    /// - Since: 1.0.0
    ///
    var body: some View { ... }
}

///
/// Tunnel Status.
///
/// - Since: 1.0.0
///
enum TunnelStatus {
    ///
    /// Tunnel Status - Active.
    ///
    /// - Since: 1.0.0
    ///
    case active
}
```

## Code Style

### Explicit Access Control

All declarations require explicit `public`, `private`, `internal`, `fileprivate`, or `open`. Never rely on Swift's default `internal`.

```swift
// BAD — implicit internal
func processData(input: String) { ... }

// GOOD — explicit modifier
public func processData(input: String) { ... }
private func validateInput(input: String) { ... }
```

### `let` over `var`

Default to `let` (immutable). Use `var` only when reassignment is needed.

```swift
// GOOD — assigned once
let configPath = resolve("config.json")
let configRaw = try String(contentsOfFile: configPath)

// var — reassigned later
var selectedCategory: String? = nil
selectedCategory = matchedCategory
```

### Method Ordering

1. Public methods first.
2. Private methods second.

Each method separated by a blank line. No blank line after opening brace or before closing brace of the type.

### `guard` for Early Returns

Use `guard` for precondition checks that exit the scope on failure. Use `if let` only when you need both the bound and unbound branches.

```swift
// GOOD — guard for early return
guard let config = loadConfig() else {
    return
}

let configName = config.name

// GOOD — if let when both branches are needed
if let name = config.name {
    logger.info("Found: \(name)")
} else {
    logger.warn("No name configured.")
}
```

### `switch` — Always Exhaustive with Block Scope

Every `case` and `default` uses block-like separation. Switch must be exhaustive (compiler-enforced for enums, `default` required for other types).

```swift
switch category {
    case .added: {
        logger.info("New feature.")
    }

    case .fixed: {
        logger.info("Bug fix.")
    }

    default: {
        logger.warn("Unknown category.")
    }
}
```

### Explicit Nil Checks — Avoid Optional Chaining

Avoid `?.` chaining — prefer `guard let` or explicit nil checks with early returns. Nil coalescing (`??`) is fine for providing defaults. Don't combine them.

```swift
// BAD — optional chaining
let name = config?.name

// GOOD — guard let
guard let config = config else {
    return
}

let name = config.name

// GOOD — nil coalescing for defaults
let timeout = options.timeout ?? 5000
let label = config.name ?? "default"

// BAD — chained together
let name = config?.name ?? "default"
```

### Higher-Order Functions vs `for-in`

- `.filter()`, `.map()`, `.first(where:)` — transforming or searching, returns a new value.
- `for-in` — side effects (logging, mutating external collections, async operations).
- `.reduce()` — acceptable, but `for-in` with a mutable accumulator is also fine.

### Block Body vs Expression Body in Closures

- **Block body** (`{ param in ... }`): When accessing properties of the closure param, or when multiple statements needed.
- **Expression body** (single-expression closure): When the closure is a direct comparison or single method call.

```swift
// Block body — accessing properties, multiple operations
items.map { item in
    let itemName = item.name
    let itemRole = item.role

    return ItemResult(title: itemName, description: itemRole)
}

// Expression body — direct comparison
validCategories.first { validCategory in validCategory == value }

// Expression body — single property check
results.filter { result in result.status == .fulfilled }
```

### Trailing Closure Syntax

Use trailing closure syntax when the last parameter is a closure. Use labeled closure syntax when there are multiple closure parameters.

```swift
// GOOD — trailing closure
items.filter { item in
    item.isActive
}

// GOOD — labeled closures for multiple closure params
UIView.animate(
    withDuration: 0.3,
    animations: {
        view.alpha = 1.0
    },
    completion: { finished in
        logger.info("Animation complete.")
    }
)
```

### Named Closure Parameters — No `$0`

Always name closure parameters explicitly. Never use shorthand argument names (`$0`, `$1`).

```swift
// BAD — shorthand arguments
items.filter { $0.isActive }
items.map { $0.name }

// GOOD — named parameters
items.filter { item in item.isActive }
items.map { item in item.name }
```

### Descriptive Closure Parameter Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```swift
// BAD
validCategories.first { c in c == value }

// GOOD
validCategories.first { validCategory in validCategory == value }
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```swift
let workspaceConfig = workspace.config
let workspaceConfigName = workspaceConfig.name
let workspaceConfigRole = workspaceConfig.role
```

### Comment Placement in Method Bodies

Comments describe the process/intent. Placement rules:
- Comment sits above the code block it describes.
- Blank line before the comment (except at the start of a scope).
- No comment needed on the first block if it's self-explanatory.
- No trailing comments (same-line comments after code). Exception: multi-line conditions may use inline `//` comments after each condition line to explain the check.

### No Stacked Comments

One descriptive comment per code block. No consecutive comments without code between them.

### Quote File Names in Comments and Log Messages

Wrap file names in double quotes inside comments and log strings (e.g., `"config.json"`, `"CHANGELOG.md"`).

### Blank Lines between Distinct Operations

Separate method calls, `await` statements, and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

### Bare Side-Effect Statements Get Their Own Visual Group

When a function call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

Array literals, dictionary literals, and similar collections use one entry per line in multiline constructs.

### Mixed Logical Conditions

When mixing `&&`/`||`, parenthesized groups go on their own lines, each condition on its own line.

### No Multi-Line Boolean Variable Assignments for `if`

Don't extract a multi-condition boolean into a named variable just to check it once. Inline conditions directly in `if` blocks.

### Ternary Expressions

- No nested ternaries.
- No ternaries inside string interpolation — extract to a variable first.

### Readability — All Generated Code Must Be Human-Readable

Don't inline complex expressions into string interpolation or other expressions. Break them into named variables so each step is clear.

### Error Handling

- **Creator** (function designer): may design a function to `throw` on failure — that's the API contract.
- **Consumer** (function caller): always wraps calls to throwing functions in `do`/`try`/`catch`.
- CLI entry points and `@main` never throw — handle errors and call `exit()` with the appropriate code.