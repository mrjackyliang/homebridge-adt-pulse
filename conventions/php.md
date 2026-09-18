# PHP Conventions

Quotes: Single (non-interpolated). Indentation: 4-space. File naming: PascalCase (PSR-4) or snake_case (e.g., `EntityRepository.php`).

## Documentation Style

- Comment syntax: `/** */`
- Padding tag: `@since UNRELEASED` (PHPDoc) — tag new or changed API with `@since UNRELEASED`; the release process stamps the real version automatically, so never hand-write a version number.
- Param format: `@param type $name - Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `@return type`
- Include `@private` tag for private members.

### Example

```php
/**
 * Backup Config File.
 *
 * @param string $backup_name - Backup name.
 * @param string $conf_path   - Conf path.
 * @param string $backup_path - Backup path.
 *
 * @return void
 *
 * @since UNRELEASED
 */
function backup_config_file(
    string $backup_name,
    string $conf_path,
    string $backup_path
): void { ... }
```

## Code Style

### Strict Types Declaration

Every PHP file starts with `declare(strict_types=1)` immediately after the opening `<?php` tag.

```php
<?php

declare(strict_types=1);
```

### Explicit Access Modifiers

All class members require explicit `public`, `private`, or `protected`. Never rely on PHP's implicit public.

```php
// BAD — implicit public
function processData(string $input): void { ... }

// GOOD — explicit modifier
public function processData(string $input): void { ... }
private function validateInput(string $input): void { ... }
```

### Type Declarations Everywhere

All function parameters, return types, and class properties must have explicit type declarations. Use union types (`string|int`) and nullable types (`?string`) where needed.

```php
// BAD — no type declarations
function findById($id) { ... }

// GOOD — fully typed
public function findById(string $id): ?Entity { ... }
```

### `readonly` Properties

Use `readonly` on properties assigned once in the constructor, never reassigned after (PHP 8.1+).

```php
public function __construct(
    private readonly Database $database,
    private readonly Logger $logger,
) { ... }
```

### Method Ordering

1. Public methods first.
2. Private methods second.

Each method separated by a blank line. No blank line after opening brace or before closing brace of the class.

### `match` Expression — Always Include `default`

Prefer `match` over `switch` for value mapping. Always include a `default` arm.

```php
$label = match ($category) {
    'added' => 'New feature',
    'fixed' => 'Bug fix',
    default => 'Unknown',
};
```

For side-effect branches, use `switch` with block-scoped `case` and always include `default`:

```php
switch ($category) {
    case 'added': {
        $logger->info('New feature.');
        break;
    }

    case 'fixed': {
        $logger->info('Bug fix.');
        break;
    }

    default: {
        $logger->warn('Unknown category.');
        break;
    }
}
```

### Explicit Null Checks

Always use explicit comparisons. No truthy/falsy shortcuts.

- `=== null` — not set.
- `!== null` — present.
- `=== ''` — explicit empty string check.
- `count($array) > 0` — explicit array length check.
- `??` — null coalescing for defaults (fine to use).

```php
// BAD — truthy check
if ($name) { ... }

// GOOD — explicit checks
if ($name !== null) { ... }
if ($name !== '') { ... }
if (count($items) > 0) { ... }

// GOOD — null coalescing for defaults
$timeout = $options['timeout'] ?? 5000;
```

### Array Functions vs `foreach`

- `array_filter()`, `array_map()` — transforming or searching, returns a new value.
- `foreach` — side effects (logging, mutating external state).
- `array_reduce()` — acceptable, but `foreach` with a mutable accumulator is also fine.

### Descriptive Callback Parameter Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```php
// BAD
array_filter($valid_categories, fn($c) => $c === $value);

// GOOD
array_filter(
    $valid_categories,
    fn(string $valid_category) => $valid_category === $value
);
```

### Arrow Functions vs Anonymous Functions

- **Arrow function** (`fn() =>`): Single expression, no side effects.
- **Anonymous function** (`function() { }`): Multiple statements or side effects.

```php
// Arrow function — single expression
$names = array_map(
    fn(Item $item) => $item->getName(),
    $items
);

// Anonymous function — multiple statements
$results = array_map(
    function (Item $item) {
        $item_name = $item->getName();
        $item_role = $item->getRole();

        return new ItemResult($item_name, $item_role);
    },
    $items
);
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```php
$workspace_config = $workspace->getConfig();
$workspace_config_name = $workspace_config->getName();
$workspace_config_role = $workspace_config->getRole();
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

Separate function calls and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

### Bare Side-Effect Statements Get Their Own Visual Group

When a function call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

Array literals and similar collections use one entry per line in multiline constructs.

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

- **Creator** (function designer): may design a function to throw on failure — that's the API contract.
- **Consumer** (function caller): always wraps calls to throwing functions in try/catch.
- CLI entry points never throw — set the appropriate exit code with `exit()` and return.