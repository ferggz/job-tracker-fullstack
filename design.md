<!-- Hallmark · studied: yes · DNA-source: url · source: https://linear.app/ · translated for a job application tracker -->

# Design — Job Application Tracker

Locked design system. Future Hallmark runs read this file first and defer to it.
This is a structural interpretation of a public reference, not a visual replica.

## System

- Genre · modern-minimal, product-first, information-dense
- Macrostructure · Workbench: persistent navigation + view header + primary work surface + optional detail panel
- Theme · studied DNA, translated into an original neutral system
- Axes · paired light/dark surfaces / neutral grotesque / restrained cool accent
- Product character · calm, fast, legible, quietly precise
- Primary object · a job application, shown as a row first and a card only when spatial grouping is useful

## Provenance

- Source mode · public URL study
- Source · [linear.app](https://linear.app/), used as a public reference for this project on 2026-08-24
- Supporting references · Linear's public documentation for filters, search, display options, boards, mobile behavior, and its published UI-redesign notes
- Attestation · public reference for the user's own project
- Scope · reusable principles only; do not copy Linear branding, logos, proprietary copy, illustrations, exact layouts, or exact visual identity
- Confidence · structure and behavior are grounded in public product examples and documentation. Exact source CSS tokens were not available in this environment; the tokens below are original recommendations. Fine visual rhythm and breakpoint behavior require later screenshot-based validation.

## Design DNA

### Information density

- Prefer compact, scannable rows over spacious cards for the primary application view.
- Keep one dominant line per application: company, role, status, next action, and last activity.
- Reveal secondary fields on demand through configurable columns, a peek panel, or the full detail view.
- Use group headers with counts; keep them sticky in long lists.
- Density must not mean ambiguity: preserve 32–40 px row targets, clear focus, and readable contrast.

### Navigation structure

- Desktop shell: 224–248 px collapsible left sidebar, flexible content canvas, optional 320–400 px detail panel.
- Sidebar order: global actions; personal focus; core workspace views; saved views; secondary utilities.
- Recommended items: Search, Add application, Dashboard, Applications, Follow-ups, Interviews, Offers, Archive, Saved views.
- Favorites and saved views belong below core navigation and may collapse independently.
- Keep the active item clear through surface contrast and text weight, not a large brand-colored block.
- The top of the content area owns page title, view switcher, filter summary, and display controls.

### Typography hierarchy

- Use one neutral sans family with optical or weight contrast; do not imitate a proprietary type treatment.
- Display/page title · 24–28 px / 600–650, tight but not compressed.
- Section title · 16–18 px / 600.
- Row primary · 13–14 px / 500–600.
- Body and metadata · 13–14 px / 400–450.
- Labels and table headers · 11–12 px / 500–600; sentence case, never decorative all-caps.
- Use tabular numbers for counts, dates, salary, and conversion metrics.
- Hierarchy should come from weight, contrast, and placement before size.

### Spacing and geometry

- Base unit · 4 px.
- Common gaps · 4, 8, 12, 16, 24, 32 px.
- Content padding · 16 px compact, 24 px standard, 32 px on wide dashboard canvases.
- Row padding · 8–10 px vertical and 12–16 px horizontal.
- Borders are hairlines that separate functional regions; shadows are reserved for floating overlays.
- Radii stay restrained: 6 px inputs, 8 px cards/panels, full radius only for compact chips.
- Avoid excessive nesting of rounded containers. Prefer one clear surface boundary per region.

### Tables and lists

- List is the default application workspace; board is an alternate status-oriented view.
- First column remains the strongest semantic anchor: company plus role, not an internal identifier.
- Suggested columns: Company / Role, Status, Next action, Follow-up date, Applied date, Source, Last activity.
- Permit sorting, grouping, column visibility, and saved view preferences without changing the underlying data.
- Keep headers sticky; selection and bulk actions appear contextually after selection.
- Truncate long values in the row and expose the full value through accessible tooltip, peek, or detail view.
- Empty groups are hidden by default but can be revealed through display options.
- A board card shows only company, role, next action/date, and at most two compact metadata items.

### Filters and search

- Separate global search from find-in-view. Global search spans applications, companies, contacts, and notes; find-in-view temporarily narrows the current list or board.
- Put a visible search entry in the sidebar and support `/` or `Cmd/Ctrl+K` as an accelerator, never as the only route.
- Filters update results immediately and are summarized as removable chips or a concise formula.
- Core filters: status, company, role, location, source, date applied, next action, follow-up date, salary range, tags, and archived state.
- Reflect durable filters, sorting, grouping, and view mode in the URL so a view is bookmarkable and shareable.
- Allow saved views such as “Follow up this week”, “Interviewing”, “Waiting on response”, and “Recently inactive”.
- Advanced boolean filters are progressive disclosure; keep common filters one step away.

### Status presentation

- Status is semantic data, not decoration. Combine a short label with a small dot or quiet tinted chip.
- Recommended workflow: Wishlist → Applied → Screening → Interview → Offer → Hired, with Rejected and Withdrawn as terminal branches.
- Use restrained color families: neutral for Wishlist, blue for Applied, violet for Screening, amber for Interview, green for Offer/Hired, muted red for Rejected, gray for Withdrawn.
- Never rely on color alone; text labels remain visible and icons are optional reinforcement.
- Avoid saturated full-row backgrounds. Reserve stronger treatment for overdue follow-ups, destructive actions, and current focus.
- Application health is separate from workflow status: on track, waiting, needs action, overdue.

### Dashboard composition

- Dashboard is a decision surface, not a gallery of generic KPI cards.
- Lead with “Needs attention”: overdue follow-ups, interviews today, and applications without activity.
- Follow with a compact pipeline summary and conversion funnel using real data only.
- Add recent activity and upcoming events as dense lists that can open the related application.
- Use charts only when they answer a concrete question: applications over time, stage conversion, response rate, or source quality.
- Prefer 2–3 strong regions with varied spans over a uniform grid of equally weighted cards.
- Every metric must link to the filtered records behind it.

### Responsive behavior

- Desktop ≥ 1200 px · full sidebar, list/table, optional detail panel.
- Tablet 768–1199 px · collapsible sidebar overlay; detail panel becomes a drawer; low-priority columns hide through display preferences.
- Mobile < 768 px · bottom navigation for Home, Applications, Add, Follow-ups, and Search; no squeezed desktop sidebar.
- Mobile applications use a compact stacked row, not a horizontally scrolling data table.
- Board view may scroll horizontally by column, but list view must not introduce page-level horizontal scrolling.
- Filters open in a full-height sheet; active filters remain visible as a short summary after closing.
- Keep primary actions reachable with one hand and interactive targets at least 44 px on touch layouts.
- Preserve the same information architecture across breakpoints, even when navigation changes shape.

### Restrained visual language

- Let alignment, typography, and surface contrast do most of the work.
- Use one accent color sparingly for focus, selected controls, links, and primary actions.
- Icons are compact and functional; avoid illustrative icon tiles, gradients, glow, glass, and decorative dashboard chrome.
- Motion communicates state changes only: panel entrance, row insertion/removal, selection, and view transition.
- Default copy is direct and task-oriented: “Add application”, “Set follow-up”, “Move to interview”.
- Do not invent testimonials, metrics, company logos, or sample performance claims.

### Light and dark surfaces

- Derive both modes from shared semantic roles rather than independent color picking.
- Use four elevation roles: canvas, sidebar, panel/card, floating overlay.
- Light mode separates regions with very small lightness shifts and hairlines; dark mode uses lightness elevation rather than heavy shadows.
- Body text and neutral icons must gain contrast in dark mode rather than becoming uniformly gray.
- Status hues keep their meaning across modes but use separate foreground/background pairs for contrast.
- Offer system, light, and dark preferences; high-contrast mode must remain possible by changing contrast tokens, not component CSS.

## Tokens

Canonical values are original to this project and may be tuned after visual testing.

```css
:root {
  --color-paper:        oklch(98% 0.004 260);
  --color-paper-2:      oklch(96.5% 0.006 260);
  --color-panel:        oklch(99.5% 0.002 260);
  --color-overlay:      oklch(100% 0 0);
  --color-ink:          oklch(22% 0.014 260);
  --color-ink-2:        oklch(48% 0.014 260);
  --color-ink-3:        oklch(62% 0.010 260);
  --color-rule:         oklch(89% 0.008 260);
  --color-accent:       oklch(57% 0.16 265);
  --color-accent-ink:   oklch(99% 0.002 260);
  --color-focus:        oklch(62% 0.18 255);
  --color-danger:       oklch(58% 0.18 25);
  --color-warning:      oklch(70% 0.14 78);
  --color-success:      oklch(59% 0.13 150);

  --font-display: "Inter Display", "Inter", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, monospace;

  --space-3xs: 4px;  --space-2xs: 8px;  --space-xs: 12px;
  --space-sm: 16px;  --space-md: 24px;  --space-lg: 32px;
  --space-xl: 48px;  --space-2xl: 64px; --space-3xl: 96px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 120ms; --dur-base: 180ms; --dur-slow: 280ms;

  --radius-input: 6px; --radius-card: 8px; --radius-panel: 10px;
  --radius-pill: 999px; --rule-hairline: 1px;
}

[data-theme="dark"] {
  --color-paper:        oklch(18% 0.012 260);
  --color-paper-2:      oklch(21% 0.014 260);
  --color-panel:        oklch(24% 0.014 260);
  --color-overlay:      oklch(27% 0.016 260);
  --color-ink:          oklch(94% 0.006 260);
  --color-ink-2:        oklch(72% 0.010 260);
  --color-ink-3:        oklch(58% 0.012 260);
  --color-rule:         oklch(31% 0.014 260);
  --color-accent:       oklch(70% 0.15 265);
  --color-accent-ink:   oklch(18% 0.012 260);
  --color-focus:        oklch(74% 0.16 255);
}
```

## Component voice

- Primary action · accent fill, 6 px radius, compact 8 × 12 px padding, medium weight.
- Secondary action · neutral ghost or hairline outline using the same geometry.
- Inputs · panel surface, visible border, quiet placeholder, immediate focus ring.
- Panels · mostly border-separated; shadow only when floating above another surface.
- Status chips · compact, semantic, label always present, no glossy or gradient treatment.
- Detail view · properties grouped in a right panel on desktop and a drawer/full screen on smaller layouts.

## Motion stance

- Motion-cut by default; use one restrained opacity/translate reveal for overlays and drawers.
- Animate transform and opacity only, generally 120–280 ms.
- Never animate focus rings. Avoid bounce, hover-scale cards, celebratory status motion, and `transition: all`.
- Reduced-motion fallback · instant state change or ≤150 ms opacity crossfade.

## Accessibility and verification

- Meet WCAG AA contrast for text and controls; expose a higher-contrast theme path.
- Every interactive control has default, hover, focus-visible, active, disabled, loading, error, and success behavior where applicable.
- Keyboard users can search, filter, move through rows, open details, and perform bulk actions without a mouse.
- Verify at 320, 375, 414, 768, 1024, and 1440 px with no unintended horizontal page scroll.
- Do not ship a dense desktop table as the mobile experience; verify the stacked-row transformation with realistic long company and role names.

## Exports

This file is the current source of truth. Create `tokens.css` when frontend implementation begins. Tailwind, DTCG, or shadcn exports should be generated from these semantic roles rather than copied from the reference.

## Notes — do not carry over

- Do not reproduce Linear's brand mark, wordmark, product names, copy, screenshots, illustrations, or signature visual details.
- Do not treat the reference homepage as the tracker application's information architecture.
- Do not copy exact source colors, type metrics, radii, sidebar dimensions, animation timings, or component geometry.
- Do not overfit keyboard shortcuts to another product; expose visible controls and add shortcuts only as accelerators.
- Avoid generic KPI-card dashboards, oversized marketing typography inside the app, decorative gradients, glass panels, glow, pill overload, nested rounded cards, and color-only status states.
- Avoid invented performance metrics and sample companies presented as real data.
- URL study limitation: exact visual rhythm and responsive breakpoint behavior were not verified in a rendered browser pass. Validate with screenshots and real-device testing before implementation.

