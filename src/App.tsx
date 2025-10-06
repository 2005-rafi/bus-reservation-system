import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BusReservationPage from './pages/BusReservationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBusFormPage from './pages/AdminBusFormPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user } = useAuth();

  // Protected route component for admin-only routes
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
  };

  // Protected route component for authenticated users
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main application routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Protected routes */}
        <Route path="/reservation/:busId" element={
          <ProtectedRoute>
            <BusReservationPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        
        <Route path="/admin/bus/new" element={
          <AdminRoute>
            <AdminBusFormPage />
          </AdminRoute>
        } />
        
        <Route path="/admin/bus/edit/:busId" element={
          <AdminRoute>
            <AdminBusFormPage />
          </AdminRoute>
        } />
      </Route>

      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;