/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit banner in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerTextFieldDefault } from "../../../src/marketing/banner-text-field-default.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  dismissLabel: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  id: S.String,
  subscribeLabel: S.String,
  title: S.String,
  titleSuffix: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
const EmailInput = m("BannerTextFieldDefaultEmailInput", { email: S.String });
const Submitted = m("BannerTextFieldDefaultSubmitted");
const Dismissed = m("BannerTextFieldDefaultDismissed");
type Message = typeof EmailInput.Type | typeof Submitted.Type | typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BannerTextFieldDefaultEmailInput") {
      return { ...model, email: message.email };
    }
    return message._tag === "BannerTextFieldDefaultDismissed"
      ? { ...model, isVisible: false }
      : model;
  },
  view: (model: Model, h: Parameters<typeof bannerTextFieldDefault<Message>>[1]) =>
    model.isVisible
      ? bannerTextFieldDefault(
          {
            ...model,
            onDismiss: Dismissed(),
            onEmailInput: (email) => EmailInput({ email }),
            onSubmit: Submitted(),
          },
          h,
        )
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  description: "Be the first to hear about new components, updates, and design resources.",
  dismissLabel: "Dismiss",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  id: "banner-text-field-default",
  subscribeLabel: "Subscribe",
  title: "Stay up to date with the latest news",
  titleSuffix: "and updates",
} as const;

export default {
  ...componentMeta("banner-text-field-default"),
  title: "Untitled UI/Marketing/Banners/Banner Text Field Default",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "operator@siglata.com" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof bannerTextFieldDefault<Message>>[1]) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const email = await canvas.findByRole("textbox", { name: args.emailLabel });
    await expect(email).toBeRequired();
    await expect(email).toHaveAttribute("type", "email");
    await userEvent.type(email, "operator@siglata.com");
    await expect(email).toHaveValue("operator@siglata.com");
    await userEvent.click(canvas.getByRole("button", { name: args.subscribeLabel }));
    await expect(email).toHaveValue("operator@siglata.com");
    const close = canvas.getByRole("button", { name: args.dismissLabel });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
