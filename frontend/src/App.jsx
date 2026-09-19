import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DokonLayout from './components/DokonLayout';
import AdminLayout from './components/AdminLayout';
import KatalogPage from './pages/KatalogPage';
import MahsulotPage from './pages/MahsulotPage';
import SavatPage from './pages/SavatPage';
import BuyurtmalarimPage from './pages/BuyurtmalarimPage';
import KirishPage from './pages/KirishPage';
import RoyxatdanOtishPage from './pages/RoyxatdanOtishPage';
import MahsulotlarPage from './pages/admin/MahsulotlarPage';
import MahsulotFormPage from './pages/admin/MahsulotFormPage';
import BuyurtmalarPage from './pages/admin/BuyurtmalarPage';
import FoydalanuvchilarPage from './pages/admin/FoydalanuvchilarPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Do'kon: qora-tilla dizayn */}
            <Route element={<DokonLayout />}>
              <Route path="/" element={<KatalogPage />} />
              <Route path="/mahsulot/:id" element={<MahsulotPage />} />
              <Route path="/kirish" element={<KirishPage />} />
              <Route path="/royxatdan-otish" element={<RoyxatdanOtishPage />} />

              {/* Savat va buyurtmalar faqat kirgan foydalanuvchi uchun */}
              <Route element={<ProtectedRoute />}>
                <Route path="/savat" element={<SavatPage />} />
                <Route path="/buyurtmalarim" element={<BuyurtmalarimPage />} />
              </Route>
            </Route>

            {/* Admin panel: faqat Admin roli bilan */}
            <Route element={<ProtectedRoute faqatAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="mahsulotlar" replace />} />
                <Route path="mahsulotlar" element={<MahsulotlarPage />} />
                <Route path="mahsulotlar/yangi" element={<MahsulotFormPage />} />
                <Route path="mahsulotlar/:id" element={<MahsulotFormPage />} />
                <Route path="buyurtmalar" element={<BuyurtmalarPage />} />
                <Route path="foydalanuvchilar" element={<FoydalanuvchilarPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
