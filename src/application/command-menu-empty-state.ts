/* oxlint-disable effect/noReturnInArrow -- The empty-state composition forwards controlled FoldKit messages without owning runtime state. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { commandMenu } from "./command-menu.ts";
import { emptyState } from "./empty-state.ts";

export interface CommandMenuEmptyStateProps<Message> {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onClear: NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onNewProject: NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly query: string;
}

const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.DataAttribute("icon", "leading"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M12 5v14M5 12h14")])],
  );

export const commandMenuEmptyState = <Message>(
  props: CommandMenuEmptyStateProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  commandMenu(
    {
      emptyContent: h.div(
        [h.Class("overflow-hidden p-6 pb-10")],
        [
          emptyState(
            {
              actionSize: "md",
              confirmIcon: plusIcon(h),
              confirmLabel: "New project",
              confirmMessage: props.onNewProject,
              decoration: "featured-icon",
              description: `Your search "${props.query}" did not match any projects. Please try again.`,
              dismissLabel: "Clear search",
              dismissMessage: props.onClear,
              size: "sm",
              title: "No projects found",
            },
            h,
          ),
        ],
      ),
      groups: [],
      id: props.id,
      isOpen: props.isOpen,
      messageForFocus: () => props.onClose,
      messageForSelect: () => props.onClose,
      onClose: props.onClose,
      onQueryChange: props.onQueryChange,
      placeholder: props.placeholder,
      query: props.query,
      resultsClassName: "max-h-131.5 min-h-49",
      shortcut: "⌘/",
      showFooter: false,
    },
    h,
  );
