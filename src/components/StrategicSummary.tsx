import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import type { Pillar } from '@/types/analysis';

interface StrategicSummaryProps {
  pillars: Pillar[];
  averageScore: number;
}

export function StrategicSummary({ pillars, averageScore }: StrategicSummaryProps) {
  // Identificar pilares mais fortes (top 3)
  const topPillars = [...pillars]
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Contar pilares por qualidade
  const excellentCount = pillars.filter(p => p.score >= 8).length;
  const goodCount = pillars.filter(p => p.score >= 6 && p.score < 8).length;
  const evaluatedCount = pillars.filter(p => p.score > 0).length;

  // Determinar cor baseada na média
  const getScoreColor = () => {
    if (averageScore >= 7) return {
      border: 'border-success/30',
      bg: 'bg-success/5',
      text: 'text-success',
      icon: 'text-success'
    };
    if (averageScore >= 4) return {
      border: 'border-warning/30',
      bg: 'bg-warning/5',
      text: 'text-warning-foreground',
      icon: 'text-warning'
    };
    return {
      border: 'border-destructive/30',
      bg: 'bg-destructive/5',
      text: 'text-destructive',
      icon: 'text-destructive'
    };
  };

  const scoreColor = getScoreColor();

  // Mensagem positiva baseada na média
  const getPositiveMessage = () => {
    if (averageScore >= 8) return 'Excelente! Jornada muito bem estruturada';
    if (averageScore >= 7) return 'Ótimo! Continue mantendo este nível';
    if (averageScore >= 6) return 'Boa base construída! Continue evoluindo';
    if (averageScore >= 4) return 'Caminho iniciado. Vamos fortalecer os pilares';
    return 'Análise concluída. Identificados os pontos de melhoria';
  };

  return (
    <div className="space-y-4">
      {/* Resumo Positivo */}
      <Card className={`border-2 ${scoreColor.border} ${scoreColor.bg}`}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center min-w-16">
              <div className={`text-3xl font-bold ${scoreColor.text}`}>{averageScore}</div>
              <div className="text-xs text-muted-foreground">de 10</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={`h-4 w-4 ${scoreColor.icon}`} />
                <p className={`text-sm font-medium ${scoreColor.text}`}>
                  {getPositiveMessage()}
                </p>
              </div>
              <div className="flex gap-1.5">
                {excellentCount > 0 && (
                  <Badge variant="outline" className="text-xs py-0 h-5 bg-success/20 text-success border-success/30">
                    {excellentCount} excelente{excellentCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {goodCount > 0 && (
                  <Badge variant="outline" className="text-xs py-0 h-5 bg-info/10 text-info border-info/30">
                    {goodCount} bom/boa
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {evaluatedCount} avaliado{evaluatedCount > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>

          {/* Grid de Pontos Fortes */}
          {topPillars.length > 0 && (
            <div className="grid md:grid-cols-3 gap-3">
              {topPillars.map((pillar, index) => (
                <div key={pillar.id} className="p-3 bg-success/10 rounded border border-success/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <p className="text-xs font-semibold text-success">
                      {index === 0 ? 'Destaque #1' : index === 1 ? 'Destaque #2' : 'Destaque #3'}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-foreground">{pillar.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Nota {pillar.score}/10</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
