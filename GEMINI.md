# Pet Soul (宠灵感)

## Project Overview

**Pet Soul** is a Next.js 16 application designed to act as a "mood decoder" for pets. It utilizes AI (multimodal models) to analyze pet photos and generate humorous, personalized "inner monologues" based on the pet's expression and environment. Users can then edit these into memes and share them on social media.

*   **Goal:** Provide pet owners with a fun way to express their pets' "thoughts".
*   **Core Features:**
    *   **Snapshot Decoding:** Upload/take photos -> AI recognition -> Monologue generation.
    *   **Persona Lab:** Select from various pet personalities (e.g., "Aloof Boss", "Drama Queen").
    *   **Meme Maker:** Edit text on images, add filters, and stickers.
    *   **Pet Profile:** Create profiles for pets for more personalized generation.

## Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS 4, Framer Motion (animations), Lucide React (icons)
*   **Components:** Radix UI primitives (via `components/ui`), Swiper
*   **Image Processing:** Konva / React-Konva (Canvas editing), browser-image-compression, heic2any
*   **Validation:** Zod
*   **Testing:** Vitest, React Testing Library
*   **Planned/Documented (but not yet in package.json):** Zustand, TanStack Query, next-pwa

## Project Structure

```
pet-soul/
├── app/                  # Next.js App Router pages and layouts
│   ├── design-system/    # Internal design system reference
│   └── ...
├── components/
│   ├── business/         # Domain-specific components (e.g., meme-editor, pet-card)
│   ├── shared/           # Shared components (icons, logo)
│   └── ui/               # Reusable UI components (buttons, inputs, etc.)
├── docs/                 # Detailed documentation (PRD, Tech Framework)
│   ├── prd-zh.md         # Product Requirements Document
│   └── tech/             # Technical architecture and guides
├── lib/                  # Utilities, constants, and validations
│   ├── constants/        # App-wide constants (personas, errors)
│   └── validations/      # Zod schemas
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Development Workflow

### Scripts

*   **Start Dev Server:** `pnpm dev` (Runs on http://localhost:3000)
*   **Build for Production:** `pnpm build`
*   **Start Production Server:** `pnpm start`
*   **Lint Code:** `pnpm lint`
*   **Run Tests:** `pnpm test` (Vitest)
*   **Run Tests (Coverage):** `pnpm test:coverage`

### Conventions

*   **Component Structure:**
    *   Base UI components reside in `components/ui`.
    *   Feature-specific components reside in `components/business`.
    *   Tests are co-located with components (e.g., `button.tsx` and `button.test.tsx`).
*   **Styling:** Use Tailwind CSS utility classes. `clsx` and `tailwind-merge` are used for class manipulation.
*   **State Management:**
    *   Use React Server Components (RSC) where possible for data fetching.
    *   Client-side state should be managed locally or (planned) via Zustand.
*   **Testing:**
    *   Use Vitest for unit and integration tests.
    *   Aim for high coverage on core business logic and utility functions.

## Key Documentation

*   **Product Requirements:** `docs/prd-zh.md`
*   **Frontend Architecture:** `docs/tech/frontend-tech-framework.md`
