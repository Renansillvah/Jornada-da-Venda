import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Lista de emails autorizados como administradores
const ADMIN_EMAILS = ['renan.wow.blizz@gmail.com'];

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    // Verificar se o email está armazenado localmente
    const storedEmail = localStorage.getItem('user_email');

    if (storedEmail && ADMIN_EMAILS.includes(storedEmail)) {
      setIsAuthorized(true);
      setUserEmail(storedEmail);
      return;
    }

    // Se não tem email armazenado, solicitar
    const email = prompt('🔐 Acesso Restrito\n\nDigite seu email de administrador:');

    if (!email) {
      setIsAuthorized(false);
      return;
    }

    // Verificar se o email está na lista de admins
    if (ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      localStorage.setItem('user_email', email.toLowerCase().trim());
      setIsAuthorized(true);
      setUserEmail(email);
    } else {
      alert('❌ Acesso negado!\n\nApenas administradores autorizados podem acessar esta área.');
      setIsAuthorized(false);
    }
  };

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
