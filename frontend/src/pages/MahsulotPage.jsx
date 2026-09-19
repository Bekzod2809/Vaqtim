import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { mahsulotlarApi } from '../api/mahsulotlar';
import { savatApi } from '../api/savat';
import { RasmYoq } from '../components/MahsulotKarta';
import SonTanlagich from '../components/SonTanlagich';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { KATEGORIYA, KEPKA_TURI, MEXANIZM } from '../constants';
import { formatNarx } from '../utils';

export default function MahsulotPage() {
  const { id } = useParams();
  const { foydalanuvchi } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [m, setM] = useState(null);
  const [tanlanganRasm, setTanlanganRasm] = useState(null);
  const [soni, setSoni] = useState(1);
  const [xato, setXato] = useState('');
  const [qoshilmoqda, setQoshilmoqda] = useState(false);
  const [qoshildi, setQoshildi] = useState(false);

  useEffect(() => {
    const yuklash = async () => {
      try {
        const natija = await mahsulotlarApi.getById(id);
        setM(natija);
        const asosiy = natija.rasmlari.find((r) => r.asosiyRasmmi) ?? natija.rasmlari[0];
        setTanlanganRasm(asosiy?.rasmHavolasi ?? null);
      } catch (err) {
        setXato(err.message);
      }
    };

    yuklash();
  }, [id]);

  const savatgaQoshish = async () => {
    // Savat faqat kirgan foydalanuvchida bo'ladi: kirgach shu sahifaga qaytaramiz
    if (!foydalanuvchi) {
      navigate('/kirish', { state: { qaytish: location.pathname } });
      return;
    }

    setQoshilmoqda(true);
    try {
      await savatApi.qoshish(m.mahsulotId, soni);
      toast("Savatga qo'shildi");
      setQoshildi(true);
      setTimeout(() => setQoshildi(false), 2500);
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setQoshilmoqda(false);
    }
  };

  if (xato) {
    return <p className="py-32 text-center text-gray-400">{xato}</p>;
  }

  if (!m) {
    return (
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2">
        <div className="skelet aspect-square" />
        <div className="space-y-4 pt-4">
          <div className="skelet h-3 w-20" />
          <div className="skelet h-10 w-3/4" />
          <div className="skelet h-7 w-1/3" />
          <div className="skelet mt-10 h-40 w-full" />
        </div>
      </section>
    );
  }

  const tugagan = m.ombordagiSoni === 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/" className="group inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-oltin">
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Katalog
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="animate-paydo">
          <div className="aspect-square overflow-hidden bg-qora-2 ring-1 ring-qora-3">
            {tanlanganRasm ? (
              // key — rasm almashganda yangisi yumshoq paydo bo'ladi
              <img key={tanlanganRasm} src={tanlanganRasm} alt={m.nomi} className="h-full w-full animate-sahifa object-cover" />
            ) : (
              <RasmYoq kategoriya={m.kategoriya} />
            )}
          </div>

          {m.rasmlari.length > 1 && (
            <div className="mt-4 flex gap-3">
              {m.rasmlari.map((r) => (
                <button
                  key={r.mahsulotRasmiId}
                  onClick={() => setTanlanganRasm(r.rasmHavolasi)}
                  className={`h-20 w-20 overflow-hidden ring-1 transition duration-300 ${
                    tanlanganRasm === r.rasmHavolasi ? 'ring-oltin' : 'opacity-60 ring-qora-3 hover:opacity-100'
                  }`}
                >
                  <img src={r.rasmHavolasi} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <p className="animate-paydo text-xs uppercase tracking-[0.3em] text-oltin" style={{ animationDelay: '100ms' }}>
            {m.brendi}
          </p>
          <h1 className="mt-3 animate-paydo font-serif text-4xl font-semibold leading-tight text-krem md:text-5xl" style={{ animationDelay: '180ms' }}>
            {m.nomi}
          </h1>

          <div className="mt-6 flex animate-paydo flex-wrap items-baseline gap-x-4" style={{ animationDelay: '260ms' }}>
            {m.chegirmaNarxi ? (
              <>
                <span className="text-3xl text-oltin">{formatNarx(m.chegirmaNarxi)}</span>
                <span className="text-gray-500 line-through">{formatNarx(m.narxi)}</span>
              </>
            ) : (
              <span className="text-3xl text-krem">{formatNarx(m.narxi)}</span>
            )}
          </div>

          <dl className="mt-10 animate-paydo divide-y divide-qora-3 border-y border-qora-3 text-sm" style={{ animationDelay: '340ms' }}>
            <Xususiyat nomi="Kategoriya" qiymat={KATEGORIYA[m.kategoriya]?.birlik} />
            <Xususiyat nomi="Rangi" qiymat={m.rangi} />
            {m.mexanizmi && <Xususiyat nomi="Mexanizm" qiymat={MEXANIZM[m.mexanizmi]} />}
            {m.kepkaTuri && <Xususiyat nomi="Turi" qiymat={KEPKA_TURI[m.kepkaTuri]} />}
            <Xususiyat nomi="Omborda" qiymat={tugagan ? 'Tugagan' : `${m.ombordagiSoni} ta`} />
          </dl>

          {m.tavsifi && (
            <p className="mt-8 animate-paydo whitespace-pre-line leading-relaxed text-gray-400" style={{ animationDelay: '420ms' }}>
              {m.tavsifi}
            </p>
          )}

          <div className="mt-10 flex animate-paydo gap-3" style={{ animationDelay: '500ms' }}>
            <SonTanlagich
              katta
              soni={soni}
              kamaytirish={() => setSoni(soni - 1)}
              oshirish={() => setSoni(soni + 1)}
              max={m.ombordagiSoni}
              disabled={tugagan}
            />
            <button onClick={savatgaQoshish} disabled={tugagan || qoshilmoqda} className="dokon-btn">
              {tugagan ? 'Tugagan' : qoshilmoqda ? "Qo'shilmoqda..." : qoshildi ? "✓ Savatga qo'shildi" : "Savatga qo'shish"}
            </button>
          </div>

          {qoshildi && (
            <Link to="/savat" className="mt-4 inline-block animate-tushish text-sm text-oltin hover:text-oltin-och">
              Savatga o'tish →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Xususiyat({ nomi, qiymat }) {
  return (
    <div className="flex justify-between py-3.5">
      <dt className="text-gray-500">{nomi}</dt>
      <dd className="text-krem">{qiymat}</dd>
    </div>
  );
}
