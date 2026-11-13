import { useEffect, useState } from 'react';
import { CREAM, ClockFace, GOLD } from './Logo';

// Toshkent vaqti (UTC+5) — foydalanuvchi kompyuteri qaysi vaqt zonasida bo'lishidan qat'i nazar
function tashkentTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const getPart = (type) => Number(parts.find((q) => q.type === type).value);
  return { watch: getPart('hour'), minute: getPart('minute'), second: getPart('second') };
}

// Logodagi millar holati: 12 dan soat yo'nalishida 145° va 215° (pastga, 5 va 7 tomonga)
const LOGO_STATE = { watch: 145, minute: 215 };

// Bosqichlar: 'logo' — logo animatsiyasi, 'turn' — millar hozirgi vaqtga buriladi,
// 'tick' — oddiy soatdek har soniyada bir qadam yuradi
export default function LiveClock({ className = 'h-36 w-36' }) {
  const [step, setStep] = useState('logo');
  const [time, setTime] = useState(tashkentTime);

  useEffect(() => {
    const turn = setTimeout(() => setStep('turn'), 2400);
    const tick = setTimeout(() => setStep('tick'), 3700);
    const second = setInterval(() => setTime(tashkentTime()), 1000);

    return () => {
      clearTimeout(turn);
      clearTimeout(tick);
      clearInterval(second);
    };
  }, []);

  const { watch, minute, second } = time;

  // 1 soat = 30°, 1 daqiqa = 6°; soat mili daqiqaga qarab, daqiqa mili soniyaga qarab ham siljiydi
  const currentAngles = { watch: (watch % 12) * 30 + minute * 0.5, minute: minute * 6 + second * 0.1 };

  // Burilishda millar orqaga aylanmasin: maqsad logodagi holatdan kichik bo'lsa, bir to'liq aylana (360°) qo'shamiz
  const forward = (targetAngle, startAngle) => (targetAngle < startAngle ? targetAngle + 360 : targetAngle);

  const angle =
    step === 'logo'
      ? LOGO_STATE
      : {
          watch: forward(currentAngles.watch, LOGO_STATE.watch),
          minute: forward(currentAngles.minute, LOGO_STATE.minute),
        };

  const handStyle = (degrees) => ({
    transform: `rotate(${degrees}deg)`,
    // Faqat burilish paytida silliq aylanadi; keyin har soniyada sakraydi — kvars soatdagidek
    transition: step === 'turn' ? 'transform 1.2s cubic-bezier(0.6, 0, 0.2, 1)' : 'none',
  });

  const watchVisible = step !== 'logo';
  const timeText = `${String(watch).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className={`logo-animated ${className}`} role="img" aria-label={`Toshkent vaqti ${timeText}`}>
        <ClockFace lineColor={CREAM} />

        {/* Logodagi ikki mil: animatsiya bilan chiqadi, soat yurishni boshlaganda so'nadi */}
        <g className="transition-opacity duration-700" style={{ opacity: watchVisible ? 0 : 1 }}>
          <line className="logo-hand logo-hand-1" x1="100" y1="100" x2="128.7" y2="141" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
          <line className="logo-hand logo-hand-2" x1="100" y1="100" x2="71.3" y2="141" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Haqiqiy millar: hammasi 12 ga qaratib chizilgan, burchak transform bilan beriladi */}
        <g className="transition-opacity duration-700" style={{ opacity: watchVisible ? 1 : 0 }}>
          <line className="clock-hand" style={handStyle(angle.watch)} x1="100" y1="100" x2="100" y2="60" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
          <line className="clock-hand" style={handStyle(angle.minute)} x1="100" y1="100" x2="100" y2="42" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
          <line
            className="clock-hand"
            style={{ transform: `rotate(${second * 6}deg)` }}
            x1="100"
            y1="114"
            x2="100"
            y2="36"
            stroke={CREAM}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <circle cx="100" cy="100" r="6" fill={GOLD} />
      </svg>

      <p
        className="mt-4 text-[0.7rem] uppercase tracking-[0.35em] text-gray-500 transition-opacity duration-700"
        style={{ opacity: watchVisible ? 1 : 0 }}
      >
        Toshkent · {timeText}
      </p>
    </div>
  );
}
