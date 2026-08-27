/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/prefer-destructuring, mps/avoid-direct-tag-checks -- Storybook exercises controlled form validation and contact actions in Chromium. */
import * as Arr from "effect/Array";
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactIconsAndFormBrand } from "../../../src/marketing/contact-icons-and-form-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Field = S.Union([
  S.Literal("email"),
  S.Literal("firstName"),
  S.Literal("lastName"),
  S.Literal("message"),
  S.Literal("privacy"),
]);
const allInvalidFields: readonly (typeof Field.Type)[] = [
  "firstName",
  "lastName",
  "email",
  "message",
  "privacy",
];
const InputField = S.Union([
  S.Literal("email"),
  S.Literal("firstName"),
  S.Literal("lastName"),
  S.Literal("message"),
]);
const Contact = S.Struct({
  cta: S.String,
  href: S.String,
  icon: S.Union([S.Literal("chat"), S.Literal("email"), S.Literal("office"), S.Literal("phone")]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  contacts: S.Array(Contact),
  description: S.String,
  email: S.String,
  eyebrow: S.String,
  firstName: S.String,
  heading: S.String,
  lastName: S.String,
  message: S.String,
  privacyAccepted: S.Boolean,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  submitLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, invalidFields: S.Array(Field) });
type Model = typeof Model.Type;
const ContactOpened = m("ContactIconsAndFormBrandContactOpened", { id: S.String });
const FieldInput = m("ContactIconsAndFormBrandFieldInput", { field: InputField, value: S.String });
const PrivacyToggled = m("ContactIconsAndFormBrandPrivacyToggled");
const Submitted = m("ContactIconsAndFormBrandSubmitted");
type Message =
  | typeof ContactOpened.Type
  | typeof FieldInput.Type
  | typeof PrivacyToggled.Type
  | typeof Submitted.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, invalidFields: [] }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ContactIconsAndFormBrandFieldInput") {
      return {
        ...model,
        [message.field]: message.value,
        invalidFields: model.invalidFields.filter((field) => field !== message.field),
      };
    }
    if (message._tag === "ContactIconsAndFormBrandPrivacyToggled") {
      return {
        ...model,
        invalidFields: model.invalidFields.filter((field) => field !== "privacy"),
        privacyAccepted: !model.privacyAccepted,
      };
    }
    if (message._tag === "ContactIconsAndFormBrandContactOpened") {
      return {
        ...model,
        contacts: model.contacts.map((contact) =>
          contact.id === message.id ? { ...contact, href: "#contact-opened" } : contact,
        ),
      };
    }
    const invalidFields = [
      model.firstName.trim() === "" ? "firstName" : undefined,
      model.lastName.trim() === "" ? "lastName" : undefined,
      model.email.includes("@") ? undefined : "email",
      model.message.trim() === "" ? "message" : undefined,
      model.privacyAccepted ? undefined : "privacy",
    ].filter((field): field is typeof Field.Type => field !== undefined);
    return Arr.match(invalidFields, {
      onEmpty: () => ({ ...model, invalidFields, submitLabel: "Message sent" }),
      onNonEmpty: (values) => ({ ...model, invalidFields: values }),
    });
  },
  view: (model: Model, h: Parameters<typeof contactIconsAndFormBrand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactIconsAndFormBrand(
          {
            ...model,
            onContact: (id) => ContactOpened({ id }),
            onFieldInput: (field, value) => FieldInput({ field, value }),
            onPrivacyToggle: PrivacyToggled(),
            onSubmit: Submitted(),
          },
          h,
        ),
      ],
    ),
} as const;

const contacts = [
  {
    cta: "hi@siglata.com",
    href: "mailto:hi@siglata.com",
    icon: "email",
    id: "email",
    subtitle: "Our friendly team is here to help.",
    title: "Email",
  },
  {
    cta: "Start new chat",
    href: "#chat",
    icon: "chat",
    id: "chat",
    subtitle: "Our friendly team is here to help.",
    title: "Live chat",
  },
  {
    cta: "100 Smith Street\nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    icon: "office",
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
] as const;
const args = {
  contacts,
  description: "We'd love to hear from you. Please fill out this form or shoot us an email.",
  email: "",
  eyebrow: "Contact us",
  firstName: "",
  heading: "Chat to our friendly team",
  lastName: "",
  message: "",
  privacyAccepted: false,
  privacyHref: "#privacy",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
} as const;

export default {
  ...componentMeta("contact-icons-and-form-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Form Brand",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs) => ({
      ...storyArgs,
      invalidFields: allInvalidFields,
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
    const firstName = await canvas.findByRole("textbox", { name: /First name/u });
    const lastName = canvas.getByRole("textbox", { name: /Last name/u });
    const email = canvas.getByRole("textbox", { name: /^Email/u });
    const message = canvas.getByRole("textbox", { name: /Message/u });
    const submit = canvas.getByRole("button", { name: "Send message" });
    await userEvent.click(submit);
    await expect(firstName).toBeInvalid();
    await userEvent.type(firstName, "Olivia");
    await userEvent.type(lastName, "Rhye");
    await userEvent.type(email, "olivia@example.com");
    await userEvent.type(message, "I'd like to learn more.");
    await userEvent.click(submit);
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("Accept the privacy policy"),
    );
    const privacy = canvas.getByRole("checkbox");
    await userEvent.click(privacy);
    await expect(privacy).toBeChecked();
    await userEvent.click(submit);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Message sent" })).toBeInTheDocument(),
    );
    const emailContact = canvas.getByRole("link", { name: "hi@siglata.com" });
    emailContact.focus();
    await expect(emailContact).toHaveFocus();
    await expect(emailContact).toHaveAttribute("href", "mailto:hi@siglata.com");
  },
};
