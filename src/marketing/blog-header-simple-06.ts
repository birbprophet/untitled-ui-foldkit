/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription preserves authenticated blog fixtures and responsive branches. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { tabs } from "../application/tabs.ts";
import { button } from "../base/button.ts";

export interface BlogHeaderSimple06Article {
  readonly author: Readonly<{ readonly href: string; readonly name: string }>;
  readonly category: Readonly<{ readonly href: string; readonly name: string }>;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSimple06Category {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderSimple06Props<Message> {
  readonly articles: readonly BlogHeaderSimple06Article[];
  readonly categories: readonly BlogHeaderSimple06Category[];
  readonly currentPage: number;
  readonly desktopDescription: string;
  readonly email: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly focusedCategoryId: string;
  readonly heading: string;
  readonly mobileDescription: string;
  readonly onArticle: (articleId: string) => NoInfer<Message>;
  readonly onAuthor: (articleId: string) => NoInfer<Message>;
  readonly onCategory: (articleId: string) => NoInfer<Message>;
  readonly onCategoryFocus: (categoryId: string) => NoInfer<Message>;
  readonly onCategorySelect: (categoryId: string) => NoInfer<Message>;
  readonly onEmail: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onPrivacy: NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly privacyCopy: string;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly selectedCategoryId: string;
  readonly submitLabel: string;
  readonly totalPages: number;
}

export const blogHeaderSimple06Articles: readonly BlogHeaderSimple06Article[] = [
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
  {
    author: { href: "#", name: "Lana Steiner" },
    category: { href: "#", name: "Software Engineering" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    author: { href: "#", name: "Demi Wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
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
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
  {
    author: { href: "#", name: "Orlando Diggs" },
    category: { href: "#", name: "Customer Success" },
    href: "#",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    title: "Podcast: Creating a better CX Community",
  },
];

export const blogHeaderSimple06Categories: readonly BlogHeaderSimple06Category[] = [
  { id: "all", label: "View all" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "customer-success", label: "Customer Success" },
];

const avatar = <Message>(article: BlogHeaderSimple06Article, h: HtmlBuilder<Message>): Html =>
  h.img([
    h.Alt(article.author.name),
    h.Class("size-10 rounded-full object-cover ring-1 ring-border-secondary-alt"),
    h.Src(
      blobatarDataUri(`blog-simple-06-${article.author.name}`, {
        background: "circle",
        kind: "agent",
        size: 80,
        title: article.author.name,
      }),
    ),
  ]);

const articleCard = <Message>(
  article: BlogHeaderSimple06Article,
  props: BlogHeaderSimple06Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 xl:flex-row xl:items-start")],
    [
      h.a(
        [
          h.Class(
            "relative shrink-0 overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.onArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 xl:w-80",
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
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.onCategory(article.id)),
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
                [avatar(article, h)],
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

export const blogHeaderSimple06 = <Message>(
  props: BlogHeaderSimple06Props<Message>,
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
                [h.Class("mb-3 text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.div(
                [h.Class("grid grid-cols-[minmax(1fr,768px)] gap-x-16 lg:grid-cols-[2fr_1fr]")],
                [
                  h.h2(
                    [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                    [props.heading],
                  ),
                  h.p(
                    [
                      h.Class(
                        "mt-4 hidden text-lg text-text-tertiary md:mt-6 md:block md:text-xl lg:mt-3 lg:h-0 lg:w-120",
                      ),
                    ],
                    [props.desktopDescription],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:hidden")],
                    [props.mobileDescription],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid grid-cols-1 items-start gap-4 self-stretch sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.div(
                            [
                              h.Class(
                                "flex w-full items-center rounded-lg bg-bg-primary px-3.5 py-2.5 text-md shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                              ),
                            ],
                            [
                              h.input([
                                h.AriaLabel(props.emailPlaceholder),
                                h.Class(
                                  "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                                ),
                                h.Name("email"),
                                h.OnInput(props.onEmail),
                                h.Placeholder(props.emailPlaceholder),
                                h.Required(true),
                                h.Type("email"),
                                h.Value(props.email),
                              ]),
                            ],
                          ),
                          h.span(
                            [h.Class("self-start text-sm text-text-tertiary")],
                            [
                              props.privacyCopy,
                              " ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                  h.OnClick(props.onPrivacy),
                                ],
                                [props.privacyLabel],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button({ label: props.submitLabel, size: "xl", type: "submit" }, h),
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
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.select(
            [
              h.AriaLabel("Categories"),
              h.Class(
                "w-full rounded-lg bg-bg-primary px-3 py-2.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring focus-visible:outline-2 md:hidden",
              ),
              h.OnChange(props.onCategorySelect),
              h.Value(props.selectedCategoryId),
            ],
            props.categories.map((category) => h.option([h.Value(category.id)], [category.label])),
          ),
          h.div(
            [h.Class("-m-1 hidden w-max self-start overflow-auto p-1 md:flex md:self-auto")],
            [
              tabs(
                {
                  ariaLabel: "Categories",
                  focusedId: props.focusedCategoryId,
                  id: "blog-header-simple-06-categories",
                  items: props.categories.map((category) => ({
                    focusMessage: props.onCategoryFocus(category.id),
                    id: category.id,
                    label: category.label,
                    selectMessage: props.onCategorySelect(category.id),
                  })),
                  selectedId: props.selectedCategoryId,
                  size: "md",
                  type: "button-minimal",
                },
                h,
              ),
            ],
          ),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2")],
            props.articles
              .slice(0, 8)
              .map((article, index) =>
                h.keyed("li")(
                  article.id,
                  [
                    h.Class(
                      `flex flex-col gap-6 xl:flex-row xl:items-start ${index >= 5 ? "hidden lg:flex" : ""}`,
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
  );
