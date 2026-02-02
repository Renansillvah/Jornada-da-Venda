import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Users } from 'lucide-react';

interface Purchase {
  id: number;
  name: string;
  city: string;
  time: string;
}

const fakePurchases: Purchase[] = [
  { id: 1, name: 'João S.', city: 'São Paulo, SP', time: 'há 3 minutos' },
  { id: 2, name: 'Maria L.', city: 'Rio de Janeiro, RJ', time: 'há 8 minutos' },
  { id: 3, name: 'Carlos A.', city: 'Belo Horizonte, MG', time: 'há 12 minutos' },
  { id: 4, name: 'Ana P.', city: 'Curitiba, PR', time: 'há 15 minutos' },
  { id: 5, name: 'Pedro M.', city: 'Porto Alegre, RS', time: 'há 18 minutos' },
  { id: 6, name: 'Julia R.', city: 'Brasília, DF', time: 'há 22 minutos' },
  { id: 7, name: 'Lucas F.', city: 'Salvador, BA', time: 'há 27 minutos' },
  { id: 8, name: 'Fernanda C.', city: 'Recife, PE', time: 'há 31 minutos' },
  { id: 9, name: 'Roberto K.', city: 'Fortaleza, CE', time: 'há 35 minutos' },
  { id: 10, name: 'Camila T.', city: 'Florianópolis, SC', time: 'há 42 minutos' }
];

export function SocialProof() {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase>(fakePurchases[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [totalSales, setTotalSales] = useState(47);

  useEffect(() => {
    // Rotacionar notificações de compra
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * fakePurchases.length);
        setCurrentPurchase(fakePurchases[randomIndex]);
        setTotalSales(prev => prev + 1);
        setIsVisible(true);
      }, 500);
    }, 8000); // Troca a cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-3 max-w-sm">
      {/* Notificação de compra em tempo real */}
      <Card
        className={`border-success/30 bg-background/95 backdrop-blur-sm shadow-xl transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-foreground">
                  {currentPurchase.name}
                </p>
                <Badge className="bg-success/10 text-success border-success/30 text-xs px-2 py-0">
                  Comprou
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPurchase.city}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPurchase.time}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contador de vendas */}
      <Card className="border-primary/30 bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-primary">{totalSales}</span> pessoas compraram hoje
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
