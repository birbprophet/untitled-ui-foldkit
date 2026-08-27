/* oxlint-disable effect/noSpread, mps/require-is-prefix-for-boolean-schema-field -- `reversed` is the exact upstream ChartLegendContent prop. */
import * as S from "effect/Schema";
import { chartsBase } from "ui/application";

import { componentMeta, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  align: S.Literals(["left", "center", "right"]),
  layout: S.Literals(["horizontal", "vertical"]),
  reversed: S.Boolean,
});
type Model = typeof Args.Type;
type Message = Readonly<{ _tag: "Noop" }>;

const items = [
  { colorClass: "text-utility-brand-600", label: "Revenue" },
  { colorClass: "text-utility-blue-600", label: "Expenses" },
  { colorClass: "text-utility-success-600", label: "Profit" },
] as const;

const definition = {
  Args,
  Model: Args,
  init: (args: Model) => args,
  update: (model: Model) => model,
  view: (model: Model, h: Parameters<typeof chartsBase<Message>>[1]) =>
    chartsBase(
      {
        align: model.align,
        items,
        kind: "legend",
        layout: model.layout,
        reversed: model.reversed,
      },
      h,
    ),
} as const;

export default {
  ...componentMeta("charts-base"),
  title: "Untitled UI/Application/Charts Base",
};

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (_model, h) =>
      matrix(
        [
          [
            "Horizontal legend",
            [chartsBase({ align: "left", items, kind: "legend", layout: "horizontal" }, h)],
          ],
          [
            "Vertical legend",
            [
              chartsBase(
                { align: "left", items, kind: "legend", layout: "vertical", reversed: true },
                h,
              ),
            ],
          ],
          [
            "Single-point tooltip",
            [chartsBase({ kind: "tooltip", secondaryTitle: "Revenue", title: "$48,574" }, h)],
          ],
          [
            "Multi-point tooltip",
            [
              chartsBase(
                {
                  items: [
                    { label: "Revenue", value: "$48,574" },
                    { label: "Expenses", value: "$26,240" },
                  ],
                  kind: "tooltip",
                  title: "August 2026",
                },
                h,
              ),
            ],
          ],
          ["Active dot", [chartsBase({ kind: "active-dot" }, h)]],
        ],
        h,
      ),
  }),
  args: { align: "left", layout: "horizontal", reversed: false },
};

export const States = {
  ...liveStory(definition),
  args: { align: "right", layout: "horizontal", reversed: true },
};

export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (_model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [
          chartsBase(
            {
              items: [
                { label: "Revenue", value: "$48,574" },
                { label: "Expenses", value: "$26,240" },
              ],
              kind: "tooltip",
              title: "August 2026",
            },
            h,
          ),
        ],
      ),
  }),
  args: { align: "left", layout: "horizontal", reversed: false },
};
