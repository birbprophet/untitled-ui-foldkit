/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF mirrors the actual showActions prop and its keyboard play function uses the browser promise API directly. */
import * as S from "effect/Schema";
import { metrics } from "../../../src/application.ts";
import type { MetricVariant, MetricsProps } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Variant = S.Union([
  S.Literal("simple"),
  S.Literal("icon-01"),
  S.Literal("icon-02"),
  S.Literal("icon-03"),
  S.Literal("icon-04"),
  S.Literal("chart-01"),
  S.Literal("chart-02"),
  S.Literal("chart-03"),
  S.Literal("chart-04"),
]);
const Args = S.Struct({
  change: S.String,
  changeDescription: S.String,
  changeType: S.Union([S.Literal("simple"), S.Literal("trend"), S.Literal("modern")]),
  footerLabel: S.String,
  showActions: S.Boolean,
  subtitle: S.String,
  title: S.String,
  trend: S.Union([S.Literal("positive"), S.Literal("negative")]),
  variant: Variant,
});
const Model = S.Struct({
  ...Args.fields,
  isActionsOpen: S.Boolean,
  selectedAction: S.Union([
    S.Literal("none"),
    S.Literal("view"),
    S.Literal("share"),
    S.Literal("copy"),
  ]),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Action"; action: "copy" | "share" | "view" }>
  | Readonly<{ _tag: "Footer" }>
  | Readonly<{ _tag: "ToggleActions" }>;
const toggle: Message = { _tag: "ToggleActions" };
const footer: Message = { _tag: "Footer" };
const action = (selectedAction: "copy" | "share" | "view"): Message => ({
  _tag: "Action",
  action: selectedAction,
});
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    isActionsOpen: false,
    selectedAction: "none",
  }),
  update: (model: Model, message: Message): Model =>
    message._tag === "ToggleActions"
      ? { ...model, isActionsOpen: !model.isActionsOpen }
      : message._tag === "Action"
        ? { ...model, isActionsOpen: false, selectedAction: message.action }
        : model,
  view: (model: Model, h: Parameters<typeof metrics<Message>>[1]) =>
    metrics(
      {
        ...model,
        actionsOpen: model.isActionsOpen,
        footerMessage: footer,
        onAction: action,
        onActionsToggle: toggle,
      },
      h,
    ),
} as const;

const defaultArgs = {
  change: "100%",
  changeDescription: "vs last month",
  changeType: "simple",
  footerLabel: "View report",
  showActions: true,
  subtitle: "View 24 hours",
  title: "2,000",
  trend: "positive",
  variant: "simple",
} as const;
const variants: readonly MetricVariant[] = [
  "simple",
  "icon-01",
  "icon-02",
  "icon-03",
  "icon-04",
  "chart-01",
  "chart-02",
  "chart-03",
  "chart-04",
];
const specimen = (
  model: Model,
  h: Parameters<typeof metrics<Message>>[1],
  props: Partial<MetricsProps<Message>>,
  includeFooter = true,
) =>
  h.div(
    [h.Class("w-80")],
    [
      metrics(
        {
          ...model,
          ...(includeFooter ? { footerMessage: footer } : {}),
          onAction: action,
          onActionsToggle: toggle,
          ...props,
        },
        h,
      ),
    ],
  );

export default { ...componentMeta("metrics"), title: "Untitled UI/Application/Metrics" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        variants.map((variant) => [variant, [specimen(model, h, { variant })]]),
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.DataAttribute("hide-canvas-scrollbar", "true")],
        [
          matrix(
            [
              ["Positive", [specimen(model, h, { trend: "positive", variant: "simple" })]],
              [
                "Negative",
                [specimen(model, h, { change: "10%", trend: "negative", variant: "simple" })],
              ],
              [
                "Actions open",
                [specimen(model, h, { actionsOpen: true, variant: "icon-03" }, false)],
              ],
              [
                "Without actions",
                [specimen(model, h, { showActions: false, variant: "chart-03" }, false)],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8 outline-[100vmax] outline-bg-primary"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(model, h, { variant: "chart-04" })],
      ),
  }),
  args: defaultArgs,
};

export const Responsive = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("w-full max-w-120")],
        [
          metrics(
            {
              ...model,
              footerMessage: footer,
              onAction: action,
              onActionsToggle: toggle,
              variant: "icon-04",
            },
            h,
          ),
        ],
      ),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Metric actions" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await canvas.findByRole("menu");
    await expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await userEvent.click(within(menu).getByRole("menuitem", { name: "Share" }));
    await expect(canvas.queryByRole("menu")).toBeNull();
    await expect(trigger.getAttribute("aria-expanded")).toBe("false");
  },
};
