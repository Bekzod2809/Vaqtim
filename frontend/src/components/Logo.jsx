import { DOKON_NOMI, SHIOR } from '../constants';

export const KREM = '#F6F2E9';
export const TOQ = '#1C1B19';
export const TILLA = '#C7A560';

// 12, 3, 6, 9 dan boshqa soatlar uchun nuqtalar (logodagi koordinatalar)
const NUQTALAR = [
  [137.0, 35.9], [164.1, 63.0], [164.1, 137.0], [137.0, 164.1],
  [63.0, 164.1], [35.9, 137.0], [35.9, 63.0], [63.0, 35.9],
];

// Siferblat: halqa, 12/3/6/9 chiziqlari va soat nuqtalari. Logo ham, jonli soat ham shuni ishlatadi
export function Siferblat({ chiziq }) {
  return (
    <>
      <circle className="logo-halqa" cx="100" cy="100" r="80" fill="none" stroke={chiziq} strokeWidth="5" />

      <g className="logo-belgilar" stroke={chiziq} strokeWidth="3" strokeLinecap="round">
        <line x1="100" y1="20" x2="100" y2="34" />
        <line x1="166" y1="100" x2="180" y2="100" />
        <line x1="100" y1="166" x2="100" y2="180" />
        <line x1="20" y1="100" x2="34" y2="100" />
        {NUQTALAR.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={chiziq} stroke="none" />
        ))}
      </g>
    </>
  );
}

// "Vaqtim — Logo" brend faylidagi belgi: siferblat va tilla rangli ikki mil.
// och = true: to'q fon uchun (krem chiziqlar), false: och fon uchun (to'q chiziqlar)
// jonli = true: ochilganda siferblat chiziladi, millar aylanib o'z joyiga keladi
export function LogoBelgi({ och = true, jonli = false, className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} ${jonli ? 'logo-jonli' : ''}`} aria-hidden="true">
      <Siferblat chiziq={och ? KREM : TOQ} />
      <line className="logo-mil logo-mil-1" x1="100" y1="100" x2="128.7" y2="141" stroke={TILLA} strokeWidth="7" strokeLinecap="round" />
      <line className="logo-mil logo-mil-2" x1="100" y1="100" x2="71.3" y2="141" stroke={TILLA} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill={TILLA} />
    </svg>
  );
}

// Belgi + "Vaqtim" yozuvi (+ ixtiyoriy shior)
export function LogoToliq({ shior = false, className = '' }) {
  return (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <LogoBelgi className="h-9 w-9 shrink-0 md:h-10 md:w-10" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-2xl font-semibold tracking-wide text-krem md:text-[1.7rem]">{DOKON_NOMI}</span>
        {shior && <span className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-oltin">{SHIOR}</span>}
      </span>
    </span>
  );
}
