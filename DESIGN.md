# Git for Prompts — Design System Specification

## 1. Product Identity & Aesthetics
- **Aesthetic**: Technical, dark-mode first, minimal, precise, and engineer-focused.
- **Core Principles**:
  1. Single-level card surface hierarchy (`bg-bg-card` `#141414`).
  2. Zero double-card container nesting.
  3. Hardware-accelerated 150ms–200ms snappy micro-interactions.
  4. 0% AI Slop (zero decorative purple gradients, zero floating blobs, zero icon circles).

---

## 2. Color Palette & Dark Theme Tokens

| Token | CSS Variable / Class | Hex Value | Usage |
|---|---|---|---|
| **Page Background** | `bg-bg-page` | `#0a0a0a` | Main application background surface |
| **Card Background** | `bg-bg-card` | `#141414` | Primary cards, modals, dropdowns |
| **Panel Surface** | `bg-bg-panel` | `#1e1e1e` | Code blocks, terminal windows, inner items |
| **Primary Border** | `border-zinc-800/90` | `#27272a` | Universal card & divider borders |
| **Hover Border** | `hover:border-zinc-700` | `#3f3f46` | Interactive hover state border |
| **Primary Text** | `text-zinc-100` | `#f4f4f5` | Headlines, titles, high-emphasis text |
| **Body Text** | `text-zinc-400` | `#a1a1aa` | Supporting descriptions, paragraph copy |
| **Muted Text** | `text-zinc-500` | `#71717a` | Timestamps, secondary metadata |

### Semantic Badges & Accents
- **Immutable / Pass / Success**: `emerald-300` (`#6ee7b7`) with `bg-emerald-500/10 border-emerald-500/20`
- **Fragile / Fail / Delete**: `rose-300` (`#fca5a5`) with `bg-rose-500/10 border-rose-500/20`
- **Primary / Info / Active**: `blue-300` (`#93c5fd`) with `bg-blue-500/10 border-blue-500/20`
- **Credentials / Warning**: `amber-300` (`#fcd34d`) with `bg-amber-500/10 border-amber-500/20`

---

## 3. Typography Hierarchy

| Role | Font Family | Size / Leading | Weight | Usage |
|---|---|---|---|---|
| **Hero Title** | `font-serif` | `text-5xl` to `text-7xl` | Bold (700) | Landing hero headline |
| **Section Title** | `font-serif` | `text-3xl` to `text-5xl` | Bold (700) | Section headlines (`[text-wrap:balance]`) |
| **Card Title** | `font-mono` | `text-lg` | Bold (700) | Repository titles, card headers |
| **Body Copy** | `font-sans` | `text-sm` / `text-base` | Regular (400) | Explanations, feature text |
| **Metadata / Badges** | `font-mono` | `text-xs` / `text-[10px]` | Bold (700) | Version tags, CLI commands, badges |
| **Numbers / Latency** | `font-mono` | `tabular-nums` | Bold (700) | Pass rates, test latencies, dates |

---

## 4. Motion & Micro-Interactions

| Class | Easing | Transform / Transition | Usage |
|---|---|---|---|
| `.btn-interactive` | `cubic-bezier(0.23, 1, 0.32, 1)` | `150ms active:scale-97` | Primary & secondary action buttons |
| `.card-interactive` | `cubic-bezier(0.23, 1, 0.32, 1)` | `200ms hover:-translate-y-0.5` | Clickable cards & workflow boxes |
| `.tab-interactive` | `cubic-bezier(0.23, 1, 0.32, 1)` | `150ms active:scale-97` | Navigation links & filter tabs |
| `.icon-pop` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | `150ms spring scale` | Copy checkmarks & state toggles |

---

## 5. Touch Target & Accessibility Standards
- **Minimum Touch Target**: `44px` height/width on all mobile interactive controls (`min-h-[44px]`).
- **Focus Rings**: Accessible `focus-visible:ring-2 focus-visible:ring-blue-500/50`.
- **Reduced Motion**: Fallback `@media (prefers-reduced-motion: reduce)` disabling transforms globally.
