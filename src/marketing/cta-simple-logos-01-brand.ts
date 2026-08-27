/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaSimpleLogos01BrandProps<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaSimpleLogos01Brand = <Message>(props: CtaSimpleLogos01BrandProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.section([h.Class("bg-brand-section py-16 md:py-24"), h.Dir("ltr")], [
    h.div([h.Class("mx-auto max-w-container px-4 md:px-8")], [
      h.div([h.Class("grid grid-cols-1 items-start lg:grid-cols-[1fr_max-content] lg:gap-x-8")], [h.div([h.Class("max-w-3xl")], [
            h.h2([h.Class("text-display-sm font-semibold text-primary_on-brand md:text-display-md")], [props.heading]),
            h.p([h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl")], [props.description]),
          ]),
          h.div([h.Class("mt-8 flex flex-col-reverse justify-start gap-3 sm:flex-row lg:mt-0")], [
            button({ color: "secondary", label: props.secondaryLabel, onPress: props.onSecondary, size: "xl" }, h),
            button({ color: "primary", label: props.primaryLabel, onPress: props.onPrimary, size: "xl" }, h),
          ]),
          h.div([h.Class("mt-12 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start")], [
              h.img([h.Alt("Odeaolabs"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/odeao-labs.svg")]),
              h.img([h.Alt("Kintsugi"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/kintsugi.svg")]),
              h.img([h.Alt("Stackedlab"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/stacked-lab.svg")]),
              h.img([h.Alt("Magnolia"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/magnolia.svg")]),
              h.img([h.Alt("Warpspeed"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/warpspeed.svg")]),
              h.img([h.Alt("Sisyphus"), h.Class("h-9 opacity-85 md:h-10 ")], [h.Src("https://www.untitledui.com/logos/logotype/white/sisyphus.svg")]),
              h.img([h.Alt("Catalog"), h.Class("h-9 opacity-85 md:h-10 max-md:hidden")], [h.Src("https://www.untitledui.com/logos/logotype/white/catalog.svg")]),
              h.img([h.Alt("Pictelai"), h.Class("h-9 opacity-85 md:h-10 max-md:hidden")], [h.Src("https://www.untitledui.com/logos/logotype/white/pictel-ai.svg")]),
            ])]),
    ]),
  ]);
