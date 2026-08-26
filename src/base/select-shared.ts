import type { Html, HtmlBuilder } from "foldkit/html";

import type { SelectItem, SelectProps } from "./select.ts";
import { select } from "./select.ts";

/** FoldKit form of Untitled UI's non-visual shared select contract. */
export type SelectSharedProps<Message> = SelectProps<Message>;

export type SelectSharedItem<Message> = SelectItem<Message>;

export const selectShared = <Message>(
  props: SelectSharedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => select(props, h);
