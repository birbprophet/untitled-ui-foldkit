/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native slideout preserves the authenticated labels-menu anatomy and fixture. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { combobox } from "../base/combobox.ts";

export type LabelsMenuLocale = "en-US" | "pt-BR";
export type LabelsMenuLabelId =
  | "compliance"
  | "customer-success"
  | "design"
  | "finance"
  | "human-resources"
  | "management"
  | "marketing"
  | "operations"
  | "product"
  | "product-design"
  | "sales";

export interface LabelsMenuProps<Message> {
  readonly focusedId?: LabelsMenuLabelId;
  readonly id: string;
  readonly inputValue: string;
  readonly isOpen: boolean;
  readonly isPickerOpen: boolean;
  readonly locale: LabelsMenuLocale;
  readonly onAddLabel: NoInfer<Message>;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onClosePicker: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFocusOption: (id: LabelsMenuLabelId) => NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onManageLabels: NoInfer<Message>;
  readonly onOpenPicker: NoInfer<Message>;
  readonly onSearchSelect: (id: LabelsMenuLabelId) => NoInfer<Message>;
  readonly onToggleLabel: (id: LabelsMenuLabelId) => NoInfer<Message>;
  readonly searchSelectedId?: LabelsMenuLabelId;
  readonly selectedIds: readonly LabelsMenuLabelId[];
}

const copy = {
  "en-US": {
    add: "Add label",
    apply: "Apply",
    cancel: "Cancel",
    close: "Close",
    custom: "Custom labels",
    description: "Labels help organize projects.",
    dialog: "Slideout menu",
    labels: "Labels",
    manage: "Manage labels",
    placeholder: "Search for label",
    title: "Add labels to project",
  },
  "pt-BR": {
    add: "Adicionar rótulo",
    apply: "Aplicar",
    cancel: "Cancelar",
    close: "Fechar",
    custom: "Rótulos personalizados",
    description: "Os rótulos ajudam a organizar projetos.",
    dialog: "Menu lateral",
    labels: "Rótulos",
    manage: "Gerenciar rótulos",
    placeholder: "Pesquisar rótulo",
    title: "Adicionar rótulos ao projeto",
  },
} as const;

const labels: readonly {
  readonly color: BadgeColor;
  readonly id: LabelsMenuLabelId;
  readonly names: Readonly<Record<LabelsMenuLocale, string>>;
}[] = [
  { color: "brand", id: "design", names: { "en-US": "Design", "pt-BR": "Design" } },
  { color: "blue", id: "product", names: { "en-US": "Product", "pt-BR": "Produto" } },
  { color: "indigo", id: "marketing", names: { "en-US": "Marketing", "pt-BR": "Marketing" } },
  { color: "pink", id: "management", names: { "en-US": "Management", "pt-BR": "Gestão" } },
  { color: "success", id: "sales", names: { "en-US": "Sales", "pt-BR": "Vendas" } },
  {
    color: "slate",
    id: "product-design",
    names: { "en-US": "Product design", "pt-BR": "Design de produto" },
  },
  { color: "sky", id: "operations", names: { "en-US": "Operations", "pt-BR": "Operações" } },
  {
    color: "purple",
    id: "customer-success",
    names: { "en-US": "Customer Success", "pt-BR": "Sucesso do cliente" },
  },
  {
    color: "blue",
    id: "human-resources",
    names: { "en-US": "Human Resources", "pt-BR": "Recursos Humanos" },
  },
  {
    color: "orange",
    id: "compliance",
    names: { "en-US": "Compliance", "pt-BR": "Conformidade" },
  },
  { color: "gray", id: "finance", names: { "en-US": "Finance", "pt-BR": "Finanças" } },
] as const;

const searchableIds: readonly LabelsMenuLabelId[] = [
  "design",
  "product",
  "marketing",
  "management",
  "sales",
  "operations",
];

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5", h);
const layersIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m7 12-5 2.5 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 14.5 17 12M2 9.5l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.111L22 9.5l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 9.5Z",
    "z-1 size-5",
    h,
  );
const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M12 5v14M5 12h14", "size-5", h);

const checkIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3 text-fg-white"), h.Fill("none"), h.ViewBox("0 0 14 14")],
    [
      h.path([
        h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const labelById = (id: LabelsMenuLabelId) => labels.find((label) => label.id === id);

const labelCheckbox = <Message>(
  props: LabelsMenuProps<Message>,
  label: (typeof labels)[number],
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.selectedIds.includes(label.id);
  const name = label.names[props.locale];
  return h.label(
    [h.Class("flex cursor-pointer items-center gap-2")],
    [
      h.input([
        h.AriaLabel(name),
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.OnChange(() => props.onToggleLabel(label.id)),
        h.Type("checkbox"),
        h.Value(label.id),
      ]),
      h.span(
        [
          h.Class(
            `relative flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        selected ? [checkIcon(h)] : [],
      ),
      badge(
        {
          color: label.color,
          label: name,
          size: "md",
          type: "pill-color",
        },
        h,
      ),
    ],
  );
};

export const labelsMenu = <Message>(
  props: LabelsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  const searchable = searchableIds.flatMap((id) => {
    const label = labelById(id);
    return label === undefined ? [] : [label];
  });
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("labels-menu-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabel(text.dialog),
                  h.Attribute("dir", "ltr"),
                  h.Class(
                    "fixed inset-y-0 right-0 left-auto my-0 mr-0 ml-auto h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-transparent p-0 shadow-xl outline-hidden md:w-[calc(100%-2.5rem)]",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary ring-1 ring-border-secondary-alt outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [layersIcon(h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [text.title],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [text.description],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("labels-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [closeIcon(h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("contents [&_input]:text-text-primary")],
                            [
                              combobox(
                                {
                                  ariaLabel: text.labels,
                                  focusedId: props.focusedId,
                                  inputValue: props.inputValue,
                                  isOpen: props.isPickerOpen,
                                  items: searchable.map((label) => ({
                                    id: label.id,
                                    label: label.names[props.locale],
                                    onFocus: props.onFocusOption(label.id),
                                    onSelect: props.onSearchSelect(label.id),
                                  })),
                                  name: `${props.id}-labels`,
                                  onClose: props.onClosePicker,
                                  onInput: props.onInput,
                                  onOpen: props.onOpenPicker,
                                  placeholder: text.placeholder,
                                  selectedId: props.searchSelectedId,
                                  shortcut: true,
                                  size: "md",
                                },
                                h,
                              ),
                            ],
                          ),
                          h.div(
                            [
                              h.AriaLabel(text.custom),
                              h.Class("flex flex-col gap-4"),
                              h.Role("group"),
                            ],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [text.custom],
                              ),
                              h.section(
                                [h.Class("flex flex-col items-start gap-3 pl-2")],
                                [
                                  ...labels.map((label) => labelCheckbox(props, label, h)),
                                  button(
                                    {
                                      color: "link-color",
                                      iconLeadingElement: plusIcon(h),
                                      label: text.add,
                                      onPress: props.onAddLabel,
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
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("mr-auto")],
                            [
                              button(
                                {
                                  color: "link-color",
                                  label: text.manage,
                                  onPress: props.onManageLabels,
                                  size: "sm",
                                },
                                h,
                              ),
                            ],
                          ),
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.apply,
                              onPress: props.onApply,
                              size: "sm",
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
