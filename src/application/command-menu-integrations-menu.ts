/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match -- The authenticated regular and stacked variants share the exact integration fixture and preview anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { toggle } from "../base/controls.ts";
import { commandMenu, filterCommandGroups } from "./command-menu.ts";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu.ts";
import { emptyState } from "./empty-state.ts";

interface ControlledIntegrationsMenuProps<Message> {
  readonly focusedId?: string;
  readonly id: string;
  readonly isConnected: boolean;
  readonly isOpen: boolean;
  readonly messageForFocus: (id: string) => NoInfer<Message>;
  readonly messageForSelect: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onLearnMore: NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly onViewIntegration: NoInfer<Message>;
  readonly placeholder?: string;
  readonly query: string;
  readonly selectedId: string;
}

export type CommandMenuIntegrationsMenuProps<Message> = ControlledIntegrationsMenuProps<Message>;
export type CommandMenuIntegrationsMenuStackedProps<Message> =
  ControlledIntegrationsMenuProps<Message>;

const integrations = [
  [
    "integration-01",
    "GitHub",
    "github.com",
    "Connect your GitHub account to access your repositories",
    "https://www.untitledui.com/logos/integrations/github.svg",
  ],
  [
    "integration-02",
    "Linear",
    "linear.app",
    "Linear helps streamline software projects, sprints, tasks, and bug tracking.",
    "https://www.untitledui.com/logos/integrations/linear.svg",
  ],
  [
    "integration-03",
    "Figma",
    "figma.com",
    "Figma is a collaborative interface design tool",
    "https://www.untitledui.com/logos/integrations/figma.svg",
  ],
  [
    "integration-04",
    "Zapier",
    "zapier.com",
    "Connect your apps and automate workflows",
    "https://www.untitledui.com/logos/integrations/zapier.svg",
  ],
  [
    "integration-05",
    "Notion",
    "notion.so",
    "All-in-one workspace for notes, tasks, wikis, and databases",
    "https://www.untitledui.com/logos/integrations/notion.svg",
  ],
  [
    "integration-06",
    "Slack",
    "slack.com",
    "Slack is a new way to communicate with your team",
    "https://www.untitledui.com/logos/integrations/slack.svg",
  ],
  [
    "integration-07",
    "Dropbox",
    "dropbox.com",
    "Dropbox is a file hosting service",
    "https://www.untitledui.com/logos/integrations/dropbox.svg",
  ],
] as const;

const integrationPreview = <Message>(
  selectedId: string,
  isConnected: boolean,
  onToggle: Message,
  onViewIntegration: Message,
  onLearnMore: Message,
  h: HtmlBuilder<Message>,
): Html => {
  const integration = integrations.find(([id]) => id === selectedId) ?? integrations[1];
  return h.div(
    [
      h.Class(
        "absolute right-0 top-14 bottom-0 flex w-90 flex-col border-l border-border-secondary bg-bg-primary px-5 py-6",
      ),
    ],
    [
      h.div(
        [h.Class("mb-3 flex justify-between")],
        [
          h.img([h.Alt(integration[1]), h.Class("size-16"), h.Src(integration[4])]),
          h.div(
            [h.Class("mt-0.5")],
            [
              toggle(
                {
                  ariaLabel: `Connect ${integration[1]}`,
                  isSelected: isConnected,
                  onToggle,
                  size: "sm",
                },
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex w-full flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-0.5")],
            [
              h.p([h.Class("text-md font-semibold text-text-primary")], [integration[1]]),
              h.p([h.Class("text-sm text-text-tertiary")], [integration[3]]),
            ],
          ),
          h.div(
            [h.Class("flex w-full flex-col justify-center gap-3")],
            [
              button({ label: "View integration", onPress: onViewIntegration, size: "md" }, h),
              button(
                { color: "secondary", label: "Learn more", onPress: onLearnMore, size: "md" },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
};

const emptyContent = <Message>(stacked: boolean, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("overflow-hidden p-6 pb-10")],
    [
      emptyState(
        {
          contentMargin: "none",
          decoration: "featured-icon",
          description: "Your search did not match any integrations. Please try again.",
          ...(stacked
            ? {
                descriptionLines: [
                  "Your search did not match any integrations.",
                  "Please try again.",
                ],
              }
            : {}),
          size: "sm",
          title: "No integrations found",
        },
        h,
      ),
    ],
  );

const renderMenu = <Message>(
  props: ControlledIntegrationsMenuProps<Message>,
  stacked: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const items: readonly CommandMenuItem[] = integrations.map(
    ([id, label, description, _information, imageSrc]) => ({
      description,
      id,
      imageSrc,
      label,
      stacked,
      type: stacked ? "avatar" : "icon",
    }),
  );
  const groups: readonly CommandMenuGroup[] = [
    { id: "integrations", items, title: "Integrations" },
  ];
  const empty = filterCommandGroups(groups, props.query).length === 0;
  return commandMenu(
    {
      ariaLabel: "Command menu",
      dialogClassName: empty ? "h-90.5" : stacked ? "h-110" : "h-102.5",
      emptyContent: emptyContent(stacked, h),
      focusedId: props.focusedId,
      groups,
      id: props.id,
      isOpen: props.isOpen,
      messageForFocus: props.messageForFocus,
      messageForSelect: props.messageForSelect,
      onClose: props.onClose,
      onQueryChange: props.onQueryChange,
      placeholder: props.placeholder,
      previewContent: integrationPreview(
        props.selectedId,
        props.isConnected,
        props.onToggle,
        props.onViewIntegration,
        props.onLearnMore,
        h,
      ),
      query: props.query,
      resultsClassName: stacked ? "w-70 max-h-96!" : "w-70 max-h-88.5!",
      selectedId: props.selectedId,
      showFooter: false,
    },
    h,
  );
};

export const commandMenuIntegrationsMenu = <Message>(
  props: CommandMenuIntegrationsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderMenu(props, false, h);

export const commandMenuIntegrationsMenuStacked = <Message>(
  props: CommandMenuIntegrationsMenuStackedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderMenu(props, true, h);
