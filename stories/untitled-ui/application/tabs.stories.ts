/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { tabs } from "../../../src/application.ts";
import type { TabType } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ ariaLabel: S.String });
const Model = S.Struct({ ariaLabel: S.String, focusedId: S.String, selectedId: S.String });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; id: string }>;
const focused = (id: string): Message => ({ _tag: "Focused", id });
const selected = (id: string): Message => ({ _tag: "Selected", id });
const items = (options: Readonly<{ content?: boolean; disabled?: boolean }> = {}) =>
  [
    {
      content: options.content === true ? "Overview content" : undefined,
      focusMessage: focused("overview"),
      id: "overview",
      label: "Overview",
      selectMessage: selected("overview"),
    },
    {
      badge: 12,
      content: options.content === true ? "Integrations content" : undefined,
      focusMessage: focused("integrations"),
      id: "integrations",
      label: "Integrations",
      selectMessage: selected("integrations"),
    },
    {
      content: options.content === true ? "Activity content" : undefined,
      focusMessage: focused("activity"),
      id: "activity",
      isDisabled: options.disabled,
      label: "Activity",
      selectMessage: selected("activity"),
    },
  ] as const;
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    focusedId: "overview",
    selectedId: "overview",
  }),
  update: (model: Model, message: Message): Model =>
    message._tag === "Selected"
      ? { ...model, focusedId: message.id, selectedId: message.id }
      : { ...model, focusedId: message.id },
  view: (model: Model, h: Parameters<typeof tabs<Message>>[1]) =>
    tabs({ ...model, id: "tabs-live", items: items({ content: true }) }, h),
} as const;
const specimen = (
  model: Model,
  type: TabType,
  h: Parameters<typeof tabs<Message>>[1],
  options: Readonly<{
    fullWidth?: boolean;
    orientation?: "horizontal" | "vertical";
    size?: "sm" | "md";
  }> = {},
) =>
  tabs(
    {
      ...model,
      ...options,
      id: `tabs-${type}-${options.size ?? "sm"}-${options.orientation ?? "horizontal"}`,
      items: items(),
      type,
    },
    h,
  );

export default { ...componentMeta("tabs"), title: "Untitled UI/Application/Tabs" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h: Parameters<typeof tabs<Message>>[1]) =>
      matrix(
        [
          ["button-brand", [specimen(model, "button-brand", h)]],
          ["button-gray", [specimen(model, "button-gray", h)]],
          ["button-border", [specimen(model, "button-border", h)]],
          ["button-minimal", [specimen(model, "button-minimal", h)]],
          ["underline", [specimen(model, "underline", h)]],
          [
            "Sizes",
            [
              specimen(model, "button-brand", h),
              specimen(model, "button-brand", h, { size: "md" }),
            ],
          ],
          ["Vertical line", [specimen(model, "line", h, { orientation: "vertical" })]],
          ["Full width", [specimen(model, "underline", h, { fullWidth: true })]],
        ],
        h,
      ),
  }),
  args: { ariaLabel: "Account" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Disabled",
            [
              tabs(
                {
                  ...model,
                  id: "tabs-disabled",
                  items: items({ disabled: true }),
                  type: "button-border",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { ariaLabel: "Account" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [specimen(model, "underline", h)],
      ),
  }),
  args: { ariaLabel: "Account" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { ariaLabel: "Account" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const overview = await within(canvasElement).findByRole("tab", { name: "Overview" });
    overview.focus();
    await userEvent.keyboard("{ArrowRight}");
    const integrations = await within(canvasElement).findByRole("tab", { name: /Integrations/u });
    await waitFor(() => expect(integrations).toHaveFocus());
    await expect(integrations).toHaveAttribute("aria-selected", "false");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(integrations).toHaveAttribute("aria-selected", "true"));
    await within(canvasElement).findByRole("tabpanel", { name: /Integrations/u });
  },
};
