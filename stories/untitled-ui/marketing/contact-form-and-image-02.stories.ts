/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API, and the authenticated field contract includes a placeholder. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactFormAndImage02 } from "../../../../../packages/ui/src/marketing/contact-form-and-image-02.ts";
import type { ContactFormAndImage02Errors } from "../../../../../packages/ui/src/marketing/contact-form-and-image-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Country = S.Struct({ code: S.String, phoneMask: S.String });
const Service = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  contactEmail: S.String,
  countries: S.Array(Country),
  descriptionPrefix: S.String,
  desktopSubmitLabel: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
  mobileSubmitLabel: S.String,
  privacyHref: S.String,
  services: S.Array(Service),
});
const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryPhone: S.String,
  selectedServices: S.Array(S.String),
});
const Errors = S.Struct({
  email: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  message: S.optional(S.String),
});
const Model = S.Struct({
  ...Args.fields,
  errors: Errors,
  submitted: S.Boolean,
  values: Values,
});
type Model = typeof Model.Type;
type Field = "email" | "firstName" | "lastName" | "message" | "phone";
type Message =
  | Readonly<{ _tag: "Country"; code: string }>
  | Readonly<{ _tag: "Field"; field: Field; value: string }>
  | Readonly<{ _tag: "Privacy" }>
  | Readonly<{ _tag: "Service"; id: string }>
  | Readonly<{ _tag: "Submit" }>;

const emptyValues = {
  email: "",
  firstName: "",
  lastName: "",
  message: "",
  phone: "",
  privacyAccepted: false,
  selectedCountryPhone: "US",
  selectedServices: [],
} as const;

const fieldUpdate = (model: Model, field: Field, fieldValue: string): Model => {
  const errors = { ...model.errors };
  if (field === "firstName") {
    errors.firstName = undefined;
  } else if (field === "lastName") {
    errors.lastName = undefined;
  } else if (field === "email") {
    errors.email = undefined;
  } else if (field === "message") {
    errors.message = undefined;
  }
  return { ...model, errors, values: { ...model.values, [field]: fieldValue } };
};

const submissionErrors = (model: Model): ContactFormAndImage02Errors => ({
  ...(model.values.email.includes("@") ? {} : { email: "Enter a valid email address." }),
  ...(model.values.firstName.trim() === "" ? { firstName: "Enter your first name." } : {}),
  ...(model.values.lastName.trim() === "" ? { lastName: "Enter your last name." } : {}),
  ...(model.values.message.trim() === "" ? { message: "Enter a message." } : {}),
});

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Field") {
    return fieldUpdate(model, message.field, message.value);
  }
  if (message._tag === "Country") {
    return { ...model, values: { ...model.values, selectedCountryPhone: message.code } };
  }
  if (message._tag === "Privacy") {
    return {
      ...model,
      values: { ...model.values, privacyAccepted: !model.values.privacyAccepted },
    };
  }
  if (message._tag === "Service") {
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
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    errors: {},
    submitted: false,
    values: emptyValues,
  }),
  update,
  view: (model: Model, h: Parameters<typeof contactFormAndImage02<Message>>[1]) =>
    contactFormAndImage02(
      {
        ...model,
        desktopSubmitLabel: model.submitted ? "Message sent" : model.desktopSubmitLabel,
        mobileSubmitLabel: model.submitted ? "Message sent" : model.mobileSubmitLabel,
        onCountryChange: (code): Message => ({ _tag: "Country", code }),
        onFieldInput: (field, value): Message => ({ _tag: "Field", field, value }),
        onPrivacyToggle: { _tag: "Privacy" },
        onServiceToggle: (id): Message => ({ _tag: "Service", id }),
        onSubmit: { _tag: "Submit" },
      },
      h,
    ),
} as const;

const args = {
  contactEmail: "hi@siglata.com",
  countries: [
    { code: "US", phoneMask: "+1 (###) ###-####" },
    { code: "BR", phoneMask: "+55 (##) 9####-####" },
    { code: "GB", phoneMask: "+44-####-######" },
    { code: "AU", phoneMask: "+61-#-####-####" },
  ],
  descriptionPrefix: "You can reach us anytime via",
  desktopSubmitLabel: "Get started",
  heading: "Let's level up your brand, together",
  imageAlt: "Split image",
  imageSrc: "https://www.untitledui.com/marketing/split-image-01.webp",
  mobileSubmitLabel: "Send message",
  privacyHref: "#privacy",
  services: [
    { id: "design", label: "Website design" },
    { id: "content", label: "Content creation" },
    { id: "ux", label: "UX design" },
    { id: "consulting", label: "Strategy & consulting" },
    { id: "research", label: "User research" },
    { id: "other", label: "Other" },
  ],
} as const;

export default {
  ...componentMeta("contact-form-and-image-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Form And Image 02",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      errors: {
        email: "Enter a valid email address.",
        firstName: "Enter your first name.",
        lastName: "Enter your last name.",
        message: "Enter a message.",
      },
      submitted: false,
      values: emptyValues,
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof contactFormAndImage02<Message>>[1]) =>
      h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    const submit = canvas.getByRole("button", { name: /Get started|Send message/u });
    await userEvent.click(submit);
    await expect(await canvas.findByText("Enter your first name.")).toHaveAttribute(
      "role",
      "alert",
    );
    await expect(canvas.getByText("Enter a valid email address.")).toHaveAttribute("role", "alert");
    await userEvent.type(canvas.getByRole("textbox", { name: /First name/u }), "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: /Last name/u }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: /Email/u }), "olivia@example.com");
    await userEvent.type(canvas.getByRole("textbox", { name: /Message/u }), "Let's talk.");
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Country code" }), "BR");
    await expect(canvas.getByRole("textbox", { name: /Phone number/u })).toHaveAttribute(
      "placeholder",
      "+55 (00) 90000-0000",
    );
    await userEvent.click(submit);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Message sent" })).toBeInTheDocument(),
    );
  },
};
