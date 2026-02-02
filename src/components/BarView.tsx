import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, RotateCcw, AlertCircle, ShieldCheck, ShieldAlert, ShieldQuestion, ShieldX } from 'lucide-react';
import type { Pillar } from '@/types/analysis';
import { PILLARS_CONFIG, getLayerInfo, getScoreLevel, getActionableInsight } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { StrategicSummary } from './StrategicSummary';
import { PillarExplanation } from './PillarExplanation';

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

  // Atualizar scores quando os pilares mudarem (ex: análise com IA)
  useEffect(() => {
    const updated: Record<string, number> = {};
    pillars.forEach(p => {
      updated[p.id] = p.score;
    });
    setScores(updated);
  }, [pillars]);

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
    // Filtrar apenas pilares avaliados (score > 0)
    const evaluatedConfigs = PILLARS_CONFIG.filter(config => (scores[config.id] || 0) > 0);

    // Se nenhum pilar foi avaliado, retornar média 0
    if (evaluatedConfigs.length === 0) {
      return {
        average: 0,
        strongest: '',
        weakest: '',
      };
    }

    // Calcular média ponderada apenas dos pilares avaliados
    const pillarScores = evaluatedConfigs.map(config => {
      const score = scores[config.id] || 0;
      const weight = config.weight || 1;
      return score * weight;
    });
    const totalWeight = evaluatedConfigs.reduce((sum, config) => sum + (config.weight || 1), 0);
    const weightedAverage = pillarScores.reduce((a, b) => a + b, 0) / totalWeight;

    // Pegar apenas pilares avaliados para strongest/weakest
    const scoredPillars = pillars.map(p => ({ ...p, score: scores[p.id] })).filter(p => p.score > 0);
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
          const confidence = pillar.confidence;

          // Definir badge de confiança
          const getConfidenceBadge = (conf?: string) => {
            if (!conf || conf === 'none') {
              return {
                icon: ShieldX,
                label: 'Não analisado',
                color: 'bg-muted text-muted-foreground',
                description: 'Imagem não contém dados para este pilar'
              };
            }
            if (conf === 'low') {
              return {
                icon: ShieldQuestion,
                label: 'Baixa confiança',
                color: 'bg-warning/10 text-warning border-warning/30',
                description: 'Análise baseada em poucos elementos'
              };
            }
            if (conf === 'medium') {
              return {
                icon: ShieldAlert,
                label: 'Média confiança',
                color: 'bg-info/10 text-info border-info/30',
                description: 'Análise baseada em elementos parciais'
              };
            }
            return {
              icon: ShieldCheck,
              label: 'Alta confiança',
              color: 'bg-success/10 text-success border-success/30',
              description: 'Análise baseada em elementos claros'
            };
          };

          const confidenceBadge = getConfidenceBadge(confidence);
          const ConfidenceIcon = confidenceBadge.icon;

          return (
            <Card key={pillar.id} className={cn(
              "transition-all",
              hasChanged && "border-primary/50 shadow-sm",
              confidence === 'none' && "opacity-60"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <CardTitle className="text-sm font-semibold">
                      {pillar.name}
                    </CardTitle>
                    {confidence && (
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 gap-1", confidenceBadge.color)} title={confidenceBadge.description}>
                        <ConfidenceIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">{confidenceBadge.label}</span>
                      </Badge>
                    )}
                  </div>
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

                {pillar.observation && pillar.observation !== 'Sem dados' && (
                  <>
                    <PillarExplanation
                      explanation={pillar.observation}
                      pillarName={pillar.name}
                      example={pillar.example}
                    />
                  </>
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
