import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserMenu from '@/components/UserMenu';
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
      <div className="relative min-h-screen">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <UserMenu />
          <ThemeToggle />
        </div>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-health"
            element={
              <ProtectedRoute>
                <CompanyHealth />
              </ProtectedRoute>
            }
          />

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster />
    </AuthProvider>
  );
}

export default App;