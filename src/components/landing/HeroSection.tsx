import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Brain, Instagram, MessageCircle, FileText, Handshake, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 py-20 lg:py-32">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Lado esquerdo: Texto */}
        <div className="flex-1 space-y-6 text-center lg:text-left">

          {/* Badge de destaque */}
          <Badge variant="outline" className="bg-primary/10 inline-flex">
            <Sparkles className="w-3 h-3 mr-1" />
            Análise de Jornada de Venda
          </Badge>

          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Mapeie a{' '}
            <span className="text-primary">Jornada Mental</span>{' '}
            do Seu Cliente Antes do Fechamento
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Entenda exatamente onde sua venda perde força. Avalie 15 pilares críticos
            organizados em 3 camadas que influenciam a decisão de compra e transforme conversas em contratos fechados.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="group text-base"
              onClick={() => navigate('/signup')}
            >
              Começar Análise Gratuita
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base"
              onClick={() => navigate('/login')}
            >
              <BarChart3 className="mr-2 w-4 h-4" />
              Já Tenho Conta
            </Button>
          </div>

          {/* Texto de apoio */}
          <p className="text-sm text-muted-foreground">
            ✓ Sem necessidade de cartão • ✓ Setup em 2 minutos • ✓ Dados seguros
          </p>
        </div>

        {/* Lado direito: Preview visual - Jornada Mental */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative">
            {/* Card principal */}
            <Card className="border-2 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/5 via-info/5 to-success/5 p-6">

                  {/* Título do preview */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Análise da Jornada</div>
                      <div className="text-xs text-muted-foreground">Cliente: Proposta Tech Solutions</div>
                    </div>
                  </div>

                  {/* Jornada Mental Visual */}
                  <div className="space-y-3">

                    {/* Passo 1: Instagram */}
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border-l-4 border-info">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                          <Instagram className="w-4 h-4 text-info" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Instagram</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-info w-[85%]" />
                            </div>
                            <span className="text-xs font-semibold text-info">8.5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passo 2: Atendimento WhatsApp */}
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Atendimento</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-[70%]" />
                            </div>
                            <span className="text-xs font-semibold text-primary">7.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passo 3: Proposta */}
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-warning" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Proposta</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-warning w-[60%]" />
                            </div>
                            <span className="text-xs font-semibold text-warning">6.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passo 4: Fechamento */}
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border-l-4 border-success">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Fechamento</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-success w-[90%]" />
                            </div>
                            <span className="text-xs font-semibold text-success">9.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Resumo */}
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Pontuação Média</span>
                      <span className="text-lg font-bold text-primary">7.6/10</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ⚠️ Atenção na Proposta Comercial
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Decoração de fundo */}
            <div className="absolute -z-10 inset-0 bg-primary/10 blur-3xl rounded-full translate-y-8" />
          </div>
        </div>

      </div>
    </section>
  );
}
