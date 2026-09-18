# homebridge-adt-pulse-app-config-ui

## 3.5.0 - 2026-09-17

### UPDATED
- Separated the custom configuration UI into its own Vite workspace, wired its production bundle into the publishable plugin, and updated its React, Vite, and Vitest toolchain with `vitest.config.mts` and `vitest.setup.ts`.

### FIXED
- Kept settings tabs interactive without relying on Bootstrap JavaScript in the Homebridge iframe.
- Added spacing between paired setup actions so verification and sensor buttons no longer touch.
- Hid standalone preview navigation inside Homebridge to avoid a duplicate heading.
- Isolated the Homebridge settings UI from host Bootstrap styling, mirrored live theme colors, and repaired sensor accordions, option checkboxes, and Plugin action spacing.
- Fixed horizontal scrolling in the setup login form at all widths and made the ADT Pulse sign-in action prominent.
- Made the Verified badge follow the active Homebridge theme accent.
