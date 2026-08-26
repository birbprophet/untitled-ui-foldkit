/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Optional native file-input attributes stay explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FileUploadTriggerProps<Message> {
  readonly acceptDirectory?: boolean;
  readonly acceptedFileTypes?: readonly string[];
  readonly allowsMultiple?: boolean;
  readonly defaultCamera?: "user" | "environment";
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly onSelect?: NoInfer<Message>;
  readonly triggerLabel: string;
}

export const fileUploadTrigger = <Message>(
  props: FileUploadTriggerProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const disabled = props.isDisabled === true;
  const { onSelect } = props;
  return h.label(
    [h.Class(`relative inline-flex h-max ${disabled ? "cursor-not-allowed opacity-50" : ""}`)],
    [
      h.input([
        h.Class(
          "peer absolute inset-0 z-10 size-full cursor-pointer rounded-lg opacity-0 disabled:cursor-not-allowed",
        ),
        h.Id(props.id),
        h.AriaLabel(props.triggerLabel),
        h.Type("file"),
        h.Disabled(disabled),
        h.Multiple(props.allowsMultiple === true),
        ...(props.acceptedFileTypes === undefined
          ? []
          : [h.Accept(props.acceptedFileTypes.join(","))]),
        ...(props.defaultCamera === undefined ? [] : [h.Attribute("capture", props.defaultCamera)]),
        ...(props.acceptDirectory === true ? [h.Attribute("webkitdirectory", "")] : []),
        ...(onSelect === undefined || disabled ? [] : [h.OnChange(() => onSelect)]),
      ]),
      h.span(
        [
          h.Class(
            "relative inline-flex h-max items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary outline-focus-ring transition duration-100 ease-linear before:absolute before:rounded-[7px] ring-inset peer-hover:bg-bg-primary-hover peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
          ),
        ],
        [h.span([h.Class("px-0.5")], [props.triggerLabel])],
      ),
    ],
  );
};
