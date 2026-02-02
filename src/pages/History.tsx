import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Trash2, Eye, Calendar, FileText, BarChart3 } from 'lucide-react';
import { BarView } from '@/components/BarView';
import { getAnalyses, deleteAnalysis } from '@/lib/storage';
import type { Analysis } from '@/types/analysis';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [detailViewMode, setDetailViewMode] = useState<'detailed' | 'bars'>('detailed');

  useEffect(() => {
    setAnalyses(getAnalyses());
  }, []);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setAnalyses(getAnalyses());
    toast.success('Análise excluída');
  };

  const getTrendIcon = (trend?: 'up' | 'stable' | 'down') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Histórico de Análises</h1>
          <Button onClick={() => navigate('/analysis')}>
            Nova análise
          </Button>
        </div>

        {analyses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma análise realizada</h3>
              <p className="text-muted-foreground mb-6">
                Comece criando sua primeira análise de jornada de venda
              </p>
              <Button onClick={() => navigate('/analysis')}>
                Criar primeira análise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis, index) => (
              <Card key={analysis.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg">
                          {format(new Date(analysis.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.context.map(ctx => (
                          <Badge key={ctx} variant="secondary">
                            {ctx}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir análise?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A análise será permanentemente removida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(analysis.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {analysis.description}
                  </p>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Média geral</p>
                      <p className="text-2xl font-bold">{analysis.averageScore}/100</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Mais forte</p>
                      <p className="text-sm font-semibold truncate">{analysis.strongestPillar}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Mais fraco</p>
                      <p className="text-sm font-semibold truncate">{analysis.weakestPillar}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tendência</p>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(analysis.trend)}
                        <span className="text-sm font-semibold">
                          {analysis.trend === 'up' ? 'Evolução' : analysis.trend === 'down' ? 'Queda' : 'Estável'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {analysis.changes && (
                    <Alert>
                      <AlertDescription className="text-sm">
                        <strong>Mudanças:</strong> {analysis.changes}
                      </AlertDescription>
                    </Alert>
                  )}

                  {index === 0 && analyses.length > 1 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Comparação com análise anterior:</strong>{' '}
                        {analysis.averageScore > analyses[1].averageScore
                          ? `+${analysis.averageScore - analyses[1].averageScore} pontos`
                          : analysis.averageScore < analyses[1].averageScore
                          ? `${analysis.averageScore - analyses[1].averageScore} pontos`
                          : 'Sem mudança na média'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedAnalysis && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnalysis(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle>Detalhes da Análise</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedAnalysis.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => {
                    setSelectedAnalysis(null);
                    setDetailViewMode('detailed');
                  }}>
                    Fechar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Contexto</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedAnalysis.context.map(ctx => (
                      <Badge key={ctx} variant="secondary">
                        {ctx}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedAnalysis.description}
                  </p>
                </div>

                {/* View Mode Toggle */}
                <Tabs value={detailViewMode} onValueChange={(v) => setDetailViewMode(v as 'detailed' | 'bars')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="detailed" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Detalhada
                    </TabsTrigger>
                    <TabsTrigger value="bars" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Barras
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="detailed" className="mt-4">
                    <div>
                      <h4 className="font-semibold mb-4">Pilares Avaliados</h4>
                      <div className="space-y-4">
                        {selectedAnalysis.pillars.map(pillar => (
                          <div key={pillar.id} className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold">{pillar.name}</h5>
                              <Badge>{pillar.score}/100</Badge>
                            </div>
                            {pillar.observation && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Impacto na nota:</p>
                                <p className="text-sm">{pillar.observation}</p>
                              </div>
                            )}
                            {pillar.action && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Ações de melhoria:</p>
                                <p className="text-sm">{pillar.action}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bars" className="mt-4">
                    <BarView pillars={selectedAnalysis.pillars} />
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Média geral</p>
                      <p className="text-3xl font-bold">{selectedAnalysis.averageScore}/100</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pilar mais forte</p>
                      <p className="font-semibold">{selectedAnalysis.strongestPillar}</p>
                    </div>
                    <div className="p-4 bg-destructive/5 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pilar mais fraco</p>
                      <p className="font-semibold text-destructive">{selectedAnalysis.weakestPillar}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
