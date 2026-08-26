/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-option-over-null -- HTML placeholder text and optional upstream props are part of the component contract. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type FieldSize = "sm" | "md" | "lg";

interface FieldCopy {
  readonly hideRequiredIndicator?: boolean;
  readonly hint?: string;
  readonly isInvalid?: boolean;
  readonly isRequired?: boolean;
  readonly label?: string;
  readonly requiredMarkCompact?: boolean;
  readonly tooltip?: string;
}

export interface InputProps<Message> extends FieldCopy {
  readonly autocomplete?: string;
  readonly inputClassName?: string;
  readonly isDisabled?: boolean;
  readonly isPasswordVisible?: boolean;
  readonly isReadOnly?: boolean;
  readonly keyboardShortcut?: string;
  readonly leadingIcon?: boolean;
  readonly leadingIconElement?: Html;
  readonly maxLength?: number;
  readonly name?: string;
  readonly onBlur?: NoInfer<Message>;
  readonly onFocus?: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onTogglePassword?: NoInfer<Message>;
  readonly visibilityIconSize?: "sm" | "md";
  readonly placeholder?: string;
  readonly size?: FieldSize;
  readonly type?: "text" | "email" | "password" | "search" | "tel" | "url";
  readonly value: string;
}

export interface TextareaProps<Message> extends FieldCopy {
  readonly textAreaClassName?: string;
  readonly isDisabled?: boolean;
  readonly name?: string;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly size?: "sm" | "md";
  readonly value: string;
}

const fieldId = (kind: string, name: string | undefined, label: string | undefined): string =>
  `${kind}-${(name ?? label ?? "field").toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`;

const helpIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.25"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
        ),
      ]),
    ],
  );

const invalidIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 shrink-0 text-text-error-primary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.25"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
        ),
      ]),
    ],
  );

const leadingIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.circle([h.Cx("9"), h.Cy("9"), h.R("5.75"), h.Stroke("currentColor"), h.StrokeWidth("1.5")]),
      h.path([
        h.D("m13.25 13.25 3.5 3.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const inputLeading = <Message>(
  props: InputProps<Message>,
  h: HtmlBuilder<Message>,
): readonly Html[] => {
  if (props.leadingIconElement !== undefined) {
    return [props.leadingIconElement];
  }
  if (props.leadingIcon === true) {
    return [leadingIcon(h)];
  }
  return [];
};

const eyeIcon = <Message>(visible: boolean, size: "sm" | "md", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(size === "sm" ? "size-4" : "size-5"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2.25"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          visible
            ? "M10.743 5.092C11.149 5.032 11.569 5 12 5c5.105 0 8.455 4.505 9.58 6.287.137.215.205.323.243.49a1.16 1.16 0 0 1 0 .447c-.038.166-.107.274-.244.492-.3.474-.757 1.141-1.363 1.865M6.724 6.715c-2.162 1.467-3.63 3.504-4.303 4.57-.137.217-.205.325-.243.492a1.173 1.173 0 0 0 0 .446c.038.167.106.274.242.49C3.546 14.495 6.895 19 12 19c2.059 0 3.832-.732 5.289-1.723M3 3l18 18M9.88 9.879a3 3 0 1 0 4.243 4.243"
            : "M2.42 12.713c-.136-.215-.204-.323-.242-.49a1.173 1.173 0 0 1 0-.446c.038-.167.106-.274.242-.49C3.546 9.505 6.895 5 12 5s8.455 4.505 9.58 6.287c.137.215.205.323.243.49.029.125.029.322 0 .446-.038.167-.106.274-.242.49C20.455 14.495 17.105 19 12 19c-5.106 0-8.455-4.505-9.58-6.287Z",
        ),
      ]),
      ...(visible ? [] : [h.path([h.D("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z")])]),
    ],
  );

