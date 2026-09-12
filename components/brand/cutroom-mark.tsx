/** Crop-corner / L-bracket monogram — stroke only, ink on transparent. */
export function CutRoomMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={`cr-mark${className ? ` ${className}` : ""}`} aria-hidden>
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 9V5H9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
        <path
          d="M19 5H23V9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
        <path
          d="M23 19V23H19"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
        <path
          d="M9 23H5V19"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
        <rect
          x="9.5"
          y="9.5"
          width="9"
          height="9"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M9.5 14.5H18.5" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      </svg>
    </span>
  );
}
