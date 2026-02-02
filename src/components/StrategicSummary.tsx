import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { PILLARS_CONFIG, getScoreLevel, getActionableInsight } from '@/types/analysis';
import type { Pillar } from '@/types/analysis';

interface StrategicSummaryProps {
  pillars: Pillar[];
  averageScore: number;
}

export function StrategicSummary({ pillars, averageScore }: StrategicSummaryProps) {
  // Identificar gargalo principal (menor nota da camada de fundamentos)
  const foundationPillars = pillars.filter(p => {
    const config = PILLARS_CONFIG.find(c => c.id === p.id);
    return config?.layer === 'foundation';
  });

  const criticalBottleneck = foundationPillars.reduce((min, p) =>
    p.score < min.score ? p : min
  );

  // Identificar pilar mais forte
  const strongest = pillars.reduce((max, p) =>
    p.score > max.score ? p : max
  );

  // Contar gargalos por severidade
  const criticalCount = pillars.filter(p => p.score <= 4 && p.score > 0).length;
  const attentionCount = pillars.filter(p => p.score > 4 && p.score <= 6).length;
  const adequateCount = pillars.filter(p => p.score > 6).length;

  // Diagnóstico geral
  const getDiagnosis = () => {
    if (averageScore >= 8) return {
      text: 'Jornada bem estruturada. Foque em otimizações pontuais.',
      color: 'text-success-foreground',
      icon: CheckCircle2,
      iconColor: 'text-success-foreground'
    };
    if (averageScore >= 6) return {
      text: 'Base funcional. Alguns ajustes devem aumentar conversão.',
      color: 'text-info-foreground',
      icon: TrendingUp,
      iconColor: 'text-info-foreground'
    };
    if (averageScore >= 4) return {
      text: 'Gargalos ativos travando vendas. Ação imediata necessária.',
      color: 'text-warning-foreground',
      icon: AlertCircle,
      iconColor: 'text-warning-foreground'
    };
    return {
      text: 'Múltiplos bloqueios críticos. Reconstrução estratégica necessária.',
      color: 'text-destructive',
      icon: AlertCircle,
      iconColor: 'text-destructive'
    };
  };

  const diagnosis = getDiagnosis();
  const DiagnosisIcon = diagnosis.icon;
  const bottleneckInsight = getActionableInsight(criticalBottleneck.name, criticalBottleneck.score);
  const bottleneckLevel = getScoreLevel(criticalBottleneck.score);

  return (
    <div className="space-y-4">
      {/* Diagnóstico Geral */}
      <Card className="border-2">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center min-w-16">
              <div className="text-3xl font-bold text-primary">{averageScore}</div>
              <div className="text-xs text-muted-foreground">de 10</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DiagnosisIcon className={`h-4 w-4 ${diagnosis.iconColor}`} />
                <p className={`text-xs font-medium ${diagnosis.color}`}>
                  {diagnosis.text}
                </p>
              </div>
              <div className="flex gap-1.5">
                {criticalCount > 0 && (
                  <Badge variant="destructive" className="text-xs py-0 h-5">
                    {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {attentionCount > 0 && (
                  <Badge variant="outline" className="text-xs py-0 h-5 bg-warning/10 text-warning-foreground border-warning/30 hover:bg-warning/10">
                    {attentionCount} atenção
                  </Badge>
                )}
                {adequateCount > 0 && (
                  <Badge variant="outline" className="text-xs py-0 h-5 bg-success/10 text-success-foreground border-success/30 hover:bg-success/10">
                    {adequateCount} adequado{adequateCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Grid de Resumo */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-success/10 rounded border border-success/30">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                <p className="text-xs font-semibold text-success-foreground">Ponto forte</p>
              </div>
              <p className="text-xs font-medium text-success-foreground">{strongest.name}</p>
              <p className="text-xs text-success-foreground/80 mt-0.5">Nota {strongest.score}/10</p>
            </div>

            <div className={`p-3 rounded border ${bottleneckLevel.bgColor} ${
              criticalBottleneck.score <= 4 ? 'border-destructive/30' : 'border-warning/30'
            }`}>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className={`h-3 w-3 ${
                  criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
                }`} />
                <p className={`text-xs font-semibold ${
                  criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
                }`}>Gargalo principal</p>
              </div>
              <p className={`text-xs font-medium ${
                criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
              }`}>{criticalBottleneck.name}</p>
              <p className={`text-xs mt-0.5 ${
                criticalBottleneck.score <= 4 ? 'text-destructive/80' : 'text-warning-foreground/80'
              }`}>Nota {criticalBottleneck.score}/10 - {bottleneckLevel.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ação Prioritária */}
      {criticalBottleneck.score < 7 && (
        <Alert className={`py-3 ${
          criticalBottleneck.score <= 4 ? 'bg-destructive/10 border-destructive/30' : 'bg-warning/10 border-warning/30'
        }`}>
          <AlertCircle className={`h-4 w-4 ${
            criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
          }`} />
          <AlertDescription className="space-y-2">
            <div>
              <p className={`text-xs font-semibold ${
                criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
              }`}>
                🎯 Comece por aqui:
              </p>
              <p className={`text-xs mt-1 ${
                criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
              }`}>
                <strong>Problema:</strong> {bottleneckInsight.issue}
              </p>
            </div>
            <div className={`p-2 rounded border ${
              criticalBottleneck.score <= 4 ? 'bg-destructive/10 border-destructive/30' : 'bg-warning/10 border-warning/30'
            }`}>
              <p className={`text-xs font-medium ${
                criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
              }`}>
                ✓ Próximo passo:
              </p>
              <p className={`text-xs mt-1 ${
                criticalBottleneck.score <= 4 ? 'text-destructive' : 'text-warning-foreground'
              }`}>
                {bottleneckInsight.action}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
