import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, Target } from 'lucide-react';
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
      color: 'text-green-700',
      icon: CheckCircle2,
      iconColor: 'text-green-600'
    };
    if (averageScore >= 6) return {
      text: 'Base funcional. Alguns ajustes devem aumentar conversão.',
      color: 'text-blue-700',
      icon: TrendingUp,
      iconColor: 'text-blue-600'
    };
    if (averageScore >= 4) return {
      text: 'Gargalos ativos travando vendas. Ação imediata necessária.',
      color: 'text-yellow-700',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    };
    return {
      text: 'Múltiplos bloqueios críticos. Reconstrução estratégica necessária.',
      color: 'text-red-700',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    };
  };

  const diagnosis = getDiagnosis();
  const DiagnosisIcon = diagnosis.icon;
  const bottleneckInsight = getActionableInsight(criticalBottleneck.name, criticalBottleneck.score);
  const bottleneckLevel = getScoreLevel(criticalBottleneck.score);

  return (
    <div className="space-y-6">
      {/* Diagnóstico Geral */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Diagnóstico Estratégico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nota e Diagnóstico */}
          <div className="flex items-start gap-4">
            <div className="text-center min-w-24">
              <div className="text-5xl font-bold text-primary">{averageScore}</div>
              <div className="text-xs text-muted-foreground mt-1">de 10 pontos</div>
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <DiagnosisIcon className={`h-5 w-5 mt-0.5 ${diagnosis.iconColor}`} />
                <p className={`text-sm font-medium ${diagnosis.color}`}>
                  {diagnosis.text}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                {criticalCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {attentionCount > 0 && (
                  <Badge className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {attentionCount} atenção
                  </Badge>
                )}
                {adequateCount > 0 && (
                  <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                    {adequateCount} adequado{adequateCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Grid de Resumo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-xs font-semibold text-green-900">Ponto forte</p>
              </div>
              <p className="text-sm font-medium text-green-800">{strongest.name}</p>
              <p className="text-xs text-green-700 mt-1">Nota {strongest.score}/10</p>
            </div>

            <div className={`p-4 rounded-lg border ${bottleneckLevel.bgColor} ${
              criticalBottleneck.score <= 4 ? 'border-red-200' : 'border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`h-4 w-4 ${
                  criticalBottleneck.score <= 4 ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <p className={`text-xs font-semibold ${
                  criticalBottleneck.score <= 4 ? 'text-red-900' : 'text-yellow-900'
                }`}>Gargalo principal</p>
              </div>
              <p className={`text-sm font-medium ${
                criticalBottleneck.score <= 4 ? 'text-red-800' : 'text-yellow-800'
              }`}>{criticalBottleneck.name}</p>
              <p className={`text-xs mt-1 ${
                criticalBottleneck.score <= 4 ? 'text-red-700' : 'text-yellow-700'
              }`}>Nota {criticalBottleneck.score}/10 - {bottleneckLevel.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ação Prioritária */}
      {criticalBottleneck.score < 7 && (
        <Alert className={`${
          criticalBottleneck.score <= 4 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <AlertCircle className={`h-4 w-4 ${
            criticalBottleneck.score <= 4 ? 'text-red-600' : 'text-yellow-600'
          }`} />
          <AlertDescription className="space-y-3">
            <div>
              <p className={`text-sm font-semibold ${
                criticalBottleneck.score <= 4 ? 'text-red-900' : 'text-yellow-900'
              }`}>
                🎯 Comece por aqui:
              </p>
              <p className={`text-sm mt-1 ${
                criticalBottleneck.score <= 4 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                <strong>Problema:</strong> {bottleneckInsight.issue}
              </p>
            </div>
            <div className={`p-3 rounded-md ${
              criticalBottleneck.score <= 4 ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <p className={`text-sm font-medium ${
                criticalBottleneck.score <= 4 ? 'text-red-900' : 'text-yellow-900'
              }`}>
                ✓ Próximo passo prático:
              </p>
              <p className={`text-sm mt-1 ${
                criticalBottleneck.score <= 4 ? 'text-red-800' : 'text-yellow-800'
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
