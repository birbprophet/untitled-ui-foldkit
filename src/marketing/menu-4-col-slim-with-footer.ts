/* oxlint-disable effect/noReturnInArrow, effect/noTernary, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuItem } from "./marketing-dropdown-shared.ts";
import { marketingMenuReadyFooter } from "./marketing-menu-shared.ts";
import type { MarketingMenuFooterAction } from "./marketing-menu-shared.ts";

export interface Menu4ColSlimWithFooterProps<Message> {
  readonly actions: readonly MarketingMenuFooterAction[];
  readonly ctaLabel: string;
  readonly isFloating?: boolean;
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onAction: (id: string) => Message;
  readonly onCta: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly prompt: string;
}

export const menu4ColSlimWithFooter = <Message>(
  props: Menu4ColSlimWithFooterProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [
      h.Class(
        `relative bg-bg-primary md:overflow-hidden md:shadow-lg ${props.isFloating === true ? "md:rounded-2xl md:ring-1 md:ring-border-secondary_alt" : ""}`,
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class(`mx-auto max-w-container ${props.isFloating === true ? "" : "md:px-8"}`)],
        [
          h.ul(
            [
              h.Class(
                `grid grid-cols-1 gap-0.5 pt-2 pb-4 md:grid-cols-2 md:gap-1 xl:grid-cols-4 xl:flex-nowrap ${props.isFloating === true ? "md:p-5" : "md:py-6"}`,
              ),
            ],
            props.items.map((menuItem) =>
              h.keyed("li")(
                menuItem.id,
                [],
                [marketingDropdownMenuItemLink(menuItem, props.onItem, h)],
              ),
            ),
          ),
        ],
      ),
      marketingMenuReadyFooter(
        {
          actions: props.actions,
          ctaLabel: props.ctaLabel,
          onAction: props.onAction,
          onCta: props.onCta,
          prompt: props.prompt,
          visibleOnMobile: true,
        },
        h,
      ),
    ],
  );
