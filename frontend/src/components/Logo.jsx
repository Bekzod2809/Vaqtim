import { STORE_NAME, TAGLINE } from '../constants';

export const CREAM = '#F6F2E9';
export const DARK = '#1C1B19';
export const GOLD = '#C7A560';

// 12, 3, 6, 9 dan boshqa soatlar uchun nuqtalar (logodagi koordinatalar)
const DOTS = [
  [137.0, 35.9], [164.1, 63.0], [164.1, 137.0], [137.0, 164.1],
  [63.0, 164.1], [35.9, 137.0], [35.9, 63.0], [63.0, 35.9],
];

// Siferblat: halqa, 12/3/6/9 chiziqlari va soat nuqtalari. Logo ham, jonli soat ham shuni ishlatadi
export function ClockFace({ lineColor }) {
  return (
    <>
      <circle className="logo-ring" cx="100" cy="100" r="80" fill="none" stroke={lineColor} strokeWidth="5" />

      <g className="logo-marks" stroke={lineColor} strokeWidth="3" strokeLinecap="round">
        <line x1="100" y1="20" x2="100" y2="34" />
        <line x1="166" y1="100" x2="180" y2="100" />
        <line x1="100" y1="166" x2="100" y2="180" />
        <line x1="20" y1="100" x2="34" y2="100" />
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={lineColor} stroke="none" />
        ))}
      </g>
    </>
  );
}

// "Vaqtim — Logo" brend faylidagi belgi: siferblat va tilla rangli ikki mil.
// och = true: to'q fon uchun (krem chiziqlar), false: och fon uchun (to'q chiziqlar)
// jonli = true: ochilganda siferblat chiziladi, millar aylanib o'z joyiga keladi
export function LogoMark({ light = true, animated = false, className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} ${animated ? 'logo-animated' : ''}`} aria-hidden="true">
      <ClockFace lineColor={light ? CREAM : DARK} />
      <line className="logo-hand logo-hand-1" x1="100" y1="100" x2="128.7" y2="141" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
      <line className="logo-hand logo-hand-2" x1="100" y1="100" x2="71.3" y2="141" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill={GOLD} />
    </svg>
  );
}

// Belgi + "Vaqtim" yozuvi (+ ixtiyoriy shior)
export function FullLogo({ tagline = false, className = '' }) {
  return (
    <span className={`group inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0 md:h-10 md:w-10" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-serif text-[1.4rem] font-semibold tracking-wide text-cream sm:text-2xl md:text-[1.7rem]">{STORE_NAME}</span>
        {tagline && (
          <span className="mt-1 truncate text-[0.55rem] uppercase tracking-[0.25em] text-gold sm:text-[0.6rem] sm:tracking-[0.35em]">
            {TAGLINE}
          </span>
        )}
      </span>
    </span>
  );
}
