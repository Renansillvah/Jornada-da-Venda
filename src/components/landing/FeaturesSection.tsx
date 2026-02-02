import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, History, Download, Shield, Moon } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description: 'Visualize sua performance em tempo real com gráficos intuitivos e métricas que realmente importam.'
  },
  {
    icon: TrendingUp,
    title: 'Evolução ao Longo do Tempo',
    description: 'Acompanhe seu crescimento com gráficos de linha que mostram tendências e padrões de melhoria.'
  },
  {
    icon: History,
    title: 'Histórico Completo',
    description: 'Acesse todas as suas análises anteriores com filtros por data, contexto e pontuação.'
  },
  {
    icon: Download,
    title: 'Exportação de Dados',
    description: 'Exporte para CSV, TXT ou Markdown para compartilhar com sua equipe ou gerente.'
  },
  {
    icon: Shield,
    title: 'Dados Seguros na Nuvem',
    description: 'Suas análises protegidas e acessíveis de qualquer lugar, sem risco de perda de dados.'
  },
  {
    icon: Moon,
    title: 'Dark Mode Incluso',
    description: 'Interface moderna que se adapta ao seu ambiente de trabalho, seja de dia ou de noite.'
  }
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-20 bg-muted/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Tudo que Você Precisa para Vender Melhor
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Funcionalidades pensadas para vendedores que buscam excelência
          e resultados consistentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 group"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
