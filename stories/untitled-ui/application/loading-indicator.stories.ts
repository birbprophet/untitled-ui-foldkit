/* oxlint-disable effect/noReturnInArrow, effect/noSpread, mps/prefer-option-over-null -- Storybook CSF matrices are declarative fixture data and undefined exercises the optional label prop. */
import * as S from "effect/Schema";
import { loadingIndicator } from "ui/application";

import { componentMeta, staticStory, matrix } from "../story.ts";

type Message = Readonly<{ _tag: "Noop" }>;

const Args = S.Struct({
  label: S.String,
  size: S.Literals(["sm", "md", "lg", "xl"]),
  type: S.Literals(["line-simple", "line-spinner", "dot-circle"]),
});
const sizes = ["sm", "md", "lg", "xl"] as const;
const types = ["line-simple", "line-spinner", "dot-circle"] as const;

const specimen = (
  type: (typeof types)[number],
  size: (typeof sizes)[number],
  label: string | undefined,
  h: Parameters<typeof loadingIndicator<Message>>[1],
) => loadingIndicator({ label, size, type }, h);

export default {
  ...componentMeta("loading-indicator"),
  title: "Untitled UI/Application/Loading Indicator",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["line-simple", sizes.map((size) => specimen("line-simple", size, args.label, h))],
        ["line-spinner", sizes.map((size) => specimen("line-spinner", size, args.label, h))],
        ["dot-circle", sizes.map((size) => specimen("dot-circle", size, args.label, h))],
        ["Without label", [specimen(args.type, args.size, undefined, h)]],
      ],
      h,
    ),
  ),
  args: { label: "Loading...", size: "sm", type: "line-simple" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [matrix([["Dark", [specimen(args.type, args.size, args.label, h)]]], h)],
    ),
  ),
  args: { label: "Loading...", size: "lg", type: "line-simple" },
};
