/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit form in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerTextFieldDefaultFullWidth } from "../../../../../packages/ui/src/marketing/banner-text-field-default-full-width.ts";
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
const Model = S.Struct({ ...Args.fields, isSubmitted: S.Boolean, isVisible: S.Boolean });
type Model = typeof Model.Type;
const EmailInput = m("BannerTextFieldDefaultFullWidthEmailInput", { email: S.String });
const Submitted = m("BannerTextFieldDefaultFullWidthSubmitted");
const Dismissed = m("BannerTextFieldDefaultFullWidthDismissed");
type Message = typeof EmailInput.Type | typeof Submitted.Type | typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isSubmitted: false, isVisible: true }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BannerTextFieldDefaultFullWidthEmailInput") {
      return { ...model, email: message.email, isSubmitted: false };
    }
    if (message._tag === "BannerTextFieldDefaultFullWidthDismissed") {
      return { ...model, isVisible: false };
    }
    return { ...model, isSubmitted: true, subscribeLabel: "Subscribed" };
  },
  view: (model: Model, h: Parameters<typeof bannerTextFieldDefaultFullWidth<Message>>[1]) => {
    if (model.isVisible) {
      return bannerTextFieldDefaultFullWidth(
        {
          ...model,
          onDismiss: Dismissed(),
          onEmailInput: (email) => EmailInput({ email }),
          onSubmit: Submitted(),
        },
        h,
      );
    }
    return h.div([h.AriaLabel("Banner dismissed")]);
  },
} as const;

const args = {
  description: "Be the first to hear about new components, updates, and design resources.",
  dismissLabel: "Dismiss",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  id: "banner-text-field-default-full-width",
  subscribeLabel: "Subscribe",
  title: "Stay up to date with the latest news",
  titleSuffix: "and updates",
} as const;

export default {
  ...componentMeta("banner-text-field-default-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Text Field Default Full Width",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "operator@siglata.com" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary px-8 pt-16 pb-8"), h.DataAttribute("theme", "dark")],
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
    await userEvent.type(email, "operator@siglata.com");
    await expect(email).toHaveValue("operator@siglata.com");
    await userEvent.click(canvas.getByRole("button", { name: args.subscribeLabel }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Subscribed" })).toBeInTheDocument(),
    );
    await expect(email).toHaveValue("operator@siglata.com");
    const close = canvas.getByRole("button", { name: args.dismissLabel });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
