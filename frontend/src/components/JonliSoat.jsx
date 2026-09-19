import { useEffect, useState } from 'react';
import { KREM, Siferblat, TILLA } from './Logo';

// Toshkent vaqti (UTC+5) — foydalanuvchi kompyuteri qaysi vaqt zonasida bo'lishidan qat'i nazar
function toshkentVaqti() {
  const qismlar = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const ol = (turi) => Number(qismlar.find((q) => q.type === turi).value);
  return { soat: ol('hour'), daqiqa: ol('minute'), soniya: ol('second') };
}

// Logodagi millar holati: 12 dan soat yo'nalishida 145° va 215° (pastga, 5 va 7 tomonga)
const LOGO_HOLATI = { soat: 145, daqiqa: 215 };

// Bosqichlar: 'logo' — logo animatsiyasi, 'burilish' — millar hozirgi vaqtga buriladi,
// 'yurish' — oddiy soatdek har soniyada bir qadam yuradi
export default function JonliSoat({ className = 'h-36 w-36' }) {
  const [bosqich, setBosqich] = useState('logo');
  const [vaqt, setVaqt] = useState(toshkentVaqti);

  useEffect(() => {
    const burilish = setTimeout(() => setBosqich('burilish'), 2400);
    const yurish = setTimeout(() => setBosqich('yurish'), 3700);
    const soniya = setInterval(() => setVaqt(toshkentVaqti()), 1000);

    return () => {
      clearTimeout(burilish);
      clearTimeout(yurish);
      clearInterval(soniya);
    };
  }, []);

  const { soat, daqiqa, soniya } = vaqt;

  // 1 soat = 30°, 1 daqiqa = 6°; soat mili daqiqaga qarab, daqiqa mili soniyaga qarab ham siljiydi
  const hozirgi = { soat: (soat % 12) * 30 + daqiqa * 0.5, daqiqa: daqiqa * 6 + soniya * 0.1 };

  // Burilishda millar orqaga aylanmasin: maqsad logodagi holatdan kichik bo'lsa, bir to'liq aylana (360°) qo'shamiz
  const oldinga = (maqsad, boshlangich) => (maqsad < boshlangich ? maqsad + 360 : maqsad);

  const burchak =
    bosqich === 'logo'
      ? LOGO_HOLATI
      : {
          soat: oldinga(hozirgi.soat, LOGO_HOLATI.soat),
          daqiqa: oldinga(hozirgi.daqiqa, LOGO_HOLATI.daqiqa),
        };

  const milUslubi = (gradus) => ({
    transform: `rotate(${gradus}deg)`,
    // Faqat burilish paytida silliq aylanadi; keyin har soniyada sakraydi — kvars soatdagidek
    transition: bosqich === 'burilish' ? 'transform 1.2s cubic-bezier(0.6, 0, 0.2, 1)' : 'none',
  });

  const soatKorinadi = bosqich !== 'logo';
  const vaqtMatni = `${String(soat).padStart(2, '0')}:${String(daqiqa).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className={`logo-jonli ${className}`} role="img" aria-label={`Toshkent vaqti ${vaqtMatni}`}>
        <Siferblat chiziq={KREM} />

        {/* Logodagi ikki mil: animatsiya bilan chiqadi, soat yurishni boshlaganda so'nadi */}
        <g className="transition-opacity duration-700" style={{ opacity: soatKorinadi ? 0 : 1 }}>
          <line className="logo-mil logo-mil-1" x1="100" y1="100" x2="128.7" y2="141" stroke={TILLA} strokeWidth="7" strokeLinecap="round" />
          <line className="logo-mil logo-mil-2" x1="100" y1="100" x2="71.3" y2="141" stroke={TILLA} strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Haqiqiy millar: hammasi 12 ga qaratib chizilgan, burchak transform bilan beriladi */}
        <g className="transition-opacity duration-700" style={{ opacity: soatKorinadi ? 1 : 0 }}>
          <line className="soat-mil" style={milUslubi(burchak.soat)} x1="100" y1="100" x2="100" y2="60" stroke={TILLA} strokeWidth="7" strokeLinecap="round" />
          <line className="soat-mil" style={milUslubi(burchak.daqiqa)} x1="100" y1="100" x2="100" y2="42" stroke={TILLA} strokeWidth="5" strokeLinecap="round" />
          <line
            className="soat-mil"
            style={{ transform: `rotate(${soniya * 6}deg)` }}
            x1="100"
            y1="114"
            x2="100"
            y2="36"
            stroke={KREM}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <circle cx="100" cy="100" r="6" fill={TILLA} />
      </svg>

      <p
        className="mt-4 text-[0.7rem] uppercase tracking-[0.35em] text-gray-500 transition-opacity duration-700"
        style={{ opacity: soatKorinadi ? 1 : 0 }}
      >
        Toshkent · {vaqtMatni}
      </p>
    </div>
  );
}
