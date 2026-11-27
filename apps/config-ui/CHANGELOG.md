# homebridge-adt-pulse-app-config-ui

## 3.5.12 - 2026-11-27

No changes.

## 3.5.11 - 2026-11-21

### UPDATED
- Tests now report coverage through a `check:coverage` script, which fails when line, function, branch or statement coverage drops below the project minimum, and the README badges now include that coverage.
- Nova 0.49.0, which runs the configuration UI's type checks, tests and coverage check, and counts its coverage toward the coverage badge the publish workflow writes.
- README introduction, which now describes the project with its new long description.

## 3.5.10 - 2026-11-17

### UPDATED
- Nova is now 0.44.0.

## 3.5.9 - 2026-11-04

No changes.

## 3.5.8 - 2026-11-02

No changes.

## 3.5.7 - 2026-11-01

### UPDATED
- Nova is now 0.38.0, Node.js 26 is supported, and the setup and completion artwork is refreshed with the current ADT Pulse for Homebridge branding.

## 3.5.6 - 2026-10-18

### UPDATED
- Nova is now 0.33.0, and Nova's custom ESLint rules load through the consolidated preset entry point.

## 3.5.5 - 2026-10-12

### UPDATED
- Nova is now 0.30.1.
- Adopted role-based TypeScript preset layers.
- Aligned configuration UI JSDoc hierarchies with the function-level contract.

### ADDED
- The generated project credits include configured contributors.

## 3.5.4 - 2026-10-11

### UPDATED
- Nova is now 0.29.0, and the project adopts its shared Nova rule bundle with complete JavaScript, TypeScript, browser, and Vite preset coverage.
- Homebridge UI utilities, React Hook Form, and React Hooks linting are now on their latest compatible releases.

## 3.5.3 - 2026-10-03

No changes.

## 3.5.2 - 2026-10-01

### UPDATED
- Nova is now 0.27.4, and the project adopts its corrected optional Vitest peer dependency metadata.

## 3.5.1 - 2026-09-23

### UPDATED
- Nova is now 0.27.3, and the generated inactive-thread workflow has write access to pull requests.

## 3.5.0 - 2026-09-17

### UPDATED
- Separated the custom configuration UI into its own Vite workspace, wired its production bundle into the publishable plugin, and updated its React, Vite, and Vitest toolchain with `vitest.config.mts` and `vitest.setup.ts`.

### FIXED
- Kept settings tabs interactive without relying on Bootstrap JavaScript in the Homebridge iframe.
- Added spacing between paired setup actions so verification and sensor buttons no longer touch.
- Hid standalone preview navigation inside Homebridge to avoid a duplicate heading.
- Isolated the Homebridge settings UI from host Bootstrap styling, mirrored live theme colors, and repaired sensor accordions, option checkboxes, and Plugin action spacing.
- The setup login form no longer scrolls horizontally at any width, and the ADT Pulse sign-in action is prominent.
- Made the Verified badge follow the active Homebridge theme accent.
