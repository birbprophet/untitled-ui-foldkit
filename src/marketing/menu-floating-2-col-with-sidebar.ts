/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { Menu2ColWithSidebarProps } from "./menu-2-col-with-sidebar.ts";
import { menu2ColWithSidebar } from "./menu-2-col-with-sidebar.ts";

export type MenuFloating2ColWithSidebarProps<Message> = Menu2ColWithSidebarProps<Message>;

export const menuFloating2ColWithSidebar = <Message>(props: MenuFloating2ColWithSidebarProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div([h.Class("md:rounded-2xl md:ring-1 md:ring-border-secondary_alt md:shadow-lg")], [
    menu2ColWithSidebar(props, h),
  ]);
