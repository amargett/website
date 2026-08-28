// The site's mark: the old circuit-vine redrawn as one still plotter figure —
// copper traces with 45° bends, via rings at each branch junction on the trunk,
// leaves at the trace ends.

export default function Sapling({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="180"
      height="168"
      viewBox="0 0 180 168"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M90 156 L90 44" />
        <path d="M90 120 L64 94 L64 76" />
        <path d="M90 132 L122 100 L122 84" />
        <path d="M90 72 L74 56 L74 40" />
        <path d="M90 84 L108 66 L108 50" />
      </g>
      <g stroke="var(--green)" strokeWidth="1.3" fill="none">
        <path d="M64 76 C56 68 56 58 62 52 C70 57 71 68 64 76 Z" />
        <path d="M122 84 C130 76 130 66 124 60 C116 65 115 76 122 84 Z" />
        <path d="M74 40 C66 32 66 22 72 16 C80 21 81 32 74 40 Z" />
        <path d="M108 50 C116 42 116 32 110 26 C102 31 101 42 108 50 Z" />
        <path d="M90 44 C85 36 86 27 91 22 C96 28 95 37 90 44 Z" />
      </g>
      <g stroke="var(--copper)" strokeWidth="1.3" fill="var(--paper)">
        <circle cx="90" cy="120" r="3.2" />
        <circle cx="90" cy="132" r="3.2" />
        <circle cx="90" cy="84" r="3.2" />
        <circle cx="90" cy="72" r="3.2" />
      </g>
      <path
        d="M66 156 L114 156"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M75 161 L105 161 M82 166 L98 166"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
