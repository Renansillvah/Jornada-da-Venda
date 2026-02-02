import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import LandingPage from '@/pages/landing/LandingPage';
import SalesLanding from '@/pages/SalesLanding';
import Home from '@/pages/Home';
import Analysis from '@/pages/Analysis';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import BuyCredits from '@/pages/BuyCredits';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page (rota pública) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/venda" element={<SalesLanding />} />

        {/* Rotas de autenticação (públicas) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rotas do app (protegidas) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Analysis />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AppLayout>
                <History />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/buy-credits"
          element={<BuyCredits />}
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;