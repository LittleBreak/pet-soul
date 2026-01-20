# Phase 3: Component Library Task List

Based on: `docs/tech/phase-3-components-zh.md`

---

## 1. Design System Setup

- [ ] 1.1 Configure Tailwind CSS color tokens (primary, secondary, accent, neutral, glass)
- [ ] 1.2 Add Google Fonts (Outfit + Inter) to Next.js
- [ ] 1.3 Configure typography scale in Tailwind config
- [ ] 1.4 Set up dark/light mode CSS variables
- [ ] 1.5 Configure animation utilities (active:scale-95, hover effects)

## 2. Atomic Components (UI Library)

- [ ] 2.1 Initialize shadcn/ui and install base components
- [ ] 2.2 Customize `Button` component (rounded-full, loading spinner, variants)
- [ ] 2.3 Customize `Input/Textarea` component (focus ring with primary color)
- [ ] 2.4 Customize `Card` component (glass variant, hover effect)
- [ ] 2.5 Customize `Dialog/Modal` component (backdrop-blur)
- [ ] 2.6 Customize `Toast` component (success/error variants)
- [ ] 2.7 Customize `Avatar` component (fallback support)
- [ ] 2.8 Customize `Badge` component (capsule shape)
- [ ] 2.9 Customize `Skeleton` component (loading animation)
- [ ] 2.10 Customize `Slider` component
- [ ] 2.11 Customize `Tabs` component

## 3. Business Components (Molecules)

- [ ] 3.1 Create `PhotoUploader` (drag & drop, states: idle/dragging/uploading/done)
- [ ] 3.2 Create `PersonaCard` (icon, name, description, selected state)
- [ ] 3.3 Create `PersonaSelector` (horizontal scroll/grid of PersonaCards)
- [ ] 3.4 Create `ResultCard` (single monologue display)
- [ ] 3.5 Create `ResultCarousel` (swipeable carousel with dot indicators)
- [ ] 3.6 Create `MemeEditor` (image preview with text overlay, style controls)
- [ ] 3.7 Create `ExportPanel` (download + share buttons grid)
- [ ] 3.8 Create `PetCard` (avatar, name, breed/personality badges)
- [ ] 3.9 Create `CreditDisplay` (remaining quota indicator)

## 4. Layout Components

- [ ] 4.1 Create `MobileTabBar` (mobile bottom navigation)

## 5. Shared Components

- [ ] 5.1 Create `Icons` collection (Lucide React icons)
- [ ] 5.2 Create `Logo` component

## 6. Development & Testing

- [x] 6.1 Create `/app/design-system/page.tsx` preview page
- [x] 6.2 Add all Atoms to preview page with multiple states
- [x] 6.3 Add all Molecules to preview page with mock data
- [x] 6.4 Verify responsive behavior (375px mobile, 1024px+ desktop)
- [x] 6.5 Add aria-labels to interactive elements
- [x] 6.6 Add alt attributes to all images
- [x] 6.7 Verify color contrast (WCAG AA)

---

## Suggested Execution Order

```
1 (Design System) → 2 (Atoms) → 5 (Shared) → 4 (Layout) → 3 (Business) → 6 (Testing)
```
