/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based and authenticated fields include placeholders. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactFormAndImage01,
  contactFormAndImage01Countries,
} from "../../../src/marketing/contact-form-and-image-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Errors = S.Struct({
  email: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  message: S.optional(S.String),
  phone: S.optional(S.String),
});
const Args = S.Struct({
  countries: S.Array(S.Struct({ id: S.String, label: S.String, phoneMask: S.String })),
  countryCodeLabel: S.String,
  description: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  firstNameLabel: S.String,
  firstNamePlaceholder: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
  lastNameLabel: S.String,
  lastNamePlaceholder: S.String,
  messageLabel: S.String,
  messagePlaceholder: S.String,
  phoneLabel: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  submitLabel: S.String,
});
type Args = typeof Args.Type;
const Model = S.Struct({
  ...Args.fields,
  email: S.String,
  errors: Errors,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryId: S.String,
  submitted: S.Boolean,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "CountryChanged"; id: string }>
  | Readonly<{ _tag: "EmailInput"; value: string }>
  | Readonly<{ _tag: "FirstNameInput"; value: string }>
  | Readonly<{ _tag: "LastNameInput"; value: string }>
  | Readonly<{ _tag: "MessageInput"; value: string }>
  | Readonly<{ _tag: "PhoneInput"; value: string }>
  | Readonly<{ _tag: "PrivacyToggled" }>
  | Readonly<{ _tag: "Submitted" }>;

const definition = {
  Args,
  Model,
  init: (storyArgs: Args): Model => ({
    ...storyArgs,
    email: "",
    errors: {},
    firstName: "",
    lastName: "",
    message: "",
    phone: "",
    privacyAccepted: false,
    selectedCountryId: "US",
    submitted: false,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "CountryChanged") {
      return { ...model, selectedCountryId: message.id };
    }
    if (message._tag === "EmailInput") {
      return { ...model, email: message.value };
    }
    if (message._tag === "FirstNameInput") {
      return { ...model, firstName: message.value };
    }
    if (message._tag === "LastNameInput") {
      return { ...model, lastName: message.value };
    }
    if (message._tag === "MessageInput") {
      return { ...model, message: message.value };
    }
    if (message._tag === "PhoneInput") {
      return { ...model, phone: message.value };
    }
    if (message._tag === "PrivacyToggled") {
      return { ...model, privacyAccepted: !model.privacyAccepted };
    }
    const errors = {
      ...(model.email.includes("@") ? {} : { email: "Enter a valid email address." }),
      ...(model.firstName.trim() === "" ? { firstName: "First name is required." } : {}),
      ...(model.lastName.trim() === "" ? { lastName: "Last name is required." } : {}),
      ...(model.message.trim() === "" ? { message: "Message is required." } : {}),
    };
    const submitted =
      errors.email === undefined &&
      errors.firstName === undefined &&
      errors.lastName === undefined &&
      errors.message === undefined;
    return { ...model, errors, submitted };
  },
  view: (model: Model, h: Parameters<typeof contactFormAndImage01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactFormAndImage01(
          {
            ...model,
            onCountryChange: (id): Message => ({ _tag: "CountryChanged", id }),
            onEmailInput: (value): Message => ({ _tag: "EmailInput", value }),
            onFirstNameInput: (value): Message => ({ _tag: "FirstNameInput", value }),
            onLastNameInput: (value): Message => ({ _tag: "LastNameInput", value }),
            onMessageInput: (value): Message => ({ _tag: "MessageInput", value }),
            onPhoneInput: (value): Message => ({ _tag: "PhoneInput", value }),
            onPrivacyToggle: { _tag: "PrivacyToggled" },
            onSubmit: { _tag: "Submitted" },
            submitLabel: model.submitted ? "Message sent" : model.submitLabel,
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  countries: [...contactFormAndImage01Countries],
  countryCodeLabel: "Country code",
  description: "Our friendly team would love to hear from you.",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Contact us",
  imageAlt: "Smiling girl",
  imageSrc: "https://www.untitledui.com/marketing/smiling-girl-12.webp",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  phoneLabel: "Phone number",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
} satisfies Args;

export default {
  ...componentMeta("contact-form-and-image-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Form And Image 01",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: Args): Model => ({
      ...definition.init(storyArgs),
      email: "not-an-email",
      errors: {
        email: "Enter a valid email address.",
        firstName: "First name is required.",
        lastName: "Last name is required.",
        message: "Message is required.",
        phone: "Enter a valid phone number.",
      },
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
    await expect(await canvas.findByRole("img", { name: "Smiling girl" })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(await canvas.findByText("First name is required.")).toHaveAttribute(
      "role",
      "alert",
    );

    await userEvent.type(canvas.getByRole("textbox", { name: /First name/u }), "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: /Last name/u }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Email/u }), "olivia@example.com");
    const country = canvas.getByRole("combobox", { name: "Country code" });
    await userEvent.selectOptions(country, "BR");
    const phone = canvas.getByRole("textbox", { name: "Phone number" });
    await waitFor(() => expect(phone).toHaveAttribute("placeholder", "+55 (00) 90000-0000"));
    await userEvent.type(phone, "+55 11 91234 5678");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Message/u }), "Hello from Siglata.");
    await userEvent.click(canvas.getByRole("checkbox", { name: /You agree/u }));
    await expect(canvas.getByRole("checkbox", { name: /You agree/u })).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Message sent" })).toBeVisible());
  },
};
