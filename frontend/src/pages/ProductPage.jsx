import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../api/products';
import { cartApi } from '../api/cart';
import { NoImage } from '../components/ProductCard';
import QuantityPicker from '../components/QuantityPicker';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORY, CAP_TYPE, MOVEMENT } from '../constants';
import { formatPrice } from '../utils';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [m, setM] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await productsApi.getById(id);
        setM(result);
        const main = result.images.find((r) => r.isMainImage) ?? result.images[0];
        setSelectedImage(main?.imageUrl ?? null);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, [id]);

  const addToCart = async () => {
    // Savat faqat kirgan foydalanuvchida bo'ladi: kirgach shu sahifaga qaytaramiz
    if (!user) {
      navigate('/login', { state: { goBack: location.pathname } });
      return;
    }

    setAdding(true);
    try {
      await cartApi.add(m.productId, quantity);
      toast("Savatga qo'shildi");
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setAdding(false);
    }
  };

  if (error) {
    return <p className="py-32 text-center text-gray-400">{error}</p>;
  }

  if (!m) {
    return (
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:gap-12 md:py-12">
        <div className="skeleton aspect-square" />
        <div className="space-y-4 pt-4">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-7 w-1/3" />
          <div className="skeleton mt-10 h-40 w-full" />
        </div>
      </section>
    );
  }

  const finished = m.stockQuantity === 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <Link to="/" className="group -ml-1 inline-flex items-center gap-2 py-2 pl-1 pr-2 text-sm text-gray-500 transition hover:text-gold">
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Katalog
      </Link>

      <div className="mt-4 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-12">
        <div className="animate-appear">
          <div className="aspect-square overflow-hidden bg-dark-2 ring-1 ring-dark-3">
            {selectedImage ? (
              // key — rasm almashganda yangisi yumshoq paydo bo'ladi
              <img key={selectedImage} src={selectedImage} alt={m.name} className="h-full w-full animate-page object-cover" />
            ) : (
              <NoImage category={m.category} />
            )}
          </div>

          {m.images.length > 1 && (
            <div className="scroll-row -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {m.images.map((r) => (
                <button
                  key={r.productImageId}
                  onClick={() => setSelectedImage(r.imageUrl)}
                  className={`h-16 w-16 shrink-0 overflow-hidden ring-1 transition duration-300 sm:h-20 sm:w-20 ${
                    selectedImage === r.imageUrl ? 'ring-gold' : 'opacity-60 ring-dark-3 hover:opacity-100'
                  }`}
                >
                  <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <p
            className="animate-appear text-[0.65rem] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]"
            style={{ animationDelay: '100ms' }}
          >
            {m.brand}
          </p>
          <h1 className="mt-3 animate-appear font-serif text-3xl font-semibold leading-tight text-cream sm:text-4xl md:text-5xl" style={{ animationDelay: '180ms' }}>
            {m.name}
          </h1>

          <div className="mt-5 flex animate-appear flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-6 sm:gap-x-4" style={{ animationDelay: '260ms' }}>
            {m.salePrice ? (
              <>
                <span className="text-2xl text-gold sm:text-3xl">{formatPrice(m.salePrice)}</span>
                <span className="text-gray-500 line-through">{formatPrice(m.price)}</span>
              </>
            ) : (
              <span className="text-2xl text-cream sm:text-3xl">{formatPrice(m.price)}</span>
            )}
          </div>

          <dl className="mt-8 animate-appear divide-y divide-dark-3 border-y border-dark-3 text-sm sm:mt-10" style={{ animationDelay: '340ms' }}>
            <Feature name="Kategoriya" value={CATEGORY[m.category]?.singular} />
            <Feature name="Rangi" value={m.color} />
            {m.movement && <Feature name="Mexanizm" value={MOVEMENT[m.movement]} />}
            {m.capType && <Feature name="Turi" value={CAP_TYPE[m.capType]} />}
            <Feature name="Omborda" value={finished ? 'Tugagan' : `${m.stockQuantity} ta`} />
          </dl>

          {m.description && (
            <p className="mt-6 animate-appear whitespace-pre-line text-sm leading-relaxed text-gray-400 sm:mt-8 sm:text-base" style={{ animationDelay: '420ms' }}>
              {m.description}
            </p>
          )}

          <div className="mt-8 grid animate-appear grid-cols-[auto_1fr] gap-3 sm:mt-10" style={{ animationDelay: '500ms' }}>
            <QuantityPicker
              large
              quantity={quantity}
              decrease={() => setQuantity(quantity - 1)}
              increase={() => setQuantity(quantity + 1)}
              max={m.stockQuantity}
              disabled={finished}
            />
            <button onClick={addToCart} disabled={finished || adding} className="store-btn">
              {finished ? 'Tugagan' : adding ? "Qo'shilmoqda..." : added ? "✓ Savatga qo'shildi" : "Savatga qo'shish"}
            </button>
          </div>

          {added && (
            <Link to="/cart" className="mt-4 inline-block animate-drop text-sm text-gold hover:text-gold-light">
              Savatga o'tish →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Feature({ name, value }) {
  return (
    <div className="flex justify-between gap-4 py-3.5">
      <dt className="shrink-0 text-gray-500">{name}</dt>
      <dd className="text-right text-cream">{value}</dd>
    </div>
  );
}
