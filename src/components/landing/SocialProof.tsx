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
    <div className="fixed bottom-4 right-4 z-40 space-y-2 max-w-[200px]">
      {/* Notificação de compra em tempo real */}
      <Card
        className={`border-success/30 bg-background/85 backdrop-blur-md shadow-md transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="p-2">
          <div className="flex items-start gap-1.5">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <p className="font-semibold text-[10px] text-foreground truncate">
                  {currentPurchase.name}
                </p>
                <Badge className="bg-success/10 text-success border-success/30 text-[8px] px-1 py-0 leading-none">
                  Comprou
                </Badge>
              </div>
              <p className="text-[9px] text-muted-foreground truncate">
                {currentPurchase.city}
              </p>
              <p className="text-[8px] text-muted-foreground">
                {currentPurchase.time}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contador de vendas */}
      <Card className="border-primary/30 bg-background/85 backdrop-blur-md shadow-md">
        <div className="p-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-3 h-3 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] text-muted-foreground leading-tight">
                <span className="font-bold text-primary">{totalSales}</span> compraram hoje
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
