<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0 (initial creation)
- Added sections: 5 Core Principles, Technology Stack, Development Standards, Governance
- Templates verified: plan-template.md, spec-template.md, tasks-template.md (no conflicting references)
-->
# Stellarium Foundation App Constitution

## Core Principles

### I. Bun Runtime First
All development uses Bun as the primary runtime and package manager. No npm, yarn, or pnpm allowed. Leverage Bun's native bundler capabilities; run `bun run` for scripts, `bun install` for dependencies, and `bunx` for package execution.

### II. Svelte 5 Reactive Runes
Components use Svelte 5's runes syntax exclusively: `$state`, `$derived`, `$effect`, `$props`. No Options API or legacy patterns. Event handlers must use `onclick` with arrow functions; avoid `createEventDispatcher` in favor of prop callbacks.

### III. Mobile-First SPA Architecture
Single Page Application built with client-side routing via `window.history.pushState`. All routes handled by the root App component. Capacitor integration for native mobile capabilities (filesystem, share, status bar) with graceful web fallback.

### IV. Tailwind CSS Utility-First Styling
Styling uses Tailwind CSS utility classes exclusively. No custom CSS files except `index.css` for theme configuration. CSS-in-JS libraries prohibited; prefer inline utilities or the `@apply` directive within component style blocks.

### V. Local Data Resilience
All static data (literature, quizzes, videos) cached in `localStorage` with fallback to network fetch. Cache-first strategy for offline capability; silent preheating during app initialization.

## Technology Stack

**Runtime**: Bun v1.3+ (JavaScript/TypeScript)
**Framework**: Svelte 5.x with runes syntax
**Styling**: Tailwind CSS v4.x
**Mobile**: Capacitor 8.x (Android/iOS)
**Markdown**: marked + markdown-it libraries
**Icons**: lucide-svelte
**Deployment**: Static hosting (Render/Netlify/Vercel) with SPA redirects

## Development Standards

- **Build**: `bun run dev` (port 3000), `bun run build` (outputs to `dist/`)
- **Type Check**: `bun run lint` (TypeScript noEmit)
- **Mobile**: `bun run cap sync android/ios` for platform synchronization
- **File Structure**: Feature-based organization under `src/screens/`, `src/components/`, `src/media/`, `src/data/`
- **Data**: Static JSON in `public/` directory with client-side caching
- **PDF Handling**: Capacitor Filesystem API for native, Blob URLs for web

## Governance

This constitution governs all code changes to the Stellarium Foundation application. Amendments require documentation and version increment. All PRs must verify compliance with core principles.

**Version**: 1.0.0 | **Ratified**: 2026-06-24 | **Last Amended**: 2026-06-24