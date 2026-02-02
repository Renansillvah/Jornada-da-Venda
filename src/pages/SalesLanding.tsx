import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Check,
  X,
  TrendingUp,
  Zap,
  Crown,
  Shield,
  Target,
  Users,
  Infinity
} from 'lucide-react';
import { SocialProof } from '@/components/landing/SocialProof';

export default function SalesLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-warning/10 text-warning border-warning/30 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Oferta de Lançamento - Pagamento Único
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Você Está Perdendo Vendas
            <br />
            <span className="text-primary">Sem Saber Onde</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Descubra os <strong>15 pontos fracos</strong> da sua jornada de vendas em{' '}
            <strong className="text-foreground">5 minutos</strong> (com IA)
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={() => navigate('/buy-credits')}
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              <Crown className="w-5 h-5 mr-2" />
              Garantir Acesso Vitalício
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                De <span className="line-through">R$ 29,90</span> por apenas
              </p>
              <p className="text-success font-bold text-2xl">R$ 9,99 Vitalício</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Infinity className="w-4 h-4 text-success" />
              <span>Análises ilimitadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Pague 1x, use sempre</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Garantia de 7 dias</span>
            </div>
          </div>
        </div>

        {/* Problema (Dor) */}
        <Card className="mb-16 border-destructive/30 bg-destructive/5">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Você Reconhece Esses Sinais?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium mb-1">Cliente Some</p>
                  <p className="text-sm text-muted-foreground">
                    "Vou pensar" e nunca mais responde
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium mb-1">Proposta Ignorada</p>
                  <p className="text-sm text-muted-foreground">
                    Manda proposta mas não fecha
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium mb-1">Preço Alto</p>
                  <p className="text-sm text-muted-foreground">
                    Cliente sempre acha caro
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-background rounded-lg border border-border">
              <p className="text-center text-sm">
                <strong>O problema não é você.</strong> É que você está errando em pontos
                específicos da jornada mental do cliente (e não sabe quais).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Solução */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            A Solução: Análise Científica da Jornada
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Faça Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Print de conversa (Instagram, WhatsApp, proposta, email...)
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">IA Analisa</h3>
                <p className="text-sm text-muted-foreground">
                  15 pilares da jornada mental do cliente (em 5 minutos)
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Ações Práticas</h3>
                <p className="text-sm text-muted-foreground">
                  O que mudar HOJE para fechar mais vendas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 rounded-lg p-6 border border-primary/30">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  Exemplo Real: O que a IA detectou em 1 conversa
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>
                      Linguagem informal demais para contexto B2B (perdendo 40% das vendas)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>
                      Falta de prova social (cliente não vê autoridade)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>
                      Proposta sem próximo passo claro (cliente fica perdido)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Prova Social */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Resultados Reais
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">João Silva</p>
                    <p className="text-xs text-muted-foreground">Consultor de Marketing</p>
                  </div>
                </div>
                <p className="text-sm mb-2">
                  "Descobri que estava sendo informal demais com clientes corporativos. Mudei 3 coisas e{' '}
                  <strong className="text-success">fechei 40% mais vendas</strong> no mês seguinte."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">Maria Santos</p>
                    <p className="text-xs text-muted-foreground">Designer Freelancer</p>
                  </div>
                </div>
                <p className="text-sm mb-2">
                  "Minha proposta tinha 8 problemas que eu não via. Corrigi e{' '}
                  <strong className="text-success">aumentei meu ticket médio em 60%</strong>."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Urgência + Oferta */}
        <Card className="mb-16 border-2 border-primary">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Crown className="w-16 h-16 text-primary" />
              </div>

              <Badge className="mb-4 bg-warning/10 text-warning border-warning/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Oferta por Tempo Limitado
              </Badge>

              <h2 className="text-4xl font-bold mb-4">
                Acesso Vitalício por Apenas R$ 9,99
              </h2>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-2xl text-muted-foreground line-through">R$ 29,90</span>
                <span className="text-5xl font-bold text-success">R$ 9,99</span>
              </div>

              <p className="text-lg font-medium text-primary mb-2">
                Pague uma vez. Use para sempre.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Análises ilimitadas • Sem mensalidade • Sem taxa oculta
              </p>

              <div className="max-w-md mx-auto space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-success" />
                  <span>Análises ilimitadas com IA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-success" />
                  <span>Diagnóstico completo dos 15 pilares</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-success" />
                  <span>Ações práticas prontas para copiar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-success" />
                  <span>Atualizações futuras incluídas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-success" />
                  <span>Suporte prioritário</span>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">💡 Compare o valor:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">1 Venda Perdida</p>
                    <p className="font-bold text-destructive">~ R$ 500</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Acesso Vitalício</p>
                    <p className="font-bold text-success">R$ 9,99</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/buy-credits')}
                size="lg"
                className="text-lg px-12 py-6 h-auto mb-4"
              >
                <Crown className="w-5 h-5 mr-2" />
                Garantir Acesso Vitalício Agora
              </Button>

              <p className="text-xs text-muted-foreground mb-4">
                Pagamento 100% seguro via Mercado Pago
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-warning">
                <Users className="w-4 h-4" />
                <span>Apenas 47 vagas com este preço</span>
              </div>
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
                <h3 className="font-semibold text-lg mb-1">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="text-sm text-muted-foreground">
                  Se você não estiver satisfeito com a análise, devolvemos 100% do seu
                  dinheiro. Sem perguntas. Sem burocracia. O risco é todo nosso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Proof (Notificações de compras) */}
      <SocialProof />
    </div>
  );
}
