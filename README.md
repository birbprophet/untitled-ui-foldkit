# untitled-ui-foldkit

FoldKit renderers for Untitled UI v8. npm name: **ui**.

## Install

```bash
bun add github:birbprophet/untitled-ui-foldkit#cursor/initial-package-ad13
```

## Theme

```css
@import "ui/default-brand.css";
@import "ui/theme.css";
```

Siglata: `@import "tokens/console.css"` instead of `default-brand.css`.

## Full catalog sync

The verified 619-ID catalog syncs from Siglata via `scripts/sync-untitled-ui-foldkit.sh` in siglata/siglata.

## Cloudflare Artifacts

See `docs/cloudflare-artifacts.md`. GitHub remains primary.

## Gate

```bash
vp install && vp check && vp test
```
