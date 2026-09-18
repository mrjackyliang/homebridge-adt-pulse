# CSS Conventions

Selectors: class-based. Indentation: 2-space. File naming: kebab-case (e.g., `user-profile.css`).

## Documentation Style

Section banners use JSDoc-style block comments with `=` borders:

```css
/**
 * ============================
 * Section Title
 * ============================
 */
```

Inline comments use `/* ... */` above the rule or declaration they describe.

## Code Style

### Class Naming

Use kebab-case for class names. Names describe the component or element, not its appearance.

```css
/* BAD — camelCase, visual description */
.userCard { ... }
.redButton { ... }

/* GOOD — kebab-case, semantic */
.user-card { ... }
.action-button { ... }
.action-button-primary { ... }
```

### Property Ordering

Group properties by category in this order:
1. Positioning (`position`, `top`, `right`, `z-index`)
2. Display and box model (`display`, `flex`, `width`, `margin`, `padding`)
3. Typography (`font-size`, `line-height`, `color`, `text-align`)
4. Visual (`background`, `border`, `border-radius`, `box-shadow`, `opacity`)
5. Animation (`transition`, `animation`, `transform`)
6. Miscellaneous (`cursor`, `pointer-events`, `overflow`)

Blank line between each group.

```css
.user-card {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;

  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text);

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;

  transition: box-shadow 200ms ease;
}
```

### Custom Properties

Use `--` prefix with namespace. Define at `:root` for globals, at component level for scoped values.

```css
/* GOOD — namespaced globals */
:root {
  --color-text: hsl(0 0% 13%);
  --color-surface: hsl(0 0% 100%);
  --color-border: hsl(0 0% 87%);
  --spacing-sm: 8px;
  --spacing-md: 16px;
}

/* GOOD — component-scoped */
.user-card {
  --card-padding: var(--spacing-md);

  padding: var(--card-padding);
}
```

### Selector Specificity

Keep specificity low. Prefer class selectors. No ID selectors for styling. No `!important` except for utility overrides.

```css
/* BAD — ID selector */
#main-header { ... }

/* BAD — !important for regular styling */
.header { color: red !important; }

/* GOOD — class selectors only */
.main-header { ... }
.main-header-title { ... }
```

### Media Queries

Mobile-first approach. Use `min-width` breakpoints. Colocate media queries with the component they modify.

```css
/* GOOD — mobile-first, colocated */
.user-card {
  padding: 8px;
}

@media (min-width: 768px) {
  .user-card {
    padding: 16px;
  }
}
```

### Units

- `rem` for font sizes and spacing tied to text.
- `px` for borders, shadows, and fixed dimensions.
- `%` or viewport units for fluid layout.
- No `em` for spacing (compounds unpredictably in nested contexts).

### Nesting

Use native CSS nesting for pseudo-classes, pseudo-elements, and direct modifiers. Do not nest deeper than 2 levels.

```css
/* GOOD — shallow nesting for modifiers */
.action-button {
  background: var(--color-surface);

  &:hover {
    background: var(--color-surface-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
}

/* BAD — too deep */
.nav {
  .nav-list {
    .nav-item {
      .nav-link { ... }
    }
  }
}
```

### One Declaration per Line

Each declaration goes on its own line. No single-line rule sets.

```css
/* BAD — single-line */
.hidden { display: none; }

/* GOOD */
.hidden {
  display: none;
}
```

### Comment Placement

Comments describe the purpose of a rule set or declaration group. Placement rules:
- Comment sits above the rule set or declaration it describes.
- Blank line before the comment (except at the start of a file).
- No trailing comments (same-line comments after declarations).

### No Stacked Comments

One descriptive comment per rule set or declaration group. No consecutive comments without code between them.

### Blank Lines between Rule Sets

Separate each rule set with a blank line.
