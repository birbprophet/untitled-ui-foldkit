/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF and its keyboard play function use the browser promise API directly. */
import * as S from "effect/Schema";
import { breadcrumbs } from "ui/application";
import type { BreadcrumbType } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ ariaLabel: S.String });
const Model = S.Struct({ ariaLabel: S.String, isExpanded: S.Boolean });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Expanded" }>;
const homeIcon = (h: Parameters<typeof breadcrumbs<Message>>[1]) =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("m3 10.5 9-7 9 7V21h-6v-6H9v6H3V10.5Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
const items = (h: Parameters<typeof breadcrumbs<Message>>[1]) => [
  { href: "#home", icon: homeIcon(h), id: "home", label: "Home" },
  { href: "#settings", id: "settings", label: "Settings" },
  { href: "#team", id: "team", label: "Team" },
  { href: "#members", id: "members", label: "Members" },
  { href: "#olivia", id: "olivia", label: "Olivia Rhye" },
];
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isExpanded: false }),
  update: (model: Model, _message: Message): Model => ({ ...model, isExpanded: true }),
  view: (model: Model, h: Parameters<typeof breadcrumbs<Message>>[1]) =>
    breadcrumbs(
      {
        ...model,
        expandMessage: { _tag: "Expanded" },
        items: items(h),
        maxVisibleItems: 4,
      },
      h,
    ),
} as const;
const specimen = (
  model: Model,
  h: Parameters<typeof breadcrumbs<Message>>[1],
  type: BreadcrumbType,
  divider: "chevron" | "slash" = "chevron",
) =>
  breadcrumbs(
    {
      ...model,
      divider,
      expandMessage: { _tag: "Expanded" },
      items: items(h),
      maxVisibleItems: 0,
      type,
    },
    h,
  );

export default { ...componentMeta("breadcrumbs"), title: "Untitled UI/Application/Breadcrumbs" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Text", [specimen(model, h, "text")]],
          ["Text line", [specimen(model, h, "text-line")]],
          ["Button", [specimen(model, h, "button")]],
          ["Slash divider", [specimen(model, h, "text", "slash")]],
        ],
        h,
      ),
  }),
  args: { ariaLabel: "Breadcrumbs" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Collapsed", [definition.view(model, h)]],
          ["Expanded", [definition.view({ ...model, isExpanded: true }, h)]],
        ],
        h,
      ),
  }),
  args: { ariaLabel: "Breadcrumbs" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [specimen(model, h, "text")],
      ),
  }),
  args: { ariaLabel: "Breadcrumbs" },
};

export const Responsive = AllVariants;

export const Interactions = {
  ...liveStory(definition),
  args: { ariaLabel: "Breadcrumbs" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const expand = await canvas.findByRole("button", { name: "See all breadcrumb items" });
    expand.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: "See all breadcrumb items" })).toBeNull(),
    );
    await canvas.findByRole("link", { name: "Settings" });
    await expect(canvas.getByText("Olivia Rhye")).toHaveAttribute("aria-current", "page");
  },
};
