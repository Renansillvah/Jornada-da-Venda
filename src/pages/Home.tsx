import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, History, Sparkles, ShoppingCart } from 'lucide-react';
import { getCredits, giveWelcomeCredits } from '@/lib/credits';

export default function Home() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // Dar boas-vindas com créditos grátis no primeiro acesso
    giveWelcomeCredits();

    // Atualizar saldo de créditos
    setCredits(getCredits());

    // Atualizar créditos a cada 5 segundos (caso o usuário compre em outra aba)
    const interval = setInterval(() => {
      setCredits(getCredits());
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

          {/* Indicador de Créditos */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Badge
              variant="outline"
              className={`text-sm px-4 py-2 gap-2 ${
                credits === 0
                  ? 'bg-destructive/10 text-destructive border-destructive/30'
                  : credits <= 3
                  ? 'bg-warning/10 text-warning border-warning/30'
                  : 'bg-success/10 text-success border-success/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {credits} crédito{credits !== 1 ? 's' : ''} disponível{credits !== 1 ? 'eis' : ''}
            </Badge>
            {credits <= 5 && (
              <Button
                onClick={() => navigate('/buy-credits')}
                size="sm"
                variant={credits === 0 ? 'default' : 'outline'}
                className="gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {credits === 0 ? 'Comprar Créditos' : 'Comprar Mais'}
              </Button>
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
