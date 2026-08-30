# @birbprophet/untitled-ui-foldkit

Brand-neutral FoldKit ports of the authenticated Untitled UI v8 component catalog for
reuse across FoldKit applications. Ports transcribe upstream anatomy, spacing,
typography, responsive behavior, and interactions; consuming applications inject their
identity (logos, avatars) and brand ramp at the host boundary.

## Status

**619 / 619** authenticated component IDs ported and verified (the 620th inventory id,
RTL-only `rtl-demo`, is excluded — all supported locales are left-to-right).

| Category    | Verified | Total |
| ----------- | -------- | ----- |
| Base        | 48       | 48    |
| Application | 128      | 128   |
| Marketing   | 443      | 443   |

Quality gates (identical toolchain to Siglata/Harnessful: vite-plus `vp check`/`vp test`
over the house Oxlint stack — ultracite core, vendored Effect presets, `@rikalabs`,
`@mpsuesser`, `@foldkit` plugins):

- TypeScript: zero errors across `src/`, `tests/`, `stories/`.
- Tests: **531 files / 610 tests green**, including catalog↔registry↔evidence
  reconciliation.
- Localized behavior: date components accept `"en-US" | "pt-BR"` (`Intl` weekday/date
  formatting, e.g. `Sun/Sat` vs `dom./sáb.`); calendar parity is under
  `tests/calendar-month.test.ts`.
- Interaction parity: every component ships All variants / States / Dark / Responsive /
  Interactions stories; base controls cover unfilled, partially-filled, activated,
  disabled, and loading states.

## Consumption

```jsonc
// package.json of the consuming app/repo
"@birbprophet/untitled-ui-foldkit": "github:birbprophet/untitled-ui-foldkit#<commit-sha>"
```

```ts
import { button } from "@birbprophet/untitled-ui-foldkit/base";
import { careersSimple02 } from "@birbprophet/untitled-ui-foldkit/marketing";
import { catalog } from "@birbprophet/untitled-ui-foldkit/catalog";
```

Peer dependencies: `foldkit` and `effect`. There are no other runtime dependencies — no
React, no icon runtime, no avatar generator inside the library.

### Theme (brand colors)

Ports style through CSS custom properties. Import your token register first, then the
library theme:

```css
@import "your-tokens/register.css"; /* defines --brand-50 … --brand-900 etc.   */
@import "@birbprophet/untitled-ui-foldkit/theme.css";
```

Without a project register, import `default-brand.css` first to get the upstream purple
ramp. Every brand hue, neutral surface, focus ring, and `_on-brand` text role resolves
through these variables, so a host re-brand never forks component code.

The ramp contract is also available programmatically — eleven `--brand-50` …
`--brand-950` steps are the only colour injection surface renderers depend on:

```ts
import {
  renderBrandRampBlock,
  untitledDefaultBrandRamp,
} from "@birbprophet/untitled-ui-foldkit/theme";
```

### Brand context (identity data contract)

Identity-bearing renderers accept identity through data, never imports.
`BrandContext` describes a product symbol plus optional horizontal wordmark; the
shipped default is the upstream Untitled UI mark, valid until a host passes its
own assets:

```ts
import { untitledDefaultBrandContext } from "@birbprophet/untitled-ui-foldkit/brand-context";
```

### Identity injection (logos & avatars)

The library ships NO product artwork. Slots that upstream fills with its own logo or
people photos are plain data props:

```ts
interface BrandMark {
  readonly alt: string;
  readonly src: string;
}
interface BrandLockup {
  readonly mark: BrandMark;
  readonly text?: string;
  readonly wordmarkSrc?: string;
}
```

- Header/footer/nav sections take a required `brand: BrandLockup`; renderers never emit
  hardcoded product names or marks.
- People avatars are `src` URL props on data items (`avatarUrl`, `authorAvatarSrc`,
  …). Provide any deterministic avatar source you like — e.g. self-hosted
  [blobatar](https://github.com/Alain00/blobatar) with `?gen=1` URLs pinned per name for
  Gravatar-style stability.
- Story fixtures demonstrating the pattern live in `stories/fixtures/brand.ts`
  (dev-only; never imported by library code).

## Repository layout

```text
src/       ports + catalog + evidence (published)
tests/     house vitest suites, one per id (published)
stories/   Storybook CSF corpus, five stories per id (dev only)
theme.css / default-brand.css   token boundary styles (published)
packages/oxlint-plugin          vendored house lint plugin (dev)
```

Tooling pins mirror `siglata/siglata`: typescript 7, effect 4 rc, foldkit 0.153,
vite-plus 0.3, oxlint 1.79, pnpm workspaces (`pnpm-workspace.yaml`). `pnpm install`,
then `pnpm exec vp check` / `pnpm exec vp test`.

## Sync bridge

This repo is authoritative. To mirror the published surface into Siglata's workspace:

```bash
cp -R src packages/ui/src && cp -R tests packages/ui/tests && cp theme.css packages/ui/
```

Story files map to `apps/storybook/stories/untitled-ui/**` with import specifiers already
pointing at local sources.
