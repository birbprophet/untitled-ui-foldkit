# untitled-ui-foldkit

FoldKit renderers for Untitled UI v8. Brand-neutral renderers; the host injects
brand colour and identity at the boundary. Published npm name: **ui**.

## Install

```bash
bun add github:birbprophet/untitled-ui-foldkit#cursor/initial-package-ad13
```

## Theme (other projects)

```css
@import "ui/default-brand.css";
@import "ui/theme.css";
```

## Theme (Siglata)

```css
@import "tokens/console.css";
@import "ui/theme.css";
```

See `docs/cloudflare-artifacts.md` for release-host tradeoffs.

## Gate

```bash
vp install && vp check && vp test
```
