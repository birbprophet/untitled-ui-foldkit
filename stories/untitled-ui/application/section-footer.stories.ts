/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Storybook CSF matrices are declarative fixture data. */
import * as S from "effect/Schema";
import { button } from "../../../src/base.ts";
import { sectionFooter } from "../../../src/application.ts";

import { componentMeta, staticStory, matrix } from "../story.ts";

const Args = S.Struct({ isCard: S.Boolean });
type Message = Readonly<{ _tag: "Noop" }>;
const specimen = (isCard: boolean, h: Parameters<typeof sectionFooter<Message>>[1]) =>
  sectionFooter(
    {
      actions: [
        button({ color: "secondary", label: "Cancel", size: "sm" }, h),
        button({ label: "Save changes", size: "sm" }, h),
      ],
      isCard,
      leading: h.span([h.Class("text-sm text-text-tertiary")], ["Last saved 2 minutes ago"]),
    },
    h,
  );

export default {
  ...componentMeta("section-footer"),
  title: "Untitled UI/Application/Section Footer",
};

export const AllVariants = {
  ...staticStory(Args, (_args, h) =>
    matrix(
      [
        ["Page", [h.div([h.Class("w-160")], [specimen(false, h)])]],
        ["Card", [h.div([h.Class("w-160")], [specimen(true, h)])]],
      ],
      h,
    ),
  ),
  args: { isCard: false },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [h.div([h.Class("w-160")], [specimen(args.isCard, h)])],
    ),
  ),
  args: { isCard: true },
};

export const Responsive = AllVariants;
