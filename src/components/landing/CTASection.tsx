import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Sem limite de análises',
  'Todos os recursos liberados',
  'Dados seguros e privados',
  'Suporte por email'
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 py-20">
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-info/5 to-success/5 shadow-xl">
        <CardContent className="p-8 sm:p-12 lg:p-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">

            {/* Título */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Pronto para Transformar Sua Forma de Vender?
            </h2>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-muted-foreground">
              Comece hoje mesmo. Gratuito, sem cartão de crédito,
              setup em menos de 2 minutos.
            </p>

            {/* CTA Principal */}
            <div className="pt-4">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 h-auto"
                onClick={() => navigate('/signup')}
              >
                Criar Minha Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Lista de benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 max-w-lg mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-left text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

          </div>
        </CardContent>
      </Card>
    </section>
  );
}
