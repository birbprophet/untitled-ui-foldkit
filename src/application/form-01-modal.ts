/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated responsive two-step form anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { combobox } from "../base/combobox.ts";
import { input, textarea } from "../base/fields.ts";
import { select } from "../base/select.ts";
import type { SelectItem } from "../base/select.ts";

export interface Form01ModalValues {
  readonly companyId: string;
  readonly companyQuery: string;
  readonly description: string;
  readonly employmentId: string;
  readonly locationId: string;
  readonly locationQuery: string;
  readonly secondTitle: string;
  readonly title: string;
  readonly website: string;
}

export type Form01ModalField = keyof Form01ModalValues;

export interface Form01ModalProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly isCompanyOpen: boolean;
  readonly companyFocusedId?: string;
  readonly isLocationOpen: boolean;
  readonly locationFocusedId?: string;
  readonly onAddExperience: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldInput: (field: Form01ModalField, value: string) => NoInfer<Message>;
  readonly onNext: NoInfer<Message>;
  readonly onPrevious: NoInfer<Message>;
  readonly onSaveDraft: NoInfer<Message>;
  readonly onSelect: (
    field: "companyId" | "employmentId" | "locationId",
    id: string,
  ) => NoInfer<Message>;
  readonly onSelectFocus: (
    field: "companyId" | "employmentId" | "locationId",
    id: string,
  ) => NoInfer<Message>;
  readonly onSelectOpenChanged: (
    field: "companyId" | "employmentId" | "locationId",
    isOpen: boolean,
  ) => NoInfer<Message>;
  readonly selectedStep: 0 | 1;
  readonly values: Form01ModalValues;
}

const companies = [
  ["@phoenix", "Phoenix Baker", false],
  ["@olivia", "Olivia Ryhe", false],
  ["@lana", "Lana Steiner", true],
  ["@demi", "Demi Wilkinson", false],
  ["@candice", "Candice Wu", false],
  ["@natali", "Natali Craig", false],
  ["@carolineschultz", "Caroline Schultz", false],
  ["@drew", "Drew Cano", false],
  ["@evelyn", "Evelyn Harrison", false],
  ["@kari", "Kari Rasmussen", false],
] as const;

const employmentTypes = [
  ["fulltime", "Full time"],
  ["parttime", "Part time"],
] as const;

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const flagIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("z-1 size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M5 22V4m0 0c4-3 7 3 14 0v10c-7 3-10-3-14 0"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const saveIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(
          "M15.833 17.5H4.167A1.667 1.667 0 0 1 2.5 15.833V4.167A1.667 1.667 0 0 1 4.167 2.5h8.75l4.583 4.583v8.75a1.667 1.667 0 0 1-1.667 1.667ZM6.667 2.5v5h6.666v-5M6.667 17.5v-5h6.666v5",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const arrowLeftIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("M15.833 10H4.167m5-5.833L3.333 10l5.834 5.833"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const peopleItems = <Message>(
  field: "companyId" | "locationId",
  props: Form01ModalProps<Message>,
): readonly SelectItem<Message>[] =>
  companies.map(([id, label, disabled]) => ({
    id,
    isDisabled: disabled,
    label,
    onFocus: props.onSelectFocus(field, id),
    onSelect: props.onSelect(field, id),
  }));

const employmentItems = <Message>(
  props: Form01ModalProps<Message>,
): readonly SelectItem<Message>[] =>
  employmentTypes.map(([id, label]) => ({
    id,
    label,
    onFocus: props.onSelectFocus("employmentId", id),
    onSelect: props.onSelect("employmentId", id),
  }));

const websiteField = <Message>(props: Form01ModalProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      h.label(
        [h.Class("text-sm font-medium text-text-secondary"), h.For(`${props.id}-website`)],
        ["Website", h.span([h.Class("text-text-brand-tertiary")], ["*"])],
      ),
      h.div(
        [
          h.Class(
            "flex w-full items-center overflow-hidden rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          h.span(
            [h.Class("border-r border-border-primary px-[11px] py-2 text-md text-text-tertiary")],
            ["https://"],
          ),
          h.input([
            h.Class(
              "min-w-0 flex-1 bg-transparent px-3 py-2 text-md text-text-primary outline-none placeholder:text-text-placeholder",
            ),
            h.Id(`${props.id}-website`),
            h.OnInput((value) => props.onFieldInput("website", value)),
            h.Placeholder("www.example.com"),
            h.Type("url"),
            h.Value(props.values.website),
          ]),
        ],
      ),
    ],
  );

const firstStep = <Message>(props: Form01ModalProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        `${props.selectedStep === 0 ? "flex" : "hidden"} w-full grid-cols-1 flex-col items-start justify-start gap-4 px-4 sm:grid sm:grid-cols-[280px_1fr] sm:px-6`,
      ),
    ],
    [
      h.div(
        [h.Class("w-full sm:col-span-2")],
        [
          input(
            {
              isRequired: true,
              label: "Title",
              name: `${props.id}-title`,
              onInput: (value) => props.onFieldInput("title", value),
              placeholder: "What is your title?",
              value: props.values.title,
            },
            h,
          ),
        ],
      ),
      combobox(
        {
          focusedId: props.companyFocusedId,
          inputValue: props.values.companyQuery,
          isOpen: props.isCompanyOpen,
          isRequired: true,
          items: peopleItems("companyId", props),
          label: "Company",
          name: `${props.id}-company`,
          onClose: props.onSelectOpenChanged("companyId", false),
          onInput: (value) => props.onFieldInput("companyQuery", value),
          onOpen: props.onSelectOpenChanged("companyId", true),
          placeholder: "Search for company",
          selectedId: props.values.companyId,
          shortcut: false,
        },
        h,
      ),
      websiteField(props, h),
      combobox(
        {
          focusedId: props.locationFocusedId,
          inputValue: props.values.locationQuery,
          isOpen: props.isLocationOpen,
          isRequired: true,
          items: peopleItems("locationId", props),
          label: "Location",
          name: `${props.id}-location`,
          onClose: props.onSelectOpenChanged("locationId", false),
          onInput: (value) => props.onFieldInput("locationQuery", value),
          onOpen: props.onSelectOpenChanged("locationId", true),
          placeholder: "Search for city",
          selectedId: props.values.locationId,
        },
        h,
      ),
      h.div(
        [h.Class("hidden w-32 sm:block")],
        [
          select(
            {
              isRequired: true,
              items: employmentItems(props),
              label: "Employment",
              name: `${props.id}-employment-desktop`,
              onOpenChanged: (open) => props.onSelectOpenChanged("employmentId", open),
              selectedId: props.values.employmentId,
            },
            h,
          ),
        ],
      ),
      h.div(
        [h.Class("col-span-2 hidden w-full sm:block")],
        [
          input(
            {
              isRequired: true,
              label: "Title",
              name: `${props.id}-second-title`,
              onInput: (value) => props.onFieldInput("secondTitle", value),
              placeholder: "What is your title?",
              value: props.values.secondTitle,
            },
            h,
          ),
        ],
      ),
      h.div(
        [h.Class("col-span-2 hidden h-36 w-full flex-col sm:flex")],
        [
          textarea(
            {
              isRequired: true,
              label: "Description",
              name: `${props.id}-description-desktop`,
              onInput: (value) => props.onFieldInput("description", value),
              placeholder:
                "e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints.",
              requiredMarkCompact: true,
              rows: 4,
              tooltip: "This will be public",
              value: props.values.description,
            },
            h,
          ),
        ],
      ),
    ],
  );

