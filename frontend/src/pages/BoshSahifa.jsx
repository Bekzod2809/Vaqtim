import { DOKON_NOMI } from '../constants';

// Vaqtinchalik: do'kon sahifasi (mahsulotlar katalogi) keyingi bosqichda yoziladi
export default function BoshSahifa() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-oltin">Soatlar va aksessuarlar</p>
      <h1 className="font-serif text-5xl font-semibold text-white md:text-6xl">{DOKON_NOMI}</h1>
      <p className="mx-auto mt-6 max-w-md text-gray-400">Katalog sahifasi keyingi bosqichda qo'shiladi.</p>
    </section>
  );
}
