import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserMenu from '@/components/UserMenu';
import LandingPage from '@/pages/landing/LandingPage';
import Home from '@/pages/Home';
import Analysis from '@/pages/Analysis';
import History from '@/pages/History';
import CompanyHealth from '@/pages/CompanyHealth';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page (rota pública) */}
        <Route path="/" element={<LandingPage />} />

        {/* Rotas de autenticação (públicas) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rotas do app (protegidas) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="relative min-h-screen">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <UserMenu />
                  <ThemeToggle />
                </div>
                <Home />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <div className="relative min-h-screen">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <UserMenu />
                  <ThemeToggle />
                </div>
                <Analysis />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <div className="relative min-h-screen">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <UserMenu />
                  <ThemeToggle />
                </div>
                <History />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-health"
          element={
            <ProtectedRoute>
              <div className="relative min-h-screen">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <UserMenu />
                  <ThemeToggle />
                </div>
                <CompanyHealth />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;