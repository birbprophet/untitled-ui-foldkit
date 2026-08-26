/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- The exact upstream badge sizing is a two-value lookup inside a pure FoldKit renderer. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { renderBadge as renderAppGallery } from "../internal/app-store/app-gallery.ts";
import { renderBadge as renderAppStore } from "../internal/app-store/app-store.ts";
import { renderBadge as renderGalaxyStore } from "../internal/app-store/galaxy-store.ts";
import { renderBadge as renderGooglePlay } from "../internal/app-store/google-play.ts";
import { renderBadge as renderGooglePlayWhite } from "../internal/app-store/google-play-white.ts";

export type AppStoreButtonStore =
  | "app-gallery"
  | "app-store"
  | "galaxy-store"
  | "google-play"
  | "google-play-white";

export interface AppStoreButtonsProps {
  readonly href: string;
  readonly size?: "md" | "lg";
  readonly store: AppStoreButtonStore;
}

interface Badge {
  readonly height: readonly [number, number];
  readonly label: string;
  readonly render: <Message>(h: HtmlBuilder<Message>, width: number, height: number) => Html;
  readonly width: readonly [number, number];
}

const badges: Readonly<Record<AppStoreButtonStore, Badge>> = {
  "app-gallery": {
    height: [40, 44],
    label: "Explore it on AppGallery",
    render: renderAppGallery,
    width: [133, 147],
  },
  "app-store": {
    height: [40, 44],
    label: "Download on the App Store",
    render: renderAppStore,
    width: [120, 132],
  },
  "galaxy-store": {
    height: [40, 44],
    label: "Available on Galaxy Store",
    render: renderGalaxyStore,
    width: [147, 162],
  },
  "google-play": {
    height: [40, 44],
    label: "Get it on Google Play",
    render: renderGooglePlay,
    width: [135, 149],
  },
  "google-play-white": {
    height: [40, 44],
    label: "Get it on Google Play",
    render: renderGooglePlayWhite,
    width: [135, 149],
  },
};

export const appStoreButtons = <Message>(
  props: AppStoreButtonsProps,
  h: HtmlBuilder<Message>,
): Html => {
  const badge = badges[props.store];
  const sizeIndex = props.size === "lg" ? 1 : 0;
  return h.a(
    [
      h.AriaLabel(badge.label),
      h.Class(
        "inline-flex rounded-[7px] bg-black ring-1 ring-app-store-badge-border ring-inset outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(props.href),
    ],
    [badge.render(h, badge.width[sizeIndex], badge.height[sizeIndex])],
  );
};
