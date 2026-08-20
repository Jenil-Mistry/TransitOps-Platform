---
name: design-system-samsara-the-connected-operations-platform
description: >
  Apply the Samsara | The Connected Operations Platform design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for marketing interfaces.
---

# Samsara | The Connected Operations Platform — Design System Skill

## When to Use

- Building new UI components for Samsara | The Connected Operations Platform.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for marketing pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Samsara | The Connected Operations Platform — https://www.samsara.com/?utm_source=chatgpt.com
- **Surface:** marketing
- **Audience:** Business decision-makers and potential customers
- **Character:** Conversion-focused marketing presence with a rich, diverse color palette and 3 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-5 | `#F5F4F1` | Background |
| color-1 | `#1C1917` | Text Primary |
| color-2 | `#FEAE0F` | Accent |
| color-3 | `#CCC9C1` | Border |
| color-4 | `#E0DDD5` | Border |
| color-6 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Samsara Sans, FK Grotesk, FK Grotesk Mono

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 12px | Captions, metadata |
| text-sm | 14px | Labels, secondary text |
| text-base | 16px | Body text (default) |
| text-lg | 24px | Subheadings, emphasis |
| text-xl | 52px | Section headings |
| text-2xl | 72px | Section headings |
| text-3xl | 80px | Section headings |

**Weight scale:** 400 · 500 · 700
**Line heights:** 72px · 52px · 24px · 14px · 28.8px · 16px · 18px · 88px · 32px · 21.28px · 15.96px · 20px

### Spacing

**Base unit:** 4px

`space-1: 4px` · `space-2: 8px` · `space-3: 12px` · `space-4: 16px` · `space-5: 20px` · `space-6: 24px` · `space-7: 32px` · `space-8: 40px` · `space-9: 48px` · `space-10: 72px` · `space-11: 80px` · `space-12: 100px` · `space-13: 116px` · `space-14: 127px` · `space-15: 157px` · `space-16: 194px`

### Shapes

**Border radius:** `radius-sm: 4px`

### Elevation

- **shadow-sm:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-fast:** `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), fill 0.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `top 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), fill 0.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-base:** `0.3s cubic-bezier(0, 0, 0.2, 1)`
- **duration-base:** `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **duration-slow:** `0.6s ease-in-out forwards fadein`

## Component Inventory

- **Buttons:** 38 detected
- **Links:** 302 detected
- **Inputs:** 4 detected
- **Navigation:** 6 elements
- **Lists:** 10 detected
- **Forms:** 2 detected
- **Images:** 243 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (4px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
