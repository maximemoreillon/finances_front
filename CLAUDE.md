# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Development server (Vite)
npm run build      # Type-check then production build
npm run preview    # Preview production build
npm run lint       # Lint .vue and .ts files
```

## Architecture

This is a **Vue 3 + TypeScript** SPA for personal finance management (accounts, transactions, categories). It uses:

- **Vite** as the build tool
- **Vue Router 4** (history mode) for navigation
- **Vuetify 3** for Material Design UI (auto-imported via `vite-plugin-vuetify`)
- **Axios** for all API calls — configured with a base URL in `src/axios.ts`, imported directly in components (no plugin)
- **ApexCharts** (`vue3-apexcharts`) for data visualization, registered globally in `main.ts` as `<apexchart>`
- **No Vuex / Pinia** — component-level state only; the app runs behind an auth gateway so no auth logic exists

## Key Patterns

**Composables** replace Vue 2 mixins:
- `src/composables/useQueryParams.ts` — reads/writes `year`, `month`, `category` query params via Vue Router; provides `setQueryParam()`
- `src/composables/useDateRange.ts` — derives `start_date`/`end_date` from the query param composable

**Composable usage**: `MonthSelect`, `YearSelect`, `TransactionsTable`, `TransactionsBarChart`, `ExpensesBreakdown`, and `BreakdownChart` all call `useQueryParams()` directly — they write filter state to the URL, which other components on the same page react to.

**TransactionsTable** determines which API endpoint to call based on which route params are present (`accountId`, `categoryId`, or neither for global transactions).

## Types

All shared API types live in `src/types.ts`: `Account`, `Category`, `Keyword`, `Transaction`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_FINANCES_API_URL` | Backend API base URL (required) |

> Note: the prefix changed from `VUE_APP_` (Vue CLI) to `VITE_` (Vite).

## Vuetify 3 Migration Notes

Key API differences from Vuetify 2 applied throughout this codebase:
- Dialog activators: `#activator="{ props }"` + `v-bind="props"` (not `{ on, attrs }`)
- Chip close: `closable` prop + `@click:close` (not `close`)
- Button text variant: `variant="text"` (not `text` bool prop)
- Card/chip outlined: `variant="outlined"` (not `outlined` bool prop)
- Data table headers: `{ key, title }` (not `{ value, text }`)
- Select items: `{ title, value }` (not `{ text, value }`)
- `v-model` on selects: use `:model-value` + `@update:model-value` when value is derived from external state
