/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI blog section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { blogCards } from "./blog-cards.ts";
import type { BlogCardsArticle, BlogCardsTag } from "./blog-cards.ts";

export interface BlogSectionSimpleLeftAligned02Props<Message> {
  readonly articles: readonly BlogCardsArticle[];
  readonly description: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategory: (id: string) => NoInfer<Message>;
  readonly onTag: (articleId: string, tag: BlogCardsTag) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly viewAllLabel: string;
}

export const blogSectionSimpleLeftAligned02 = <Message>(
  props: BlogSectionSimpleLeftAligned02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("max-w-3xl")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.ul(
            [h.Class("mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2")],
            props.articles.slice(0, 4).map((article) =>
              h.keyed("li")(
                article.id,
                [h.DataAttribute("article-id", article.id)],
                [
                  blogCards(
                    {
                      article,
                      onArticle: props.onArticle(article.id),
                      onAuthor: props.onAuthor(article.id),
                      onCategory: props.onCategory(article.id),
                      onTag: (tag) => props.onTag(article.id, tag),
                      variant: "simple-04-vertical",
                    },
                    h,
                  ),
                ],
              ),
            ),
          ),
          h.div(
            [
              h.Class(
                "mt-12 flex flex-col gap-3 border-border-secondary md:mt-16 md:flex-row md:justify-end md:border-t md:pt-4",
              ),
            ],
            [
              button(
                {
                  color: "primary",
                  label: props.viewAllLabel,
                  onPress: props.onViewAll,
                  size: "xl",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
