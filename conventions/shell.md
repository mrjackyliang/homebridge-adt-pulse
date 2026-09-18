# Shell Conventions

Quotes: Double (for variable expansion). Indentation: 2-space. File naming: kebab-case (e.g., `backup-config.sh`).

## Documentation Style

Section banners and inline comments only. No doc comment blocks. Shell uses `#` with `=` borders:

```bash
# ============================
# Section Title
# ============================
```

## Code Style

### Strict Mode

Every shell script starts with `set -euo pipefail` after the shebang.

```bash
#!/usr/bin/env bash
set -euo pipefail
```

### `SCRIPT_DIR` Detection

Every script that references relative paths must detect its own directory.

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

### `main()` Entry Point

Scripts use a `main()` function as the entry point, called at the bottom of the file.

```bash
main() {
  # Script logic here.
  ...
}

main "$@"
```

### Variable Quoting

Always double-quote variables. Unquoted variables cause word splitting and glob expansion.

```bash
# BAD — unquoted
cp $source_file $dest_dir

# GOOD — quoted
cp "${source_file}" "${dest_dir}"
```

### Variable Naming

- Local variables: `snake_case` (lowercase).
- Environment/exported variables: `UPPER_SNAKE_CASE`.
- Use `local` for function-scoped variables.

```bash
# GOOD
local config_path="${SCRIPT_DIR}/config.json"
local output_dir="${1:-./output}"

export APP_VERSION="1.0.0"
```

### Descriptive Loop Variable Names

Derive from the collection name in singular form. Array and iterable variable names must end with a plural noun so the singular form can be derived naturally. No single-letter abbreviations.

```bash
# BAD
for f in "${workflow_files[@]}"; do

# GOOD
for workflow_file in "${workflow_files[@]}"; do
```

### Comment Placement

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

Separate commands and different logical blocks with blank lines. Variable declarations and loops also need blank line separation.

```bash
# BAD — everything stuck together
local config_raw
config_raw="$(cat "${config_path}")"
local items
items="$(echo "${config_raw}" | jq '.items')"
process_items "${items}"

# GOOD — each operation gets breathing room
local config_raw
config_raw="$(cat "${config_path}")"

local items
items="$(echo "${config_raw}" | jq '.items')"

process_items "${items}"
```

### Return Directly When Immediately Returned

Don't assign to an intermediate variable just to echo it on the next line.

### Extract Nested Commands into Variables

Don't nest command substitutions. Extract into its own named variable for readability.

```bash
# BAD — nested substitutions
local result
result="$(basename "$(dirname "${file_path}")")"

# GOOD — extracted
local parent_dir
parent_dir="$(dirname "${file_path}")"

local result
result="$(basename "${parent_dir}")"
```

### One Entry per Line in Arrays

Array literals use one entry per line in multiline constructs.

```bash
local platforms=(
  "nodejs"
  "swift"
  "kotlin"
  "docker"
)
```

### Conditional Expressions

Use `[[ ]]` over `[ ]`. Always use explicit comparisons.

```bash
# BAD — single bracket, implicit check
if [ $name ]; then

# GOOD — double bracket, explicit check
if [[ -n "${name}" ]]; then
if [[ "${count}" -gt 0 ]]; then
if [[ "${value}" == "expected" ]]; then
```

### `case` Statement — Always Include Wildcard

Always include a `*)` wildcard. Each pattern uses `;;` terminator.

```bash
case "${category}" in
  "added")
    info "New feature."
    ;;

  "fixed")
    info "Bug fix."
    ;;

  *)
    warn "Unknown category."
    ;;
esac
```

### Error Handling

- Functions that can fail should return non-zero exit codes.
- Callers check return codes or use `||` for error handling.
- Scripts never leave errors unhandled — `set -e` catches unchecked failures.
- Use `trap` for cleanup on exit.

```bash
trap cleanup EXIT

cleanup() {
  # Remove temporary files.
  rm -f "${tmp_file}"
}
```
