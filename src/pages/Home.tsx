import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, History, Activity } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

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
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/analysis')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-base font-semibold mb-1">Análise Avulsa</h3>
                <p className="text-muted-foreground text-xs">
                  Avalie um ponto específico da jornada
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/company-health')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Activity className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-base font-semibold mb-1">Saúde Comercial</h3>
                <p className="text-muted-foreground text-xs">
                  Visão geral da empresa
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/history')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <History className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-base font-semibold mb-1">Histórico</h3>
                <p className="text-muted-foreground text-xs">
                  Todas as análises realizadas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={() => navigate('/analysis')}
          >
            Nova análise avulsa
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base"
            onClick={() => navigate('/company-health')}
          >
            Ver saúde comercial da empresa
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
