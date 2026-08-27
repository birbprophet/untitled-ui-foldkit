/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blobatarUri } from "blobatar/uri";

import {
  contactSimpleForm02,
  contactSimpleForm02Countries,
} from "../../../src/marketing/contact-simple-form-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Country = S.Struct({ id: S.String, label: S.String, phoneMask: S.String });
const Args = S.Struct({
  countries: S.Array(Country),
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  submitLabel: S.String,
});
type Args = typeof Args.Type;
const Errors = S.Struct({
  email: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  message: S.optional(S.String),
  privacy: S.optional(S.String),
});
const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryId: S.String,
});
const Model = S.Struct({ ...Args.fields, errors: Errors, values: Values });
type Model = typeof Model.Type;
type Field = "email" | "firstName" | "lastName" | "message" | "phone";
type Message =
  | Readonly<{ _tag: "CountryChanged"; id: string }>
  | Readonly<{ _tag: "FieldChanged"; field: Field; value: string }>
  | Readonly<{ _tag: "PrivacySelected" }>
  | Readonly<{ _tag: "PrivacyToggled" }>
  | Readonly<{ _tag: "Submitted" }>;

const emptyValues = {
  email: "",
  firstName: "",
  lastName: "",
  message: "",
  phone: "",
  privacyAccepted: false,
  selectedCountryId: "US",
} as const;

const validate = (values: Model["values"]): Model["errors"] => ({
  email: values.email.includes("@") ? undefined : "Enter a valid email address.",
  firstName: values.firstName.trim() === "" ? "Enter your first name." : undefined,
  lastName: values.lastName.trim() === "" ? "Enter your last name." : undefined,
  message: values.message.trim() === "" ? "Leave us a message." : undefined,
  privacy: values.privacyAccepted ? undefined : "Accept the privacy policy to continue.",
});

const definition = {
  Args,
  Model,
  init: (args: Args): Model => ({ ...args, errors: {}, values: emptyValues }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "CountryChanged") {
      return { ...model, values: { ...model.values, selectedCountryId: message.id } };
    }
    if (message._tag === "PrivacyToggled") {
      return {
        ...model,
        errors: { ...model.errors, privacy: undefined },
        values: { ...model.values, privacyAccepted: !model.values.privacyAccepted },
      };
    }
    if (message._tag === "PrivacySelected") {
      return { ...model, privacyHref: "#privacy-opened" };
    }
    if (message._tag === "Submitted") {
      const errors = validate(model.values);
      const valid =
        errors.email === undefined &&
        errors.firstName === undefined &&
        errors.lastName === undefined &&
        errors.message === undefined &&
        errors.privacy === undefined;
      return { ...model, errors, submitLabel: valid ? "Message sent" : model.submitLabel };
    }
    const errors =
      message.field === "phone" ? model.errors : { ...model.errors, [message.field]: undefined };
    return {
      ...model,
      errors,
      values: { ...model.values, [message.field]: message.value },
    };
  },
  view: (model: Model, h: Parameters<typeof contactSimpleForm02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactSimpleForm02(
          {
            ...model,
            onCountryChange: (id): Message => ({ _tag: "CountryChanged", id }),
            onFieldInput: (field, value): Message => ({ _tag: "FieldChanged", field, value }),
            onPrivacy: { _tag: "PrivacySelected" },
            onPrivacyToggle: { _tag: "PrivacyToggled" },
            onSubmit: { _tag: "Submitted" },
          },
          h,
        ),
      ],
    ),
} as const;

const imageSrc = blobatarUri("contact-simple-form-02-lana-steiner", {
  background: "square",
  size: 1024,
  title: "Lana Steiner",
});

const args = {
  countries: [...contactSimpleForm02Countries],
  description: "Our friendly team would love to hear from you.",
  heading: "Contact us",
  imageAlt: "Lana Steiner",
  imageSrc,
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
} satisfies Args;

export default {
  ...componentMeta("contact-simple-form-02"),
  title: "Untitled UI/Marketing/Contact/Contact Simple Form 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs): Model => ({
      ...definition.init(storyArgs),
      errors: validate(emptyValues),
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
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
    const submit = await canvas.findByRole("button", { name: "Send message" });
    await userEvent.click(submit);
    await canvas.findByText("Enter your first name.");
    await canvas.findByText("Accept the privacy policy to continue.");

    await userEvent.type(await canvas.findByLabelText(/First name/u), "Olivia");
    await userEvent.type(await canvas.findByLabelText(/Last name/u), "Rhye");
    await userEvent.type(await canvas.findByLabelText(/Email/u), "olivia@example.com");
    await userEvent.type(await canvas.findByLabelText(/Message/u), "I'd like to learn more.");
    await userEvent.click(await canvas.findByRole("checkbox"));
    await userEvent.click(submit);
    await waitFor(() => expect(submit).toHaveAccessibleName("Message sent"));
  },
};
