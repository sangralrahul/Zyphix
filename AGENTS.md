# Architecture Decisions

- Keep the existing Wouter application behind lazy client-only TanStack route boundaries because it depends on browser location APIs and cannot execute during server rendering.
- Use the Vite 7 toolchain required by the current TanStack Start integration because Vite 8 breaks config loading and CommonJS dependency evaluation.