/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerTextFieldBrandFullWidth } from "../../../src/marketing/banner-text-field-brand-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  dismissLabel: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  id: S.String,
  subscribeLabel: S.String,
  title: S.String,
  titleSuffix: S.String,
});
const Model = S.Struct({
  ...Args.fields,
  email: S.String,
  isSubmitted: S.Boolean,
  isVisible: S.Boolean,
});
type Model = typeof Model.Type;
const Dismissed = m("BannerTextFieldBrandFullWidthDismissed");
const EmailChanged = m("BannerTextFieldBrandFullWidthEmailChanged", { email: S.String });
const Submitted = m("BannerTextFieldBrandFullWidthSubmitted");
type Message = typeof Dismissed.Type | typeof EmailChanged.Type | typeof Submitted.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    email: "",
    isSubmitted: false,
    isVisible: true,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BannerTextFieldBrandFullWidthEmailChanged") {
      return { ...model, email: message.email };
    }
    if (message._tag === "BannerTextFieldBrandFullWidthSubmitted") {
      return { ...model, isSubmitted: true };
    }
    return { ...model, isVisible: false };
  },
  view: (model: Model, h: Parameters<typeof bannerTextFieldBrandFullWidth<Message>>[1]) =>
    model.isVisible
      ? bannerTextFieldBrandFullWidth(
          {
            ...model,
            onDismiss: Dismissed(),
            onEmailInput: (email) => EmailChanged({ email }),
            onSubmit: Submitted(),
            subscribeLabel: model.isSubmitted ? "Subscribed" : model.subscribeLabel,
          },
          h,
        )
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  description: "Be the first to hear about new components, updates, and design resources.",
  dismissLabel: "Dismiss",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  id: "banner-text-field-brand-full-width",
  subscribeLabel: "Subscribe",
  title: "Stay up to date with the latest news",
  titleSuffix: "and updates",
} as const;

export default {
  ...componentMeta("banner-text-field-brand-full-width"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Banners/Banner Text Field Brand Full Width",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      email: "olivia@example.com",
      isSubmitted: true,
      isVisible: true,
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof bannerTextFieldBrandFullWidth<Message>>[1]) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
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
    const email = await canvas.findByRole("textbox", { name: "Email" });
    await userEvent.type(email, "olivia@example.com");
    await expect(email).toHaveValue("olivia@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));
    await expect(await canvas.findByRole("button", { name: "Subscribed" })).toBeInTheDocument();
    const dismiss = canvas.getByRole("button", { name: "Dismiss" });
    dismiss.focus();
    await expect(dismiss).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
