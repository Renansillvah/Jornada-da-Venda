import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Crown, Sparkles, Mail } from 'lucide-react';
import { createAccountAfterPayment } from '@/lib/access';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Simular processamento do pagamento
    const paymentId = searchParams.get('payment_id') || `mp_${Date.now()}`;
    const email = searchParams.get('email') || searchParams.get('payer_email') || '';

    setTimeout(() => {
      // Criar conta automaticamente após pagamento
      const result = createAccountAfterPayment(email, paymentId, 9.99);

      if (result.success) {
        setAccountCreated(true);
        setUserEmail(result.email);
      }

      setProcessing(false);
    }, 2000);
  }, [searchParams]);

  if (processing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Processando seu pagamento...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos sua compra
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-success/30 shadow-xl">
        <CardContent className="pt-8 pb-8">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 text-success">
              Pagamento Aprovado!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Bem-vindo ao <strong>Jornada da Venda</strong>
            </p>
          </div>

          {/* Informações da conta */}
          {accountCreated && (
            <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Sua conta foi criada automaticamente</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesso vitalício ativado com sucesso!
                  </p>
                </div>
              </div>

              {userEmail && (
                <div className="flex items-center gap-2 text-sm bg-background rounded-lg p-3 border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{userEmail}</span>
                </div>
              )}
            </div>
          )}

          {/* Benefícios desbloqueados */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-center mb-4">Você agora tem acesso a:</h3>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Análises Ilimitadas com IA</p>
                <p className="text-sm text-muted-foreground">
                  Quantas quiser, quando quiser. Para sempre.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Diagnóstico dos 15 Pilares</p>
                <p className="text-sm text-muted-foreground">
                  Análise completa da jornada mental do cliente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Scripts e Ações Práticas</p>
                <p className="text-sm text-muted-foreground">
                  Exemplos prontos para copiar e aplicar hoje
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Atualizações Futuras Gratuitas</p>
                <p className="text-sm text-muted-foreground">
                  Todas as melhorias incluídas sem custo adicional
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="w-full text-lg py-6 h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Minha Primeira Análise
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Seu acesso vitalício está ativo. Aproveite! 🎉
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
