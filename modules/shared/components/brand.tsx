import { cn } from "cn";

export const BRAND_NAME = "Traceless"

export const BrandLogo = (
  props: {
    className?: string,
  }
) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8 shrink-0", props.className)}
    >
      <rect width="32" height="32" rx="9" className="fill-zinc-900" />
      {/* Image frame that fades out: the picture stays, the trace doesn't */}
      <path
        d="M16 8H11a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 16v-5a3 3 0 0 0-3-3h-5"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1.5 3"
      />
      {/* Mountains */}
      <path
        d="m9 21.5 4.2-4.6a1 1 0 0 1 1.5 0L19 21.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* AI sparkle */}
      <path
        d="M19.5 10.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z"
        fill="white"
      />
    </svg>
  )
}

export const Brand = (
  props: {
    className?: string,
    hideName?: boolean,
  }
) => {
  return (
    <span className={cn("inline-flex items-center gap-2", props.className)}>
      <BrandLogo />
      {props.hideName
        ? <span className="sr-only">{BRAND_NAME}</span>
        : (
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {BRAND_NAME}
          </span>
        )}
    </span>
  )
}
