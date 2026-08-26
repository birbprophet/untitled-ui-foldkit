/* oxlint-disable effect/noReturnInArrow, foldkit/prefer-callable-message-constructor -- The one-shot mount mirrors the authenticated calendar's initial earliest-event scroll. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import type { MountAction } from "foldkit/mount";
import * as Mount from "foldkit/mount";

const CalendarInitialScrollCompleted = S.Struct({
  _tag: S.Literal("CalendarInitialScrollCompleted"),
});

const ScrollCalendarToFirstEvent = Mount.define(
  "ScrollCalendarToFirstEvent",
  CalendarInitialScrollCompleted,
)((element) =>
  Effect.sync(() => {
    element.scrollTop = 864;
    return { _tag: "CalendarInitialScrollCompleted" } as const;
  }),
);

export const scrollCalendarToFirstEvent = <Message>(
  completed: NoInfer<Message>,
): MountAction<Message> => Mount.mapMessage(ScrollCalendarToFirstEvent(), () => completed);
