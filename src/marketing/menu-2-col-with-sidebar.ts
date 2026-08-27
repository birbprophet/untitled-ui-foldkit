/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";
import { marketingMenuVideoCard } from "./marketing-menu-shared.ts";
import type { MarketingMenuVideoTutorial } from "./marketing-menu-shared.ts";

export interface Menu2ColWithSidebarProps<Message> {
  readonly allTutorialsLabel: string;
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly onAllTutorials: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly tutorials: readonly MarketingMenuVideoTutorial<Message>[];
  readonly tutorialsTitle: string;
}

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("m9 18 6-6-6-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const menu2ColWithSidebar = <Message>(
  props: Menu2ColWithSidebarProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto flex max-w-container flex-col md:px-8 md:pb-6 xl:flex-row xl:pb-0")],
        [
          h.div(
            [h.Class("flex flex-col gap-5 pt-4 pb-5 md:flex-row md:pt-6 md:pr-6 md:pb-6")],
            props.columns.map((column) =>
              h.keyed("div")(
                column.id,
                [h.Class("flex-1")],
                [
                  h.h3(
                    [h.Class("mb-3 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")],
                    [column.title],
                  ),
                  h.ul(
                    [h.Class("flex flex-col gap-0.5")],
                    column.items.map((menuItem) =>
                      h.keyed("li")(
                        menuItem.id,
                        [],
                        [marketingDropdownMenuItemLink(menuItem, props.onItem, h)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          h.div(
            [h.Class("relative z-10 w-full xl:max-w-140")],
            [
              h.div(
                [
                  h.Class(
                    "flex flex-col items-start bg-bg-secondary pt-5 pb-6 md:rounded-2xl md:p-6 md:pr-8",
                  ),
                ],
                [
                  h.h3(
                    [h.Class("mb-3 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")],
                    [props.tutorialsTitle],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-2 md:gap-0.5")],
                    props.tutorials.map((tutorial) =>
                      h.keyed("div")(tutorial.id, [], [marketingMenuVideoCard(tutorial, h)]),
                    ),
                  ),
                  h.div(
                    [h.Class("mt-4 px-4 leading-none md:hidden")],
                    [
                      h.a(
                        [
                          h.Class(
                            "inline-flex items-center gap-1 text-sm font-semibold text-text-brand-secondary outline-focus-ring focus-visible:outline-2",
                          ),
                          h.Href("#"),
                          h.OnClick(props.onAllTutorials),
                        ],
                        [props.allTutorialsLabel, chevronRight(h)],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
