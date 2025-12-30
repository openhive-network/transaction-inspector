# Transaction Inspector

## Project Overview

Transaction Inspector is a Vue 3 web application for inspecting and validating HIVE blockchain transactions. It allows users to:
- View transaction IDs and signature digests
- Verify transaction signatures
- Inspect authority information (owner, active, posting)
- Check weight thresholds and authority weights
- Map accounts to keys and verify signature validity

## Tech Stack

- **Framework**: Vue 3.4 with Composition API (`<script setup>`)
- **Language**: TypeScript 5.4
- **Build Tool**: Vite 5.1
- **Styling**: Tailwind CSS 3.4 with shadcn-vue components (via Radix Vue)
- **State Management**: Pinia 2.1
- **Blockchain**: @hiveio/wax 1.27
- **Form Validation**: VeeValidate + Zod
- **Package Manager**: pnpm

## Directory Structure

```
src/
├── assets/           # CSS and images
├── components/
│   ├── custom/       # App-specific components (Form, TrxDialog, TrxInfo, etc.)
│   └── ui/           # Reusable shadcn-vue components (button, card, dialog, etc.)
├── lib/
│   └── utils.ts      # Utility functions (cn class merger)
├── plugins/
│   └── wax/          # Wax blockchain plugin and types
├── store/
│   └── wax.ts        # Pinia store for transaction data
├── App.vue           # Root component
└── main.ts           # Application entry point
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Type-check and build for production
pnpm build-only       # Build without type checking
pnpm preview          # Preview production build
pnpm type-check       # Run TypeScript checks
```

## Key Files

- `src/main.ts` - App entry point, installs WaxPlugin and Pinia
- `src/store/wax.ts` - Pinia store with transaction state and actions
- `src/plugins/wax/index.ts` - WaxAccountInformations class for blockchain interaction
- `src/plugins/wax/types.ts` - TypeScript interfaces and enums (EPackType, EAuthorityLevel)
- `vite.config.ts` - Vite config with `@/` path alias
- `tailwind.config.js` - Tailwind theme with CSS variables and dark mode
- `components.json` - shadcn-vue configuration

## Coding Conventions

- **Vue**: Composition API with `<script setup lang="ts">`
- **TypeScript**: Strict mode, `I` prefix for interfaces, `E` prefix for enums
- **Imports**: Use `import type` for type-only imports
- **Styling**: Tailwind utility classes, `cn()` helper for class merging
- **State**: Pinia stores with reactive state, computed, and actions
- **Components**: Single-file components in PascalCase

## CI/CD Notes

No dedicated CI/CD configuration. Build pipeline runs via npm scripts:
- `vue-tsc` for type checking
- `vite build` for production builds
- `npm-run-all2` for parallel script execution
