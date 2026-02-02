import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingDown, Target, LineChart } from 'lucide-react';

const problems = [
  {
    icon: AlertCircle,
    title: 'Não Sabe Onde a Venda Perdeu Força',
    description: 'Cliente parecia interessado, mas não fechou. Você não consegue identificar o ponto exato onde perdeu a oportunidade.'
  },
  {
    icon: TrendingDown,
    title: 'Vendas Caem Sem Explicação Clara',
    description: 'Sua taxa de conversão diminui, mas você não tem dados concretos para entender o motivo e corrigir.'
  },
  {
    icon: Target,
    title: 'Falta de Critérios Objetivos',
    description: 'Avalia suas vendas apenas pela intuição. Não tem métricas claras para medir cada etapa da jornada.'
  },
  {
    icon: LineChart,
    title: 'Sem Visão de Evolução',
    description: 'Impossível comparar performance ao longo do tempo ou identificar padrões de sucesso e fracasso.'
  }
];

export function ProblemSection() {
  return (
    <section className="container mx-auto px-6 py-20 bg-muted/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Por Que Suas Vendas Não Fecham?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A jornada mental do cliente é invisível. Sem mapeá-la, você está vendendo no escuro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {problems.map((problem, index) => {
          const Icon = problem.icon;
          return (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Ícone */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-destructive" />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
