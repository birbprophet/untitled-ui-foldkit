/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";
import { marketingMenuColumnList, marketingMenuReadyFooter } from "./marketing-menu-shared.ts";
import type { MarketingMenuFooterAction } from "./marketing-menu-shared.ts";

export interface Menu4ColWithFooterProps<Message> {
  readonly actions: readonly MarketingMenuFooterAction[];
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly ctaLabel: string;
  readonly onAction: (id: string) => Message;
  readonly onCta: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly prompt: string;
}

export const menu4ColWithFooter = <Message>(
  props: Menu4ColWithFooterProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("relative overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container md:px-8")],
        [
          marketingMenuColumnList(
            props.columns,
            props.onItem,
            h,
            "grid grid-cols-1 gap-5 pt-4 pb-5 md:grid-cols-2 md:py-6 xl:grid-cols-4",
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
        },
        h,
      ),
    ],
  );
