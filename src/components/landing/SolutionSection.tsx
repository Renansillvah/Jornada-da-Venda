import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, TrendingUp, Layers } from 'lucide-react';

const layers = [
  {
    icon: Shield,
    title: 'Camada 1: Fundamentos',
    subtitle: 'Base essencial para qualquer venda',
    pillars: [
      'Profissionalismo',
      'Clareza Técnica',
      'Confiança e Segurança',
      'Redução de Risco Percebido',
      'Timing da Conversa'
    ],
    description: 'Os 5 pilares fundamentais que sustentam toda conversação comercial. Sem essa base sólida, é impossível avançar para conversão.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10'
  },
  {
    icon: TrendingUp,
    title: 'Camada 2: Conversão',
    subtitle: 'Transforme interesse em decisão de compra',
    pillars: [
      'Posicionamento Percebido',
      'Alinhamento de Expectativa',
      'Diferenciação',
      'Sensação de Valor',
      'Facilidade de Fechar',
      'Sensação de Controle do Cliente'
    ],
    description: 'Os 6 pilares estratégicos que convertem um cliente interessado em um cliente comprometido e pronto para fechar.',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  {
    icon: Zap,
    title: 'Camada 3: Potencialização',
    subtitle: 'Multiplique seus resultados',
    pillars: [
      'Carisma',
      'Autoridade (Comportamental)',
      'Energia e Fluxo da Conversa'
    ],
    description: 'Os 3 pilares amplificadores que elevam sua performance e criam experiências de venda memoráveis e impactantes.',
    color: 'text-success',
    bgColor: 'bg-success/10'
  }
];

export function SolutionSection() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="bg-success/10 text-success">
          A Solução
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Metodologia de 15 Pilares em 3 Camadas
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sistema completo e científico de análise que avalia todos os aspectos críticos da jornada mental do cliente,
          desde fundamentos até amplificadores de performance.
        </p>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <Card
              key={index}
              className="border-2 hover:shadow-xl transition-all group"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`w-14 h-14 rounded-lg ${layer.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${layer.color}`} />
                  </div>

                  {/* Título e subtítulo */}
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {layer.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {layer.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  {layer.description}
                </p>

                {/* Lista de pilares */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {layer.pillars.map((pillar, idx) => (
                    <Badge key={idx} variant="outline" className={layer.bgColor}>
                      {pillar}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo visual */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full border">
          <Layers className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            <strong>15 pilares</strong> organizados em <strong>3 camadas estratégicas</strong> para análise completa e detalhada
          </span>
        </div>
      </div>
    </section>
  );
}
