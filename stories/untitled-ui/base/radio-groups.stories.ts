/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor -- Storybook CSF and native radio play functions stay direct. */
import * as S from "effect/Schema";
import { radioGroups } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, selectedValue: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected"; value: string }>;
const plans = (label: string) => [
  {
    avatarUrl: agentFace(label),
    description: "Includes up to 10 users and 20 GB storage.",
    editMessage: { _tag: "Selected", value: "basic" } as const,
    message: { _tag: "Selected", value: "basic" } as const,
    price: "$10",
    secondaryTitle: "/month",
    setDefaultMessage: { _tag: "Selected", value: "basic" } as const,
    title: label,
    value: "basic",
  },
  {
    avatarUrl: agentFace("Business plan"),
    badge: "Popular",
    description: "Includes up to 20 users and 40 GB storage.",
    editMessage: { _tag: "Selected", value: "business" } as const,
    message: { _tag: "Selected", value: "business" } as const,
    price: "$20",
    secondaryTitle: "/month",
    setDefaultMessage: { _tag: "Selected", value: "business" } as const,
    title: "Business plan",
    value: "business",
  },
];
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ label: args.label, selectedValue: "basic" }),
  update: (model: Model, message: Message): Model => ({ ...model, selectedValue: message.value }),
  view: (model: Model, h: Parameters<typeof radioGroups<Message>>[1]) =>
    radioGroups(
      {
        ariaLabel: "Plans",
        items: plans(model.label),
        name: "plans",
        selectedValue: model.selectedValue,
        variant: "icon-simple",
      },
      h,
    ),
} as const;

export default { ...componentMeta("radio-groups"), title: "Untitled UI/Base/Radio Groups" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Variants",
            (
              [
                "icon-simple",
                "icon-card",
                "avatar",
                "payment-icon",
                "radio-button",
                "checkbox",
              ] as const
            ).map((variant) =>
              h.div(
                [h.Class("w-[480px]")],
                [
                  radioGroups(
                    {
                      ariaLabel: `${variant} plans`,
                      items: plans(model.label),
                      name: variant,
                      selectedValue: model.selectedValue,
                      variant,
                    },
                    h,
                  ),
                ],
              ),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { label: "Basic plan" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[480px]")],
        [
          radioGroups(
            {
              ariaLabel: "States",
              items: [
                ...plans(model.label),
                {
                  description: "Unavailable",
                  disabled: true,
                  message: { _tag: "Selected", value: "disabled" },
                  title: "Disabled plan",
                  value: "disabled",
                },
              ],
              name: "states",
              selectedValue: model.selectedValue,
              variant: "checkbox",
            },
            h,
          ),
        ],
      ),
  }),
  args: { label: "Basic plan" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-[480px]")], [definition.view(model, h)])],
      ),
  }),
  args: { label: "Basic plan" },
};
export const Responsive = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-full max-w-[720px]")],
        [
          radioGroups(
            {
              ariaLabel: "Responsive plans",
              items: plans(model.label),
              name: "responsive",
              selectedValue: model.selectedValue,
              variant: "icon-card",
            },
            h,
          ),
        ],
      ),
  }),
  args: { label: "Basic plan" },
};
export const Interactions = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[480px]")],
        [
          radioGroups(
            {
              ariaLabel: "Payment plans",
              items: plans(model.label),
              name: "payment-interactions",
              selectedValue: model.selectedValue,
              variant: "payment-icon",
            },
            h,
          ),
        ],
      ),
  }),
  args: { label: "Basic plan" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const editButtons = await canvas.findAllByRole("button", { name: "Edit" });
    await userEvent.click(editButtons[1]);
    await expect(await canvas.findByRole("radio", { name: /Business plan/u })).toBeChecked();
  },
};
