/* oxlint-disable effect/noReturnInArrow, effect/noTernary, eslint/prefer-destructuring, foldkit/keyed-required-for-mapped-rows -- This full-width section mirrors the authenticated Untitled UI layout. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination as applicationPagination } from "../application/pagination.ts";
import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export interface BlogHeaderAltLayout01Article {
  readonly author: { readonly href: string; readonly name: string; readonly seed: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export type BlogHeaderAltLayout01Action = Readonly<{
  articleId: string;
  target: "article" | "author" | "category";
}>;

export const blogHeaderAltLayout01Articles = [
  {
    author: { href: "#", name: "Olivia Rhye", seed: "blog-olivia-rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    isFeatured: true,
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { href: "#", name: "Phoenix Baker", seed: "blog-phoenix-baker" },
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
    author: { href: "#", name: "Lana Steiner", seed: "blog-lana-steiner" },
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
    author: { href: "#", name: "Alec Whitten", seed: "blog-alec-whitten" },
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
    author: { href: "#", name: "Demi Wilkinson", seed: "blog-demi-wilkinson" },
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
    author: { href: "#", name: "Candice Wu", seed: "blog-candice-wu" },
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
    author: { href: "#", name: "Natali Craig", seed: "blog-natali-craig" },
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
    author: { href: "#", name: "Drew Cano", seed: "blog-drew-cano" },
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
  {
    author: { href: "#", name: "Orlando Diggs", seed: "blog-orlando-diggs" },
    category: { href: "#", name: "Customer Success" },
    href: "#",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    title: "Podcast: Creating a better CX Community",
  },
] as const satisfies readonly BlogHeaderAltLayout01Article[];

export interface BlogHeaderAltLayout01Props<Message> {
  readonly articles: readonly BlogHeaderAltLayout01Article[];
  readonly email: string;
  readonly onArticleActivate: (action: BlogHeaderAltLayout01Action) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPageChange: (page: number) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly page: number;
}

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-6 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
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

const badgeGroup = <Message>(
  article: BlogHeaderAltLayout01Article,
  iconTrailing: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const readingTime = h.span(
    [
      h.Class(
        "rounded-full bg-bg-primary px-2.5 py-0.5 shadow-xs ring-1 ring-border-primary ring-inset",
      ),
    ],
    [article.readingTime],
  );
  const attributes = [
    h.Class(
      "inline-flex items-center gap-2 rounded-full bg-bg-brand-primary p-0.5 pr-3 text-sm font-medium text-text-brand-secondary",
    ),
  ];
  if (!iconTrailing) {
    return h.span(attributes, [readingTime, article.category.name]);
  }
  return h.span(attributes, [
    readingTime,
    article.category.name,
    h.svg(
      [h.AriaHidden(true), h.Class("size-3"), h.Fill("none"), h.ViewBox("0 0 12 12")],
      [
        h.path([
          h.D("m4.5 3 3 3-3 3"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("1.5"),
        ]),
      ],
    ),
  ]);
};

const author = <Message>(
  article: BlogHeaderAltLayout01Article,
  props: BlogHeaderAltLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex gap-2")],
    [
      h.a(
        [
          h.Class("flex"),
          h.Href(article.author.href),
          h.OnClick(props.onArticleActivate({ articleId: article.id, target: "author" })),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.author.name),
            h.Class(
              "size-10 rounded-full bg-bg-primary object-cover ring-0.75 ring-border-secondary ring-offset-2 ring-offset-bg-primary",
            ),
            h.Src(
              blobatarDataUri(article.author.seed, {
                background: "circle",
                kind: "agent",
                size: 80,
                title: article.author.name,
              }),
            ),
          ]),
        ],
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
              h.OnClick(props.onArticleActivate({ articleId: article.id, target: "author" })),
            ],
            [article.author.name],
          ),
          h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
        ],
      ),
    ],
  );

const featuredArticle = <Message>(
  article: BlogHeaderAltLayout01Article,
  props: BlogHeaderAltLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-4 lg:flex-row lg:items-start xl:gap-8")],
    [
      h.a(
        [
          h.Class("shrink-0 overflow-hidden"),
          h.Href(article.href),
          h.OnClick(props.onArticleActivate({ articleId: article.id, target: "article" })),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class("aspect-[1.5] w-full object-cover lg:h-103 lg:w-180 xl:w-206"),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5 md:gap-6")],
        [
          h.div(
            [h.Class("flex flex-col gap-3 md:gap-4")],
            [
              badgeGroup(article, true, h),
              h.div(
                [h.Class("flex flex-col gap-1 md:gap-2")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:text-display-xs",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(
                        props.onArticleActivate({ articleId: article.id, target: "category" }),
                      ),
                    ],
                    [article.title],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary xl:line-clamp-4")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          author(article, props, h),
        ],
      ),
    ],
  );

const verticalArticle = <Message>(
  article: BlogHeaderAltLayout01Article,
  props: BlogHeaderAltLayout01Props<Message>,
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
          h.OnClick(props.onArticleActivate({ articleId: article.id, target: "article" })),
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
              badgeGroup(article, false, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(
                        props.onArticleActivate({ articleId: article.id, target: "category" }),
                      ),
                    ],
                    [article.title, arrowUpRight(h)],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          author(article, props, h),
        ],
      ),
    ],
  );

const pagination = <Message>(
  props: BlogHeaderAltLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  applicationPagination(
    {
      messageForPage: props.onPageChange,
      page: props.page,
      total: 10,
      variant: "page-default",
    },
    h,
  );

export const blogHeaderAltLayout01 = <Message>(
  props: BlogHeaderAltLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("w-full bg-bg-primary")],
    [
      h.section(
        [h.Class("bg-bg-secondary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex w-full max-w-3xl flex-col")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                    ["Blog"],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                      ),
                    ],
                    ["Resource library"],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                    [
                      "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
                    ],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid grid-cols-1 items-start gap-4 self-stretch sm:mt-12 sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          input(
                            {
                              inputClassName: "py-0.5",
                              isRequired: true,
                              name: "blog-layout-01-email",
                              onInput: props.onEmailInput,
                              placeholder: "Enter your email",
                              size: "lg",
                              type: "email",
                              value: props.email,
                            },
                            h,
                          ),
                          h.span(
                            [h.Class("self-start text-sm text-text-tertiary")],
                            [
                              "We care about your data in our ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href("#"),
                                ],
                                ["privacy policy"],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Get started",
                          onPress: props.onSubscribe,
                          size: "xl",
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
      ),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-16 md:gap-16 md:px-8 md:py-24",
          ),
        ],
        [
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2")],
            props.articles
              .slice(0, 9)
              .map((article, index) =>
                h.li(
                  [
                    h.Class(
                      `flex flex-col gap-6 md:gap-8 ${index >= 6 ? "max-lg:hidden" : ""} ${article.isFeatured === true ? "lg:col-span-2 lg:mb-4 lg:flex-row" : ""}`,
                    ),
                  ],
                  [
                    article.isFeatured === true
                      ? featuredArticle(article, props, h)
                      : verticalArticle(article, props, h),
                  ],
                ),
              ),
          ),
          pagination(props, h),
        ],
      ),
    ],
  );
