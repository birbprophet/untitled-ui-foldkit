/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingDropdownMenuFeaturedCard,
  marketingDropdownMenuItemLink,
  marketingDropdownMenuShell,
} from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuItem } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuFeatureCardProps<Message> {
  readonly cardDescription: string;
  readonly cardDismissLabel: string;
  readonly cardHref: string;
  readonly cardImageAlt: string;
  readonly cardImageSrc: string;
  readonly cardTitle: string;
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onChangelog: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const dropdownMenuFeatureCard = <Message>(
  props: DropdownMenuFeatureCardProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  marketingDropdownMenuShell(
    [
      h.div(
        [h.Class("flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6")],
        [
          marketingDropdownMenuFeaturedCard(
            {
              description: props.cardDescription,
              dismissLabel: props.cardDismissLabel,
              href: props.cardHref,
              imageAlt: props.cardImageAlt,
              imageSrc: props.cardImageSrc,
              onChangelog: props.onChangelog,
              onDismiss: props.onDismiss,
              title: props.cardTitle,
            },
            h,
          ),
          h.ul(
            [h.Class("flex flex-1 flex-col gap-0.5")],
            props.items.map((item) =>
              h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, props.onItem, h)]),
            ),
          ),
        ],
      ),
    ],
    h,
  );
