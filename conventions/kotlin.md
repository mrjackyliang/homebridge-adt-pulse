# Kotlin Conventions

Quotes: Double (only option). Indentation: 4-space. File naming: PascalCase matching class name (e.g., `EntityRepository.kt`).

## Documentation Style

- Comment syntax: `/** */`
- Padding tag: `@since UNRELEASED` (KDoc) — tag new or changed API with `@since UNRELEASED`; the release process stamps the real version automatically, so never hand-write a version number.
- Param format: `@param name - Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `@return Type?`
- Include `@private` tag for private members.

### Example

```kotlin
/**
 * Entity Repository.
 *
 * @since UNRELEASED
 */
class EntityRepository(
    /**
     * Entity Repository - Database.
     *
     * @since UNRELEASED
     */
    private val database: Database,
) {
    /**
     * Entity Repository - Find By ID.
     *
     * @param id - ID.
     *
     * @return Entity?
     *
     * @since UNRELEASED
     */
    suspend fun findById(id: UUID): Entity? { ... }
}
```

## Code Style

### Explicit Visibility Modifiers

All class members require explicit `public`, `private`, `protected`, or `internal`. Never rely on Kotlin's default `public`.

```kotlin
// BAD — implicit public
fun processData(input: String) { ... }

// GOOD — explicit modifier
public fun processData(input: String) { ... }
private fun validateInput(input: String) { ... }
```

### `val` over `var`

Default to `val` (immutable). Use `var` only when reassignment is needed.

```kotlin
// GOOD — assigned once
val configPath = resolve("config.json")
val configRaw = File(configPath).readText()

// var — reassigned later
var selectedCategory: String? = null
selectedCategory = matchedCategory
```

### Method Overloads vs Generic Parameters

Prefer overloads when the return type or behavior differs per input type. A single parameter type (e.g., `Any`) is fine when the handling is identical regardless of input type.

```kotlin
// GOOD — overloads (different behavior per type)
private fun format(value: String): String {
    return value.trim()
}

private fun format(value: Int): String {
    return value.toString()
}

// GOOD — single param (same handling regardless)
private fun validate(value: Any?): Boolean {
    return value != null
}
```

### Method Ordering

1. Public methods first.
2. Private methods second.

Each method separated by a blank line. No blank line after opening brace or before closing brace of the class.

### Expression Functions vs Block Body

- **Expression function** (`= expression`): Only for single-expression methods that are simple and short.
- **Block body** (`{ ... }`): For anything with multiple statements or complex logic.

```kotlin
// GOOD — expression function for simple getter
public fun isActive(): Boolean = status == Status.ACTIVE

// GOOD — block body for anything with logic
public fun findById(id: UUID): Entity? {
    val entity = database.get(id)

    return entity
}
```

### `when` Expression — Always Include `else`

Always include an `else` branch, even if there's nothing to handle. Each branch uses block scoping with `{ }`.

```kotlin
when (category) {
    "added" -> {
        logger.info("New feature.")
    }

    "fixed" -> {
        logger.info("Bug fix.")
    }

    else -> {
        logger.warn("Unknown category.")
    }
}
```

### Explicit Null Checks — Avoid Optional Chaining

Avoid `?.` chaining — prefer explicit null checks with early returns. Nullish coalescing (`?:`) is fine for providing defaults. Don't combine them.

```kotlin
// BAD — optional chaining
val name = config?.name

// GOOD — explicit check
if (config == null) {
    return
}

val name = config.name

// GOOD — Elvis operator for defaults
val timeout = options.timeout ?: 5000
val label = config.name ?: "default"

// BAD — chained together
val name = config?.name ?: "default"
```

### Scope Functions — Use Sparingly

Prefer explicit variable assignments over scope functions (`let`, `apply`, `also`, `run`, `with`). Use scope functions only when they genuinely improve readability — typically `apply` for object configuration.

```kotlin
// GOOD — apply for builder-style configuration
val config = Config().apply {
    name = "nova"
    version = "1.0.0"
}

// BAD — let for simple null check (use explicit if instead)
config?.let { processConfig(it) }

// GOOD — explicit null check
if (config != null) {
    processConfig(config)
}
```

### Named Lambda Parameters over `it`

Always name lambda parameters explicitly. Never use implicit `it`.

```kotlin
// BAD — implicit it
items.filter { it.isActive() }

// GOOD — named parameter
items.filter { item -> item.isActive() }
```

### Collection Operations vs `for` Loop

- `.filter()`, `.map()`, `.find()` — transforming or searching, returns a new value.
- `for` loop — side effects (logging, mutating external collections, coroutine operations).
- `.fold()` — acceptable, but `for` with a mutable accumulator is also fine.

### Block Body vs Expression Body in Lambdas

- **Block body** (`{ param -> ... }`): When accessing properties of the param, or when multiple statements needed.
- **Expression body** (`{ param -> expression }`): When the lambda is a direct comparison or single method call.

```kotlin
// Block body — accessing properties, multiple operations
items.map { item ->
    val itemName = item.name
    val itemRole = item.role

    ItemResult(title = itemName, description = itemRole)
}

// Expression body — direct comparison
validCategories.find { validCategory -> validCategory == value }

// Expression body — single property check
results.filter { result -> result.status == "fulfilled" }
```

### Descriptive Lambda Parameter Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```kotlin
// BAD
validCategories.filter { c -> c == value }

// GOOD
validCategories.filter { validCategory -> validCategory == value }
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```kotlin
val workspaceConfig = workspace.config
val workspaceConfigName = workspaceConfig.name
val workspaceConfigRole = workspaceConfig.role
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

Separate method calls, suspend calls, and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

### Bare Side-Effect Statements Get Their Own Visual Group

When a function call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

List literals, map literals, and similar collections use one entry per line in multiline constructs.

### Mixed Logical Conditions

When mixing `&&`/`||`, parenthesized groups go on their own lines, each condition on its own line.

### No Multi-Line Boolean Variable Assignments for `if`

Don't extract a multi-condition boolean into a named variable just to check it once. Inline conditions directly in `if` blocks.

### Ternary Expressions

Kotlin uses `if`/`else` expressions instead of ternary. Same rules apply:
- No nested `if`/`else` expression chains.
- No `if`/`else` expressions inside string templates — extract to a variable first.

### Readability — All Generated Code Must Be Human-Readable

Don't inline complex expressions into string templates or other expressions. Break them into named variables so each step is clear.

### Error Handling

- **Creator** (function designer): may design a function to throw on failure — that's the API contract.
- **Consumer** (function caller): always wraps calls to throwing functions in try/catch.
- CLI entry points never throw — set the appropriate exit code with `exitProcess()` and return.