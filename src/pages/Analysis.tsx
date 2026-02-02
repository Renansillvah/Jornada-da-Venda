import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { PILLARS_CONFIG, CONTEXT_OPTIONS } from '@/types/analysis';
import { saveAnalysis } from '@/lib/storage';
import type { Pillar, Analysis as AnalysisType } from '@/types/analysis';
import { toast } from 'sonner';
import { BarView } from '@/components/BarView';
import { ImageUpload } from '@/components/ImageUpload';
import { analyzeImageWithAI, getOpenAIKey } from '@/lib/openai';

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
  const [showAIUpload, setShowAIUpload] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [aiConclusion, setAiConclusion] = useState<string>('');

  const toggleContext = (option: string) => {
    setContext(prev =>
      prev.includes(option)
        ? prev.filter(c => c !== option)
        : [...prev, option]
    );
  };

  const updatePillarScore = (id: string, score: number) => {
    setPillars(prev =>
      prev.map(p => (p.id === id ? { ...p, score } : p))
    );
  };

  const calculateDiagnostic = () => {
    const pillarScores = PILLARS_CONFIG.map(config => {
      const pillar = pillars.find(p => p.id === config.id);
      const score = pillar?.score || 0;
      const weight = config.weight || 1;
      return score * weight;
    });
    const totalWeight = PILLARS_CONFIG.reduce((sum, config) => sum + (config.weight || 1), 0);
    const weightedAverage = pillarScores.reduce((a, b) => a + b, 0) / totalWeight;

    const maxScore = Math.max(...pillars.map(p => p.score));
    const minScore = Math.min(...pillars.map(p => p.score));
    const strongest = pillars.find(p => p.score === maxScore);
    const weakest = pillars.find(p => p.score === minScore);

    return {
      average: Math.round(weightedAverage * 10) / 10,
      strongest: strongest?.name || '',
      weakest: weakest?.name || '',
    };
  };

  const handleAIAnalysis = async () => {
    if (selectedImages.length === 0) {
      toast.error('Selecione pelo menos uma imagem para analisar');
      return;
    }

    const apiKey = getOpenAIKey();
    if (!apiKey) {
      toast.error('Configure sua chave da OpenAI nas configurações', {
        action: {
          label: 'Configurar',
          onClick: () => navigate('/settings')
        }
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('🚀 Iniciando análise com IA...');
      console.log(`📸 Analisando ${selectedImages.length} imagem(ns)`);

      const result = await analyzeImageWithAI(selectedImages, apiKey);
      console.log('✅ Resultado recebido da IA:', result);
      console.log('📊 Scores recebidos:', result.scores);
      console.log('📝 Explanations recebidas:', result.explanations);

      // Preencher contexto automaticamente
      setDescription(result.context + ' - ' + result.summary);

      // Armazenar a conclusão da IA
      if (result.conclusion) {
        setAiConclusion(result.conclusion);
      }

      // Preencher pilares com as notas, observações, explicações, exemplos e confiança da IA
      const updatedPillars = PILLARS_CONFIG.map(p => {
        const score = result.scores[p.id];
        const explanation = result.explanations[p.id];
        const example = result.examples?.[p.id];
        const confidence = result.confidence?.[p.id] || 'none';

        console.log(`Processando pilar ${p.name}:`, {
          id: p.id,
          scoreRecebido: score,
          scoreUsado: score || 0,
          confidence: confidence,
          hasExplanation: !!explanation,
          hasExample: !!example
        });

        return {
          id: p.id,
          name: p.name,
          score: typeof score === 'number' ? score : 0,
          observation: explanation || result.observations[p.id] || 'Não avaliado',
          action: '',
          confidence: confidence,
          example: example,
        };
      });

      console.log('✨ Pilares atualizados:', updatedPillars);
      console.log('📈 Scores finais:', updatedPillars.map(p => ({ name: p.name, score: p.score })));

      setPillars(updatedPillars);

      setShowAIUpload(false);

      // Contar pilares por nível de confiança
      const highConfidence = updatedPillars.filter(p => p.confidence === 'high').length;
      const mediumConfidence = updatedPillars.filter(p => p.confidence === 'medium').length;
      const lowConfidence = updatedPillars.filter(p => p.confidence === 'low').length;
      const notAnalyzed = updatedPillars.filter(p => p.confidence === 'none').length;

      toast.success('Análise automática concluída! Revise os resultados abaixo.', {
        duration: 7000,
        description: `${highConfidence} alta confiança • ${mediumConfidence} média • ${lowConfidence} baixa • ${notAnalyzed} não analisados`
      });

      // Scroll suave para a seção de pilares
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('❌ Erro na análise:', error);
      if (error instanceof Error) {
        console.error('Mensagem de erro:', error.message);
        console.error('Stack:', error.stack);
      }
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao analisar imagem. Verifique sua chave da OpenAI.'
      );
    } finally {
      setIsAnalyzing(false);
    }
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

    // Validar se pelo menos 1 pilar foi avaliado
    const evaluatedPillars = pillars.filter(p => p.score > 0);
    if (evaluatedPillars.length === 0) {
      toast.error('Avalie pelo menos um pilar antes de salvar');
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
      conclusion: aiConclusion || undefined,
      type: 'single',
      isActive: true,
    };

    saveAnalysis(analysis);
    toast.success('Análise salva com sucesso');
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Nova Análise de Jornada</h1>
          <Button
            onClick={() => setShowAIUpload(!showAIUpload)}
            variant={showAIUpload ? 'outline' : 'default'}
            size="lg"
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {showAIUpload ? 'Análise Manual' : 'Analisar com IA'}
          </Button>
        </div>

        {/* AI Upload Section */}
        {showAIUpload && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Análise Automática com IA
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Faça upload de imagens (prints do Instagram, WhatsApp, proposta, etc.) e
                a IA preencherá automaticamente os 15 pilares para você.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                onImagesSelected={(_, base64Images) => setSelectedImages(base64Images)}
                maxImages={5}
              />
              {selectedImages.length > 0 && (
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImages([]);
                      setShowAIUpload(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    size="lg"
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analisar Imagem
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* Bar View */}
        <div className="mb-8">
          <BarView pillars={pillars} onScoreChange={updatePillarScore} />
        </div>

        {/* Conclusão Geral da IA */}
        {aiConclusion && (
          <Card className="mb-8 border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-5 h-5" />
                Conclusão Geral e Recomendação Estratégica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-background/50 border-primary/30">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm leading-relaxed whitespace-pre-line">
                  {aiConclusion}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Pronto para salvar o diagnóstico?</p>
                <p className="text-xs text-muted-foreground">
                  Sua análise ficará salva no histórico para consulta e acompanhamento
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/home')} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleSave} size="lg" className="min-w-48">
                  Concluir análise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
