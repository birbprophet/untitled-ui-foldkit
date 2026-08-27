/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, within } from "storybook/test";

import {
  contactSimpleForm01,
  contactSimpleForm01Countries,
} from "../../../../../packages/ui/src/marketing/contact-simple-form-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Country = S.Struct({ id: S.String, label: S.String, phoneMask: S.String });
const Args = S.Struct({
  countries: S.Array(Country),
  countryCodeLabel: S.String,
  description: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  firstNameLabel: S.String,
  firstNamePlaceholder: S.String,
  heading: S.String,
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
const Model = S.Struct({
  ...Args.fields,
  email: S.String,
  emailError: S.String,
  firstName: S.String,
  firstNameError: S.String,
  isSubmitted: S.Boolean,
  lastName: S.String,
  lastNameError: S.String,
  message: S.String,
  messageError: S.String,
  phone: S.String,
  phoneError: S.String,
  privacyAccepted: S.Boolean,
  privacyError: S.String,
  selectedCountryId: S.String,
});
type Model = typeof Model.Type;
type Field = "email" | "firstName" | "lastName" | "message" | "phone";
type Message =
  | Readonly<{ _tag: "Country"; id: string }>
  | Readonly<{ _tag: "Field"; field: Field; value: string }>
  | Readonly<{ _tag: "Privacy" }>
  | Readonly<{ _tag: "Submit" }>;

const init = (args: typeof Args.Type): Model => ({
  ...args,
  email: "",
  emailError: "",
  firstName: "",
  firstNameError: "",
  isSubmitted: false,
  lastName: "",
  lastNameError: "",
  message: "",
  messageError: "",
  phone: "",
  phoneError: "",
  privacyAccepted: false,
  privacyError: "",
  selectedCountryId: "US",
});

const definition = {
  Args,
  Model,
  init,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Country") {
      return { ...model, selectedCountryId: message.id };
    }
    if (message._tag === "Privacy") {
      return { ...model, privacyAccepted: !model.privacyAccepted, privacyError: "" };
    }
    if (message._tag === "Field") {
      if (message.field === "email") {
        return { ...model, email: message.value, emailError: "" };
      }
      if (message.field === "firstName") {
        return { ...model, firstName: message.value, firstNameError: "" };
      }
      if (message.field === "lastName") {
        return { ...model, lastName: message.value, lastNameError: "" };
      }
      if (message.field === "phone") {
        return { ...model, phone: message.value, phoneError: "" };
      }
      return { ...model, message: message.value, messageError: "" };
    }
    const invalid =
      model.firstName === "" ||
      model.lastName === "" ||
      model.email === "" ||
      model.message === "" ||
      !model.privacyAccepted;
    return {
      ...model,
      emailError: model.email === "" ? "Enter your email." : "",
      firstNameError: model.firstName === "" ? "Enter your first name." : "",
      isSubmitted: !invalid,
      lastNameError: model.lastName === "" ? "Enter your last name." : "",
      messageError: model.message === "" ? "Enter a message." : "",
      phoneError: "",
      privacyError: model.privacyAccepted ? "" : "Accept the privacy policy.",
    };
  },
  view: (model: Model, h: Parameters<typeof contactSimpleForm01<Message>>[1]) =>
    contactSimpleForm01(
      {
        ...model,
        errors: {
          email: model.emailError === "" ? undefined : model.emailError,
          firstName: model.firstNameError === "" ? undefined : model.firstNameError,
          lastName: model.lastNameError === "" ? undefined : model.lastNameError,
          message: model.messageError === "" ? undefined : model.messageError,
          phone: model.phoneError === "" ? undefined : model.phoneError,
          privacy: model.privacyError === "" ? undefined : model.privacyError,
        },
        onCountryChange: (id): Message => ({ _tag: "Country", id }),
        onEmailInput: (value): Message => ({ _tag: "Field", field: "email", value }),
        onFirstNameInput: (value): Message => ({ _tag: "Field", field: "firstName", value }),
        onLastNameInput: (value): Message => ({ _tag: "Field", field: "lastName", value }),
        onMessageInput: (value): Message => ({ _tag: "Field", field: "message", value }),
        onPhoneInput: (value): Message => ({ _tag: "Field", field: "phone", value }),
        onPrivacyToggle: { _tag: "Privacy" },
        onSubmit: { _tag: "Submit" },
        submitLabel: model.isSubmitted ? "Message sent" : model.submitLabel,
      },
      h,
    ),
} as const;

const args = {
  countries: contactSimpleForm01Countries,
  countryCodeLabel: "Country code",
  description: "We'd love to hear from you. Please fill out this form.",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  eyebrow: "Contact us",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Get in touch",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  phoneLabel: "Phone number",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
} as const;

export default {
  ...componentMeta("contact-simple-form-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Form 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...init(storyArgs),
      emailError: "Enter your email.",
      firstNameError: "Enter your first name.",
      lastNameError: "Enter your last name.",
      messageError: "Enter a message.",
      privacyError: "Accept the privacy policy.",
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    await userEvent.type(canvas.getByRole("textbox", { name: "First name" }), "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: "Last name" }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "olivia@example.com");
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Country code" }), "BR");
    await expect(canvas.getByRole("combobox", { name: "Country code" })).toHaveValue("BR");
    await userEvent.type(canvas.getByRole("textbox", { name: "Phone number" }), "11999999999");
    await userEvent.type(canvas.getByRole("textbox", { name: "Message" }), "Hello from Siglata");
    await userEvent.click(canvas.getByRole("checkbox", { name: /privacy policy/u }));
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(await canvas.findByRole("button", { name: "Message sent" })).toBeInTheDocument();
  },
};
