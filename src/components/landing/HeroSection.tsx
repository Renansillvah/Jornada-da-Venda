import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
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
            Transforme Suas Reuniões de Venda em{' '}
            <span className="text-primary">Insights Acionáveis</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Analise, acompanhe e melhore sua jornada de vendas com dados concretos.
            Identifique pontos fracos e fortaleça seu processo comercial.
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

        {/* Lado direito: Preview visual */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative">
            {/* Card com visual do dashboard */}
            <Card className="border-2 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/5 via-info/5 to-success/5 p-8">
                  {/* Simular interface do dashboard */}
                  <div className="space-y-4">
                    {/* Header simulado */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-foreground/10 rounded" />
                        <div className="h-3 w-24 bg-foreground/5 rounded mt-1" />
                      </div>
                    </div>

                    {/* Cards de métricas simulados */}
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                          <div className="h-3 w-20 bg-foreground/10 rounded mb-2" />
                          <div className="h-6 w-12 bg-primary/20 rounded" />
                        </div>
                      ))}
                    </div>

                    {/* Gráfico simulado */}
                    <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border">
                      <div className="h-3 w-32 bg-foreground/10 rounded mb-4" />
                      <div className="flex items-end gap-2 h-32">
                        {[60, 80, 45, 90, 75, 85, 70, 95].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
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
