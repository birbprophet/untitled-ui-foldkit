/* oxlint-disable effect/noSpread, effect/noTernary -- HookForm adds no visual DOM beyond its native form boundary. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface HookFormProps<Message> {
  readonly children: readonly Html[];
  readonly className?: string;
  readonly id?: string;
  readonly isSubmitting?: boolean;
  readonly onReset?: NoInfer<Message>;
  readonly onSubmit?: NoInfer<Message>;
}

/**
 * Controlled FoldKit port of Untitled UI's HookForm provider boundary.
 * Field values and validation remain in the consuming program's Model.
 */
export const hookForm = <Message>(props: HookFormProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.form(
    [
      ...(props.className === undefined ? [] : [h.Class(props.className)]),
      ...(props.id === undefined ? [] : [h.Id(props.id)]),
      h.Attribute("novalidate", ""),
      h.AriaBusy(props.isSubmitting === true),
      ...(props.onReset === undefined ? [] : [h.OnReset(props.onReset)]),
      ...(props.onSubmit === undefined ? [] : [h.OnSubmit(props.onSubmit)]),
    ],
    [...props.children],
  );
