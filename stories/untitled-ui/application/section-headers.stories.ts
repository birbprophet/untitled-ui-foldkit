/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Storybook CSF matrices are declarative fixture data. */
import * as S from "effect/Schema";
import { button } from "../../../src/base.ts";
import { sectionHeaders } from "../../../src/application.ts";

import { componentMeta, staticStory, matrix } from "../story.ts";

const Args = S.Struct({ heading: S.String, subheading: S.String });
type Message = Readonly<{ _tag: "Noop" }>;
const specimen = (args: typeof Args.Type, h: Parameters<typeof sectionHeaders<Message>>[1]) =>
  sectionHeaders(
    {
      actions: [
        button({ color: "secondary", label: "Cancel", size: "sm" }, h),
        button({ label: "Save changes", size: "sm" }, h),
      ],
      heading: args.heading,
      subheading: args.subheading,
    },
    h,
  );

export default {
  ...componentMeta("section-headers"),
  title: "Untitled UI/Application/Section Headers",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix([["Heading with actions", [h.div([h.Class("w-160")], [specimen(args, h)])]]], h),
  ),
  args: {
    heading: "Team members",
    subheading: "Manage your team members and their account permissions.",
  },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [h.div([h.Class("w-160")], [specimen(args, h)])],
    ),
  ),
  args: {
    heading: "Team members",
    subheading: "Manage your team members and their account permissions.",
  },
};

export const Responsive = AllVariants;
