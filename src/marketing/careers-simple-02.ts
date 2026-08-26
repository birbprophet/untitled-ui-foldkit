/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface CareersSimple02Job {
  readonly badgeColor: BadgeColor;
  readonly badgeText: string;
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly location: string;
  readonly title: string;
  readonly type: string;
}

export interface CareersSimple02Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly jobs: readonly CareersSimple02Job[];
  readonly onJob: (id: string) => NoInfer<Message>;
}

const pinIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
        h.Stroke("currentColor"),
        h.StrokeWidth("2"),
      ]),
      h.path([
        h.D("M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const clockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const jobCard = <Message>(
  job: CareersSimple02Job,
  onJob: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "relative flex flex-col rounded-xs pt-6 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-4",
      ),
      h.Href(job.href),
      h.OnClick(onJob(job.id)),
    ],
    [
      h.div([h.Class("absolute top-0 h-px w-full border-t border-border-secondary")]),
      h.div(
        [h.Class("flex flex-col items-start gap-2 md:flex-row md:items-center")],
        [
          h.h3([h.Class("text-md font-semibold text-text-primary")], [job.title]),
          h.div(
            [h.Class("ml-0.5")],
            [
              badge(
                {
                  adornment: "dot",
                  color: job.badgeColor,
                  label: job.badgeText,
                  size: "md",
                  type: "pill-color",
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
              pinIcon(h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.location]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [clockIcon(h), h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.type])],
          ),
        ],
      ),
    ],
  );

export const careersSimple02 = <Message>(
  props: CareersSimple02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [
              h.Class(
                "mx-auto grid max-w-3xl grid-cols-1 gap-12 md:gap-16 lg:max-w-none lg:grid-cols-2",
              ),
            ],
            [
              h.div(
                [h.Class("flex flex-col")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
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
              h.ul(
                [h.Class("flex flex-col gap-8")],
                props.jobs.map((job) =>
                  h.keyed("li")(
                    job.id,
                    [h.DataAttribute("job-id", job.id)],
                    [jobCard(job, props.onJob, h)],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
