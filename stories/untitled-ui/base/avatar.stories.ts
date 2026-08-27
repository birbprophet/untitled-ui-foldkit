/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary -- Storybook CSF variant matrices and play functions stay direct. */
import * as S from "effect/Schema";
import { expect, userEvent, within } from "storybook/test";
import { avatar } from "../../../src/base.ts";

import { agentFace } from "../../fixtures/brand.ts";
import { componentMeta, liveStory, matrix, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ agent: S.String });

export default {
  ...componentMeta("avatar"),
  title: "Untitled UI/Base/Avatar",
};

const faceSrc = (args: typeof Args.Type): string => agentFace(args.agent);

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Sizes",
          (["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) =>
            avatar({ alt: args.agent, size, src: faceSrc(args) }, h),
          ),
        ],
        [
          "Shape",
          [
            avatar({ alt: args.agent, rounded: false, src: faceSrc(args) }, h),
            avatar({ alt: args.agent, rounded: true, src: faceSrc(args) }, h),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { agent: "Olivia Rhye" },
};

export const States = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        [
          "Presence",
          [
            avatar({ alt: args.agent, size: "lg", src: faceSrc(args), status: "online" }, h),
            avatar({ alt: args.agent, size: "lg", src: faceSrc(args), status: "offline" }, h),
          ],
        ],
        [
          "Adornments",
          [
            avatar({ alt: args.agent, border: true, size: "lg", src: faceSrc(args) }, h),
            avatar({ alt: args.agent, size: "lg", src: faceSrc(args), verified: true }, h),
            avatar({ alt: args.agent, count: 3, size: "lg", src: faceSrc(args) }, h),
          ],
        ],
        [
          "Fallbacks",
          [
            avatar({ alt: args.agent, initials: "OR", size: "lg", src: faceSrc(args) }, h),
            avatar(
              {
                alt: args.agent,
                initials: "OR",
                isImageFailed: true,
                size: "lg",
                src: faceSrc(args),
              },
              h,
            ),
            avatar({ alt: args.agent, isImageFailed: true, size: "lg", src: faceSrc(args) }, h),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { agent: "Olivia Rhye" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [
        matrix(
          [
            [
              "Dark",
              [
                avatar({ alt: args.agent, size: "lg", src: faceSrc(args), status: "online" }, h),
                avatar({ alt: args.agent, size: "lg", src: faceSrc(args), verified: true }, h),
                avatar({ alt: args.agent, initials: "OR", size: "lg" }, h),
              ],
            ],
          ],
          h,
        ),
      ],
    ),
  ),
  args: { agent: "Olivia Rhye" },
};

export const Responsive = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("flex w-full max-w-[360px] flex-wrap gap-4")],
      [
        avatar({ alt: args.agent, size: "2xl", src: faceSrc(args) }, h),
        avatar({ alt: args.agent, size: "xl", src: faceSrc(args) }, h),
        avatar({ alt: args.agent, size: "lg", src: faceSrc(args) }, h),
        avatar({ alt: args.agent, size: "md", src: faceSrc(args) }, h),
        avatar({ alt: args.agent, size: "sm", src: faceSrc(args) }, h),
        avatar({ alt: args.agent, size: "xs", src: faceSrc(args) }, h),
      ],
    ),
  ),
  args: { agent: "Olivia Rhye" },
};

type InteractionMessage = Readonly<{ _tag: "FailImage" }>;
const InteractionModel = S.Struct({ agent: S.String, isImageFailed: S.Boolean });
type InteractionModel = typeof InteractionModel.Type;

export const Interactions = {
  ...liveStory<typeof Args.Type, InteractionModel, InteractionMessage>({
    Args,
    Model: InteractionModel,
    init: (args) => ({ agent: args.agent, isImageFailed: false }),
    update: (model) => ({ ...model, isImageFailed: true }),
    view: (model, h) =>
      h.div(
        [h.Class("flex flex-col items-start gap-8")],
        [
          avatar(
            {
              alt: model.agent,
              isImageFailed: model.isImageFailed,
              size: "lg",
              src: faceSrc(model),
            },
            h,
          ),
          h.button(
            [
              h.Class(
                "rounded-lg bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-primary shadow-xs ring-1 ring-inset ring-border-primary",
              ),
            ],
            ["Simulate load failure"],
          ),
        ],
      ),
  }),
  args: { agent: "Olivia Rhye" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector("[data-avatar-img]")).not.toBeNull();
    await userEvent.click(await canvas.findByRole("button", { name: "Simulate load failure" }));
    await expect(canvasElement.querySelector("[data-avatar-img]")).toBeNull();
    await expect(await canvas.findByText("OR")).toBeDefined();
  },
};
