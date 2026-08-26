/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, eslint/sort-keys -- Direct FoldKit transcription preserves authenticated article and tag order. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { button } from "../base/button.ts";

export interface BlogSectionCarouselLayout02Link {
  readonly href: string;
  readonly name: string;
}

export interface BlogSectionCarouselLayout02Tag extends BlogSectionCarouselLayout02Link {
  readonly color: BadgeColor;
}

export interface BlogSectionCarouselLayout02Author extends BlogSectionCarouselLayout02Link {
  readonly seed: string;
}

export interface BlogSectionCarouselLayout02Article {
  readonly author: BlogSectionCarouselLayout02Author;
  readonly category: BlogSectionCarouselLayout02Link;
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly BlogSectionCarouselLayout02Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogSectionCarouselLayout02Props<Message> {
  readonly articles: readonly BlogSectionCarouselLayout02Article[];
  readonly description: string;
  readonly heading: string;
  readonly nextLabel: string;
  readonly onArticle: (articleId: string) => NoInfer<Message>;
  readonly onCategory: (articleId: string) => NoInfer<Message>;
  readonly onNext: NoInfer<Message>;
  readonly onPrevious: NoInfer<Message>;
  readonly onTag: (articleId: string, tagName: string) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly previousLabel: string;
  readonly selectedIndex: number;
  readonly viewAllLabel: string;
}

export const blogSectionCarouselLayout02Articles: readonly BlogSectionCarouselLayout02Article[] = [
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
    title: "PM mental models",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    href: "#",
    category: { name: "Product", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Demi Wilkinson", href: "#", seed: "demi-wilkinson" },
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
    thumbnailUrl: "https://www.untitledui.com/marketing/brainstorming.webp",
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
    title: "What is Wireframing?",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    href: "#",
    category: { name: "Design", href: "#" },
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-4.webp",
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
    thumbnailUrl: "https://www.untitledui.com/marketing/collaboration.webp",
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
    thumbnailUrl: "https://www.untitledui.com/marketing/man-and-laptop-2.webp",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Drew Cano", href: "#", seed: "drew-cano" },
    tags: [
      { name: "Software development", color: "success", href: "#" },
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
    thumbnailUrl: "https://www.untitledui.com/marketing/podcast-girl-2.webp",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    author: { name: "Orlando Diggs", href: "#", seed: "orlando-diggs" },
    tags: [
      { name: "Podcasts", color: "brand", href: "#" },
      { name: "Customer success", color: "slate", href: "#" },
    ],
  },
];

const arrow = <Message>(direction: "left" | "right" | "up-right", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        direction === "up-right"
          ? "mt-0.5 size-5 shrink-0 text-fg-quaternary"
          : "size-5 text-fg-quaternary transition-inherit-all group-hover:text-fg-quaternary-hover md:size-6",
      ),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(
          direction === "left"
            ? "m12.5 15-5-5 5-5"
            : direction === "right"
              ? "m7.5 5 5 5-5 5"
              : "M5.833 14.167 14.167 5.833m0 0H5.833m8.334 0v8.334",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const roundButton = <Message>(
  direction: "left" | "right",
  label: string,
  disabled: boolean,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "group flex size-12 cursor-pointer items-center justify-center rounded-full bg-bg-primary ring-1 ring-border-secondary backdrop-blur transition duration-100 ease-linear ring-inset outline-focus-ring hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:size-14",
      ),
      h.Disabled(disabled),
      h.OnClick(message),
      h.Type("button"),
    ],
    [arrow(direction, h)],
  );

const articleCard = <Message>(
  article: BlogSectionCarouselLayout02Article,
  props: BlogSectionCarouselLayout02Props<Message>,
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
                [article.author.name, " • ", h.time([], [article.publishedAt])],
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
                    [article.title, arrow("up-right", h)],
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

const keyboardMessage = <Message>(
  props: BlogSectionCarouselLayout02Props<Message>,
  maxIndex: number,
  key: string,
): Option.Option<Message> => {
  if (key === "ArrowLeft" && props.selectedIndex > 0) {
    return Option.some(props.onPrevious);
  }
  if (key === "ArrowRight" && props.selectedIndex < maxIndex) {
    return Option.some(props.onNext);
  }
  return Option.none();
};

export const blogSectionCarouselLayout02 = <Message>(
  props: BlogSectionCarouselLayout02Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const articles = props.articles.slice(0, 4);
  const maxIndex = Math.max(0, articles.length - 1);
  const index = Math.max(0, Math.min(props.selectedIndex, maxIndex));
  return h.section(
    [h.Class("overflow-hidden bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col items-start justify-between lg:flex-row")],
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
              h.div(
                [h.Class("hidden gap-3 lg:flex")],
                [button({ label: props.viewAllLabel, onPress: props.onViewAll, size: "xl" }, h)],
              ),
            ],
          ),
          h.div(
            [
              h.AriaLabel("Latest writings"),
              h.Attribute("aria-roledescription", "carousel"),
              h.Class("mt-12 outline-none md:mt-16"),
              h.OnKeyDownPreventDefault((key) => keyboardMessage(props, maxIndex, key)),
              h.Role("region"),
              h.Tabindex(0),
            ],
            [
              h.ul(
                [
                  h.Class(
                    "flex [--carousel-step:21.5rem] gap-6 pr-4 transition-transform duration-300 ease-out motion-reduce:transition-none md:[--carousel-step:26rem] md:gap-8 md:pr-8",
                  ),
                  h.Style({
                    transform: `translateX(calc(var(--carousel-step) * -${String(index)}))`,
                  }),
                ],
                articles.map((article, articleIndex) =>
                  h.keyed("li")(
                    article.id,
                    [
                      h.Attribute("aria-roledescription", "slide"),
                      h.AriaLabel(`${String(articleIndex + 1)} of ${String(articles.length)}`),
                      h.Class("w-full max-w-xs shrink-0 md:max-w-96"),
                      h.Role("group"),
                    ],
                    [articleCard(article, props, h)],
                  ),
                ),
              ),
              h.div(
                [h.Class("mt-8 flex gap-4 md:gap-8")],
                [
                  roundButton("left", props.previousLabel, index === 0, props.onPrevious, h),
                  roundButton("right", props.nextLabel, index === maxIndex, props.onNext, h),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 flex flex-col gap-3 lg:hidden")],
            [button({ label: props.viewAllLabel, onPress: props.onViewAll, size: "xl" }, h)],
          ),
        ],
      ),
    ],
  );
};
