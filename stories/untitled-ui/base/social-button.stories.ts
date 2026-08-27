/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { socialButton } from "ui/base";
import type { SocialButtonNetwork, SocialButtonTheme } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, presses: S.Finite });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Pressed" }>;
const pressed: Message = { _tag: "Pressed" };
const networks = ["google", "facebook", "apple", "twitter", "figma", "dribble"] as const;
const networkLabel: Record<SocialButtonNetwork, string> = {
  apple: "Sign in with Apple",
  dribble: "Sign in with Dribbble",
  facebook: "Sign in with Facebook",
  figma: "Sign in with Figma",
  google: "Sign in with Google",
  twitter: "Sign in with X",
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, presses: 0 }),
  update: (model: Model): Model => ({ ...model, presses: model.presses + 1 }),
  view: (model: Model, h: Parameters<typeof socialButton<Message>>[1]) =>
    socialButton(
      {
        accessibleLabel: model.label,
        label: model.label,
        onPress: pressed,
        social: "google",
      },
      h,
    ),
} as const;

const themedButtons = (theme: SocialButtonTheme, h: Parameters<typeof socialButton<Message>>[1]) =>
  networks.map((social) =>
    socialButton(
      {
        accessibleLabel: networkLabel[social],
        label: networkLabel[social],
        social,
        theme,
      },
      h,
    ),
  );

export default { ...componentMeta("social-button"), title: "Untitled UI/Base/Social Button" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (_model, h) =>
      matrix(
        [
          ["Brand", themedButtons("brand", h)],
          ["Color", themedButtons("color", h)],
          ["Gray", themedButtons("gray", h)],
          [
            "Sizes",
            [
              socialButton(
                {
                  accessibleLabel: "Sign in with Google",
                  label: "Sign in with Google",
                  size: "md",
                  social: "google",
                },
                h,
              ),
              socialButton(
                {
                  accessibleLabel: "Sign in with Google",
                  label: "Sign in with Google",
                  size: "lg",
                  social: "google",
                },
                h,
              ),
            ],
          ],
          [
            "Icon only",
            networks.map((social) =>
              socialButton({ accessibleLabel: networkLabel[social], social }, h),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { label: "Sign in with Google" },
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
              socialButton(
                {
                  accessibleLabel: model.label,
                  isDisabled: true,
                  label: model.label,
                  social: "google",
                },
                h,
              ),
              socialButton(
                {
                  accessibleLabel: model.label,
                  href: "#social-link",
                  label: model.label,
                  social: "google",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Sign in with Google" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [
          socialButton(
            {
              accessibleLabel: model.label,
              label: model.label,
              social: "google",
              theme: "gray",
            },
            h,
          ),
        ],
      ),
  }),
  args: { label: "Sign in with Google" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Sign in with Google" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const control = await within(canvasElement).findByRole("button", {
      name: "Sign in with Google",
    });
    control.focus();
    await expect(control).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(control).toBeEnabled();
  },
};
