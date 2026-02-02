import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingDown, Target, LineChart } from 'lucide-react';

const problems = [
  {
    icon: AlertCircle,
    title: 'Reuniões Sem Direção Clara',
    description: 'Você sai da reunião sem saber se foi bem ou mal, sem critérios objetivos de avaliação.'
  },
  {
    icon: TrendingDown,
    title: 'Perda de Oportunidades',
    description: 'Cliente interessado, mas você não explorou todos os pontos importantes da negociação.'
  },
  {
    icon: Target,
    title: 'Dificuldade em Identificar o que Melhorar',
    description: 'Sabe que precisa melhorar, mas não sabe exatamente onde focar seus esforços.'
  },
  {
    icon: LineChart,
    title: 'Falta de Visão de Evolução',
    description: 'Não tem como comparar sua performance ao longo do tempo e medir seu crescimento.'
  }
];

export function ProblemSection() {
  return (
    <section className="container mx-auto px-6 py-20 bg-muted/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Reconhece Algum Desses Desafios?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Vendedores enfrentam esses problemas todos os dias. E você?
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
