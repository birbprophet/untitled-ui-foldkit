/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- Avatar fallback and adornment precedence mirror upstream. */
import { blobatarDataUri } from "avatar";
import type { AvatarKind } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps<Message> {
  readonly alt?: string;
  readonly border?: boolean;
  readonly count?: number;
  readonly entityKind?: AvatarKind;
  readonly focusable?: boolean;
  readonly initials?: string;
  readonly isImageFailed?: boolean;
  readonly onImageError?: NoInfer<Message>;
  readonly rounded?: boolean;
  readonly seed?: string;
  readonly size?: AvatarSize;
  readonly src?: string;
  readonly status?: "online" | "offline";
  readonly verified?: boolean;
}

const sizeClasses: Record<
  AvatarSize,
  {
    readonly count: string;
    readonly icon: string;
    readonly initials: string;
    readonly root: string;
    readonly status: string;
  }
> = {
  "2xl": {
    count: "-right-1 -bottom-1 min-w-6 px-1.5 text-xs",
    icon: "size-8",
    initials: "text-display-xs",
    root: "size-16",
    status: "size-4",
  },
  lg: {
    count: "-right-1 -bottom-1 min-w-5 px-1 text-[10px]",
    icon: "size-7",
    initials: "text-lg",
    root: "size-12",
    status: "size-3",
  },
  md: {
    count: "-right-1 -bottom-1 min-w-5 px-1 text-[10px]",
    icon: "size-6",
    initials: "text-md",
    root: "size-10",
    status: "size-2.5",
  },
  sm: {
    count: "-right-1 -bottom-1 min-w-4 px-1 text-[9px]",
    icon: "size-5",
    initials: "text-sm",
    root: "size-8",
    status: "size-2",
  },
  xl: {
    count: "-right-1 -bottom-1 min-w-6 px-1.5 text-xs",
    icon: "size-8",
    initials: "text-xl",
    root: "size-14",
    status: "size-3.5",
  },
  xs: {
    count: "-right-1 -bottom-1 min-w-4 px-1 text-[9px]",
    icon: "size-4",
    initials: "text-xs",
    root: "size-6",
    status: "size-1.5",
  },
};

const userIcon = <Message>(size: AvatarSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(`${sizeClasses[size].icon} text-fg-quaternary`),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M20 21a8 8 0 0 0-16 0m8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.75"),
      ]),
    ],
  );

const verifiedSizes: Record<AvatarSize, string> = {
  "2xl": "size-5",
  lg: "size-4",
  md: "size-3.5",
  sm: "size-3",
  xl: "size-4.5",
  xs: "size-2.5",
};

const verifiedTick = <Message>(size: AvatarSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaLabel("Verified"),
      h.Class(`absolute right-0 bottom-0 z-10 text-utility-blue-500 ${verifiedSizes[size]}`),
      h.Fill("none"),
      h.ViewBox("0 0 10 10"),
    ],
    [
      h.path([
        h.Class("fill-current"),
        h.D(
          "M7.72237 1.77098C7.81734 2.00068 7.99965 2.18326 8.2292 2.27858L9.03413 2.61199C9.26384 2.70714 9.44635 2.88965 9.5415 3.11936C9.63665 3.34908 9.63665 3.60718 9.5415 3.83689L9.20833 4.64125C9.11313 4.87106 9.113 5.12943 9.20863 5.35913L9.54122 6.16325C9.58839 6.27702 9.61268 6.39897 9.6127 6.52214C9.61272 6.6453 9.58847 6.76726 9.54134 6.88105C9.4942 6.99484 9.42511 7.09823 9.33801 7.18531C9.2509 7.27238 9.14749 7.34144 9.03369 7.38854L8.22934 7.72171C7.99964 7.81669 7.81706 7.99899 7.72174 8.22855L7.38833 9.03348C7.29318 9.26319 7.11067 9.4457 6.88096 9.54085C6.65124 9.636 6.39314 9.636 6.16343 9.54085L5.35907 9.20767C5.12935 9.11276 4.87134 9.11295 4.64177 9.20821L3.83684 9.54115C3.60725 9.63608 3.34937 9.636 3.11984 9.54092C2.89032 9.44585 2.70791 9.26356 2.6127 9.03409L2.27918 8.22892C2.18421 7.99923 2.0019 7.81665 1.77235 7.72133L0.967421 7.38792C0.737807 7.29281 0.555355 7.11041 0.460169 6.88083C0.364983 6.65125 0.364854 6.39327 0.45981 6.16359L0.792984 5.35924C0.8879 5.12952 0.887707 4.87151 0.792445 4.64193L0.459749 3.83642C0.41258 3.72265 0.388291 3.60069 0.388272 3.47753C0.388252 3.35436 0.412501 3.2324 0.459634 3.11861C0.506767 3.00482 0.57586 2.90144 0.662965 2.81436C0.75007 2.72728 0.853479 2.65822 0.967283 2.61113L1.77164 2.27795C2.00113 2.18306 2.1836 2.00099 2.27899 1.7717L2.6124 0.966768C2.70755 0.737054 2.89006 0.554547 3.11978 0.459397C3.34949 0.364246 3.60759 0.364246 3.83731 0.459397L4.64166 0.792571C4.87138 0.887487 5.12939 0.887293 5.35897 0.792031L6.16424 0.459913C6.39392 0.364816 6.65197 0.364836 6.88164 0.459968C7.11131 0.555099 7.29379 0.737554 7.38895 0.967208L7.72247 1.77238L7.72237 1.77098Z",
        ),
      ]),
      h.path([
        h.ClipRule("evenodd"),
        h.D(
          "M6.95829 3.68932C7.02509 3.58439 7.04747 3.45723 7.02051 3.3358C6.99356 3.21437 6.91946 3.10862 6.81454 3.04182C6.70961 2.97502 6.58245 2.95264 6.46102 2.97959C6.33959 3.00655 6.23384 3.08064 6.16704 3.18557L4.33141 6.06995L3.49141 5.01995C3.41375 4.92281 3.30069 4.8605 3.17709 4.84673C3.05349 4.83296 2.92949 4.86885 2.83235 4.94651C2.73522 5.02417 2.67291 5.13723 2.65914 5.26083C2.64536 5.38443 2.68125 5.50843 2.75891 5.60557L4.00891 7.16807C4.0555 7.22638 4.11533 7.27271 4.18344 7.30323C4.25154 7.33375 4.32595 7.34757 4.40047 7.34353C4.47499 7.3395 4.54747 7.31773 4.61188 7.28004C4.67629 7.24234 4.73077 7.18981 4.77079 7.12682L6.95829 3.68932Z",
        ),
        h.Fill("white"),
        h.FillRule("evenodd"),
      ]),
    ],
  );

