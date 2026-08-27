/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and controlled row removal remain direct. */
import * as S from "effect/Schema";
import { filterBar } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ ariaLabel: S.String });
const Model = S.Struct({ ariaLabel: S.String, isRowVisible: S.Boolean });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Action" | "Remove" }>;
const remove: Message = { _tag: "Remove" };
const action: Message = { _tag: "Action" };

const control = <ControlMessage>(
  label: string,
  h: Parameters<typeof filterBar<ControlMessage>>[1],
) =>
  h.div(
    [
      h.Class(
        "flex h-9 min-w-36 items-center rounded-lg bg-bg-primary px-3 text-sm text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
      ),
    ],
    [label],
  );

const view = (model: Model, h: Parameters<typeof filterBar<Message>>[1]) =>
  filterBar(
    {
      actions: [control("Last 30 days", h)],
      ariaLabel: model.ariaLabel,
      content: model.isRowVisible ? [] : [control("All projects", h), control("Status", h)],
      iconAction: { label: "Open filters", onPress: action },
      rows: model.isRowVisible
        ? [
            {
              content: [control("Status", h), control("is", h), control("Active", h)],
              id: "status",
              onRemove: remove,
            },
          ]
        : [],
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isRowVisible: true }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    isRowVisible: message._tag === "Remove" ? false : model.isRowVisible,
  }),
  view,
} as const;

export default { ...componentMeta("filter-bar"), title: "Untitled UI/Application/Filter Bar" };

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      matrix(
        [
          ["Root, content and actions", [view({ ...model, isRowVisible: false }, h)]],
          ["Filter row", [view(model, h)]],
        ],
        h,
      ),
  }),
  args: { ariaLabel: "Filter results" },
};
export const States = AllVariants;
export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [view(model, h)],
      ),
  }),
  args: { ariaLabel: "Filter results" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { ariaLabel: "Filter results" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Remove filter" }));
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: "Remove filter" })).not.toBeInTheDocument(),
    );
  },
};
