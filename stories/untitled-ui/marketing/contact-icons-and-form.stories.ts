/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactIconsAndForm } from "../../../src/marketing/contact-icons-and-form.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const ContactMethod = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("chat"), S.Literal("mail"), S.Literal("phone"), S.Literal("pin")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  contactMethods: S.Array(ContactMethod),
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
  privacyAccepted: S.Boolean,
  privacyError: S.String,
});
type Model = typeof Model.Type;
type Field = "email" | "firstName" | "lastName" | "message";
type Message =
  | Readonly<{ _tag: "Contact"; id: string }>
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
  privacyAccepted: false,
  privacyError: "",
});

const definition = {
  Args,
  Model,
  init,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Contact") {
      return {
        ...model,
        contactMethods: model.contactMethods.map((method) =>
          method.id === message.id ? { ...method, href: "#contact-opened" } : method,
        ),
      };
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
      privacyError: model.privacyAccepted ? "" : "Accept the privacy policy.",
    };
  },
  view: (model: Model, h: Parameters<typeof contactIconsAndForm<Message>>[1]) =>
    contactIconsAndForm(
      {
        ...model,
        errors: {
          email: model.emailError === "" ? undefined : model.emailError,
          firstName: model.firstNameError === "" ? undefined : model.firstNameError,
          lastName: model.lastNameError === "" ? undefined : model.lastNameError,
          message: model.messageError === "" ? undefined : model.messageError,
          privacy: model.privacyError === "" ? undefined : model.privacyError,
        },
        onContact: (id): Message => ({ _tag: "Contact", id }),
        onEmailInput: (value): Message => ({ _tag: "Field", field: "email", value }),
        onFirstNameInput: (value): Message => ({ _tag: "Field", field: "firstName", value }),
        onLastNameInput: (value): Message => ({ _tag: "Field", field: "lastName", value }),
        onMessageInput: (value): Message => ({ _tag: "Field", field: "message", value }),
        onPrivacyToggle: { _tag: "Privacy" },
        onSubmit: { _tag: "Submit" },
        submitLabel: model.isSubmitted ? "Message sent" : model.submitLabel,
      },
      h,
    ),
} as const;

const args = {
  contactMethods: [
    {
      cta: "hi@siglata.com",
      href: "mailto:hi@siglata.com",
      icon: "mail",
      id: "email",
      subtitle: "Our friendly team is here to help.",
      title: "Email",
    },
    {
      cta: "Start new chat",
      href: "#",
      icon: "chat",
      id: "chat",
      subtitle: "Our friendly team is here to help.",
      title: "Live chat",
    },
    {
      cta: "100 Smith Street\nCollingwood VIC 3066 AU",
      href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
      icon: "pin",
      id: "office",
      subtitle: "Come say hello at our office HQ.",
      title: "Office",
    },
    {
      cta: "+1 (555) 000-0000",
      href: "tel:+1 (555) 000-0000",
      icon: "phone",
      id: "phone",
      subtitle: "Mon-Fri from 8am to 5pm.",
      title: "Phone",
    },
  ],
  description: "We'd love to hear from you. Please fill out this form or shoot us an email.",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  eyebrow: "Contact us",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Chat to our friendly team",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
} as const;

export default {
  ...componentMeta("contact-icons-and-form"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Form",
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
    await userEvent.type(canvas.getByRole("textbox", { name: "Message" }), "Hello from Siglata");
    await userEvent.click(canvas.getByRole("checkbox", { name: /privacy policy/u }));
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(await canvas.findByRole("button", { name: "Message sent" })).toBeInTheDocument();
    const chat = canvas.getByRole("link", { name: "Start new chat" });
    await userEvent.click(chat);
    await waitFor(() => expect(chat).toHaveAttribute("href", "#contact-opened"));
  },
};
