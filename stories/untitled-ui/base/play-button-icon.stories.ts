/* oxlint-disable effect/noSpread -- Storybook CSF composes the shared verified metadata and renderer. */
import * as S from "effect/Schema";
import { playButtonIcon } from "ui/base";

import { componentMeta, staticStory } from "../story.ts";

const Args = S.Struct({});

export default {
  ...componentMeta("play-button-icon"),
  title: "Untitled UI/Base/Play Button Icon",
};

export const AllVariants = {
  ...staticStory(Args, (_args, h) =>
    h.div(
      [h.Class("group flex size-40 items-center justify-center rounded-xl bg-gray-900")],
      [playButtonIcon({}, h)],
    ),
  ),
  args: {},
};

export const States = {
  ...staticStory(Args, (_args, h) =>
    h.div(
      [h.Class("flex size-40 items-center justify-center rounded-xl bg-gray-900")],
      [playButtonIcon({ className: "bg-alpha-white/50" }, h)],
    ),
  ),
  args: {},
};
