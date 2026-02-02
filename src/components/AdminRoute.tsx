import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';

// Credenciais do administrador (apenas renan.wow.blizz@gmail.com)
const ADMIN_EMAIL = 'renan.wow.blizz@gmail.com';
const ADMIN_PASSWORD = 'Warcraft782r@';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    // Verificar se está autenticado (sessão válida)
    const adminToken = sessionStorage.getItem('admin_token');
    const adminEmail = sessionStorage.getItem('admin_email');

    if (adminToken && adminEmail === ADMIN_EMAIL) {
      setIsAuthorized(true);
      return;
    }

    // Não autenticado - mostrar formulário de login
    setShowLoginForm(true);
    setIsAuthorized(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar credenciais
    if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Login bem-sucedido
      const token = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('admin_token', token);
      sessionStorage.setItem('admin_email', ADMIN_EMAIL);

      setIsAuthorized(true);
      setShowLoginForm(false);
      setLoading(false);
    } else {
      // Login falhou
      setError('Email ou senha incorretos. Acesso negado.');
      setLoading(false);
    }
  };

  // Mostrar formulário de login
  if (showLoginForm && !isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Acesso Restrito</CardTitle>
            <CardDescription>
              Painel Administrativo - Apenas autorizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email do Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <Alert className="bg-muted/50">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Apenas o administrador autorizado (renan.wow.blizz@gmail.com) pode acessar esta área.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? 'Verificando...' : 'Acessar Painel Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ainda verificando
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Não autorizado - redirecionar
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  // Autorizado - renderizar página admin
  return <>{children}</>;
}
