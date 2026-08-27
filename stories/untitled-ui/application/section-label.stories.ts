/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Storybook CSF matrices are declarative fixture data. */
import * as S from "effect/Schema";
import { button } from "ui/base";
import { sectionLabel } from "ui/application";

import { componentMeta, staticStory, matrix } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  isRequired: S.Boolean,
  size: S.Literals(["sm", "md"]),
  title: S.String,
  tooltip: S.String,
});
type Message = Readonly<{ _tag: "Noop" }>;
const specimen = (props: typeof Args.Type, h: Parameters<typeof sectionLabel<Message>>[1]) =>
  sectionLabel(
    {
      ...props,
      actions: [button({ color: "secondary", label: "Edit", size: "sm" }, h)],
    },
    h,
  );

export default {
  ...componentMeta("section-label"),
  title: "Untitled UI/Application/Section Label",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Small", [specimen({ ...args, size: "sm" }, h)]],
        ["Medium", [specimen({ ...args, size: "md" }, h)]],
      ],
      h,
    ),
  ),
  args: {
    description: "Supporting text for this section.",
    isRequired: true,
    size: "sm",
    title: "Section title",
    tooltip: "More information",
  },
};

export const States = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Required", [specimen({ ...args, isRequired: true }, h)]],
        ["Optional", [specimen({ ...args, isRequired: false }, h)]],
      ],
      h,
    ),
  ),
  args: {
    description: "Supporting text for this section.",
    isRequired: true,
    size: "sm",
    title: "Section title",
    tooltip: "More information",
  },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [specimen(args, h)],
    ),
  ),
  args: {
    description: "Supporting text for this section.",
    isRequired: true,
    size: "sm",
    title: "Section title",
    tooltip: "More information",
  },
};
