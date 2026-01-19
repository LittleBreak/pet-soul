# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Package Manager**: pnpm

## Architecture

This is a Next.js App Router project using React 19 server components by default.

- `app/` - Next.js App Router directory with pages and layouts
- `app/layout.tsx` - Root layout with Geist fonts and metadata
- `app/globals.css` - Tailwind imports and CSS theme variables
- `public/` - Static assets

## Code Conventions

- Path alias: `@/*` maps to project root
- Dark mode via CSS `prefers-color-scheme` media query
- Theme colors defined as CSS variables (`--background`, `--foreground`)
