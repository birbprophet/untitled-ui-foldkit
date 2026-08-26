/* oxlint-disable effect/noReturnInArrow, effect/noTernary, eslint/sort-keys -- Direct FoldKit transcription preserves authenticated fixture order. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface CareersCard03Job {
  readonly badgeColor: BadgeColor;
  readonly badgeText: string;
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly location: Readonly<{
    readonly city: string;
    readonly country: string;
    readonly countryCode: string;
  }>;
  readonly salary: string;
  readonly title: string;
  readonly type: string;
}
export interface CareersCard03Category {
  readonly category: string;
  readonly description: string;
  readonly id: string;
  readonly jobs: readonly CareersCard03Job[];
}
export interface CareersCard03Props<Message> {
  readonly categories: readonly CareersCard03Category[];
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly onJob: (jobId: string) => NoInfer<Message>;
}
const location = { city: "Melbourne", country: "Australia", countryCode: "AU" } as const;
export const careersCard03Categories: readonly CareersCard03Category[] = [
  {
    category: "Design",
    description: "Open positions in our design team.",
    id: "design",
    jobs: [
      {
        id: "product-designer",
        title: "Product Designer",
        description: "We're looking for a mid-level product designer to join our team.",
        href: "#",
        badgeColor: "blue",
        badgeText: "Design",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
      {
        id: "ux-designer",
        title: "UX Designer",
        description: "We're looking for a mid-level UX designer to join our team.",
        href: "#",
        badgeColor: "blue",
        badgeText: "Design",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
    ],
  },
  {
    category: "Software Development",
    description: "Open positions in our software team.",
    id: "software",
    jobs: [
      {
        id: "engineering-manager",
        title: "Engineering Manager",
        description: "We're looking for an experienced engineering manager to join our team.",
        href: "#",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        description: "We're looking for an experienced frontend developer to join our team.",
        href: "#",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
      {
        id: "backend-developer",
        title: "Backend Developer",
        description: "We're looking for an experienced backend developer to join our team.",
        href: "#",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
    ],
  },
  {
    category: "Customer Success",
    description: "Open positions in our CX team.",
    id: "customer-success",
    jobs: [
      {
        id: "customer-success-manager",
        title: "Customer Success Manager",
        description: "We're looking for a mid-level product designer to join our team.",
        href: "#",
        badgeColor: "success",
        badgeText: "Customer Success",
        salary: "80k - 100k",
        type: "Full-time",
        location,
      },
    ],
  },
];
const imageUrl = "https://www.untitledui.com/marketing/woman-artist-2.webp";
const flagUrl = new URL("careers-card-03-assets/AU.svg", import.meta.url).href;
const icon = <Message>(kind: "clock" | "salary", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          kind === "clock"
            ? "M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
            : "M12 6v12m3-9.5c-.6-.9-1.6-1.5-3-1.5-1.7 0-3 1-3 2.3 0 3.4 6 1.8 6 5.4 0 1.3-1.3 2.3-3 2.3-1.4 0-2.5-.6-3-1.5M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
const jobCard = <Message>(job: CareersCard03Job, message: Message, h: HtmlBuilder<Message>): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col rounded-2xl bg-bg-primary p-6 ring-1 ring-border-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(job.href),
      h.OnClick(message),
    ],
    [
      h.div(
        [h.Class("flex flex-col items-start gap-2 md:flex-row")],
        [
          h.h3([h.Class("text-md font-semibold text-text-primary")], [job.title]),
          h.div(
            [h.Class("flex flex-1 gap-2 md:flex-row-reverse md:justify-between")],
            [
              h.span(
                [
                  h.Class(
                    "flex items-center gap-1.5 rounded-md bg-bg-primary px-2 py-0.5 text-sm font-medium text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
                  ),
                ],
                [
                  h.img([
                    h.Alt("AU flag"),
                    h.Class("size-4 max-w-none rounded-full"),
                    h.Src(flagUrl),
                  ]),
                  h.span(
                    [],
                    [
                      job.location.city,
                      ", ",
                      h.span([h.Class("hidden md:inline-flex")], [job.location.country]),
                      h.span([h.Class("inline-flex md:hidden")], [job.location.countryCode]),
                    ],
                  ),
                ],
              ),
              badge(
                {
                  adornment: "dot",
                  color: job.badgeColor,
                  label: job.badgeText,
                  size: "md",
                  type: "modern",
                },
                h,
              ),
            ],
          ),
        ],
      ),
      h.p([h.Class("mt-2 text-md text-text-tertiary")], [job.description]),
      h.div(
        [h.Class("mt-5 flex gap-4")],
        [
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              icon("clock", h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.type]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              icon("salary", h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.salary]),
            ],
          ),
        ],
      ),
    ],
  );
export const careersCard03 = <Message>(
  props: CareersCard03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("hidden md:flex")],
                [badge({ color: "brand", label: "Careers", size: "lg", type: "pill-color" }, h)],
              ),
              h.span(
                [h.Class("md:hidden")],
                [badge({ color: "brand", label: "Careers", size: "md", type: "pill-color" }, h)],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-4 text-display-sm font-semibold text-text-primary md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 h-60 w-full md:mt-16 md:h-140")],
            [h.img([h.Alt(props.imageAlt), h.Class("size-full object-cover"), h.Src(imageUrl)])],
          ),
          h.ul(
            [h.Class("mx-auto mt-12 flex max-w-3xl flex-col gap-8 md:mt-16 md:gap-16")],
            props.categories.map((category) =>
              h.keyed("li")(
                category.id,
                [],
                [
                  h.h2(
                    [h.Class("text-lg font-semibold text-text-primary md:text-xl")],
                    [category.category],
                  ),
                  h.ul(
                    [h.Class("mt-5 flex flex-col gap-4 md:gap-6")],
                    category.jobs.map((job) =>
                      h.keyed("li")(job.id, [], [jobCard(job, props.onJob(job.id), h)]),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ],
  );
