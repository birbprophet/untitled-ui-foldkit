/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import type { Html } from "foldkit/html";
import { tooltip } from "ui/base";
import type { TooltipPlacement } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ isOpen: S.Boolean, label: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Closed" | "Opened" }>;
const opened: Message = { _tag: "Opened" };
const closed: Message = { _tag: "Closed" };
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isOpen: false }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    isOpen: message._tag === "Opened",
  }),
  view: (model: Model, h: Parameters<typeof tooltip<Message>>[1]) =>
    h.div(
      [h.Class("flex min-h-72 items-center justify-center")],
      [
        tooltip(
          {
            arrow: true,
            description: "This is a tooltip.",
            id: "tooltip-trigger",
            isOpen: model.isOpen,
            onClose: closed,
            onOpen: opened,
            title: "Tooltip title",
            triggerLabel: model.label,
          },
          h,
        ),
      ],
    ),
} as const;

const placements = [
  "top",
  "top left",
  "top right",
  "top start",
  "top end",
  "bottom",
  "bottom left",
  "bottom right",
  "bottom start",
  "bottom end",
  "left",
  "right",
] as const satisfies readonly TooltipPlacement[];

const openTooltip = (
  id: string,
  label: string,
  placement: TooltipPlacement,
  h: Parameters<typeof tooltip<Message>>[1],
) =>
  tooltip(
    {
      arrow: true,
      description: "This is a tooltip.",
      id,
      isOpen: true,
      onClose: closed,
      onOpen: opened,
      placement,
      title: "Tooltip title",
      triggerLabel: label,
    },
    h,
  );

const tooltipSpecimen = (
  id: string,
  label: string,
  placement: TooltipPlacement,
  h: Parameters<typeof tooltip<Message>>[1],
  disabled = false,
) => {
  if (!disabled) {
    return h.div(
      [h.Class("flex min-h-36 min-w-80 items-center justify-center")],
      [openTooltip(id, label, placement, h)],
    );
  }
  return h.div(
    [h.Class("flex min-h-36 min-w-80 items-center justify-center")],
    [
      tooltip(
        {
          id,
          isDisabled: true,
          isOpen: false,
          onClose: closed,
          onOpen: opened,
          placement,
          title: "Tooltip title",
          triggerLabel: label,
        },
        h,
      ),
    ],
  );
};

export default { ...componentMeta("tooltip"), title: "Untitled UI/Base/Tooltip" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ...placements.map((placement): [string, readonly Html[]] => [
            placement,
            [
              tooltipSpecimen(
                `tooltip-${placement.replaceAll(" ", "-")}`,
                model.label,
                placement,
                h,
              ),
            ],
          ]),
          [
            "Content",
            [
              h.div(
                [h.Class("flex min-h-36 min-w-80 items-center justify-center")],
                [
                  tooltip(
                    {
                      id: "tooltip-title-only",
                      isOpen: true,
                      onClose: closed,
                      onOpen: opened,
                      title: "Tooltip title",
                      triggerLabel: model.label,
                    },
                    h,
                  ),
                ],
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Hover me" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              tooltipSpecimen("tooltip-open", model.label, "top", h),
              tooltipSpecimen("tooltip-disabled", model.label, "top", h, true),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Hover me" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    init: (args) => ({ ...args, isOpen: true }),
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [
          h.div(
            [h.Class("flex min-h-72 items-center justify-center")],
            [tooltipSpecimen("tooltip-dark", model.label, "top", h)],
          ),
        ],
      ),
  }),
  args: { label: "Hover me" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Hover me" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const trigger = await within(canvasElement).findByRole("button", { name: "Hover me" });
    await userEvent.hover(trigger);
    await waitFor(() => expect(within(canvasElement).getByRole("tooltip")).toBeVisible());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(within(canvasElement).queryByRole("tooltip")).toBeNull());
    trigger.focus();
    await waitFor(() => expect(within(canvasElement).getByRole("tooltip")).toBeVisible());
  },
};
