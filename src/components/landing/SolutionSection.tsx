import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Handshake, CheckCircle } from 'lucide-react';

const pillars = [
  {
    icon: Search,
    title: 'Descoberta',
    subtitle: 'Entenda profundamente as necessidades',
    description: 'Perguntas certas, escuta ativa, mapeamento de dores reais do cliente.',
    color: 'text-info',
    bgColor: 'bg-info/10'
  },
  {
    icon: FileText,
    title: 'Proposta',
    subtitle: 'Soluções personalizadas e convincentes',
    description: 'Proposta de valor clara, diferenciação competitiva, ROI demonstrado.',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    icon: Handshake,
    title: 'Negociação',
    subtitle: 'Feche melhores acordos com confiança',
    description: 'Gestão de objeções, concessões estratégicas, construção de parceria win-win.',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  {
    icon: CheckCircle,
    title: 'Fechamento',
    subtitle: 'Finalize com segurança e próximos passos',
    description: 'Comprometimento do cliente, contrato assinado, início do onboarding.',
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
          Domine os 4 Pilares da Venda Consultiva
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Avalie cada etapa da sua jornada de venda com critérios objetivos
          e melhore continuamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <Card
              key={index}
              className="border-2 hover:shadow-xl transition-all hover:scale-[1.02] group"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`w-14 h-14 rounded-lg ${pillar.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${pillar.color}`} />
                  </div>

                  {/* Título e subtítulo */}
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      {pillar.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
