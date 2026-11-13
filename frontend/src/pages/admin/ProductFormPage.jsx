import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { useToast } from '../../context/ToastContext';
import { CATEGORY, CAP_TYPE, MOVEMENT } from '../../constants';
import { fieldErrors } from '../../utils';

const EMPTY_FORM = {
  name: '',
  description: '',
  brand: '',
  color: '',
  price: '',
  salePrice: '',
  stockQuantity: '',
  movement: 1,
  type: 1,
};

export default function ProductFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [category, setCategory] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // bazadagi rasmlar (faqat tahrirlashda)
  const [newFiles, setNewFiles] = useState([]);
  const [newIsMain, setNewIsMain] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  const loadProduct = async () => {
    try {
      const m = await productsApi.getById(id);
      setCategory(m.category);
      setForm({
        name: m.name,
        description: m.description ?? '',
        brand: m.brand,
        color: m.color,
        price: m.price,
        salePrice: m.salePrice ?? '',
        stockQuantity: m.stockQuantity,
        movement: m.movement ?? 1,
        type: m.capType ?? 1,
      });
      setImages(m.images);
    } catch (err) {
      toast(err.message, 'xato');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editing) {
      loadProduct();
    }
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildPayload = () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      brand: form.brand,
      color: form.color,
      price: Number(form.price),
      salePrice: form.salePrice === '' ? null : Number(form.salePrice),
      stockQuantity: Number(form.stockQuantity),
    };

    // Faqat soat va kepkaning o'ziga xos maydoni bor
    if (category === 1) payload.movement = Number(form.movement);
    if (category === 3) payload.type = Number(form.type);

    return payload;
  };

  const save = async (e) => {
    e.preventDefault();
    setErrors({});

    // Bo'sh qolsa 0 bo'lib ketadi va mahsulot saytda ko'rinmay qoladi, shuning uchun aniq kiritilishi shart
    if (form.stockQuantity === '') {
      setErrors({ stockQuantity: 'Ombordagi sonini kiriting.' });
      return;
    }

    setSaving(true);

    let productId = id;

    try {
      if (editing) {
        await productsApi.update(category, id, buildPayload());
      } else {
        productId = await productsApi.create(category, buildPayload());
      }
    } catch (err) {
      setErrors(fieldErrors(err.detail));
      toast(err.message, 'xato');
      setSaving(false);
      return;
    }

    // Mahsulot saqlandi, endi tanlangan rasmlarni birma-bir yuklaymiz
    try {
      for (let i = 0; i < newFiles.length; i++) {
        await productsApi.uploadImage(productId, newFiles[i], i === 0 && newIsMain);
      }
    } catch (err) {
      toast(`Mahsulot saqlandi, lekin rasm yuklanmadi: ${err.message}`, 'xato');
      navigate(`/admin/products/${productId}`);
      return;
    }

    toast(editing ? 'Mahsulot yangilandi' : "Mahsulot qo'shildi");
    navigate('/admin/products');
  };

  const removeImage = async (image) => {
    if (!window.confirm("Rasm o'chirilsinmi?")) {
      return;
    }

    try {
      await productsApi.removeImage(image.productImageId);
      setImages(images.filter((r) => r.productImageId !== image.productImageId));
      toast("Rasm o'chirildi");
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  if (loading) {
    return <p className="text-gray-500">Yuklanmoqda...</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">
        ← Mahsulotlar
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold sm:text-2xl">{editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h1>

      <form onSubmit={save} className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <div>
          <label className="admin-label">Kategoriya</label>
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            disabled={editing}
            className="admin-input"
          >
            {Object.entries(CATEGORY).map(([code, k]) => (
              <option key={code} value={code}>
                {k.singular}
              </option>
            ))}
          </select>
          {editing && <p className="mt-1 text-xs text-gray-500">Mavjud mahsulotning kategoriyasini o'zgartirib bo'lmaydi.</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Nomi / modeli" form={form} change={change} errors={errors} />
          <Field name="brand" label="Brend" form={form} change={change} errors={errors} />
          <Field name="color" label="Rangi" form={form} change={change} errors={errors} />
          <Field
            name="stockQuantity"
            label="Ombordagi soni"
            type="number"
            form={form}
            change={change}
            errors={errors}
          />
          <Field name="price" label="Narxi (so'm)" type="number" form={form} change={change} errors={errors} />
          <Field
            name="salePrice"
            label="Chegirma narxi (ixtiyoriy)"
            type="number"
            form={form}
            change={change}
            errors={errors}
          />

          {category === 1 && (
            <div>
              <label className="admin-label">Mexanizm</label>
              <select name="movement" value={form.movement} onChange={change} className="admin-input">
                {Object.entries(MOVEMENT).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {category === 3 && (
            <div>
              <label className="admin-label">Kepka turi</label>
              <select name="type" value={form.type} onChange={change} className="admin-input">
                {Object.entries(CAP_TYPE).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="admin-label">Tavsifi (ixtiyoriy)</label>
          <textarea name="description" value={form.description} onChange={change} rows={4} className="admin-input" />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="admin-label">Rasmlar</label>

          {images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {images.map((r) => (
                <div key={r.productImageId} className="relative h-20 w-20 overflow-hidden rounded border border-gray-200 sm:h-24 sm:w-24">
                  <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                  {r.isMainImage && (
                    <span className="absolute left-1 top-1 rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white">Asosiy</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(r)}
                    className="absolute right-1 top-1 rounded bg-white/90 px-2 py-1 text-xs leading-none text-red-600 hover:bg-white"
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
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            jpg, png yoki webp, har biri 5 MB gacha. Rasmi yo'q mahsulotda birinchi yuklangan rasm asosiy bo'ladi.
          </p>

          {editing && images.length > 0 && newFiles.length > 0 && (
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={newIsMain} onChange={(e) => setNewIsMain(e.target.checked)} />
              Yangi yuklanayotgan birinchi rasm asosiy bo'lsin
            </label>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
          <button type="submit" disabled={saving} className="admin-btn w-full sm:w-auto">
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          <Link to="/admin/products" className="admin-btn-secondary w-full sm:w-auto">
            Bekor qilish
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ name, label, type = 'text', form, change, errors }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input
        name={name}
        type={type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        value={form[name]}
        onChange={change}
        className="admin-input"
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );
}