const secondStep = <Message>(props: Form01ModalProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        `${props.selectedStep === 1 ? "flex" : "hidden"} w-full flex-col gap-4 px-4 sm:hidden sm:px-6`,
      ),
    ],
    [
      select(
        {
          isRequired: true,
          items: employmentItems(props),
          label: "Employment",
          name: `${props.id}-employment-mobile`,
          onOpenChanged: (open) => props.onSelectOpenChanged("employmentId", open),
          selectedId: props.values.employmentId,
        },
        h,
      ),
      h.div(
        [h.Class("flex min-h-40 w-full flex-col")],
        [
          textarea(
            {
              isRequired: true,
              label: "Description",
              name: `${props.id}-description-mobile`,
              onInput: (value) => props.onFieldInput("description", value),
              placeholder:
                "e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints.",
              requiredMarkCompact: true,
              rows: 6,
              tooltip: "This will be public",
              value: props.values.description,
            },
            h,
          ),
        ],
      ),
    ],
  );

export const form01Modal = <Message>(
  props: Form01ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title-heading`;
  const descriptionId = `${props.id}-description`;
  const isLastStep = props.selectedStep === 1;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:px-8 sm:py-8",
              ),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-64px)] w-[calc(100%-32px)] max-w-152 overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 align-middle shadow-xl outline-hidden sm:m-auto sm:w-[632.3125px] sm:max-w-[calc(100%-64px)] sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative hidden size-10 w-max items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset sm:flex",
                          ),
                        ],
                        [flagIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex flex-col gap-0.5")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Add experience"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            ["Share where you've worked on your profile."],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div(
                    [h.Class("w-full overflow-hidden")],
                    [firstStep(props, h), secondStep(props, h)],
                  ),
                  h.nav(
                    [
                      h.AriaLabel("Form step"),
                      h.Class("mt-5 flex items-center justify-center gap-2 sm:hidden"),
                    ],
                    [0, 1].map((step) =>
                      h.span([
                        h.AriaLabel(`Step ${String(step + 1)}`),
                        h.Class(
                          `size-2.5 rounded-full ${step === props.selectedStep ? "bg-bg-brand-solid" : "bg-bg-quaternary"}`,
                        ),
                      ]),
                    ),
                  ),
                  h.footer(
                    [
                      h.Class(
                        "z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 [&>div>button]:w-full sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6",
                      ),
                    ],
                    [
                      h.div(
                        [h.Class("sm:hidden")],
                        [
                          button(
                            {
                              color: "secondary",
                              iconLeadingElement: isLastStep ? arrowLeftIcon(h) : saveIcon(h),
                              label: isLastStep ? "Back" : "Save as draft",
                              onPress: isLastStep ? props.onPrevious : props.onSaveDraft,
                              size: "lg",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("sm:hidden")],
                        [
                          button(
                            {
                              color: "primary",
                              label: isLastStep ? "Add experience" : "Next",
                              onPress: isLastStep ? props.onAddExperience : props.onNext,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("hidden sm:block")],
                        [
                          button(
                            {
                              color: "secondary",
                              iconLeadingElement: saveIcon(h),
                              label: "Save as draft",
                              onPress: props.onSaveDraft,
                              size: "lg",
                            },
                            h,
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("hidden sm:block")],
                        [
                          button(
                            {
                              color: "primary",
                              label: "Add experience",
                              onPress: props.onAddExperience,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
