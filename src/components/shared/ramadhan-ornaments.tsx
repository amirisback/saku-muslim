
/**
 * Fanous (Lentera Ramadhan) - Pure SVG Vector
 * Menghadirkan simbol lentera Ramadhan dengan kubah, kaca, rangka, dan lilin hangat di dalamnya.
 */
export function FanousIcon({
  className = "w-6 h-6",
  glowing = false,
}: {
  className?: string;
  glowing?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${
        glowing ? "drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]" : ""
      }`}
      aria-hidden="true"
    >
      {/* Hanging Chain / Top Ring */}
      <line
        x1="32"
        y1="0"
        x2="32"
        y2="12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="15" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Lantern Cap (Kubah Atas) */}
      <path
        d="M20 25C20 20 25 18 32 18C39 18 44 20 44 25L48 29H16L20 25Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <rect x="18" y="28" width="28" height="3" rx="1.5" fill="currentColor" />

      {/* Glass Body (Badan Kaca Lentera) */}
      <path
        d="M17 31L22 60H42L47 31H17Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Internal Candle & Warm Flame (Cahaya Lentera) */}
      <ellipse cx="32" cy="46" rx="5" ry="8" fill="#FBBF24" fillOpacity="0.8" />
      <circle cx="32" cy="45" r="2.5" fill="#FFFBEB" />
      <path
        d="M32 36C32 36 34 39 34 41C34 42.1 33.1 43 32 43C30.9 43 30 42.1 30 41C30 39 32 36 32 36Z"
        fill="#F59E0B"
      />

      {/* Structural Ribs (Rangka Logam Kaca) */}
      <line
        x1="27"
        y1="31"
        x2="29"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <line
        x1="37"
        y1="31"
        x2="35"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <line
        x1="19"
        y1="45"
        x2="45"
        y2="45"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.5"
      />

      {/* Base / Pedestal (Kaki Penyangga Lentera) */}
      <rect x="20" y="60" width="24" height="4" rx="1" fill="currentColor" fillOpacity="0.85" />
      <path d="M22 64L19 72H45L42 64H22Z" fill="currentColor" fillOpacity="0.9" />
      <rect x="17" y="72" width="30" height="3" rx="1.5" fill="currentColor" />

      {/* Bottom Finial (Pucuk Bawah) */}
      <polygon points="32,80 29,75 35,75" fill="currentColor" />
    </svg>
  );
}

/**
 * Hilal & Bintang 8 (Khatim Al-Sulayman) - Pure SVG Vector
 */
export function HilalStarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crescent Moon (Bulan Sabit Emas) */}
      <path
        d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C27.8 44 31.35 42.94 34.4 41.1C24.8 38.6 17.6 29.9 17.6 19.5C17.6 13.5 20.1 8.1 24.2 4.3C24.13 4.2 24.07 4.1 24 4Z"
        fill="currentColor"
      />
      {/* 8-Point Islamic Star (Bintang Delapan) */}
      <g transform="translate(32, 16) scale(0.65)">
        <polygon
          points="0,-12 3.5,-3.5 12,0 3.5,3.5 0,12 -3.5,3.5 -12,0 -3.5,-3.5"
          fill="currentColor"
        />
        <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
      </g>
    </svg>
  );
}

/**
 * Arabesque Seamless Geometric Pattern
 * Menghadirkan siluet ornamen arsitektur Islam transparan.
 */
export function ArabesquePattern({ className }: { className?: string }) {
  return (
    <svg
      className={
        className ||
        "absolute -right-8 -top-8 w-80 h-80 opacity-[0.06] text-amber-300 pointer-events-none select-none"
      }
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
      <polygon
        points="100,10 126,74 190,100 126,126 100,190 74,126 10,100 74,74"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon
        points="100,30 149,49 170,100 149,151 100,170 51,151 30,100 51,49"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
      <polygon
        points="100,75 118,88 125,100 118,112 100,125 82,112 75,100 82,88"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * RamadhanBadge Pill
 * Badge aksen bertema Ramadhan Kareem
 */
export function RamadhanBadge({
  text = "Ramadhan 1448 H",
  variant = "gold",
  className = "",
}: {
  text?: string;
  variant?: "gold" | "emerald";
  className?: string;
}) {
  const styles =
    variant === "gold"
      ? "bg-amber-100/90 text-amber-900 border-amber-300/80 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/60"
      : "bg-emerald-100/90 text-emerald-900 border-emerald-300/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700/60";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs tracking-wide transition-all ${styles} ${className}`}
    >
      <FanousIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
      <span>{text}</span>
    </div>
  );
}
