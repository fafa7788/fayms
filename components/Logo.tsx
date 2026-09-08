export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M62 30 H150 L100 80 H78 V110 L48 140 V70 C48 48 53 30 62 30 Z"
        fill="currentColor"
      />
      <path d="M150 78 V170 L100 170 V128 L150 78 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  size = 28,
  showWordmark = true,
  className = "",
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-[var(--text)] ${className}`}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className="font-display font-semibold tracking-tight"
          style={{ fontSize: size * 0.72 }}
        >
          FAYMS
        </span>
      )}
    </span>
  );
}
