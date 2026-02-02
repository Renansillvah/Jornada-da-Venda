import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Trash2, Eye, Calendar, FileText, Search, Filter, X, Download, Copy, FileDown } from 'lucide-react';
import { BarView } from '@/components/BarView';
import { getAnalyses, deleteAnalysis } from '@/lib/storage';
import type { Analysis } from '@/types/analysis';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTEXT_OPTIONS } from '@/types/analysis';
import { exportToCSV, exportToText, copyToClipboard } from '@/lib/export';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContext, setFilterContext] = useState<string>('all');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setAnalyses(getAnalyses());
  }, []);

  const filteredAnalyses = useMemo(() => {
    return analyses.filter(analysis => {
      // Filtro de busca (descrição ou contexto)
      const matchesSearch = searchTerm === '' ||
        analysis.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.context.some(ctx => ctx.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de contexto
      const matchesContext = filterContext === 'all' ||
        analysis.context.includes(filterContext);

      // Filtro de nota
      let matchesScore = true;
      if (filterScore === 'excellent') matchesScore = analysis.averageScore >= 8;
      else if (filterScore === 'good') matchesScore = analysis.averageScore >= 6 && analysis.averageScore < 8;
      else if (filterScore === 'attention') matchesScore = analysis.averageScore >= 4 && analysis.averageScore < 6;
      else if (filterScore === 'critical') matchesScore = analysis.averageScore < 4;

      return matchesSearch && matchesContext && matchesScore;
    });
  }, [analyses, searchTerm, filterContext, filterScore]);

  const hasActiveFilters = searchTerm !== '' || filterContext !== 'all' || filterScore !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterContext('all');
    setFilterScore('all');
  };

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setAnalyses(getAnalyses());
    toast.success('Análise excluída');
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
          <div className="flex gap-2">
            {analyses.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    exportToCSV(filteredAnalyses);
                    toast.success('CSV exportado com sucesso');
                  }}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportar para CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={() => navigate('/analysis')}>
              Nova análise
            </Button>
          </div>
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
            {/* Barra de Busca e Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Busca */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por descrição ou contexto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Toggle Filtros */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {showFilters ? 'Ocultar' : 'Mostrar'} filtros
                      {hasActiveFilters && <Badge variant="secondary" className="ml-2">Ativos</Badge>}
                    </Button>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Limpar filtros
                      </Button>
                    )}
                  </div>

                  {/* Filtros Expandidos */}
                  {showFilters && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Contexto</label>
                        <Select value={filterContext} onValueChange={setFilterContext}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os contextos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os contextos</SelectItem>
                            {CONTEXT_OPTIONS.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nota</label>
                        <Select value={filterScore} onValueChange={setFilterScore}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as notas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as notas</SelectItem>
                            <SelectItem value="excellent">Excelente (8-10)</SelectItem>
                            <SelectItem value="good">Adequado (6-8)</SelectItem>
                            <SelectItem value="attention">Atenção (4-6)</SelectItem>
                            <SelectItem value="critical">Crítico (&lt;4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Contador de Resultados */}
                  <div className="text-sm text-muted-foreground">
                    Mostrando {filteredAnalyses.length} de {analyses.length} análise{analyses.length > 1 ? 's' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Análises */}
            {filteredAnalyses.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhuma análise encontrada</h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredAnalyses.map((analysis, index) => (
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
                    <div className="p-3 bg-success/10 rounded-lg border border-success/30">
                      <p className="text-xs text-success-foreground mb-1">Ponto forte</p>
                      <p className="text-sm font-semibold text-success-foreground truncate">{analysis.strongestPillar}</p>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                      <p className="text-xs text-destructive mb-1">Gargalo</p>
                      <p className="text-sm font-semibold text-destructive truncate">{analysis.weakestPillar}</p>
                    </div>
                  </div>

                  {analysis.changes && (
                    <Alert>
                      <AlertDescription className="text-sm">
                        <strong>Mudanças:</strong> {analysis.changes}
                      </AlertDescription>
                    </Alert>
                  )}

                  {index === 0 && filteredAnalyses.length > 1 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Comparação com análise anterior:</strong>{' '}
                        {analysis.averageScore > filteredAnalyses[1].averageScore
                          ? `+${analysis.averageScore - filteredAnalyses[1].averageScore} pontos`
                          : analysis.averageScore < filteredAnalyses[1].averageScore
                          ? `${analysis.averageScore - filteredAnalyses[1].averageScore} pontos`
                          : 'Sem mudança na média'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))
            )}
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
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={async () => {
                          const success = await copyToClipboard(selectedAnalysis);
                          if (success) toast.success('Copiado para área de transferência');
                          else toast.error('Erro ao copiar');
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar (Markdown)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          exportToText(selectedAnalysis);
                          toast.success('Relatório exportado');
                        }}>
                          <FileDown className="h-4 w-4 mr-2" />
                          Baixar Relatório (TXT)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" onClick={() => setSelectedAnalysis(null)}>
                      Fechar
                    </Button>
                  </div>
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
