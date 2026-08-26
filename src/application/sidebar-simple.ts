import type { Html, HtmlBuilder } from "foldkit/html";

import { sidebarSimpleLayout } from "./sidebar-navigation-base.ts";
import type { SidebarNavigationBaseProps } from "./sidebar-navigation-base.ts";

export type SidebarSimpleProps<Message> = SidebarNavigationBaseProps<Message>;

export const sidebarSimple = <Message>(
  props: SidebarSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html => h.div([h.DataAttribute("sidebar-simple", "")], [sidebarSimpleLayout(props, h)]);
