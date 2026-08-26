/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI brand section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface CareersSimple03BrandJob {
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly location: string;
  readonly title: string;
  readonly type: string;
}
export interface CareersSimple03BrandProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly jobs: readonly CareersSimple03BrandJob[];
  readonly onJob: (id: string) => NoInfer<Message>;
}

const icon = <Message>(kind: "clock" | "pin", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-brand-200"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    kind === "clock"
      ? [
          h.path([
            h.D(
              "M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
            ),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ]
      : [
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

const jobCard = <Message>(
  job: CareersSimple03BrandJob,
  onJob: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "-mt-px flex flex-col rounded-xs border-t border-brand_alt pt-6 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-4",
      ),
      h.Href(job.href),
      h.OnClick(onJob(job.id)),
    ],
    [
      h.h3([h.Class("text-md font-semibold text-primary_on-brand")], [job.title]),
      h.p([h.Class("mt-2 text-md text-tertiary_on-brand")], [job.description]),
      h.div(
        [h.Class("mt-5 flex gap-4")],
        [
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              icon("pin", h),
              h.span([h.Class("text-sm font-medium text-tertiary_on-brand")], [job.location]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              icon("clock", h),
              h.span([h.Class("text-sm font-medium text-tertiary_on-brand")], [job.type]),
            ],
          ),
        ],
      ),
    ],
  );

export const careersSimple03Brand = <Message>(
  props: CareersSimple03BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-brand-800 py-16 in-data-[theme=dark]:bg-bg-primary md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex max-w-3xl flex-col lg:mx-0")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-tertiary_on-brand md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-sm font-semibold text-primary_on-brand md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 md:mt-16")],
            [
              h.ul(
                [
                  h.Class(
                    "mx-auto grid max-w-3xl grid-cols-1 gap-x-16 gap-y-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-12",
                  ),
                ],
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
