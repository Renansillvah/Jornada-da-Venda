import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { PILLARS_CONFIG, CONTEXT_OPTIONS, getScoreLevel } from '@/types/analysis';
import { saveAnalysis } from '@/lib/storage';
import type { Pillar, Analysis as AnalysisType } from '@/types/analysis';
import { toast } from 'sonner';

export default function Analysis() {
  const navigate = useNavigate();
  const [context, setContext] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [pillars, setPillars] = useState<Pillar[]>(
    PILLARS_CONFIG.map(p => ({
      id: p.id,
      name: p.name,
      score: 0,
      observation: '',
      action: '',
    }))
  );

  const toggleContext = (option: string) => {
    setContext(prev =>
      prev.includes(option)
        ? prev.filter(c => c !== option)
        : [...prev, option]
    );
  };

  const updatePillar = (id: string, field: keyof Pillar, value: string | number) => {
    setPillars(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculateDiagnostic = () => {
    const scores = pillars.map(p => p.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const strongest = pillars.find(p => p.score === maxScore);
    const weakest = pillars.find(p => p.score === minScore);

    return {
      average: Math.round(average),
      strongest: strongest?.name || '',
      weakest: weakest?.name || '',
    };
  };

  const handleSave = () => {
    if (context.length === 0) {
      toast.error('Selecione pelo menos um contexto de análise');
      return;
    }

    if (!description.trim()) {
      toast.error('Adicione uma descrição do material analisado');
      return;
    }

    const hasEmptyScores = pillars.some(p => p.score === 0);
    if (hasEmptyScores) {
      toast.error('Preencha a pontuação de todos os pilares');
      return;
    }

    const diagnostic = calculateDiagnostic();
    const analysis: AnalysisType = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      context,
      description,
      pillars,
      averageScore: diagnostic.average,
      strongestPillar: diagnostic.strongest,
      weakestPillar: diagnostic.weakest,
    };

    saveAnalysis(analysis);
    toast.success('Análise salva com sucesso');
    navigate('/history');
  };

  const diagnostic = calculateDiagnostic();

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

        <h1 className="text-3xl font-bold mb-8">Nova Análise de Jornada</h1>

        {/* Context Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contexto da Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block">Selecione os canais analisados</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CONTEXT_OPTIONS.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={context.includes(option)}
                      onCheckedChange={() => toggleContext(option)}
                    />
                    <label
                      htmlFor={option}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição do material analisado</Label>
              <Textarea
                id="description"
                placeholder="Ex: Análise do perfil do Instagram após reforma visual. Cliente segmento premium, primeiro contato..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Strategic Note */}
        <Alert className="mb-8 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Observação estratégica:</strong> Nem todos os pilares têm o mesmo peso emocional na decisão de compra.
            Falhas em clareza, confiança e facilidade de fechar tendem a travar vendas mesmo quando outros pontos estão bons.
          </AlertDescription>
        </Alert>

        {/* Pillars Section */}
        <div className="space-y-6 mb-8">
          {pillars.map((pillar, index) => {
            const scoreLevel = getScoreLevel(pillar.score);
            return (
              <Card key={pillar.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">
                      {index + 1}. {pillar.name}
                    </span>
                    <span className={`text-sm font-semibold ${scoreLevel.color}`}>
                      {pillar.score > 0 ? `${pillar.score}/100 - ${scoreLevel.level}` : 'Não avaliado'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`score-${pillar.id}`}>Pontuação (0-100)</Label>
                    <Input
                      id={`score-${pillar.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={pillar.score || ''}
                      onChange={e => updatePillar(pillar.id, 'score', parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`observation-${pillar.id}`}>O que impactou essa nota</Label>
                    <Textarea
                      id={`observation-${pillar.id}`}
                      placeholder="Descreva os pontos observados..."
                      value={pillar.observation}
                      onChange={e => updatePillar(pillar.id, 'observation', e.target.value)}
                      rows={2}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`action-${pillar.id}`}>O que melhorar para subir pontos</Label>
                    <Textarea
                      id={`action-${pillar.id}`}
                      placeholder="Liste ações práticas de melhoria..."
                      value={pillar.action}
                      onChange={e => updatePillar(pillar.id, 'action', e.target.value)}
                      rows={2}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Diagnostic */}
        {pillars.some(p => p.score > 0) && (
          <Card className="mb-8 border-2 border-primary/30">
            <CardHeader>
              <CardTitle>Diagnóstico Preliminar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Média geral</p>
                  <p className="text-3xl font-bold">{diagnostic.average}/100</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pilar mais forte</p>
                  <p className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    {diagnostic.strongest}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pilar mais fraco</p>
                  <p className="font-semibold flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    {diagnostic.weakest}
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>A venda tende a travar no pilar mais fraco.</strong> Priorize melhorar este ponto antes de otimizar os demais.
                </AlertDescription>
              </Alert>

              <Alert className="border-primary/30 bg-primary/5">
                <AlertDescription className="text-sm">
                  Pilares ligados à <strong>confiança, clareza e facilidade de fechar</strong> costumam ter maior impacto na conversão do que pilares estéticos ou emocionais.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Priority Action */}
        {diagnostic.weakest && (
          <Card className="mb-8 bg-destructive/5 border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Prioridade de Ação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                <strong>Pilar crítico:</strong> {diagnostic.weakest}
              </p>
              <Alert>
                <AlertDescription className="text-sm">
                  Se apenas um ponto puder ser corrigido agora, comece por este pilar.
                  Ele representa o maior gargalo da jornada de venda no momento.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSave} size="lg" className="flex-1">
            Salvar análise
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" size="lg">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
