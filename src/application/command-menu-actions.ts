/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The two authenticated action compositions share only their upstream route fixture and Command Menu primitive. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { commandMenu } from "./command-menu.ts";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu.ts";
import { emptyState } from "./empty-state.ts";

interface ControlledActionMenuProps<Message> {
  readonly focusedId?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForFocus: (id: string) => NoInfer<Message>;
  readonly messageForSelect: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly query: string;
  readonly selectedId?: string;
}

export type CommandMenuActionsProps<Message> = ControlledActionMenuProps<Message>;

export type CommandMenuActionsStackedProps<Message> = ControlledActionMenuProps<Message>;

const recent: readonly CommandMenuItem[] = [
  { icon: "folder", id: "item-01", label: "Marketing site redesign", type: "icon" },
  {
    icon: "file-plus",
    id: "item-02",
    label: "New document",
    shortcutKeys: ["⌘n"],
    type: "icon",
  },
  {
    icon: "user-plus",
    id: "item-03",
    label: "Invite colleagues",
    shortcutKeys: ["⌘i"],
    type: "icon",
  },
];

const routes: readonly CommandMenuItem[] = [
  {
    icon: "user",
    id: "route-01",
    label: "My profile",
    shortcutKeys: ["⌘k", "p"],
    type: "icon",
  },
  {
    icon: "users",
    id: "route-02",
    label: "Team profile",
    shortcutKeys: ["⌘k", "t"],
    type: "icon",
  },
  {
    icon: "user-plus",
    id: "route-03",
    label: "Invite colleagues",
    shortcutKeys: ["⌘i"],
    type: "icon",
  },
  {
    icon: "folder-plus",
    id: "route-04",
    label: "Create new project",
    shortcutKeys: ["⌘n"],
    type: "icon",
  },
  {
    icon: "help-circle",
    id: "route-05",
    label: "Support",
    shortcutKeys: ["⌘h"],
    type: "icon",
  },
  {
    icon: "layers",
    id: "route-06",
    label: "Changelog",
    shortcutKeys: ["⌘c"],
    type: "icon",
  },
  {
    icon: "zap-fast",
    id: "route-07",
    label: "Keyboard shortcuts",
    shortcutKeys: ["⌘?"],
    type: "icon",
  },
];

const descriptions: Readonly<Record<string, string>> = {
  "item-01": "Project by Olivia Rhye in Notion migration",
  "item-02": "Create a new blank document",
  "item-03": "Collaborate with your team on projects",
  "route-01": "View and edit your personal profile",
  "route-02": "View and edit your team profile",
  "route-03": "Collaborate with your team on projects",
  "route-04": "Create a new blank project",
  "route-05": "Our team are here to help if you get stuck",
  "route-06": "Learn about our latest releases and updates",
  "route-07": "Speed up your workflow with shortcuts",
};

const actionGroups = (stacked: boolean): readonly CommandMenuGroup[] => {
  const adapt = (item: CommandMenuItem): CommandMenuItem => ({
    ...item,
    ...(stacked ? { description: descriptions[item.id], stacked: true } : {}),
  });
  return [
    { id: "recent", items: recent.map(adapt), ...(stacked ? { title: "Recent" } : {}) },
    { id: "default", items: routes.map(adapt) },
  ];
};

const emptyContent = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("overflow-hidden p-6 pb-10")],
    [
      emptyState(
        {
          contentMargin: "none",
          decoration: "featured-icon",
          description: "Your search did not match any actions. Please try again.",
          descriptionLines: ["Your search did not match any actions.", "Please try again."],
          size: "sm",
          title: "No actions found",
        },
        h,
      ),
    ],
  );

const renderActions = <Message>(
  props: ControlledActionMenuProps<Message>,
  stacked: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  commandMenu(
    {
      emptyContent: emptyContent(h),
      focusedId: props.focusedId,
      groups: actionGroups(stacked),
      id: props.id,
      isOpen: props.isOpen,
      messageForFocus: props.messageForFocus,
      messageForSelect: props.messageForSelect,
      onClose: props.onClose,
      onQueryChange: props.onQueryChange,
      placeholder: props.placeholder,
      query: props.query,
      resultsClassName: stacked ? "min-h-49" : undefined,
      selectedId: props.selectedId,
      showFooter: false,
    },
    h,
  );

export const commandMenuActions = <Message>(
  props: CommandMenuActionsProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderActions(props, false, h);

export const commandMenuActionsStacked = <Message>(
  props: CommandMenuActionsStackedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderActions(props, true, h);
