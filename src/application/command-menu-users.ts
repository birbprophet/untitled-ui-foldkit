/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The two authenticated user compositions share their upstream people fixture and differ only in documented stacking anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { commandMenu } from "./command-menu.ts";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu.ts";
import { emptyState } from "./empty-state.ts";

interface ControlledUsersProps<Message> {
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

export type CommandMenuUsersProps<Message> = ControlledUsersProps<Message>;
export type CommandMenuUsersStackedProps<Message> = ControlledUsersProps<Message>;

const people = [
  ["user-01", "Phoenix Baker", "@phoenix"],
  ["user-02", "Olivia Rhye", "@olivia"],
  ["user-03", "Lana Steiner", "@lana"],
  ["user-04", "Demi Wilkinson", "@demi"],
  ["user-05", "Candice Wu", "@candice"],
  ["user-06", "Natali Craig", "@natali"],
  ["user-07", "Drew Cano", "@drew"],
  ["user-08", "Kari Rasmussen", "@kari"],
] as const;

const userItems = (stacked: boolean): readonly CommandMenuItem[] =>
  people.map(([id, label, description]) => ({
    avatarSeed: `command-user-${id}`,
    description,
    id,
    label,
    stacked,
    type: "avatar",
  }));

const userGroups = (stacked: boolean): readonly CommandMenuGroup[] => {
  const items = userItems(stacked);
  const recentCount = stacked ? 3 : 2;
  return [
    {
      id: "recent",
      items: items.slice(0, recentCount).map((user) => ({
        ...user,
        id: `${user.id}-recent`,
      })),
      title: "Recent",
    },
    { id: "all", items, title: "All users" },
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
          description: "Your search did not match any users. Please try again.",
          descriptionLines: ["Your search did not match any users.", "Please try again."],
          size: "sm",
          title: "No users found",
        },
        h,
      ),
    ],
  );

const renderUsers = <Message>(
  props: ControlledUsersProps<Message>,
  stacked: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  commandMenu(
    {
      emptyContent: emptyContent(h),
      focusedId: props.focusedId,
      groups: userGroups(stacked),
      id: props.id,
      isOpen: props.isOpen,
      messageForFocus: props.messageForFocus,
      messageForSelect: props.messageForSelect,
      onClose: props.onClose,
      onQueryChange: props.onQueryChange,
      placeholder: props.placeholder,
      query: props.query,
      resultsClassName: stacked ? "max-h-125.5 min-h-49" : "min-h-49",
      selectedId: props.selectedId,
      showFooter: true,
    },
    h,
  );

export const commandMenuUsers = <Message>(
  props: CommandMenuUsersProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderUsers(props, false, h);

export const commandMenuUsersStacked = <Message>(
  props: CommandMenuUsersStackedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderUsers(props, true, h);
