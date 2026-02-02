import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { PILLARS_CONFIG, CONTEXT_OPTIONS } from '@/types/analysis';
import { saveAnalysis } from '@/lib/storage';
import type { Pillar, Analysis as AnalysisType } from '@/types/analysis';
import { toast } from 'sonner';
import { BarView } from '@/components/BarView';

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

  const updatePillarScore = (id: string, score: number) => {
    setPillars(prev =>
      prev.map(p => (p.id === id ? { ...p, score } : p))
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

        {/* Bar View */}
        <div className="mb-8">
          <BarView pillars={pillars} onScoreChange={updatePillarScore} />
        </div>

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
