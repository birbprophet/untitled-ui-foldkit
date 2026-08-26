/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription preserves the authenticated split-layout anatomy. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface BlogSectionSplitLayout02Article {
  readonly author: Readonly<{ readonly href: string; readonly name: string }>;
  readonly category: Readonly<{ readonly href: string; readonly name: string }>;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogSectionSplitLayout02Props<Message> {
  readonly articles: readonly BlogSectionSplitLayout02Article[];
  readonly description: string;
  readonly heading: string;
  readonly onArticle: (articleId: string) => NoInfer<Message>;
  readonly onAuthor: (articleId: string) => NoInfer<Message>;
  readonly onCategory: (articleId: string) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly viewAllLabel: string;
}

export const blogSectionSplitLayout02Articles: readonly BlogSectionSplitLayout02Article[] = [
  {
    author: { href: "#", name: "Olivia Rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { href: "#", name: "Phoenix Baker" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
];

const authorAvatar = <Message>(
  article: BlogSectionSplitLayout02Article,
  h: HtmlBuilder<Message>,
): Html =>
  h.img([
    h.Alt(article.author.name),
    h.Class("size-10 rounded-full object-cover"),
    h.Src(
      blobatarDataUri(`blog-split-layout-02-${article.author.name}`, {
        background: "circle",
        kind: "agent",
        size: 80,
        title: article.author.name,
      }),
    ),
  ]);

const articleCard = <Message>(
  article: BlogSectionSplitLayout02Article,
  props: BlogSectionSplitLayout02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-5 xl:flex-row xl:items-start")],
    [
      h.a(
        [
          h.Class("shrink-0 overflow-hidden rounded-2xl"),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class("h-60 w-full object-cover xl:h-50 xl:w-91.5"),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-2")],
            [
              h.a(
                [
                  h.Class(
                    "group relative inline-flex h-max cursor-pointer items-center justify-normal rounded p-0 text-sm font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(article.category.href),
                  h.OnClick(props.onCategory(article.id)),
                ],
                [article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-2")],
                [
                  h.a(
                    [
                      h.Class(
                        "rounded-md text-xl font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 xl:text-lg",
                      ),
                      h.Href(article.href),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [
                  h.Class("flex"),
                  h.Href(article.author.href),
                  h.OnClick(props.onAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [authorAvatar(article, h)],
              ),
              h.div(
                [],
                [
                  h.p(
                    [h.Class("text-sm font-semibold")],
                    [
                      h.a(
                        [
                          h.Class(
                            "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(article.author.href),
                          h.OnClick(props.onAuthor(article.id)),
                        ],
                        [article.author.name],
                      ),
                    ],
                  ),
                  h.p([h.Class("text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const blogSectionSplitLayout02 = <Message>(
  props: BlogSectionSplitLayout02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-x-16 gap-y-12 px-4 md:px-8 lg:flex-row",
          ),
        ],
        [
          h.div(
            [h.Class("w-full max-w-100")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-5")], [props.description]),
              h.div(
                [h.Class("mt-12 hidden flex-col gap-3 md:mt-8 md:flex md:flex-row")],
                [button({ label: props.viewAllLabel, onPress: props.onViewAll, size: "xl" }, h)],
              ),
            ],
          ),
          h.ul(
            [
              h.Class(
                "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12 lg:col-span-3 lg:grid-cols-1",
              ),
            ],
            props.articles
              .slice(0, 2)
              .map((article) =>
                h.keyed("li")(
                  article.id,
                  [h.DataAttribute("article-id", article.id)],
                  [articleCard(article, props, h)],
                ),
              ),
          ),
          h.div(
            [h.Class("flex flex-col gap-3 md:hidden")],
            [button({ label: props.viewAllLabel, onPress: props.onViewAll, size: "xl" }, h)],
          ),
        ],
      ),
    ],
  );
