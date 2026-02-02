import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Trash2, Eye, Calendar, FileText } from 'lucide-react';
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

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Nota geral</p>
                      <p className="text-2xl font-bold text-primary">{analysis.averageScore}<span className="text-sm text-muted-foreground">/10</span></p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 mb-1">Ponto forte</p>
                      <p className="text-sm font-semibold text-green-800 truncate">{analysis.strongestPillar}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 mb-1">Gargalo</p>
                      <p className="text-sm font-semibold text-red-800 truncate">{analysis.weakestPillar}</p>
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
                  <Button variant="ghost" onClick={() => setSelectedAnalysis(null)}>
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

                {/* Bar View */}
                <BarView pillars={selectedAnalysis.pillars} />

              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
