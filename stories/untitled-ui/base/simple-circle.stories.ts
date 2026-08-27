/* oxlint-disable effect/noSpread, effect/noTernary -- Storybook CSF variant matrices stay direct. */
import * as S from "effect/Schema";
import { simpleCircle } from "../../../src/base.ts";

import { componentMeta, staticStory } from "../story.ts";

const Args = S.Struct({ value: S.Finite });

export default { ...componentMeta("simple-circle"), title: "Untitled UI/Base/Simple Circle" };

export const AllVariants = {
  ...staticStory(Args, (args, h) => simpleCircle({ value: args.value }, h)),
  args: { value: 40 },
};
export const States = {
  ...staticStory(Args, (_args, h) =>
    h.div(
      [h.Class("flex gap-8")],
      [
        simpleCircle({ value: 0 }, h),
        simpleCircle({ value: 40 }, h),
        simpleCircle({ value: 100 }, h),
      ],
    ),
  ),
  args: { value: 40 },
};
export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
      [simpleCircle({ value: args.value }, h)],
    ),
  ),
  args: { value: 40 },
};