const avatarAdornment = <Message>(
  props: AvatarProps<Message>,
  size: AvatarSize,
  h: HtmlBuilder<Message>,
): readonly Html[] => {
  if (props.status !== undefined) {
    return [
      h.span([
        h.AriaLabel(props.status === "online" ? "Online" : "Offline"),
        h.Class(
          `absolute right-0 bottom-0 flex justify-center rounded-full ring-[1.5px] ring-bg-primary ${sizeClasses[size].status} ${props.status === "online" ? "bg-fg-success-secondary" : "bg-utility-neutral-300"}`,
        ),
        h.Style({
          "background-image":
            "radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255,255,255,.05) 0%, rgba(255,255,255,0) 100%), radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0) 74.66%, rgba(255,255,255,.18) 100%)",
        }),
      ]),
    ];
  }
  if (props.verified === true) {
    return [verifiedTick(size, h)];
  }
  if (props.count !== undefined && props.count !== 0) {
    return [
      h.span(
        [h.AriaLabel(`${String(props.count)} more`), h.Class("absolute right-0 bottom-0 p-px")],
        [
          h.span(
            [
              h.Class(
                "flex size-3.5 items-center justify-center rounded-full bg-fg-error-primary text-center text-[10px] leading-[13px] font-bold text-white",
              ),
            ],
            [String(props.count)],
          ),
        ],
      ),
    ];
  }
  return [];
};

export const avatar = <Message>(props: AvatarProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const rounded = props.rounded !== false;
  const generated =
    props.seed === undefined
      ? undefined
      : blobatarDataUri(props.seed, {
          background: "circle",
          kind: props.entityKind ?? "agent",
          size: 128,
          title: props.alt ?? props.seed,
        });
  const imageSource = props.src ?? generated;
  const canShowImage = imageSource !== undefined && props.isImageFailed !== true;
  const imageError = props.onImageError;
  const main = canShowImage
    ? h.img([
        h.DataAttribute("avatar-img", ""),
        h.Class("size-full object-cover"),
        h.Src(imageSource),
        h.Alt(props.alt ?? ""),
        ...(imageError === undefined ? [] : [h.OnError(imageError)]),
      ])
    : props.initials === undefined
      ? userIcon(size, h)
      : h.span(
          [h.Class(`${sizeClasses[size].initials} font-semibold text-text-quaternary`)],
          [props.initials],
        );
  return h.span(
    [
      h.DataAttribute("avatar", ""),
      h.Class(
        `relative inline-flex shrink-0 ${rounded ? "rounded-full" : "rounded-[7px]"} ${props.focusable === true ? "outline-transparent group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-focus-ring" : ""} ${props.border === true ? "p-px ring-1 ring-border-secondary-alt" : ""} ${sizeClasses[size].root}`,
      ),
    ],
    [
      h.span(
        [
          h.Class(
            `relative inline-flex size-full shrink-0 items-center justify-center overflow-hidden bg-bg-tertiary outline-[0.5px] -outline-offset-[0.5px] outline-black/16 ${rounded ? "rounded-full" : "rounded-md"}`,
          ),
        ],
        [main],
      ),
      ...avatarAdornment(props, size, h),
    ],
  );
};
