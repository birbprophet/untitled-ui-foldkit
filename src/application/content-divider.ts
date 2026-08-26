/* oxlint-disable effect/noReturnInArrow, effect/noTernary, eslint/no-nested-ternary -- Three exact upstream visual branches stay readable as a direct lookup. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentDividerProps {
  readonly label: string;
  readonly type: "single-line" | "dual-line" | "background-fill";
}

export const contentDivider = <Message>(
  props: ContentDividerProps,
  h: HtmlBuilder<Message>,
): Html => {
  const root =
    props.type === "single-line"
      ? "flex items-center gap-x-2"
      : props.type === "dual-line"
        ? "flex justify-center gap-x-2 border-y border-border-secondary py-3"
        : "flex justify-center gap-x-2 rounded-lg bg-bg-secondary py-2";
  const line = h.span([h.AriaHidden(true), h.Class("h-px flex-1 bg-border-secondary")]);
  return h.div(
    [h.Class(`w-full shrink-0 ${root}`), h.Role("separator"), h.AriaLabel(props.label)],
    props.type === "single-line" ? [line, props.label, line] : [props.label],
  );
};
