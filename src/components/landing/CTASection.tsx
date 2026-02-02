import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Análises ilimitadas para sempre',
  'Pague 1x, nunca mais paga',
  'Trial de 2 análises',
  'Suporte prioritário'
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
              Pronto para Parar de Perder Vendas?
            </h2>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-muted-foreground">
              Acesso vitalício por apenas R$ 9,99. Pague uma vez, use para sempre.
              Análises ilimitadas com IA.
            </p>

            {/* CTA Principal */}
            <div className="pt-4">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 h-auto"
                onClick={() => navigate('/venda')}
              >
                Garantir Acesso Vitalício Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                De <span className="line-through">R$ 29,90</span> por apenas <span className="font-bold text-success">R$ 9,99</span>
              </p>
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
