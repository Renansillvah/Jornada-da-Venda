import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, HelpCircle } from 'lucide-react';

export default function PaymentPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-warning/30">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Ícone de pendente */}
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-warning" />
          </div>

          {/* Mensagem principal */}
          <h1 className="text-2xl font-bold mb-3">
            Pagamento Pendente
          </h1>
          <p className="text-muted-foreground mb-6">
            Estamos aguardando a confirmação do seu pagamento
          </p>

          {/* Informações */}
          <div className="bg-warning/5 rounded-lg p-4 mb-6 text-sm text-left border border-warning/30">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">O que acontece agora?</p>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Se você pagou por Pix, a confirmação pode levar alguns minutos</li>
                  <li>• Se pagou por boleto, pode levar até 3 dias úteis</li>
                  <li>• Você receberá um email assim que o pagamento for confirmado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Início
            </Button>

            <p className="text-xs text-muted-foreground">
              Dúvidas? Entre em contato com nosso suporte
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
