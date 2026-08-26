/* oxlint-disable effect/noSpread, effect/noTernary -- Optional native form attributes stay explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FormProps<Message> {
  readonly action?: string;
  readonly children: readonly Html[];
  readonly className?: string;
  readonly id?: string;
  readonly method?: "get" | "post";
  readonly noValidate?: boolean;
  readonly onReset?: NoInfer<Message>;
  readonly onSubmit?: NoInfer<Message>;
  readonly validationBehavior?: "aria" | "native";
}

/** The FoldKit equivalent of Untitled UI's transparent React Aria Form wrapper. */
export const form = <Message>(props: FormProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.form(
    [
      ...(props.action === undefined ? [] : [h.Action(props.action)]),
      ...(props.className === undefined ? [] : [h.Class(props.className)]),
      ...(props.id === undefined ? [] : [h.Id(props.id)]),
      ...(props.method === undefined ? [] : [h.Method(props.method)]),
      ...(props.noValidate === true || props.validationBehavior === "aria"
        ? [h.Attribute("novalidate", "")]
        : []),
      ...(props.onReset === undefined ? [] : [h.OnReset(props.onReset)]),
      ...(props.onSubmit === undefined ? [] : [h.OnSubmit(props.onSubmit)]),
    ],
    [...props.children],
  );
