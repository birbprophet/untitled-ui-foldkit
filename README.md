# untitled-ui-foldkit (`packages/ui`)

FoldKit renderers for Untitled UI v8. The package is project-neutral: renderers
read semantic CSS roles, and the host injects brand colour and identity assets at
the boundary.

The in-repo path is `packages/ui`. The external home is
[`birbprophet/untitled-ui-foldkit`](https://github.com/birbprophet/untitled-ui-foldkit)
(canonical home is birbprophet/untitled-ui-foldkit (branch cursor/initial-package-ad13). This tree is staging until git pin — see docs/09-tooling-and-repo/untitled-ui-foldkit.md).

## Theme contract

Two layers, imported in order:

1. **Brand ramp** — eleven `--brand-50` … `--brand-950` custom properties.
2. **Semantic theme** — `ui/theme.css` maps Untitled roles (`--color-bg-brand-solid`,
   `--color-focus-ring`, `text-text-brand-secondary`, …) to those ramp steps.

Renderers use Tailwind semantic classes only (`bg-bg-brand-solid`,
`outline-focus-ring`). Purple→teal (or any rebrand) happens in step 1, not inside
each renderer.

### Default (other projects)

```css
@import "ui/default-brand.css";
@import "ui/theme.css";
```

`default-brand.css` ships Untitled UI purple (`#7f56d9` at `--brand-600`).

### Siglata (console + Storybook)

```css
@import "../../../packages/tokens/console.css"; /* teal --brand-* + fonts */
@import "ui/theme.css";
```

`packages/tokens/console.css` is generated from the Siglata register
(`packages/tokens/src/console.ts`). It overrides `--brand-*` with teal and sets
`--font-family` to Inter.

Programmatic access:

```typescript
import { renderBrandRampBlock, untitledDefaultBrandRamp } from "ui/theme";
```

## Brand context

Identity-bearing renderers accept an optional `brandContext` prop. Siglata passes
`siglataBrandContext` from `apps/storybook/src/siglata-theme.ts` (exported for
stories and future identity renderers).

## Example: button uses injected theme, not hardcoded colour

The primary button variant applies semantic classes:

```typescript
primary:
  "bg-bg-brand-solid … hover:bg-bg-brand-solid-hover …",
```

Those classes resolve to `--color-bg-brand-solid` → `var(--color-brand-600)` →
`var(--brand-600)`. Siglata sets `--brand-600: #0b7d74` in `console.css`; a
standalone consumer gets `#7f56d9` from `default-brand.css`.

## 620-ID catalog migration

Each verified renderer should:

- use semantic Tailwind roles from `theme.css`, never hex or `--brand-*` directly;
- read logos through an optional `brandContext` prop (default
  `untitledDefaultBrandContext`), not `import … from "brand"`;
- keep fixture copy generic or pass identity via props where upstream demos used
  product names.

The catalog in `src/catalog.ts` stays ID-compatible; theme injection does not
change component IDs or story titles.

## References

- FoldKit UI overview: https://foldkit.dev/ui/overview
- Siglata tokens: `packages/tokens/src/console.ts`
- Storybook wiring: `apps/storybook/.storybook/preview.ts`,
  `apps/storybook/src/storybook.css
