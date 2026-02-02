import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, Check, Zap, TrendingUp, Crown, Shield, Mail, User } from 'lucide-react';
import { hasLifetimeAccess } from '@/lib/access';
import { createPaymentPreference } from '@/lib/mercadopago';
import { toast } from 'sonner';

export default function BuyCredits() {
  const navigate = useNavigate();
  const hasAccess = hasLifetimeAccess();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Se já tem acesso vitalício, redirecionar
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Você já tem Acesso Vitalício!</h2>
            <p className="text-muted-foreground mb-6">
              Aproveite suas análises ilimitadas
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Ir para Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePurchase = async () => {
    // Validar email
    if (!email || !email.includes('@')) {
      toast.error('Email inválido', {
        description: 'Por favor, insira um email válido'
      });
      return;
    }

    setLoading(true);

    try {
      toast.info('Criando pagamento...', {
        description: 'Aguarde enquanto preparamos seu checkout'
      });

      // Criar preferência de pagamento no Mercado Pago
      const preference = await createPaymentPreference({
        email,
        name: name || undefined,
      });

      // Redirecionar para o checkout do Mercado Pago
      toast.success('Redirecionando para o Mercado Pago...', {
        description: 'Você será levado para a página de pagamento'
      });

      // Aguardar 1 segundo antes de redirecionar
      setTimeout(() => {
        window.location.href = preference.init_point;
      }, 1000);

    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      toast.error('Erro ao processar pagamento', {
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-warning/10 text-warning border-warning/30 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Oferta de Lançamento - Pagamento Único
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Acesso Vitalício
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Pague uma vez, use para sempre
          </p>
          <p className="text-sm text-muted-foreground">
            Sem mensalidades. Sem taxas ocultas. Sem limite de análises.
          </p>
        </div>

        {/* Prova Social */}
        <Card className="mb-12 border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">
                  "Descobri que minha linguagem informal estava afastando clientes B2B. Mudei 3 coisas e fechei 40% mais vendas!"
                </p>
                <p className="text-sm text-muted-foreground">
                  — João Silva, Consultor de Marketing Digital
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Oferta Principal */}
        <Card className="mb-12 border-2 border-primary shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Crown className="w-16 h-16 text-primary" />
            </div>
            <Badge className="mx-auto mb-4 bg-success/10 text-success border-success/30 px-4 py-2">
              67% DE DESCONTO - Lançamento
            </Badge>
            <CardTitle className="text-3xl mb-2">Acesso Vitalício</CardTitle>
            <CardDescription>
              Análises ilimitadas. Para sempre.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Preço */}
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-2xl text-muted-foreground line-through">R$ 29,90</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  -67%
                </Badge>
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold text-primary">R$ 9,99</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pagamento único • Sem mensalidade
              </p>
              <p className="text-xs text-warning mt-2">
                ⚠️ Preço sobe para R$ 29,90 após primeiros 100 clientes
              </p>
            </div>

            {/* O que está incluído */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center mb-4">O que você ganha:</h3>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Análises Ilimitadas com IA</p>
                  <p className="text-sm text-muted-foreground">
                    Quantas quiser, quando quiser. Para sempre.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Diagnóstico Completo dos 15 Pilares</p>
                  <p className="text-sm text-muted-foreground">
                    Fundamentos, Conversão e Potencialização
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Ações Práticas Personalizadas</p>
                  <p className="text-sm text-muted-foreground">
                    O que mudar HOJE para vender mais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Scripts Prontos para Copiar</p>
                  <p className="text-sm text-muted-foreground">
                    Exemplos práticos antes/depois
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Atualizações Gratuitas</p>
                  <p className="text-sm text-muted-foreground">
                    Todas as melhorias futuras incluídas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Suporte Prioritário</p>
                  <p className="text-sm text-muted-foreground">
                    Resposta em até 24h
                  </p>
                </div>
              </div>
            </div>

            {/* Comparação */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-center font-medium mb-3">
                💡 Compare o valor:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">1 Venda Perdida</p>
                  <p className="font-bold text-destructive">~ R$ 500</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">Acesso Vitalício</p>
                  <p className="font-bold text-success">R$ 9,99</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Identifique e corrija os erros que te fazem perder vendas
              </p>
            </div>

            {/* Formulário */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
              <h3 className="font-semibold text-center text-sm">Complete para continuar:</h3>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Usaremos este email para criar sua conta automaticamente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Nome (opcional)
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handlePurchase}
              disabled={loading}
              size="lg"
              className="w-full text-lg py-6 h-auto"
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Garantir Acesso Vitalício Agora
                </>
              )}
            </Button>

            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Pagamento 100% seguro via Mercado Pago
              </p>
              <p className="text-xs text-muted-foreground">
                ✓ Sua conta será criada automaticamente após o pagamento
              </p>
            </div>

            <div className="text-center text-sm text-warning">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Apenas 47 vagas com este preço
            </div>
          </CardContent>
        </Card>

        {/* Garantia */}
        <Card className="bg-success/5 border-success/30">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Garantia Incondicional de 7 Dias</h3>
                <p className="text-sm text-muted-foreground">
                  Se você não estiver satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas. Sem burocracia. O risco é todo nosso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
