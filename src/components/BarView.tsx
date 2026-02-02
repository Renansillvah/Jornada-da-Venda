import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import type { Pillar } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface BarViewProps {
  pillars: Pillar[];
}

export function BarView({ pillars }: BarViewProps) {
  const [simulatedScores, setSimulatedScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    pillars.forEach(p => {
      initial[p.id] = p.score;
    });
    return initial;
  });

  const increaseScore = (id: string, amount: number) => {
    setSimulatedScores(prev => ({
      ...prev,
      [id]: Math.min(100, prev[id] + amount),
    }));
  };

  const resetSimulation = () => {
    const reset: Record<string, number> = {};
    pillars.forEach(p => {
      reset[p.id] = p.score;
    });
    setSimulatedScores(reset);
  };

  const diagnostic = useMemo(() => {
    const scores = Object.values(simulatedScores);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const strongest = pillars.find(p => simulatedScores[p.id] === maxScore)?.name || '';
    const weakest = pillars.find(p => simulatedScores[p.id] === minScore)?.name || '';

    return { average, strongest, weakest };
  }, [simulatedScores, pillars]);

  const getBarColor = (score: number): string => {
    if (score <= 20) return 'bg-red-500';
    if (score <= 40) return 'bg-orange-500';
    if (score <= 60) return 'bg-yellow-500';
    if (score <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getScoreLabel = (score: number): { label: string; color: string } => {
    if (score <= 20) return { label: 'Crítico', color: 'text-red-600' };
    if (score <= 40) return { label: 'Fraco', color: 'text-orange-600' };
    if (score <= 60) return { label: 'Aceitável', color: 'text-yellow-600' };
    if (score <= 80) return { label: 'Bom', color: 'text-blue-600' };
    return { label: 'Excelente', color: 'text-green-600' };
  };

  const hasSimulationChanges = useMemo(() => {
    return pillars.some(p => simulatedScores[p.id] !== p.score);
  }, [pillars, simulatedScores]);

  return (
    <div className="space-y-6">
      {/* Alert */}
      <Alert className="border-primary/30 bg-primary/5">
        <AlertDescription className="text-sm">
          Os ajustes nesta visualização representam <strong>simulação de melhoria</strong> e não alteram a análise original.
        </AlertDescription>
      </Alert>

      {/* Diagnostic Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Média geral simulada</p>
            <p className="text-4xl font-bold">{diagnostic.average}<span className="text-xl text-muted-foreground">/100</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pilar mais forte</p>
            <p className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {diagnostic.strongest}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pilar mais fraco</p>
            <p className="font-semibold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              {diagnostic.weakest}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reset Button */}
      {hasSimulationChanges && (
        <div className="flex justify-end">
          <Button onClick={resetSimulation} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar simulação
          </Button>
        </div>
      )}

      {/* Bars */}
      <div className="space-y-4">
        {pillars.map((pillar, index) => {
          const currentScore = simulatedScores[pillar.id];
          const originalScore = pillar.score;
          const hasChanged = currentScore !== originalScore;
          const scoreInfo = getScoreLabel(currentScore);

          return (
            <Card key={pillar.id} className={cn(
              "transition-all",
              hasChanged && "border-primary/50 shadow-md"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    {index + 1}. {pillar.name}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-sm font-semibold", scoreInfo.color)}>
                      {scoreInfo.label}
                    </span>
                    {hasChanged && (
                      <span className="text-xs text-primary font-medium">
                        +{currentScore - originalScore} pts
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        getBarColor(currentScore)
                      )}
                      style={{ width: `${currentScore}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground mix-blend-difference">
                        {currentScore}%
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => increaseScore(pillar.id, 5)}
                      disabled={currentScore >= 100}
                      className="h-8 px-3"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      5
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => increaseScore(pillar.id, 10)}
                      disabled={currentScore >= 100}
                      className="h-8 px-3"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      10
                    </Button>
                  </div>
                </div>

                {/* Observation (if exists) */}
                {pillar.observation && (
                  <p className="text-xs text-muted-foreground italic">
                    {pillar.observation}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Summary */}
      {hasSimulationChanges && (
        <Alert className="bg-primary/10 border-primary/50">
          <AlertDescription className="text-sm">
            <strong>Simulação ativa:</strong> Você aumentou pontos em um ou mais pilares.
            Use esta visualização para decidir onde focar suas melhorias reais.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
