import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, RotateCcw, AlertCircle } from 'lucide-react';
import type { Pillar } from '@/types/analysis';
import { PILLARS_CONFIG, getLayerInfo, getScoreLevel, getActionableInsight } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { StrategicSummary } from './StrategicSummary';

interface BarViewProps {
  pillars: Pillar[];
  onScoreChange?: (id: string, score: number) => void;
}

export function BarView({ pillars, onScoreChange }: BarViewProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    pillars.forEach(p => {
      initial[p.id] = p.score;
    });
    return initial;
  });

  const increaseScore = (id: string, amount: number) => {
    const newScore = Math.min(10, scores[id] + amount);
    setScores(prev => ({
      ...prev,
      [id]: newScore,
    }));
    if (onScoreChange) {
      onScoreChange(id, newScore);
    }
  };

  const resetScores = () => {
    const reset: Record<string, number> = {};
    pillars.forEach(p => {
      reset[p.id] = p.score;
      if (onScoreChange) {
        onScoreChange(p.id, p.score);
      }
    });
    setScores(reset);
  };

  const diagnostic = useMemo(() => {
    const pillarScores = PILLARS_CONFIG.map(config => {
      const score = scores[config.id] || 0;
      const weight = config.weight || 1;
      return score * weight;
    });
    const totalWeight = PILLARS_CONFIG.reduce((sum, config) => sum + (config.weight || 1), 0);
    const weightedAverage = pillarScores.reduce((a, b) => a + b, 0) / totalWeight;

    const scoredPillars = pillars.map(p => ({ ...p, score: scores[p.id] }));
    const maxScore = Math.max(...scoredPillars.map(p => p.score));
    const minScore = Math.min(...scoredPillars.map(p => p.score));
    const strongest = scoredPillars.find(p => p.score === maxScore)?.name || '';
    const weakest = scoredPillars.find(p => p.score === minScore)?.name || '';

    return {
      average: Math.round(weightedAverage * 10) / 10,
      strongest,
      weakest,
    };
  }, [scores, pillars]);

  const hasChanges = useMemo(() => {
    return pillars.some(p => scores[p.id] !== p.score);
  }, [pillars, scores]);

  const getBarColor = (score: number): string => {
    if (score === 0) return 'bg-muted-foreground/20';
    if (score <= 4) return 'bg-destructive';
    if (score <= 6) return 'bg-warning';
    return 'bg-success';
  };

  const pillarsByLayer = useMemo(() => {
    const foundation = PILLARS_CONFIG.filter(p => p.layer === 'foundation');
    const conversion = PILLARS_CONFIG.filter(p => p.layer === 'conversion');
    const amplification = PILLARS_CONFIG.filter(p => p.layer === 'amplification');
    return { foundation, conversion, amplification };
  }, []);

  const renderLayer = (layerPillars: typeof PILLARS_CONFIG, layerKey: string) => {
    const layerInfo = getLayerInfo(layerKey);
    const pillarData = layerPillars.map(config => {
      const pillar = pillars.find(p => p.id === config.id);
      return { ...config, ...pillar, score: scores[config.id] || 0 };
    });

    return (
      <div key={layerKey} className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{layerInfo.icon}</span>
          <div>
            <h3 className="font-semibold text-lg">{layerInfo.name}</h3>
            <p className="text-xs text-muted-foreground">{layerInfo.description}</p>
          </div>
        </div>

        {pillarData.map((pillar) => {
          const currentScore = pillar.score;
          const hasChanged = currentScore !== (pillars.find(p => p.id === pillar.id)?.score || 0);
          const scoreInfo = getScoreLevel(currentScore);

          return (
            <Card key={pillar.id} className={cn(
              "transition-all",
              hasChanged && "border-primary/50 shadow-sm"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    {pillar.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", scoreInfo.color)}>
                      {scoreInfo.level}
                    </span>
                    {hasChanged && (
                      <span className="text-xs text-primary font-medium">
                        +{currentScore - (pillars.find(p => p.id === pillar.id)?.score || 0)}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        getBarColor(currentScore)
                      )}
                      style={{ width: `${(currentScore / 10) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground mix-blend-difference">
                        {currentScore}/10
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => increaseScore(pillar.id, 1)}
                      disabled={currentScore >= 10}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => increaseScore(pillar.id, 2)}
                      disabled={currentScore >= 10}
                      className="h-7 px-2 text-xs"
                    >
                      +2
                    </Button>
                  </div>
                </div>

                {pillar.observation && (
                  <p className="text-xs text-muted-foreground italic pt-1">
                    {pillar.observation}
                  </p>
                )}

                {currentScore < 7 && currentScore > 0 && onScoreChange && (
                  <div className="mt-2 space-y-2">
                    <Alert className={`py-2 ${
                      currentScore <= 4
                        ? 'border-destructive/30 bg-destructive/10'
                        : 'border-warning/30 bg-warning/10'
                    }`}>
                      <AlertCircle className={`h-3 w-3 ${
                        currentScore <= 4 ? 'text-destructive' : 'text-warning-foreground'
                      }`} />
                      <AlertDescription className={`text-xs ${
                        currentScore <= 4 ? 'text-destructive' : 'text-warning-foreground'
                      }`}>
                        <strong>{getActionableInsight(pillar.name, currentScore).issue}</strong>
                      </AlertDescription>
                    </Alert>
                    <div className={`p-2 rounded text-xs ${
                      currentScore <= 4
                        ? 'bg-destructive/10 text-destructive border border-destructive/30'
                        : 'bg-warning/10 text-warning-foreground border border-warning/30'
                    }`}>
                      <strong>✓ Ação:</strong> {getActionableInsight(pillar.name, currentScore).action}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!onScoreChange && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription className="text-sm">
            Os ajustes nesta visualização representam <strong>simulação de melhoria</strong> e não alteram a análise original.
          </AlertDescription>
        </Alert>
      )}

      {/* Resumo Estratégico */}
      {onScoreChange && pillars.some(p => p.score > 0) && (
        <StrategicSummary pillars={pillars} averageScore={diagnostic.average} />
      )}

      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={resetScores} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
        </div>
      )}

      {renderLayer(pillarsByLayer.foundation, 'foundation')}
      {renderLayer(pillarsByLayer.conversion, 'conversion')}
      {renderLayer(pillarsByLayer.amplification, 'amplification')}

      {!onScoreChange && hasChanges && (
        <Alert className="bg-primary/10 border-primary/50">
          <AlertDescription className="text-sm">
            <strong>Simulação ativa:</strong> Use esta visualização para decidir onde focar melhorias reais.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
