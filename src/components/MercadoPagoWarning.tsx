import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export function MercadoPagoWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Verificar se o token do Mercado Pago está disponível
    const hasAccessToken = !!import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
    const hasPublicKey = !!import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

    // Verificar se já foi exibido antes nesta sessão
    const warningShown = sessionStorage.getItem('mp_warning_shown');

    if ((!hasAccessToken || !hasPublicKey) && !warningShown) {
      setShowWarning(true);
      sessionStorage.setItem('mp_warning_shown', 'true');
    }
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <Alert className="bg-warning/10 border-warning shadow-lg">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <AlertDescription className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-warning mb-1">
              Mercado Pago não carregado
            </p>
            <p className="text-sm text-muted-foreground">
              O servidor foi atualizado. Recarregue a página para ativar os pagamentos.
            </p>
          </div>
          <Button
            onClick={handleReload}
            size="sm"
            variant="outline"
            className="flex-shrink-0 border-warning hover:bg-warning/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
