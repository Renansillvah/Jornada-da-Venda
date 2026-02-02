import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, HelpCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/30">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Ícone de erro */}
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>

          {/* Mensagem principal */}
          <h1 className="text-2xl font-bold mb-3">
            Pagamento Não Aprovado
          </h1>
          <p className="text-muted-foreground mb-6">
            Não foi possível processar seu pagamento
          </p>

          {/* Motivos comuns */}
          <div className="bg-destructive/5 rounded-lg p-4 mb-6 text-sm text-left border border-destructive/30">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Motivos comuns:</p>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Saldo insuficiente no cartão</li>
                  <li>• Dados do cartão incorretos</li>
                  <li>• Cartão bloqueado ou vencido</li>
                  <li>• Limite de compras atingido</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/buy-credits')}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Voltar para o Início
            </Button>

            <p className="text-xs text-muted-foreground">
              Precisa de ajuda? Entre em contato com nosso suporte
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
