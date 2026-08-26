# untitled-ui-foldkit

FoldKit renderers for [Untitled UI](https://www.untitledui.com) v8 (`untitledui@0.1.64/library-v8`). Ships reusable ports for any FoldKit project — not tied to Siglata brand, Storybook, or workspace packages.

## Exports

| Path                               | Holds                                                          |
| ---------------------------------- | -------------------------------------------------------------- |
| `untitled-ui-foldkit/base`         | Base component renderers (`button`, `badges`, …)               |
| `untitled-ui-foldkit/catalog`      | Authenticated component ids, source paths, verification status |
| `untitled-ui-foldkit/registry`     | Id → renderer map                                              |
| `untitled-ui-foldkit/verification` | Honest verification schema (Effect Schema)                     |
| `untitled-ui-foldkit/theme.css`    | Untitled UI Tailwind `@theme` baseline                         |

## Usage

```ts
import { button } from "untitled-ui-foldkit/base";
import type { HtmlBuilder } from "foldkit/html";

const view = (h: HtmlBuilder<Msg>) =>
  button({ label: "Continue", onPress: { _tag: "Continue" } }, h);
```

Import `theme.css` in the app or Storybook host that renders these components.

## Verification

Verification dimensions default to **`unverified`**. An entry moves to `verified` only when evidence is recorded in `verifiedEvidence` and passes `VerificationEvidence` decode — visual parity, interaction, accessibility, locale, and responsive checks are separate fields, not assumed.

## Relationship to Siglata

| Stays in Siglata                    | Lives here                                    |
| ----------------------------------- | --------------------------------------------- |
| `packages/tokens` brand deltas      | Untitled baseline `theme.css`                 |
| `packages/brand`, `packages/avatar` | Generic placeholders at call sites            |
| `apps/storybook` + visual manifest  | Optional future `apps/storybook` in this repo |
| `packages/i18n` product copy        | Locale props on components that need them     |

Siglata consumes this package (or a workspace link during migration) and keeps its delivery lock locally.

## Gate

```bash
bun install   # or vp install
vp check
vp test
```

## License

MIT
