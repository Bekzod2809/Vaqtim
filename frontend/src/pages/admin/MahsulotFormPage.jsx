import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mahsulotlarApi } from '../../api/mahsulotlar';
import { useToast } from '../../context/ToastContext';
import { KATEGORIYA, KEPKA_TURI, MEXANIZM } from '../../constants';
import { maydonXatolari } from '../../utils';

const BOSH_FORMA = {
  nomi: '',
  tavsifi: '',
  brendi: '',
  rangi: '',
  narxi: '',
  chegirmaNarxi: '',
  ombordagiSoni: '',
  mexanizmi: 1,
  turi: 1,
};

export default function MahsulotFormPage() {
  const { id } = useParams();
  const tahrirlash = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [kategoriya, setKategoriya] = useState(1);
  const [forma, setForma] = useState(BOSH_FORMA);
  const [rasmlar, setRasmlar] = useState([]); // bazadagi rasmlar (faqat tahrirlashda)
  const [yangiFayllar, setYangiFayllar] = useState([]);
  const [yangisiAsosiy, setYangisiAsosiy] = useState(false);
  const [xatolar, setXatolar] = useState({});
  const [yuklanmoqda, setYuklanmoqda] = useState(tahrirlash);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);

  const mahsulotniYuklash = async () => {
    try {
      const m = await mahsulotlarApi.getById(id);
      setKategoriya(m.kategoriya);
      setForma({
        nomi: m.nomi,
        tavsifi: m.tavsifi ?? '',
        brendi: m.brendi,
        rangi: m.rangi,
        narxi: m.narxi,
        chegirmaNarxi: m.chegirmaNarxi ?? '',
        ombordagiSoni: m.ombordagiSoni,
        mexanizmi: m.mexanizmi ?? 1,
        turi: m.kepkaTuri ?? 1,
      });
      setRasmlar(m.rasmlari);
    } catch (err) {
      toast(err.message, 'xato');
      navigate('/admin/mahsulotlar');
    } finally {
      setYuklanmoqda(false);
    }
  };

  useEffect(() => {
    if (tahrirlash) {
      mahsulotniYuklash();
    }
  }, [id]);

  const ozgartirish = (e) => setForma({ ...forma, [e.target.name]: e.target.value });

  const payloadYasash = () => {
    const payload = {
      nomi: forma.nomi,
      tavsifi: forma.tavsifi || null,
      brendi: forma.brendi,
      rangi: forma.rangi,
      narxi: Number(forma.narxi),
      chegirmaNarxi: forma.chegirmaNarxi === '' ? null : Number(forma.chegirmaNarxi),
      ombordagiSoni: Number(forma.ombordagiSoni),
    };

    // Faqat soat va kepkaning o'ziga xos maydoni bor
    if (kategoriya === 1) payload.mexanizmi = Number(forma.mexanizmi);
    if (kategoriya === 3) payload.turi = Number(forma.turi);

    return payload;
  };

  const saqlash = async (e) => {
    e.preventDefault();
    setXatolar({});
    setSaqlanmoqda(true);

    let mahsulotId = id;

    try {
      if (tahrirlash) {
        await mahsulotlarApi.update(kategoriya, id, payloadYasash());
      } else {
        mahsulotId = await mahsulotlarApi.create(kategoriya, payloadYasash());
      }
    } catch (err) {
      setXatolar(maydonXatolari(err.detail));
      toast(err.message, 'xato');
      setSaqlanmoqda(false);
      return;
    }

    // Mahsulot saqlandi, endi tanlangan rasmlarni birma-bir yuklaymiz
    try {
      for (let i = 0; i < yangiFayllar.length; i++) {
        await mahsulotlarApi.rasmYuklash(mahsulotId, yangiFayllar[i], i === 0 && yangisiAsosiy);
      }
    } catch (err) {
      toast(`Mahsulot saqlandi, lekin rasm yuklanmadi: ${err.message}`, 'xato');
      navigate(`/admin/mahsulotlar/${mahsulotId}`);
      return;
    }

    toast(tahrirlash ? 'Mahsulot yangilandi' : "Mahsulot qo'shildi");
    navigate('/admin/mahsulotlar');
  };

  const rasmniOchirish = async (rasm) => {
    if (!window.confirm("Rasm o'chirilsinmi?")) {
      return;
    }

    try {
      await mahsulotlarApi.rasmOchirish(rasm.mahsulotRasmiId);
      setRasmlar(rasmlar.filter((r) => r.mahsulotRasmiId !== rasm.mahsulotRasmiId));
      toast("Rasm o'chirildi");
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  if (yuklanmoqda) {
    return <p className="text-gray-500">Yuklanmoqda...</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/mahsulotlar" className="text-sm text-gray-500 hover:text-gray-900">
        ← Mahsulotlar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">{tahrirlash ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h1>

      <form onSubmit={saqlash} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="admin-label">Kategoriya</label>
          <select
            value={kategoriya}
            onChange={(e) => setKategoriya(Number(e.target.value))}
            disabled={tahrirlash}
            className="admin-input"
          >
            {Object.entries(KATEGORIYA).map(([kod, k]) => (
              <option key={kod} value={kod}>
                {k.birlik}
              </option>
            ))}
          </select>
          {tahrirlash && <p className="mt-1 text-xs text-gray-500">Mavjud mahsulotning kategoriyasini o'zgartirib bo'lmaydi.</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Maydon nomi="nomi" label="Nomi / modeli" forma={forma} ozgartirish={ozgartirish} xatolar={xatolar} />
          <Maydon nomi="brendi" label="Brend" forma={forma} ozgartirish={ozgartirish} xatolar={xatolar} />
          <Maydon nomi="rangi" label="Rangi" forma={forma} ozgartirish={ozgartirish} xatolar={xatolar} />
          <Maydon
            nomi="ombordagiSoni"
            label="Ombordagi soni"
            type="number"
            forma={forma}
            ozgartirish={ozgartirish}
            xatolar={xatolar}
          />
          <Maydon nomi="narxi" label="Narxi (so'm)" type="number" forma={forma} ozgartirish={ozgartirish} xatolar={xatolar} />
          <Maydon
            nomi="chegirmaNarxi"
            label="Chegirma narxi (ixtiyoriy)"
            type="number"
            forma={forma}
            ozgartirish={ozgartirish}
            xatolar={xatolar}
          />

          {kategoriya === 1 && (
            <div>
              <label className="admin-label">Mexanizm</label>
              <select name="mexanizmi" value={forma.mexanizmi} onChange={ozgartirish} className="admin-input">
                {Object.entries(MEXANIZM).map(([kod, nomi]) => (
                  <option key={kod} value={kod}>
                    {nomi}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kategoriya === 3 && (
            <div>
              <label className="admin-label">Kepka turi</label>
              <select name="turi" value={forma.turi} onChange={ozgartirish} className="admin-input">
                {Object.entries(KEPKA_TURI).map(([kod, nomi]) => (
                  <option key={kod} value={kod}>
                    {nomi}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="admin-label">Tavsifi (ixtiyoriy)</label>
          <textarea name="tavsifi" value={forma.tavsifi} onChange={ozgartirish} rows={4} className="admin-input" />
          {xatolar.tavsifi && <p className="mt-1 text-xs text-red-600">{xatolar.tavsifi}</p>}
        </div>

        <div>
          <label className="admin-label">Rasmlar</label>

          {rasmlar.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {rasmlar.map((r) => (
                <div key={r.mahsulotRasmiId} className="relative h-24 w-24 overflow-hidden rounded border border-gray-200">
                  <img src={r.rasmHavolasi} alt="" className="h-full w-full object-cover" />
                  {r.asosiyRasmmi && (
                    <span className="absolute left-1 top-1 rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white">Asosiy</span>
                  )}
                  <button
                    type="button"
                    onClick={() => rasmniOchirish(r)}
                    className="absolute right-1 top-1 rounded bg-white/90 px-1.5 text-xs text-red-600 hover:bg-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={(e) => setYangiFayllar(Array.from(e.target.files))}
            className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            jpg, png yoki webp, har biri 5 MB gacha. Rasmi yo'q mahsulotda birinchi yuklangan rasm asosiy bo'ladi.
          </p>

          {tahrirlash && rasmlar.length > 0 && yangiFayllar.length > 0 && (
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={yangisiAsosiy} onChange={(e) => setYangisiAsosiy(e.target.checked)} />
              Yangi yuklanayotgan birinchi rasm asosiy bo'lsin
            </label>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-100 pt-5">
          <button type="submit" disabled={saqlanmoqda} className="admin-btn">
            {saqlanmoqda ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          <Link to="/admin/mahsulotlar" className="admin-btn-ikkinchi">
            Bekor qilish
          </Link>
        </div>
      </form>
    </div>
  );
}

function Maydon({ nomi, label, type = 'text', forma, ozgartirish, xatolar }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input name={nomi} type={type} value={forma[nomi]} onChange={ozgartirish} className="admin-input" />
      {xatolar[nomi] && <p className="mt-1 text-xs text-red-600">{xatolar[nomi]}</p>}
    </div>
  );
}
