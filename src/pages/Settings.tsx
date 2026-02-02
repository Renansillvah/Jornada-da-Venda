import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Key, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { getOpenAIKey, saveOpenAIKey } from '@/lib/openai';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Settings() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const existingKey = getOpenAIKey();
    if (existingKey) {
      setApiKey(existingKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Digite uma chave válida da OpenAI');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('A chave da OpenAI deve começar com "sk-"');
      return;
    }

    saveOpenAIKey(apiKey.trim());
    setIsSaved(true);
    toast.success('Chave da OpenAI salva com sucesso!');
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSaved(false);
    toast.success('Chave removida');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground mb-8">
          Configure as integrações e preferências do app
        </p>

        {/* OpenAI Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  Análise Automática com IA
                  {isSaved && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  Configure sua chave da OpenAI para usar análise automática de imagens
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Key className="w-4 h-4" />
              <AlertDescription>
                <strong>Como obter sua chave:</strong>
                <ol className="mt-2 space-y-1 text-sm list-decimal list-inside">
                  <li>Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/api-keys</a></li>
                  <li>Faça login ou crie uma conta OpenAI</li>
                  <li>Clique em "Create new secret key"</li>
                  <li>Copie a chave e cole abaixo</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="openai-key">Chave da API OpenAI</Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sua chave é armazenada apenas localmente no seu navegador
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Key className="w-4 h-4 mr-2" />
                Salvar Chave
              </Button>
              {isSaved && (
                <Button onClick={handleRemove} variant="outline">
                  Remover
                </Button>
              )}
            </div>

            {isSaved && (
              <Alert className="bg-success/10 border-success/50">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <AlertDescription className="text-success">
                  <strong>Configuração ativa!</strong> Você já pode usar a análise automática
                  na página de Nova Análise.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como funciona a análise com IA?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Tire uma foto ou print:</strong> Pode ser uma conversa
              do Instagram, WhatsApp, uma proposta comercial, email, qualquer material de venda.
            </p>
            <p>
              <strong className="text-foreground">2. Faça upload no app:</strong> Clique em "Analisar com IA"
              na página de Nova Análise e selecione a imagem.
            </p>
            <p>
              <strong className="text-foreground">3. A IA analisa automaticamente:</strong> O GPT-4 Vision
              lê a imagem, identifica o contexto e avalia cada um dos 15 pilares da jornada mental do cliente.
            </p>
            <p>
              <strong className="text-foreground">4. Revise e salve:</strong> Os pilares são preenchidos
              automaticamente. Você pode ajustar manualmente se quiser e salvar a análise.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