const fieldLabel = <Message>(
  copy: FieldCopy,
  id: string,
  showTooltip: boolean,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  copy.label === undefined
    ? []
    : [
        h.span(
          [
            h.Class(
              `flex items-center text-sm font-medium text-text-secondary ${copy.requiredMarkCompact === true ? "gap-0.5" : "gap-1.5"}`,
            ),
          ],
          [
            h.label(
              [h.For(id)],
              [
                copy.label,
                ...(copy.isRequired === true &&
                copy.hideRequiredIndicator !== true &&
                copy.requiredMarkCompact !== true
                  ? [h.span([h.Class("text-text-brand-tertiary")], [" *"])]
                  : []),
              ],
            ),
            ...(copy.isRequired === true &&
            copy.hideRequiredIndicator !== true &&
            copy.requiredMarkCompact === true
              ? [h.span([h.Class("text-text-brand-tertiary")], ["*"])]
              : []),
            ...(copy.tooltip === undefined || !showTooltip
              ? []
              : [
                  h.span(
                    [
                      h.Class("text-fg-quaternary"),
                      h.Title(copy.tooltip),
                      h.Tabindex(0),
                      h.AriaLabel(copy.tooltip),
                    ],
                    [helpIcon(h)],
                  ),
                ]),
          ],
        ),
      ];

const fieldHint = <Message>(
  copy: FieldCopy,
  id: string,
  h: HtmlBuilder<Message>,
): readonly Html[] =>
  copy.hint === undefined
    ? []
    : [
        h.span(
          [
            h.Class(
              `text-sm ${copy.isInvalid === true ? "text-text-error-primary" : "text-text-tertiary"}`,
            ),
            h.Id(`${id}-hint`),
            ...(copy.isInvalid === true ? [h.Role("alert")] : []),
          ],
          [copy.hint],
        ),
      ];

export const input = <Message>(props: InputProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const id = fieldId("input", props.name, props.label);
  const isPassword = props.type === "password";
  const passwordType =
    isPassword && props.isPasswordVisible === true ? "text" : (props.type ?? "text");
  const toggleMessage = props.onTogglePassword;
  const sizeClasses: Record<FieldSize, string> = {
    lg: "px-3.5 py-2.5 text-md",
    md: "px-3 py-2 text-md",
    sm: "px-3 py-2 text-sm",
  };
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      ...fieldLabel(props, id, false, h),
      h.div(
        [
          h.Class(
            `relative flex w-full items-center gap-2 rounded-lg bg-bg-primary shadow-xs ring-1 ring-inset transition duration-100 ease-linear focus-within:ring-2 ${props.isInvalid === true ? "ring-border-error-subtle focus-within:ring-border-error-subtle" : "ring-border-primary focus-within:ring-border-brand"} ${sizeClasses[size]} ${props.inputClassName ?? ""} ${props.isDisabled === true ? "cursor-not-allowed bg-bg-disabled-subtle opacity-50" : ""}`,
          ),
        ],
        [
          ...inputLeading(props, h),
          h.input([
            h.Class(
              "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed",
            ),
            h.Id(id),
            h.Type(passwordType),
            h.Value(props.value),
            ...(props.maxLength === undefined ? [] : [h.Maxlength(props.maxLength)]),
            h.Placeholder(props.placeholder ?? ""),
            h.Disabled(props.isDisabled === true),
            h.Readonly(props.isReadOnly === true),
            h.Required(props.isRequired === true),
            h.AriaInvalid(props.isInvalid === true),
            ...(props.hint === undefined ? [] : [h.AriaDescribedBy(`${id}-hint`)]),
            ...(props.name === undefined ? [] : [h.Name(props.name)]),
            ...(props.autocomplete === undefined ? [] : [h.Autocomplete(props.autocomplete)]),
            h.OnInput(props.onInput),
            ...(props.onFocus === undefined ? [] : [h.OnFocus(props.onFocus)]),
            ...(props.onBlur === undefined ? [] : [h.OnBlur(props.onBlur)]),
          ]),
          ...(props.keyboardShortcut === undefined
            ? []
            : [
                h.kbd(
                  [
                    h.Class(
                      "rounded border border-border-primary px-1.5 py-0.5 font-mono text-xs text-text-tertiary",
                    ),
                    h.AriaHidden(true),
                  ],
                  [props.keyboardShortcut],
                ),
              ]),
          ...(props.isInvalid === true && !isPassword ? [invalidIcon(h)] : []),
          ...(props.tooltip === undefined || isPassword
            ? []
            : [
                h.button(
                  [
                    h.AriaLabel(props.tooltip),
                    h.Class(
                      "ml-auto shrink-0 cursor-pointer rounded text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2",
                    ),
                    h.Title(props.tooltip),
                    h.Type("button"),
                  ],
                  [helpIcon(h)],
                ),
              ]),
          ...(isPassword
            ? [
                h.button(
                  [
                    h.Class(
                      "rounded text-fg-quaternary outline-focus-ring hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2",
                    ),
                    h.Type("button"),
                    h.AriaLabel("Toggle password visibility"),
                    ...(toggleMessage === undefined ? [] : [h.OnClick(toggleMessage)]),
                  ],
                  [eyeIcon(props.isPasswordVisible === true, props.visibilityIconSize ?? "md", h)],
                ),
              ]
            : []),
        ],
      ),
      ...fieldHint(props, id, h),
    ],
  );
};

export const textarea = <Message>(props: TextareaProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const id = fieldId("textarea", props.name, props.label);
  return h.div(
    [h.Class("flex w-full flex-col gap-1.5")],
    [
      ...fieldLabel(props, id, true, h),
      h.textarea([
        h.Class(
          `w-full resize-y rounded-lg bg-bg-primary text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none transition duration-100 ease-linear placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand disabled:cursor-not-allowed disabled:bg-bg-disabled-subtle disabled:opacity-50 ${size === "md" ? "px-3.5 py-3 text-md" : "p-3 text-sm"} ${props.isInvalid === true ? "ring-border-error-subtle focus:ring-border-error-subtle" : ""} ${props.textAreaClassName ?? ""}`,
        ),
        h.Id(id),
        h.Value(props.value),
        ...(props.rows === undefined ? [] : [h.Rows(props.rows)]),
        h.Placeholder(props.placeholder ?? ""),
        h.Disabled(props.isDisabled === true),
        h.Required(props.isRequired === true),
        h.AriaInvalid(props.isInvalid === true),
        ...(props.hint === undefined ? [] : [h.AriaDescribedBy(`${id}-hint`)]),
        ...(props.name === undefined ? [] : [h.Name(props.name)]),
        h.OnInput(props.onInput),
      ]),
      ...fieldHint(props, id, h),
    ],
  );
};
