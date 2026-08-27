/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF and the upstream variant matrix remain direct. */
import * as S from "effect/Schema";
import { progressSteps } from "../../../src/application.ts";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({
  orientation: S.Union([S.Literal("horizontal"), S.Literal("vertical")]),
  size: S.Union([S.Literal("sm"), S.Literal("md")]),
  type: S.Union([S.Literal("icon"), S.Literal("number"), S.Literal("featured-icon")]),
  variant: S.Union([
    S.Literal("icons-with-text"),
    S.Literal("minimal-icons"),
    S.Literal("minimal-icons-connected"),
    S.Literal("text-with-line"),
  ]),
});

const items = [
  { description: "Please provide your name and email", status: "complete", title: "Your details" },
  { description: "A few details about your company", status: "current", title: "Company details" },
  {
    description: "Start collaborating with your team",
    status: "incomplete",
    title: "Invite your team",
  },
] as const;

export default {
  ...componentMeta("progress-steps"),
  title: "Untitled UI/Application/Progress Steps",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Icons — horizontal",
          [
            progressSteps(
              {
                ...args,
                items,
                orientation: "horizontal",
                type: "icon",
                variant: "icons-with-text",
              },
              h,
            ),
          ],
        ],
        [
          "Numbers — vertical",
          [
            progressSteps(
              {
                ...args,
                items,
                orientation: "vertical",
                type: "number",
                variant: "icons-with-text",
              },
              h,
            ),
          ],
        ],
        [
          "Featured icons",
          [
            progressSteps(
              {
                ...args,
                items,
                orientation: "horizontal",
                size: "md",
                type: "featured-icon",
                variant: "icons-with-text",
              },
              h,
            ),
          ],
        ],
        [
          "Minimal",
          [
            progressSteps(
              { items, showStepCount: true, size: args.size, variant: "minimal-icons" },
              h,
            ),
          ],
        ],
        [
          "Minimal connected",
          [progressSteps({ items, size: args.size, variant: "minimal-icons-connected" }, h)],
        ],
        [
          "Text with line",
          [
            progressSteps(
              { items, orientation: "horizontal", size: args.size, variant: "text-with-line" },
              h,
            ),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { orientation: "horizontal", size: "sm", type: "icon", variant: "icons-with-text" },
};

export const States = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Incomplete, current, complete", [progressSteps({ ...args, items }, h)]],
        ["Without connectors", [progressSteps({ ...args, connector: false, items }, h)]],
      ],
      h,
    ),
  ),
  args: { orientation: "horizontal", size: "md", type: "number", variant: "icons-with-text" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [progressSteps({ ...args, items }, h)],
    ),
  ),
  args: { orientation: "horizontal", size: "md", type: "icon", variant: "icons-with-text" },
};

export const Responsive = {
  ...staticStory(Args, (args, h) =>
    h.div([h.Class("p-8")], [progressSteps({ ...args, items, type: "number" }, h)]),
  ),
  args: { orientation: "horizontal", size: "md", type: "number", variant: "icons-with-text" },
};
