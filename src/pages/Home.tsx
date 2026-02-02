import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, History, Crown, ShoppingCart, Zap } from 'lucide-react';
import { hasLifetimeAccess, getRemainingTrialAnalyses, giveFreeTrial } from '@/lib/access';

export default function Home() {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [trialRemaining, setTrialRemaining] = useState(0);

  useEffect(() => {
    // Dar trial de 2 análises grátis no primeiro acesso
    giveFreeTrial();

    // Verificar status de acesso
    setHasAccess(hasLifetimeAccess());
    setTrialRemaining(getRemainingTrialAnalyses());

    // Atualizar status a cada 5 segundos (caso o usuário pague em outra aba)
    const interval = setInterval(() => {
      setHasAccess(hasLifetimeAccess());
      setTrialRemaining(getRemainingTrialAnalyses());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Painel de Jornada de Venda
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O cliente passa por uma jornada mental antes de fechar uma venda.
            Este painel mede os pilares que influenciam essa decisão.
          </p>

          {/* Indicador de Acesso */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {hasAccess ? (
              <Badge
                variant="outline"
                className="text-sm px-4 py-2 gap-2 bg-success/10 text-success border-success/30"
              >
                <Crown className="w-4 h-4" />
                Acesso Vitalício Ativo - Análises Ilimitadas
              </Badge>
            ) : (
              <>
                <Badge
                  variant="outline"
                  className={`text-sm px-4 py-2 gap-2 ${
                    trialRemaining === 0
                      ? 'bg-destructive/10 text-destructive border-destructive/30'
                      : 'bg-warning/10 text-warning border-warning/30'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Trial: {trialRemaining} análise{trialRemaining !== 1 ? 's' : ''} gratuita{trialRemaining !== 1 ? 's' : ''}
                </Badge>
                <Button
                  onClick={() => navigate('/buy-credits')}
                  size="sm"
                  variant={trialRemaining === 0 ? 'default' : 'outline'}
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {trialRemaining === 0 ? 'Desbloquear Agora (R$ 9,99)' : 'Garantir Vitalício'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <Card className="border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/analysis')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Nova Análise</h3>
                <p className="text-muted-foreground text-sm">
                  Avalie uma jornada de venda específica
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/history')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <History className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Histórico</h3>
                <p className="text-muted-foreground text-sm">
                  Todas as análises realizadas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="text-lg px-12 py-6"
            onClick={() => navigate('/analysis')}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Começar Nova Análise
          </Button>
        </div>

        <div className="mt-16 p-6 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center italic">
            "Este painel não mede intenção. Ele revela onde a venda perde força."
          </p>
        </div>
      </div>
    </div>
  );
}
