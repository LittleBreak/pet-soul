# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router + RSC) | 16.x |
| UI | React | 19.x |
| Language | TypeScript (strict mode) | 5.9 |
| Styling | Tailwind CSS | 4.x |
| Package Manager | pnpm | - |

### Planned Dependencies (per tech spec)

- **UI Components**: Radix UI, Framer Motion, Swiper, Lucide React
- **Image Processing**: react-dropzone, browser-image-compression, heic2any, Konva.js (react-konva)
- **State Management**: Zustand (client state), TanStack Query (server state), Zod (validation)
- **PWA**: next-pwa, Web App Manifest

## Architecture

### Project Structure (Planned)

```
pet-soul/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main app route group
│   │   ├── page.tsx              # Home (upload entry)
│   │   ├── generate/page.tsx     # Generation page
│   │   ├── result/page.tsx       # Result display
│   │   └── meme/page.tsx         # Meme editor
│   ├── api/                      # API Routes
│   │   ├── generate/route.ts     # AI generation endpoint
│   │   ├── upload/route.ts       # Image upload endpoint
│   │   └── user/route.ts         # User-related endpoints
│   ├── layout.tsx                # Root layout
│   └── manifest.ts               # PWA manifest
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── upload/                   # Upload components (PhotoUploader)
│   ├── persona/                  # Persona selection (PersonaSelector)
│   ├── result/                   # Result display (MonologueSwiper)
│   ├── meme/                     # Meme editor (MemeEditor with Konva)
│   └── share/                    # Share components (ShareSheet)
├── lib/                          # Utilities
│   ├── api/                      # API client
│   ├── hooks/                    # Custom hooks
│   ├── stores/                   # Zustand stores
│   ├── utils/                    # Utility functions
│   ├── constants/                # Constants (PERSONAS[], etc.)
│   └── validations/              # Zod schemas
└── types/                        # TypeScript type definitions
```

### Core User Flow

```
Upload Photo → Select Persona → AI Generates 3 Versions → Choose Best → Create Meme → Share/Save
     │              │                   │                      │              │
     ▼              ▼                   ▼                      ▼              ▼
PhotoUploader  PersonaSelector   MonologueSwiper        MemeEditor      ShareSheet
```

### State Management Layers

1. **Server State (TanStack Query)**: API data, caching, sync, optimistic updates
2. **Client State (Zustand)**: UI state, cross-component state (uploaded image, selected persona, editor state)
3. **Local State (useState)**: Component-internal state (form input, animation, temporary UI)

## Code Conventions

- Path alias: `@/*` maps to project root
- Dark mode via CSS `prefers-color-scheme` media query
- Theme colors defined as CSS variables (`--background`, `--foreground`)
- React Server Components by default; use `'use client'` directive for client components

## Key Business Logic

### Persona System

6 base personas: 高冷总裁 (aloof boss), 碎碎念大妈 (chatty auntie), 文艺青年 (artsy youth), 热血少年 (hot-blooded teen), 毒舌吐槽 (sharp-tongued), 卑微打工人 (humble worker). Default: "高冷主子". Premium personas (甄嬛体, 赛博朋克, etc.) require subscription.

### Image Processing

- Supported formats: JPG, PNG, HEIC (converted via heic2any)
- Max size: 10MB, compress to 1MB if > 2MB (browser-image-compression)
- Temporary storage: 24-hour auto-deletion

### AI Generation

- Uses Claude API Vision for image recognition (pet breed, expression, action, environment)
- Generates 3 monologue versions per request
- Target response time: 3 seconds (use streaming + skeleton loading)

### Meme Editor (Konva.js)

- Text positioning via Konva `<Text>` with drag support
- 5 font styles, 3 filters (original, vintage, B&W)
- Watermark for free users (removable with subscription)
- Export via `stage.toDataURL()` / `toBlob()`

## API Routes

| Endpoint | Purpose |
|----------|---------|
| `POST /api/upload` | Image upload, validation, compression |
| `POST /api/generate` | AI monologue generation |
| `GET/POST /api/user` | User quota management |

## MVP Constraints

- Free users: 5 generations/day
- Content safety: Sensitive word filtering required
- First phase: Simplified Chinese only, PWA web version
