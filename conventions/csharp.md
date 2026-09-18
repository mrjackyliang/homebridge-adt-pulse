# C# Conventions

Quotes: Double (only option). Indentation: 4-space. File naming: PascalCase matching class name (e.g., `EntityRepository.cs`).

## Documentation Style

- Comment syntax: `///`
- Padding tag: `<remarks>Since v1.0.0</remarks>` (XML doc tag)
- Param format: `<param name="x">X</param>` (description matches the parameter name, capitalized, no trailing period inside XML tags)
- Return format: `<returns>Type</returns>`
- Blank `///` at top and bottom of every comment block.
- No `@private` tag needed (access control is in the declaration).

### Example

```csharp
///
/// Entity Repository.
///
/// <remarks>Since v1.0.0</remarks>
///
public class EntityRepository {
    ///
    /// Entity Repository - Database.
    ///
    /// <remarks>Since v1.0.0</remarks>
    ///
    private readonly Database _database;

    ///
    /// Entity Repository - Constructor.
    ///
    /// <param name="database">Database</param>
    ///
    /// <remarks>Since v1.0.0</remarks>
    ///
    public EntityRepository(Database database) { ... }

    ///
    /// Entity Repository - Find By ID.
    ///
    /// <param name="id">ID</param>
    ///
    /// <returns>Entity?</returns>
    ///
    /// <remarks>Since v1.0.0</remarks>
    ///
    public async Task<Entity?> FindById(Guid id) { ... }
}
```

## Code Style

### Explicit Access Modifiers

All class members require explicit `public`, `private`, `protected`, or `internal`. Never rely on C#'s default `private` for members or `internal` for types.

```csharp
// BAD — implicit private
void ProcessData(string input) { ... }

// GOOD — explicit modifier
public void ProcessData(string input) { ... }
private void ValidateInput(string input) { ... }
```

### `readonly` on Fields

Use `readonly` for fields assigned once in the constructor, never reassigned after.

```csharp
// GOOD — assigned once, never reassigned
private readonly Database _database;

// No readonly — reassigned during lifecycle
private string _selectedCategory;
```

### Method Overloads vs Generic Parameters

Prefer overloads when the return type or behavior differs per input type. A single parameter type (e.g., `object`) is fine when the handling is identical regardless of input type.

```csharp
// GOOD — overloads (different behavior per type)
private static string Format(string value) {
    return value.Trim();
}

private static string Format(int value) {
    return value.ToString("F2");
}

// GOOD — single param (same handling regardless)
private static bool Validate(object value) {
    return value != null;
}
```

### Method Ordering

1. Public methods first.
2. Private methods second (async grouped, then non-async grouped).

Each method separated by a blank line. No blank line after opening brace or before closing brace of the class.

### Expression-Bodied Members

Use expression body (`=>`) for single-expression methods, properties, and read-only accessors. Use block body for anything with multiple statements.

```csharp
// GOOD — expression-bodied property
public string FullName => $"{FirstName} {LastName}";

// GOOD — expression-bodied simple method
public bool IsActive() => Status == Status.Active;

// GOOD — block body for multiple statements
public async Task<Entity?> FindById(Guid id) {
    var entity = await _database.GetAsync(id);

    return entity;
}
```

### Switch Statements — Always Block-Scoped

Every `case` and `default` uses block scoping with `{ }`. Always include a `default` case, even if there's nothing to handle. Prefer `switch` expressions with pattern matching where appropriate.

```csharp
switch (category) {
    case "added": {
        logger.Info("New feature.");
        break;
    }

    case "fixed": {
        logger.Info("Bug fix.");
        break;
    }

    default: {
        logger.Warn("Unknown category.");
        break;
    }
}

// Switch expression — acceptable for value mapping
var label = category switch {
    "added" => "New feature",
    "fixed" => "Bug fix",
    _ => "Unknown",
};
```

### Explicit Null Checks — Avoid Optional Chaining

Avoid `?.` chaining — prefer explicit null checks with early returns. Nullish coalescing (`??`) is fine for providing defaults. Don't combine them.

```csharp
// BAD — optional chaining
var name = config?.Name;

// GOOD — explicit check
if (config == null) {
    return;
}

var name = config.Name;

// GOOD — null coalescing for defaults
var timeout = options.Timeout ?? 5000;
var label = config.Name ?? "default";

// BAD — chained together
var name = config?.Name ?? "default";
```

### `var` vs Explicit Type

Use `var` when the type is obvious from the right-hand side. Use explicit types when the type is not immediately clear.

```csharp
// GOOD — type obvious from constructor/method
var config = new Config();
var items = GetItems();

// GOOD — explicit type when not obvious
List<string> names = ParseNames(rawInput);
```

### LINQ Method Syntax vs Query Syntax

Prefer method syntax (`.Where()`, `.Select()`, `.FirstOrDefault()`). Query syntax is acceptable for complex joins.

- `.Where()`, `.Select()`, `.FirstOrDefault()` — transforming or searching, returns a new value.
- `foreach` — side effects (logging, mutating external collections, async operations).
- `.Aggregate()` — acceptable, but `foreach` with a mutable accumulator is also fine.

### Block Body vs Expression Body in Lambdas

- **Block body** (`=> { ... }`): When accessing properties of the param, or when multiple statements needed.
- **Expression body** (`=> expression`): When the lambda is a direct comparison or single method call.

```csharp
// Block body — accessing properties, multiple operations
items.Select(item => {
    var itemName = item.Name;
    var itemRole = item.Role;

    return new ItemResult(itemName, itemRole);
});

// Expression body — direct comparison
validCategories.FirstOrDefault(
    validCategory => validCategory == value
);

// Expression body — single property check
items.Where(item => item.IsActive);
```

### Descriptive Lambda Parameter Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```csharp
// BAD
validCategories.Where(c => c == value);

// GOOD
validCategories.Where(validCategory => validCategory == value);
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```csharp
var workspaceConfig = workspace.Config;
var workspaceConfigName = workspaceConfig.Name;
var workspaceConfigRole = workspaceConfig.Role;
```

### `async`/`await` Patterns

Use `Task.WhenAll` for parallel execution. Suffix async methods with `Async`.

```csharp
// GOOD — parallel execution
var (data, configRaw) = await (
    FetchDataAsync(),
    File.ReadAllTextAsync(configPath)
);

// GOOD — Async suffix convention
public async Task<Entity?> FindByIdAsync(Guid id) { ... }
private async Task<Config> LoadConfigAsync() { ... }
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

When a method call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

Array initializers, list initializers, and similar collections use one entry per line in multiline constructs.

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

- **Creator** (method designer): may design a method to throw on failure — that's the API contract.
- **Consumer** (method caller): always wraps calls to throwing methods in try/catch.
- CLI entry points never throw — set the appropriate exit code with `Environment.ExitCode` and return.