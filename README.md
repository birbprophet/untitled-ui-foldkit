# untitled-ui-foldkit

FoldKit ports of authenticated Untitled UI v8 components for cross-project reuse.

Siglata consumes this package as `packages/ui` for Storybook verification and product surfaces. Tokens, brand overrides, and the visual capture harness stay in `siglata/siglata`.

## Status

**266 / 619** authenticated component IDs verified (excluding RTL-only `rtl-demo`).

| Category | Verified | Total |
| -------- | -------- | ----- |
| Base | 48 | 48 |
| Application | 128 | 128 |
| Marketing | 90 | 443 |

353 marketing sections remain pending across fourteen families.

## Consumption

```json
"ui": "github:birbprophet/untitled-ui-foldkit#<commit-sha>"
```

```ts
import { button } from "ui/base";
import { careersSimple02 } from "ui/marketing";
```

Peer dependencies: `foldkit`, `effect`, Siglata tokens at the app boundary.

## Theme

```css
@import "tokens/console.css";
@import "ui/theme.css";
```

## Sync from Siglata

```bash
cp -R siglata/packages/ui/src ./src
cp -R siglata/packages/ui/tests ./tests
cp siglata/packages/ui/theme.css siglata/packages/ui/package.json ./
```
