# Design Brief

## Direction

Fashion Nest — Refined luxury clothing e-commerce platform with editorial sensibility and high-end retail aesthetic.

## Tone

Warm, elegant, and modern. Light-mode dominant with spacious layouts, clean typography, and rose/gold accents that evoke high-fashion retail without ornamentation.

## Differentiation

Warm rose/gold accent color on clean whites and deep blacks; product photography dominates spacious card-based layouts; editorial serif + sans pairing elevates minimal aesthetic.

## Color Palette

| Token      | OKLCH           | Role                                    |
| ---------- | --------------- | --------------------------------------- |
| background | 0.98 0.012 72   | Warm cream page background              |
| foreground | 0.18 0.025 60   | Deep charcoal text                      |
| card       | 1.0 0.006 75    | Pure white product cards                |
| primary    | 0.45 0.16 28    | Deep warm brown (CTA, links)            |
| accent     | 0.52 0.18 32    | Rose/gold highlights, active states     |
| muted      | 0.92 0.01 72    | Light section backgrounds               |
| destructive| 0.55 0.22 25    | Alert/error red                         |

## Typography

- Display: Fraunces — elegant serif for headings and hero text
- Body: General Sans — clean sans-serif for UI labels and copy
- Mono: Geist Mono — code, product skus
- Scale: hero `text-7xl font-bold tracking-tight`, h2 `text-4xl font-bold`, label `text-sm font-semibold uppercase tracking-widest`, body `text-base`

## Elevation & Depth

Subtle shadow hierarchy with no depth blur: card shadow `0 2px 8px rgba(0,0,0,0.08)` for floating product cards; elevated shadow `0 8px 16px rgba(0,0,0,0.12)` for modals/overlays; minimal borders (`border` token at 0.88 L) for content separation.

## Structural Zones

| Zone    | Background              | Border                    | Notes                               |
| ------- | ----------------------- | ------------------------- | ----------------------------------- |
| Header  | card (1.0 0.006 75)     | 0.88 0.01 72              | Navigation with rose accent links   |
| Content | background (0.98...) or card | border token             | Alternating white/cream sections   |
| Footer  | foreground-dark 0.2 L   | accent rose/gold highlight| Dark footer with warm accent bar    |

## Spacing & Rhythm

Spacious, breathing layout with 2rem/3rem section gaps; product grid uses 1rem internal card padding; 0.5rem micro-spacing for form inputs and badge groups; breathing room emphasizes product imagery and editorial quality.

## Component Patterns

- Buttons: Primary rose/gold bg (`accent`), white text, soft shadow on hover, `border-radius: 6px`
- Cards: White bg, soft card shadow, image-centric, no internal border
- Badges: Rose/gold accent with muted bg, rounded pill `border-radius: 9999px`
- Inputs: Bordered (`border` token), light focus state with ring (`accent`), padding-y 0.75rem

## Motion

- Entrance: Fade-in 0.3s ease-in on page load; slide-in-up (4px) 0.3s cubic-bezier for staggered content
- Hover: Button/link color shift 0.2s smooth; card shadow lift `0 4px 12px` on hover
- Decorative: None; motion reserved for state feedback and transitions

## Constraints

- Use semantic tokens exclusively; no arbitrary color values
- Product imagery must be full-width or full-card to dominate visual hierarchy
- Avoid animation beyond entrance, hover, and loading states
- Maintain editorial cleanliness: no gradients, no bevels, no textures

## Lookbook Gallery

Masonry/multi-column grid of editorial clothing imagery with seasonal tabs (Spring Collection, Summer Vibes, Autumn Edit, Winter Luxe). Minimal text overlays using accent rose/gold. Gallery images (1.5rem gap on mobile, 2rem on desktop) with hover zoom effect (scale 1.05) revealing "Shop Similar" CTA overlay. Full-resolution lightbox modal with dark bg. Tab navigation with animated indicator bar using accent color. Maintains editorial magazine aesthetic with breathing room emphasizing product imagery. No new colors — uses existing accent, primary, and semantic tokens exclusively.
