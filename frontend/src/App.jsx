import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DokonLayout from './components/DokonLayout';
import AdminLayout from './components/AdminLayout';
import BoshSahifa from './pages/BoshSahifa';
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
              <Route path="/" element={<BoshSahifa />} />
              <Route path="/kirish" element={<KirishPage />} />
              <Route path="/royxatdan-otish" element={<RoyxatdanOtishPage />} />
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
