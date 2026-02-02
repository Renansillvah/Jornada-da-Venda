import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { getAnalyses } from '@/lib/storage';
import { calculateCompanyHealth } from '@/lib/companyHealth';
import { PILLARS_CONFIG, getLayerInfo, getScoreLevel } from '@/types/analysis';
import type { CompanyHealth as CompanyHealthType } from '@/types/analysis';

export default function CompanyHealth() {
  const navigate = useNavigate();
  const [health, setHealth] = useState<CompanyHealthType | null>(null);

  useEffect(() => {
    const analyses = getAnalyses();
    const companyHealth = calculateCompanyHealth(analyses);
    setHealth(companyHealth);
  }, []);

  if (!health) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (health.totalAnalyses === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardContent className="py-16 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma análise encontrada</h3>
              <p className="text-muted-foreground mb-6">
                Crie análises avulsas para alimentar o painel de saúde comercial
              </p>
              <Button onClick={() => navigate('/analysis')}>
                Criar primeira análise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: 'up' | 'stable' | 'down') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low', count: number) => {
    if (confidence === 'high') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Alta ({count} análises)</Badge>;
    }
    if (confidence === 'medium') {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">Média ({count} análises)</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Baixa ({count} análises)</Badge>;
  };

  const pillarsByLayer = {
    foundation: PILLARS_CONFIG.filter(p => p.layer === 'foundation'),
    conversion: PILLARS_CONFIG.filter(p => p.layer === 'conversion'),
    amplification: PILLARS_CONFIG.filter(p => p.layer === 'amplification'),
  };

  const renderLayer = (layerPillars: typeof PILLARS_CONFIG, layerKey: string) => {
    const layerInfo = getLayerInfo(layerKey);
    const layerScores = layerPillars
      .map(config => health.pillarScores[config.id])
      .filter(Boolean);

    if (layerScores.length === 0) {
      return null;
    }

    return (
      <div key={layerKey} className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{layerInfo.icon}</span>
          <div>
            <h3 className="font-semibold">{layerInfo.name}</h3>
            <p className="text-xs text-muted-foreground">{layerInfo.description}</p>
          </div>
        </div>

        <div className="space-y-2">
          {layerPillars.map(config => {
            const pillarScore = health.pillarScores[config.id];

            if (!pillarScore) {
              return (
                <Card key={config.id} className="bg-muted/30">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{config.name}</p>
                      <Badge variant="outline" className="text-xs">Sem dados</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            const scoreInfo = getScoreLevel(pillarScore.average);

            return (
              <Card key={config.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{config.name}</p>
                        {getTrendIcon(pillarScore.trend)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getConfidenceBadge(pillarScore.confidence, pillarScore.count)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{pillarScore.average}</div>
                      <div className={`text-xs font-medium ${scoreInfo.color}`}>{scoreInfo.level}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Saúde Comercial da Empresa</h1>
            <p className="text-sm text-muted-foreground">
              Baseado em {health.totalAnalyses} análise{health.totalAnalyses > 1 ? 's' : ''} ativa{health.totalAnalyses > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Nota Geral */}
        <Card className="border-2 border-primary/30 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-1">{health.overallScore}</div>
                <div className="text-xs text-muted-foreground">Nota geral</div>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(health.overallScore / 10) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {health.overallScore >= 8 && 'Atendimento em excelente nível'}
                  {health.overallScore >= 6 && health.overallScore < 8 && 'Atendimento funcional com espaço para melhoria'}
                  {health.overallScore >= 4 && health.overallScore < 6 && 'Gargalos ativos impactando conversão'}
                  {health.overallScore < 4 && 'Múltiplos bloqueios críticos identificados'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerta de Confiança */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>Como interpretar:</strong> Pilares com confiança "baixa" precisam de mais análises para diagnóstico preciso.
            Notas são calculadas com base apenas em dados reais, sem penalização por pilares não avaliados.
          </AlertDescription>
        </Alert>

        {/* Pilares por Camada */}
        <div className="space-y-6">
          {renderLayer(pillarsByLayer.foundation, 'foundation')}
          {renderLayer(pillarsByLayer.conversion, 'conversion')}
          {renderLayer(pillarsByLayer.amplification, 'amplification')}
        </div>

        {/* Ações */}
        <Card className="mt-6 bg-primary/5 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Continue melhorando</p>
                <p className="text-xs text-muted-foreground">
                  Crie novas análises para atualizar os dados e acompanhar a evolução
                </p>
              </div>
              <Button onClick={() => navigate('/analysis')}>
                Nova análise
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
