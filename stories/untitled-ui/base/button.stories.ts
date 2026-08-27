/* oxlint-disable effect/noAsyncFunction, effect/noSpread -- Storybook CSF and play functions use Storybook's promise API directly. */
import { button } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";
import type { ButtonStoryMessage } from "./button.story-model.ts";
import {
  ButtonStoryArgs,
  ButtonStoryModel,
  buttonInteractionLabel,
  initButtonStory,
  updateButtonStory,
} from "./button.story-model.ts";

export default { ...componentMeta("button"), title: "Untitled UI/Base/Button" };

export const AllVariants = {
  ...liveStory<ButtonStoryArgs, ButtonStoryModel, ButtonStoryMessage>({
    Args: ButtonStoryArgs,
    Model: ButtonStoryModel,
    init: initButtonStory,
    update: updateButtonStory,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
              button({ label: model.label, onPress: { _tag: "Pressed" }, size }, h),
            ),
          ],
          [
            "Colors",
            (
              [
                "primary",
                "secondary",
                "tertiary",
                "link-color",
                "link-gray",
                "primary-destructive",
                "secondary-destructive",
                "tertiary-destructive",
                "link-destructive",
              ] as const
            ).map((color) =>
              button({ color, label: model.label, onPress: { _tag: "Pressed" } }, h),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { label: "Button CTA" },
};

export const States = {
  ...liveStory<ButtonStoryArgs, ButtonStoryModel, ButtonStoryMessage>({
    Args: ButtonStoryArgs,
    Model: ButtonStoryModel,
    init: initButtonStory,
    update: updateButtonStory,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              button({ isDisabled: true, label: "Disabled" }, h),
              button({ isLoading: true, label: "Loading" }, h),
              button({ isLoading: true, label: "Loading", showTextWhileLoading: true }, h),
              button({ iconLeading: true, iconTrailing: true, label: model.label }, h),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Button CTA" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const disabled = await canvas.findByRole("button", { name: "Disabled" });
    const loading = await canvas.findAllByRole("button", { name: "Loading" });
    await expect(disabled).toBeDisabled();
    await expect(loading).toHaveLength(2);
    const loadingOnly = loading.at(0);
    const loadingWithText = loading.at(1);
    await expect(loadingOnly).not.toBeDisabled();
    await expect(loadingOnly).toHaveAttribute("aria-busy", "true");
    await expect(loadingOnly).toHaveAttribute("aria-disabled", "true");
    await expect(loadingOnly).toHaveAttribute("data-pending", "true");
    await expect(loadingWithText).not.toBeDisabled();
    await expect(loadingWithText).toHaveAttribute("aria-busy", "true");
    await expect(loadingWithText).toHaveAttribute("aria-disabled", "true");
    await expect(loadingWithText).toHaveAttribute("data-pending", "true");
  },
};

export const Dark = {
  ...liveStory<ButtonStoryArgs, ButtonStoryModel, ButtonStoryMessage>({
    Args: ButtonStoryArgs,
    Model: ButtonStoryModel,
    init: initButtonStory,
    update: updateButtonStory,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8"),
          h.DataAttribute("testid", "dark-surface"),
          h.DataAttribute("theme", "dark"),
        ],
        [
          matrix(
            [
              [
                "Dark",
                [
                  button({ label: model.label }, h),
                  button({ color: "secondary", label: model.label }, h),
                  button({ color: "tertiary", label: model.label }, h),
                  button({ color: "primary-destructive", label: "Delete" }, h),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Button CTA" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const surface = await within(canvasElement).findByTestId("dark-surface");
    await expect(getComputedStyle(surface).backgroundColor).toBe("rgb(12, 14, 18)");
  },
};

export const Interactions = {
  ...liveStory<ButtonStoryArgs, ButtonStoryModel, ButtonStoryMessage>({
    Args: ButtonStoryArgs,
    Model: ButtonStoryModel,
    init: initButtonStory,
    update: updateButtonStory,
    view: (model, h) =>
      button(
        {
          label: buttonInteractionLabel(model),
          onPress: { _tag: "Pressed" },
        },
        h,
      ),
  }),
  args: { label: "Run report" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Run report" }));
    const again = await canvas.findByRole("button", { name: "Run report again" });
    await expect(again).toBeInTheDocument();
    again.focus();
    await expect(again).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(
      await canvas.findByRole("button", { name: "Run report once more" }),
    ).toBeInTheDocument();
  },
};
/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread -- Typed Storybook fixtures keep direct model updates and variant matrices readable. */
