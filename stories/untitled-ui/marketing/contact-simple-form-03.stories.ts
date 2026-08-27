/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based and authenticated fields include placeholders. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactSimpleForm03,
  contactSimpleForm03Countries,
  contactSimpleForm03Services,
} from "../../../src/marketing/contact-simple-form-03.ts";
import type {
  ContactSimpleForm03Errors,
  ContactSimpleForm03Field,
} from "../../../src/marketing/contact-simple-form-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  contactEmail: S.String,
  countries: S.Array(S.Struct({ code: S.String, phoneMask: S.String })),
  countryCodeLabel: S.String,
  descriptionPrefix: S.String,
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
  services: S.Array(S.Struct({ id: S.String, label: S.String })),
  servicesLabel: S.String,
  submitLabel: S.String,
});
type Args = typeof Args.Type;
const Errors = S.Struct({
  email: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  message: S.optional(S.String),
  phone: S.optional(S.String),
});
const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  selectedCountryPhone: S.String,
  selectedServices: S.Array(S.String),
});
const Model = S.Struct({ ...Args.fields, errors: Errors, submitted: S.Boolean, values: Values });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "CountryChanged"; code: string }>
  | Readonly<{ _tag: "FieldInput"; field: ContactSimpleForm03Field; value: string }>
  | Readonly<{ _tag: "ServiceToggled"; id: string }>
  | Readonly<{ _tag: "Submitted" }>;

const emptyValues = {
  email: "",
  firstName: "",
  lastName: "",
  message: "",
  phone: "",
  selectedCountryPhone: "US",
  selectedServices: [],
} as const;

const submissionErrors = (model: Model): ContactSimpleForm03Errors => ({
  ...(model.values.email.includes("@") ? {} : { email: "Enter a valid email address." }),
  ...(model.values.firstName.trim() === "" ? { firstName: "Enter your first name." } : {}),
  ...(model.values.lastName.trim() === "" ? { lastName: "Enter your last name." } : {}),
  ...(model.values.message.trim() === "" ? { message: "Enter a message." } : {}),
});

const definition = {
  Args,
  Model,
  init: (storyArgs: Args): Model => ({
    ...storyArgs,
    errors: {},
    submitted: false,
    values: emptyValues,
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "CountryChanged") {
      return {
        ...model,
        values: { ...model.values, selectedCountryPhone: message.code },
      };
    }
    if (message._tag === "FieldInput") {
      return { ...model, values: { ...model.values, [message.field]: message.value } };
    }
    if (message._tag === "ServiceToggled") {
      const selected = model.values.selectedServices.includes(message.id);
      return {
        ...model,
        values: {
          ...model.values,
          selectedServices: selected
            ? model.values.selectedServices.filter((id) => id !== message.id)
            : [...model.values.selectedServices, message.id],
        },
      };
    }
    const errors = submissionErrors(model);
    const submitted =
      errors.email === undefined &&
      errors.firstName === undefined &&
      errors.lastName === undefined &&
      errors.message === undefined;
    return { ...model, errors, submitted };
  },
  view: (model: Model, h: Parameters<typeof contactSimpleForm03<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactSimpleForm03(
          {
            ...model,
            onCountryChange: (code): Message => ({ _tag: "CountryChanged", code }),
            onFieldInput: (field, value): Message => ({ _tag: "FieldInput", field, value }),
            onServiceToggle: (id): Message => ({ _tag: "ServiceToggled", id }),
            onSubmit: { _tag: "Submitted" },
            submitLabel: model.submitted ? "Message sent" : model.submitLabel,
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  contactEmail: "hi@siglata.com",
  countries: [...contactSimpleForm03Countries],
  countryCodeLabel: "Country code",
  descriptionPrefix: "You can reach us anytime via",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Let's level up your brand, together",
  imageAlt: "Woman artist",
  imageSrc: "https://www.untitledui.com/marketing/woman-artist.webp",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  phoneLabel: "Phone number",
  services: [...contactSimpleForm03Services],
  servicesLabel: "Services",
  submitLabel: "Get started",
} satisfies Args;

export default {
  ...componentMeta("contact-simple-form-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Form 03",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: Args): Model => ({
      ...definition.init(storyArgs),
      errors: {
        email: "Enter a valid email address.",
        firstName: "Enter your first name.",
        lastName: "Enter your last name.",
        message: "Enter a message.",
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
    await expect(await canvas.findByRole("img", { name: "Woman artist" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "hi@siglata.com" })).toHaveAttribute(
      "href",
      "mailto:hi@siglata.com",
    );

    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await expect(await canvas.findByText("Enter your first name.")).toHaveAttribute(
      "role",
      "alert",
    );
    await userEvent.type(canvas.getByRole("textbox", { name: /First name/u }), "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: /Last name/u }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Email/u }), "olivia@example.com");
    await userEvent.type(
      canvas.getByRole("textbox", { name: /^Message/u }),
      "Let's work together.",
    );
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Country code" }), "BR");
    await expect(canvas.getByRole("textbox", { name: "Phone number" })).toHaveAttribute(
      "placeholder",
      "+55 (00) 90000-0000",
    );
    await userEvent.click(canvas.getByRole("checkbox", { name: "Website design" }));
    await expect(canvas.getByRole("checkbox", { name: "Website design" })).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Message sent" })).toBeVisible());
  },
};
