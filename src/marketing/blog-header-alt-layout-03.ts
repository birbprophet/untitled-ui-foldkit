/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/sort-keys -- Authenticated copy includes literal input placeholders and ordered fixtures. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { tabs } from "../application/tabs.ts";
import { avatar } from "../base/avatar.ts";
import { badge, badgeGroup } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { button } from "../base/button.ts";

export interface BlogHeaderAltLayout03Link {
  readonly href: string;
  readonly name: string;
}

export interface BlogHeaderAltLayout03Tag extends BlogHeaderAltLayout03Link {
  readonly color: BadgeColor;
}

export interface BlogHeaderAltLayout03Author extends BlogHeaderAltLayout03Link {
  readonly seed: string;
}

export interface BlogHeaderAltLayout03Article {
  readonly author: BlogHeaderAltLayout03Author;
  readonly category: BlogHeaderAltLayout03Link;
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly BlogHeaderAltLayout03Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderAltLayout03Tab {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderAltLayout03Props<Message> {
  readonly articles: readonly BlogHeaderAltLayout03Article[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly loadMoreLabel: string;
  readonly onArticle: (articleId: string) => NoInfer<Message>;
  readonly onAuthor: (articleId: string) => NoInfer<Message>;
  readonly onCategory: (articleId: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onLoadMore: NoInfer<Message>;
  readonly onSearchInput: (search: string) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly onTabFocus: (tabId: string) => NoInfer<Message>;
  readonly onTabSelect: (tabId: string) => NoInfer<Message>;
  readonly onTag: (articleId: string, tagName: string) => NoInfer<Message>;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly search: string;
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly selectedTabId: string;
  readonly subscribeLabel: string;
  readonly tabs: readonly BlogHeaderAltLayout03Tab[];
}

export const blogHeaderAltLayout03Tabs: readonly BlogHeaderAltLayout03Tab[] = [
  { id: "all", label: "View all" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "customer-success", label: "Customer Success" },
];

export const blogHeaderAltLayout03Articles: readonly BlogHeaderAltLayout03Article[] = [
  {
    id: "article-1",
    title: "UX review presentations",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    href: "#",
    category: { name: "Design", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Olivia Rhye", href: "#", seed: "olivia-rhye" },
    tags: [
      { name: "Design", color: "brand", href: "#" },
      { name: "Research", color: "indigo", href: "#" },
      { name: "Presentation", color: "pink", href: "#" },
    ],
    isFeatured: true,
  },
  {
    id: "article-2",
    title: "Migrating to Linear 101",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    href: "#",
    category: { name: "Product", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    publishedAt: "19 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Phoenix Baker", href: "#", seed: "phoenix-baker" },
    tags: [
      { name: "Product", color: "sky", href: "#" },
      { name: "Tools", color: "pink", href: "#" },
      { name: "SaaS", color: "pink", href: "#" },
    ],
  },
  {
    id: "article-3",
    title: "Building your API stack",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    href: "#",
    category: { name: "Software Engineering", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Lana Steiner", href: "#", seed: "lana-steiner" },
    tags: [
      { name: "Software Development", color: "success", href: "#" },
      { name: "Tools", color: "pink", href: "#" },
    ],
  },
  {
    id: "article-3.5",
    title: "Bill Walsh leadership lessons",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    href: "#",
    category: { name: "Product", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Alec Whitten", href: "#", seed: "alec-whitten" },
    tags: [
      { name: "Leadership", color: "brand", href: "#" },
      { name: "Management", color: "slate", href: "#" },
    ],
  },
  {
    id: "article-4",
    title: "PM mental models",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    href: "#",
    category: { name: "Product", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Demi Wilkinson", href: "#", seed: "demi-wilkinson" },
    tags: [
      { name: "Product", color: "sky", href: "#" },
      { name: "Research", color: "indigo", href: "#" },
      { name: "Frameworks", color: "orange", href: "#" },
    ],
  },
  {
    id: "article-5",
    title: "What is wireframing?",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    href: "#",
    category: { name: "Design", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Candice Wu", href: "#", seed: "candice-wu" },
    tags: [
      { name: "Design", color: "brand", href: "#" },
      { name: "Research", color: "indigo", href: "#" },
    ],
  },
  {
    id: "article-6",
    title: "How collaboration makes us better designers",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    href: "#",
    category: { name: "Design", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Natali Craig", href: "#", seed: "natali-craig" },
    tags: [
      { name: "Design", color: "brand", href: "#" },
      { name: "Research", color: "indigo", href: "#" },
    ],
  },
  {
    id: "article-7",
    title: "Our top 10 Javascript frameworks to use",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    href: "#",
    category: { name: "Product", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Drew Cano", href: "#", seed: "drew-cano" },
    tags: [
      { name: "Software Development", color: "success", href: "#" },
      { name: "Tools", color: "pink", href: "#" },
      { name: "SaaS", color: "pink", href: "#" },
    ],
  },
  {
    id: "article-8",
    title: "Podcast: Creating a better CX Community",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    href: "#",
    category: { name: "Customer Success", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Orlando Diggs", href: "#", seed: "orlando-diggs" },
    tags: [
      { name: "Podcasts", color: "brand", href: "#" },
      { name: "Customer Success", color: "slate", href: "#" },
    ],
  },
];

const arrowIcon = <Message>(kind: "down" | "up-right", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(kind === "down" ? "size-5" : "mt-0.5 size-5 shrink-0 text-fg-quaternary"),
      h.DataAttribute("icon", kind),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          kind === "down"
            ? "M10 4.167v11.666m0 0 4.167-4.166M10 15.833l-4.167-4.166"
            : "M5.833 14.167 14.167 5.833m0 0H5.833m8.334 0v8.334",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const searchIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.circle([h.Cx("9"), h.Cy("9"), h.R("5.75"), h.Stroke("currentColor"), h.StrokeWidth("1.5")]),
      h.path([
        h.D("m13.25 13.25 3.5 3.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderAltLayout03Article,
  props: BlogHeaderAltLayout03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
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
        [h.Class("flex flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [
                  article.author.name,
                  " • ",
                  h.time([h.Datetime(article.publishedAt)], [article.publishedAt]),
                ],
              ),
              h.div(
                [h.Class("flex w-full flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.onCategory(article.id)),
                    ],
                    [article.title, arrowIcon("up-right", h)],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            article.tags.map((tag) =>
              h.keyed("a")(
                tag.name,
                [
                  h.Class(
                    "rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(tag.href),
                  h.OnClick(props.onTag(article.id, tag.name)),
                ],
                [badge({ color: tag.color, label: tag.name, size: "md", type: "pill-color" }, h)],
              ),
            ),
          ),
        ],
      ),
    ],
  );

const featuredArticle = <Message>(
  article: BlogHeaderAltLayout03Article,
  props: BlogHeaderAltLayout03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("mx-auto hidden max-w-container px-4 md:block md:px-8")],
    [
      h.div(
        [h.Class("flex flex-col gap-8 lg:flex-row xl:items-start")],
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
                h.Class("aspect-[1.5] w-full object-cover lg:w-125 xl:h-103 xl:w-206"),
                h.Src(article.thumbnailUrl),
              ]),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-6")],
            [
              h.div(
                [h.Class("flex flex-col gap-4")],
                [
                  badgeGroup(
                    {
                      addonText: article.category.name,
                      color: "brand",
                      label: article.readingTime,
                      size: "md",
                      theme: "light",
                    },
                    h,
                  ),
                  h.div(
                    [h.Class("flex flex-col gap-2")],
                    [
                      h.a(
                        [
                          h.Class(
                            "flex justify-between gap-x-4 rounded-md text-xl font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:text-display-xs",
                          ),
                          h.Href(article.category.href),
                          h.OnClick(props.onCategory(article.id)),
                        ],
                        [article.title],
                      ),
                      h.p(
                        [h.Class("line-clamp-2 text-md text-text-tertiary lg:line-clamp-none")],
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
                      h.Href(article.author.href),
                      h.OnClick(props.onAuthor(article.id)),
                      h.Tabindex(-1),
                    ],
                    [
                      avatar(
                        {
                          alt: article.author.name,
                          focusable: true,
                          seed: article.author.seed,
                          size: "md",
                        },
                        h,
                      ),
                    ],
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
                                "rounded text-sm font-semibold text-text-primary outline-focus-ring hover:text-text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
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
      ),
    ],
  );

export const blogHeaderAltLayout03 = <Message>(
  props: BlogHeaderAltLayout03Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const [featured] = props.articles;
  return h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex w-full max-w-3xl flex-col")],
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
                          h.div(
                            [h.Class("py-0.5")],
                            [
                              h.input([
                                h.AriaLabel(props.emailLabel),
                                h.Class(
                                  "min-h-12 w-full rounded-lg bg-bg-primary px-3.5 py-2.5 text-md text-text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2",
                                ),
                                h.Name("email"),
                                h.OnInput(props.onEmailInput),
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
                              `${props.privacyPrefix} `,
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                ],
                                [props.privacyLabel],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          label: props.subscribeLabel,
                          size: "xl",
                          type: "submit",
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
      ...(featured === undefined ? [] : [featuredArticle(featured, props, h)]),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:gap-16 md:px-8 md:pt-16 md:pb-24",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-12")],
            [
              h.div(
                [h.Class("flex flex-col items-end gap-8 md:flex-row")],
                [
                  h.div(
                    [h.Class("hidden flex-1 self-start overflow-auto md:flex md:self-auto")],
                    [
                      tabs(
                        {
                          ariaLabel: "Blog categories",
                          id: "blog-header-alt-layout-03-tabs",
                          items: props.tabs.map((tab) => ({
                            focusMessage: props.onTabFocus(tab.id),
                            id: tab.id,
                            label: tab.label,
                            selectMessage: props.onTabSelect(tab.id),
                          })),
                          selectedId: props.selectedTabId,
                          size: "md",
                          type: "button-brand",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("flex w-full flex-col gap-1.5 md:w-70")],
                    [
                      h.div(
                        [
                          h.Class(
                            "flex min-h-11 w-full items-center gap-2 rounded-lg bg-bg-primary px-3.5 py-2.5 text-md shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring focus-within:outline-2 focus-within:outline-offset-2",
                          ),
                        ],
                        [
                          searchIcon(h),
                          h.input([
                            h.AriaLabel(props.searchLabel),
                            h.Class(
                              "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                            ),
                            h.Name("search"),
                            h.OnInput(props.onSearchInput),
                            h.Placeholder(props.searchPlaceholder),
                            h.Type("text"),
                            h.Value(props.search),
                          ]),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              h.ul(
                [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2 xl:grid-cols-3")],
                props.articles
                  .slice(0, 7)
                  .map((article, index) =>
                    h.keyed("li")(
                      article.id,
                      [
                        h.Class(
                          `${index === 0 ? "md:hidden" : ""} ${index >= 6 ? "hidden lg:block" : ""}`,
                        ),
                      ],
                      [articleCard(article, props, h)],
                    ),
                  ),
              ),
            ],
          ),
          h.div(
            [h.Class("flex w-full flex-col md:w-auto md:flex-row md:justify-center")],
            [
              button(
                {
                  color: "secondary",
                  iconLeadingElement: arrowIcon("down", h),
                  label: props.loadMoreLabel,
                  onPress: props.onLoadMore,
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
};
