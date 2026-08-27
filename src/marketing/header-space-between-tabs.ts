/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { tabs } from "../application/tabs.ts";

export interface HeaderSectionTab {
  readonly id: string;
  readonly label: string;
}

export interface HeaderSpaceBetweenTabsProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onTab: (id: string) => NoInfer<Message>;
  readonly selectedTabId: string;
  readonly tabs: readonly HeaderSectionTab[];
  readonly tabsId: string;
}

export const headerSpaceBetweenTabs = <Message>(
  props: HeaderSpaceBetweenTabsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mb-3 text-sm font-semibold text-text-brand-secondary md:text-md")],
            [props.eyebrow],
          ),
          h.div(
            [h.Class("grid grid-cols-[minmax(auto,768px)] gap-x-16 lg:grid-cols-[1fr_480px]")],
            [
              h.h1(
                [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl lg:mt-3 lg:h-0")],
                [props.description],
              ),
              h.div(
                [h.Class("mt-8 sm:justify-self-start md:mt-12")],
                [
                  tabs(
                    {
                      ariaLabel: props.heading,
                      className: "w-full md:w-auto [&_[role=tab]]:flex-1",
                      id: props.tabsId,
                      items: props.tabs.map((tab) => ({
                        focusMessage: props.onTab(tab.id),
                        id: tab.id,
                        label: tab.label,
                        selectMessage: props.onTab(tab.id),
                      })),
                      selectedId: props.selectedTabId,
                      size: "md",
                      type: "button-border",
                    },
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
