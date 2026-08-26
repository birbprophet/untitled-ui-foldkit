/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription preserves authenticated blog anatomy and fixture order. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { tabs } from "../application/tabs.ts";

export interface BlogHeaderFeaturedPost02Article {
  readonly author: Readonly<{ readonly href: string; readonly name: string }>;
  readonly category: Readonly<{ readonly href: string; readonly name: string }>;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderFeaturedPost02Tab {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderFeaturedPost02Props<Message> {
  readonly articles: readonly BlogHeaderFeaturedPost02Article[];
  readonly categoriesLabel: string;
  readonly currentPage: number;
  readonly description: string;
  readonly eyebrow: string;
  readonly featuredArticle: BlogHeaderFeaturedPost02Article;
  readonly focusedTabId: string;
  readonly heading: string;
  readonly onArticle: (articleId: string) => NoInfer<Message>;
  readonly onAuthor: (articleId: string) => NoInfer<Message>;
  readonly onCategory: (articleId: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSearch: (query: string) => NoInfer<Message>;
  readonly onTabFocus: (tabId: string) => NoInfer<Message>;
  readonly onTabSelect: (tabId: string) => NoInfer<Message>;
  readonly searchPlaceholder: string;
  readonly searchQuery: string;
  readonly selectedTabId: string;
  readonly tabs: readonly BlogHeaderFeaturedPost02Tab[];
  readonly totalPages: number;
}

export const blogHeaderFeaturedPost02Articles: readonly BlogHeaderFeaturedPost02Article[] = [
  {
    author: { href: "#", name: "Olivia Rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
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
    readingTime: "8 min read",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    author: { href: "#", name: "Lana Steiner" },
    category: { href: "#", name: "Software Engineering" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    author: { href: "#", name: "Alec Whitten" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
  {
    author: { href: "#", name: "Demi Wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    author: { href: "#", name: "Candice Wu" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    author: { href: "#", name: "Natali Craig" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
  {
    author: { href: "#", name: "Drew Cano" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
];

export const blogHeaderFeaturedPost02FeaturedArticle: BlogHeaderFeaturedPost02Article = {
  author: { href: "#", name: "Amélie Laurent" },
  category: { href: "#", name: "Design" },
  href: "#",
  id: "article-001",
  publishedAt: "10 April 2027",
  readingTime: "8 min read",
  summary:
    'Tools and trends change, but good design is timeless. Learn how to quickly develop an "eye" for design.',
  thumbnailUrl: "https://www.untitledui.com/marketing/blog-featured-post-02.webp",
  title: 'Improve your design skills: Develop an "eye" for design',
};

export const blogHeaderFeaturedPost02Tabs: readonly BlogHeaderFeaturedPost02Tab[] = [
  { id: "all", label: "View all" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "software-engineering", label: "Software Development" },
  { id: "customer-success", label: "Customer Success" },
  { id: "leadership", label: "Leadership" },
  { id: "management", label: "Management" },
];

const arrowUpRight = <Message>(className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M7 17 17 7m0 0H7m10 0v10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const readingBadge = <Message>(
  article: BlogHeaderFeaturedPost02Article,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "inline-flex w-max cursor-pointer items-center rounded-[10px] bg-bg-primary py-1 pr-3 pl-1 text-xs font-medium text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear hover:bg-bg-secondary",
      ),
    ],
    [
      h.span(
        [
          h.Class(
            "mr-2 inline-flex items-center gap-1 rounded-md bg-bg-primary px-1.5 py-0.5 shadow-xs ring-1 ring-border-primary ring-inset",
          ),
        ],
        [
          h.span([
            h.AriaHidden(true),
            h.Class(
              "inline-block size-2 shrink-0 rounded-full bg-utility-brand-500 outline-3 -outline-offset-1 outline-utility-brand-100",
            ),
          ]),
          article.category.name,
        ],
      ),
      h.span([], [article.readingTime]),
    ],
  );

const authorAvatar = <Message>(article: BlogHeaderFeaturedPost02Article, h: HtmlBuilder<Message>) =>
  h.img([
    h.Alt(article.author.name),
    h.Class(
      "size-10 rounded-full bg-bg-primary object-cover ring-0.75 ring-border-secondary ring-offset-2 ring-offset-bg-primary",
    ),
    h.Src(
      blobatarDataUri(`blog-featured-post-02-${article.author.name}`, {
        background: "circle",
        kind: "agent",
        size: 80,
        title: article.author.name,
      }),
    ),
  ]);

const mobileFeatured = <Message>(
  article: BlogHeaderFeaturedPost02Article,
  props: BlogHeaderFeaturedPost02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full rounded-none object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "group/title flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.href),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [
                      article.title,
                      arrowUpRight(
                        "mt-0.5 size-6 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover/title:text-fg-quaternary-hover",
                        h,
                      ),
                    ],
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
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderFeaturedPost02Article,
  props: BlogHeaderFeaturedPost02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3")],
            [
              readingBadge(article, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.onCategory(article.id)),
                    ],
                    [article.title, arrowUpRight("mt-0.5 size-6 shrink-0 text-fg-quaternary", h)],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [article.summary],
                  ),
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
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const blogHeaderFeaturedPost02 = <Message>(
  props: BlogHeaderFeaturedPost02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-primary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:gap-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.a(
            [
              h.Class(
                "relative hidden w-full overflow-hidden outline-focus-ring select-none focus-visible:outline-2 focus-visible:outline-offset-4 md:block md:h-145 lg:h-180",
              ),
              h.Href(props.featuredArticle.href),
              h.OnClick(props.onArticle(props.featuredArticle.id)),
            ],
            [
              h.img([
                h.Alt(props.featuredArticle.title),
                h.Class("absolute inset-0 size-full object-cover"),
                h.Src(props.featuredArticle.thumbnailUrl),
              ]),
              h.div([
                h.Class(
                  "absolute top-0 left-0 size-20 bg-linear-to-br from-bg-primary from-50% via-black via-50% to-black",
                ),
              ]),
              h.div(
                [
                  h.Class(
                    "absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-black/40 to-transparent pt-24",
                  ),
                ],
                [
                  h.div(
                    [h.Class("flex w-full items-start gap-6 p-8")],
                    [
                      h.div(
                        [h.Class("flex flex-1 flex-col gap-2")],
                        [
                          h.p(
                            [h.Class("flex-1 text-display-xs font-semibold text-white")],
                            [props.featuredArticle.title],
                          ),
                          h.p(
                            [h.Class("line-clamp-2 text-md text-white/80")],
                            [props.featuredArticle.summary],
                          ),
                        ],
                      ),
                      h.div(
                        [h.Class("flex items-center gap-2 rounded-xs")],
                        [
                          authorAvatar(props.featuredArticle, h),
                          h.div(
                            [],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-white")],
                                [props.featuredArticle.author.name],
                              ),
                              h.p(
                                [h.Class("text-sm text-white")],
                                [props.featuredArticle.publishedAt],
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
          ),
          h.div([h.Class("md:hidden")], [mobileFeatured(props.featuredArticle, props, h)]),
          h.div(
            [h.Class("flex flex-col gap-12 md:flex-row md:gap-16")],
            [
              h.div(
                [h.Class("flex w-full flex-col items-stretch gap-8 md:max-w-70")],
                [
                  h.div(
                    [
                      h.Class(
                        "flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3.5 py-2.5 text-md shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                      ),
                    ],
                    [
                      searchIcon(h),
                      h.input([
                        h.AriaLabel(props.searchPlaceholder),
                        h.Class(
                          "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                        ),
                        h.OnInput(props.onSearch),
                        h.Placeholder(props.searchPlaceholder),
                        h.Type("search"),
                        h.Value(props.searchQuery),
                      ]),
                    ],
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-5")],
                    [
                      h.p(
                        [h.Class("text-sm font-semibold text-text-brand-secondary")],
                        [props.categoriesLabel],
                      ),
                      tabs(
                        {
                          ariaLabel: props.categoriesLabel,
                          focusedId: props.focusedTabId,
                          id: "blog-header-featured-post-02-categories",
                          items: props.tabs.map((tab) => ({
                            focusMessage: props.onTabFocus(tab.id),
                            id: tab.id,
                            label: tab.label,
                            selectMessage: props.onTabSelect(tab.id),
                          })),
                          orientation: "vertical",
                          selectedId: props.selectedTabId,
                          size: "md",
                          type: "line",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
              h.div(
                [h.Class("flex flex-1 flex-col gap-12 lg:gap-16")],
                [
                  h.ul(
                    [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2")],
                    props.articles
                      .slice(0, 8)
                      .map((article, index) =>
                        h.keyed("li")(
                          article.id,
                          [
                            h.Class(
                              `flex flex-col gap-6 md:gap-8 ${index >= 5 ? "hidden lg:flex" : ""}`,
                            ),
                            h.DataAttribute("article-id", article.id),
                          ],
                          [articleCard(article, props, h)],
                        ),
                      ),
                  ),
                  pagination(
                    {
                      messageForPage: props.onPage,
                      page: props.currentPage,
                      total: props.totalPages,
                      variant: "page-minimal-center",
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
