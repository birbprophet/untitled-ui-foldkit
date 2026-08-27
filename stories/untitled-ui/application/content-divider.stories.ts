/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Storybook CSF matrices are declarative fixture data. */
import * as S from "effect/Schema";
import { contentDivider } from "ui/application";

import { componentMeta, staticStory, matrix } from "../story.ts";

type Message = Readonly<{ _tag: "Noop" }>;

const Args = S.Struct({
  label: S.String,
  type: S.Literals(["single-line", "dual-line", "background-fill"]),
});

const specimen = (
  type: (typeof Args.Type)["type"],
  label: string,
  h: Parameters<typeof contentDivider<Message>>[1],
) => h.div([h.Class("w-96")], [contentDivider({ label, type }, h)]);

export default {
  ...componentMeta("content-divider"),
  title: "Untitled UI/Application/Content Divider",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Single line", [specimen("single-line", args.label, h)]],
        ["Dual line", [specimen("dual-line", args.label, h)]],
        ["Background fill", [specimen("background-fill", args.label, h)]],
      ],
      h,
    ),
  ),
  args: { label: "Section label", type: "single-line" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [matrix([["Dark", [specimen(args.type, args.label, h)]]], h)],
    ),
  ),
  args: { label: "Section label", type: "single-line" },
};
