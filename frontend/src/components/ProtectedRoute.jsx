import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bu faqat qulaylik uchun: sahifani yashiradi. Haqiqiy himoya backendda — [Authorize(Roles = "Admin")]
export default function ProtectedRoute({ faqatAdmin = false }) {
  const { foydalanuvchi, adminmi } = useAuth();
  const location = useLocation();

  if (!foydalanuvchi) {
    return <Navigate to="/kirish" state={{ qaytish: location.pathname }} replace />;
  }

  if (faqatAdmin && !adminmi) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
