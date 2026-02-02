import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Check, Zap, TrendingUp } from 'lucide-react';
import { getCredits } from '@/lib/credits';
import { toast } from 'sonner';

export default function BuyCredits() {
  const navigate = useNavigate();
  const currentCredits = getCredits();
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      id: 'starter',
      name: 'Pacote Inicial',
      credits: 10,
      price: 9.99,
      priceOriginal: 29.90,
      popular: true,
      savings: '67% OFF',
      features: [
        '10 análises completas com IA',
        'Diagnóstico dos 15 pilares',
        'Ações práticas personalizadas',
        'Exemplos prontos para copiar',
        'Válido por 6 meses'
      ],
      cta: 'Começar Agora',
      urgency: 'Oferta de lançamento - Vagas limitadas!'
    },
    {
      id: 'pro',
      name: 'Pacote Profissional',
      credits: 30,
      price: 24.99,
      priceOriginal: 89.70,
      popular: false,
      savings: '72% OFF',
      features: [
        '30 análises completas com IA',
        'Diagnóstico dos 15 pilares',
        'Ações práticas personalizadas',
        'Exemplos prontos para copiar',
        'Válido por 12 meses',
        'Suporte prioritário'
      ],
      cta: 'Economizar Mais',
      urgency: 'Mais vendido entre consultores!'
    }
  ];

  const handlePurchase = (packageId: string) => {
    setLoading(true);

    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) return;

    // Aqui você vai integrar com Mercado Pago
    // Por enquanto, vou simular o processo
    toast.info('Redirecionando para pagamento...', {
      description: 'Você será redirecionado para o Mercado Pago'
    });

    // Simular redirect para Mercado Pago (você vai substituir isso pela URL real)
    setTimeout(() => {
      // IMPORTANTE: Aqui você vai criar a preferência no Mercado Pago e redirecionar
      toast.error('Integração com Mercado Pago ainda não configurada', {
        description: 'Configure suas credenciais do Mercado Pago nas Settings',
        action: {
          label: 'Ir para Settings',
          onClick: () => navigate('/settings')
        }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Oferta de Lançamento
          </Badge>
          <h1 className="text-4xl font-bold mb-3">
            Descubra Onde Você Está Perdendo Vendas
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Análise completa da jornada do cliente em 5 minutos
          </p>
          <p className="text-sm text-muted-foreground">
            Você tem <span className="font-bold text-primary">{currentCredits} crédito{currentCredits !== 1 ? 's' : ''}</span> disponível
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

        {/* Pacotes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${
                pkg.popular
                  ? 'border-2 border-primary shadow-lg scale-105'
                  : 'border-border'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Mais Escolhido
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    {pkg.savings}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-warning">
                  {pkg.urgency}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Preço */}
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {pkg.priceOriginal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">R$ {pkg.price.toFixed(2)}</span>
                    <span className="text-muted-foreground">/ {pkg.credits} análises</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Apenas R$ {(pkg.price / pkg.credits).toFixed(2)} por análise
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  {loading ? (
                    'Processando...'
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {pkg.cta}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pagamento 100% seguro via Mercado Pago
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Garantia */}
        <Card className="bg-success/5 border-success/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Garantia de 7 dias</h3>
                <p className="text-sm text-muted-foreground">
                  Se você não estiver satisfeito com a análise, devolvemos 100% do seu dinheiro. Sem perguntas. Sem burocracia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
