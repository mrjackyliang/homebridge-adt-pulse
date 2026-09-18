# Python Conventions

Quotes: Double (Black/Google convention). Indentation: 4-space. File naming: snake_case (PEP 8) (e.g., `entity_repository.py`).

## Documentation Style

- Comment syntax: `"""` (Google-style)
- Padding tag: `Version:\n    1.0.0` (Google-style custom section)
- Param format: `Args:\n    name: Name.` (description matches the parameter name, capitalized, with a trailing period)
- Return format: `Returns:\n    Type.`
- Docstring starts with `"""` then a newline before the summary line.
- No `@private` tag; use `_` prefix naming instead.

### Example

```python
class EntityRepository:
    """
    Entity Repository.

    Version:
        1.0.0
    """

    def __init__(self, database):
        """
        Entity Repository - Constructor.

        Args:
            database: Database.

        Version:
            1.0.0
        """
        self._database = database

    def find_by_id(self, entity_id):
        """
        Entity Repository - Find By ID.

        Args:
            entity_id: ID.

        Returns:
            Entity.

        Version:
            1.0.0
        """
        return self._database.get(entity_id)
```

## Code Style

### Private Members — `_` Prefix Convention

Use `_` prefix for private methods and attributes. Use `__` (name mangling) only when subclass collision avoidance is genuinely needed.

```python
# GOOD — single underscore for private
self._database = database
self._cache = {}

def _validate_input(self, value):
    ...

# Only when subclass collision is a real concern
def __internal_reset(self):
    ...
```

### Type Hints Everywhere

All function parameters, return types, and class attributes must have type hints. Use `from __future__ import annotations` for forward references.

```python
from __future__ import annotations

def find_by_id(self, entity_id: str) -> Entity | None:
    ...

def process_items(self, items: list[Item]) -> list[Result]:
    ...
```

### `Final` and Immutability

Use `typing.Final` for constants that should never be reassigned. Python has no `const` — `Final` is the closest equivalent.

```python
from typing import Final

MAX_RETRIES: Final[int] = 3
DEFAULT_TIMEOUT: Final[int] = 5000
```

### Method Ordering

1. Public methods first.
2. Private methods second (prefix `_`).

Each method separated by a blank line. No blank line after class declaration or before closing of the class.

### `match` Statement — Always Include Wildcard

Always include a `case _` wildcard (Python 3.10+). Each case uses a block.

```python
match category:
    case "added":
        logger.info("New feature.")

    case "fixed":
        logger.info("Bug fix.")

    case _:
        logger.warning("Unknown category.")
```

### Explicit `None` Checks — No Truthy/Falsy

Always use explicit comparisons. No truthy/falsy shortcuts.

- `is None` — not set.
- `is not None` — present.
- `== ""` — explicit empty string.
- `len(items) > 0` — explicit length check.

```python
# BAD — truthy check
if name:
    ...

# GOOD — explicit checks
if name is not None:
    ...
if name != "":
    ...
if len(items) > 0:
    ...
```

### List Comprehensions vs `map`/`filter` vs `for` Loop

- List comprehensions — transforming or filtering, returns a new list. Prefer over `map()`/`filter()`.
- `for` loop — side effects (logging, mutating external collections, async operations).
- `functools.reduce()` — acceptable, but `for` with a mutable accumulator is also fine.

```python
# GOOD — list comprehension for transformation
names = [item.name for item in items if item.is_active]

# GOOD — for loop for side effects
for item in items:
    logger.info(item.name)
```

### Descriptive Loop Variable Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```python
# BAD
for c in valid_categories:
    ...

# GOOD
for valid_category in valid_categories:
    ...

# More examples
for raw_path in raw_paths:
    ...
for allowed_policy in allowed_policies:
    ...
```

### Variable Names Chain from Parent

When extracting properties from an object, the variable name chains from the parent variable name.

```python
workspace_config = workspace.config
workspace_config_name = workspace_config.name
workspace_config_role = workspace_config.role
```

### Comment Placement in Method Bodies

Comments describe the process/intent. Placement rules:
- Comment sits above the code block it describes.
- Blank line before the comment (except at the start of a scope).
- No comment needed on the first block if it's self-explanatory.
- No trailing comments (same-line comments after code). Exception: multi-line conditions may use inline `#` comments after each condition line to explain the check.

### No Stacked Comments

One descriptive comment per code block. No consecutive comments without code between them.

### Quote File Names in Comments and Log Messages

Wrap file names in double quotes inside comments and log strings (e.g., `"config.json"`, `"CHANGELOG.md"`).

### Blank Lines between Distinct Operations

Separate function calls, `await` statements, and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

```python
# BAD — everything stuck together
config_raw = path.read_text()
config = parser.parse(config_raw)
filtered = filter_items(config.items)

# GOOD — each operation gets breathing room
config_raw = path.read_text()

config = parser.parse(config_raw)

filtered = filter_items(config.items)
```

### Bare Side-Effect Statements Get Their Own Visual Group

When a function call has no assignment (return value unused), separate it from surrounding assignments with a blank line.

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to return it on the next line.

### Extract Nested Function Calls into Variables

Don't nest function calls as arguments to other function calls. Extract into its own named variable for readability.

### One Entry per Line in Collections

List literals, dict literals, and similar collections use one entry per line in multiline constructs.

### Mixed Logical Conditions

When mixing `and`/`or`, parenthesized groups go on their own lines, each condition on its own line.

### No Multi-Line Boolean Variable Assignments for `if`

Don't extract a multi-condition boolean into a named variable just to check it once. Inline conditions directly in `if` blocks.

### Inline `if`/`else` Expressions

Python's ternary is `value_a if condition else value_b`. Same rules apply:
- No nested inline `if`/`else` chains.
- No inline `if`/`else` inside f-strings — extract to a variable first.

### Readability — All Generated Code Must Be Human-Readable

Don't inline complex expressions into f-strings or other expressions. Break them into named variables so each step is clear.

### Error Handling

- **Creator** (function designer): may design a function to raise on failure — that's the API contract.
- **Consumer** (function caller): always wraps calls to raising functions in `try`/`except`.
- CLI entry points never raise — set the appropriate exit code with `sys.exit()` and return.
