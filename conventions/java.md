# Java Conventions

Quotes: Double (only option). Indentation: 4-space. File naming: PascalCase matching class name (e.g., `EntityRepository.java`).

## Documentation Style

- Comment syntax: `/** */`
- Padding tag: `@since UNRELEASED` (Javadoc) — tag new or changed API with `@since UNRELEASED`; the release process stamps the real version automatically, so never hand-write a version number.
- Param format: `@param name - Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `@return Type`

### Example

```java
/**
 * Entity Repository.
 *
 * @since UNRELEASED
 */
public class EntityRepository {
    /**
     * Entity Repository - Database.
     *
     * @since UNRELEASED
     */
    private final Database database;

    /**
     * Entity Repository - Constructor.
     *
     * @param database - Database.
     *
     * @since UNRELEASED
     */
    public EntityRepository(Database database) { ... }

    /**
     * Entity Repository - Find By ID.
     *
     * @param id - ID.
     *
     * @return Entity
     *
     * @since UNRELEASED
     */
    public Entity findById(UUID id) { ... }
}
```

## Code Style

### Explicit Access Modifiers

All class members require explicit `public`, `private`, or `protected`. Never rely on package-private (default) access.

```java
// BAD — package-private (implicit)
void processData(String input) { ... }

// GOOD — explicit modifier
public void processData(String input) { ... }
private void validateInput(String input) { ... }
```

### `final` on Local Variables

Use `final` for variables that are assigned once and never reassigned. Equivalent to `const` in TypeScript.

```java
// GOOD — assigned once, never reassigned
final String configPath = resolve("config.json");
final String configRaw = Files.readString(Path.of(configPath));

// No final — reassigned later
String selectedCategory = null;
selectedCategory = matchedCategory;
```

### Method Overloads vs Generic Parameters

Prefer overloads when the return type or behavior differs per input type. A single parameter type (e.g., `Object`) is fine when the handling is identical regardless of input type.

```java
// GOOD — overloads (different behavior per type)
private static String format(String value) {
    return value.trim();
}

private static String format(int value) {
    return String.valueOf(value);
}

// GOOD — single param (same handling regardless)
private static boolean validate(Object value) {
    return value != null;
}
```

### Method Ordering

1. Public methods first.
2. Private methods second.

Each method separated by a blank line. No blank line after opening brace or before closing brace of the class.

### Switch Statements — Always Block-Scoped

Every `case` and `default` uses block scoping with `{ }`. Always include a `default` case, even if there's nothing to handle.

```java
switch (category) {
    case "added": {
        logger.info("New feature.");
        break;
    }

    case "fixed": {
        logger.info("Bug fix.");
        break;
    }

    default: {
        logger.warn("Unknown category.");
        break;
    }
}
```

### Explicit Null Checks — No Truthy/Falsy

Always use explicit comparisons. Prefer explicit null checks over `Optional` wrapping for simple cases.

- `== null` — not initialized / absent.
- `!= null` — present.
- `.equals()` — value comparison for objects.
- `.isEmpty()` — explicit empty check for strings and collections.

```java
// BAD — truthy-style string check
if (name) { ... }

// GOOD — explicit checks
if (name != null) { ... }
if (!name.isEmpty()) { ... }
if (items.size() > 0) { ... }
```

### Stream API vs `for` Loop

- `.filter()`, `.map()`, `.findFirst()` — transforming or searching, returns a new value.
- `for` / `for-each` — side effects (logging, mutating external collections).
- `.reduce()` — acceptable, but `for-each` with a mutable accumulator is also fine.

```java
// GOOD — stream for transformation
final List<String> names = items.stream()
    .filter(item -> item.isActive())
    .map(item -> item.getName())
    .toList();

// GOOD — for-each for side effects
for (final Item item : items) {
    logger.info(item.getName());
}
```

### Block Body vs Expression Body in Lambdas

- **Block body** (`-> { ... }`): When accessing properties of the param, or when multiple statements needed.
- **Expression body** (`-> expression`): When the lambda is a direct comparison or single method call.

```java
// Block body — accessing properties, multiple operations
items.stream().map(item -> {
    final String itemName = item.getName();
    final String itemRole = item.getRole();

    return new ItemResult(itemName, itemRole);
});

// Expression body — direct comparison
validCategories.stream().filter(
    validCategory -> validCategory.equals(value)
);

// Expression body — single method call
items.stream().map(item -> item.getName());
```

### Descriptive Lambda Parameter Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```java
// BAD
validCategories.stream().filter(c -> c.equals(value));

// GOOD
validCategories.stream().filter(
    validCategory -> validCategory.equals(value)
);
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```java
final Config workspaceConfig = workspace.getConfig();
final String workspaceConfigName = workspaceConfig.getName();
final String workspaceConfigRole = workspaceConfig.getRole();
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

Separate method calls and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

```java
// BAD — everything stuck together
final String configRaw = Files.readString(configPath);
final Config config = parser.parse(configRaw);
final List<Item> filtered = filterItems(config.getItems());

// GOOD — each operation gets breathing room
final String configRaw = Files.readString(configPath);

final Config config = parser.parse(configRaw);

final List<Item> filtered = filterItems(config.getItems());
```

### Bare Side-Effect Statements Get Their Own Visual Group

When a method call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

Array literals, list literals, and similar collections use one entry per line in multiline constructs.

### Mixed Logical Conditions

When mixing `&&`/`||`, parenthesized groups go on their own lines, each condition on its own line.

### No Multi-Line Boolean Variable Assignments for `if`

Don't extract a multi-condition boolean into a named variable just to check it once. Inline conditions directly in `if` blocks.

### Ternary Expressions

- No nested ternaries.
- No ternaries inside string concatenation — extract to a variable first.

### Readability — All Generated Code Must Be Human-Readable

Don't inline complex expressions into string concatenation or other expressions. Break them into named variables so each step is clear.

### Error Handling

- **Creator** (method designer): may design a method to throw on failure — that's the API contract. Prefer unchecked exceptions (`RuntimeException` subclasses) for programming errors. Use checked exceptions only for recoverable conditions the caller must handle.
- **Consumer** (method caller): always wraps calls to throwing methods in try/catch.
- CLI entry points never throw — set the appropriate exit code with `System.exit()` and return.