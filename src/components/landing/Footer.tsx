import { Separator } from '@/components/ui/separator';
import { BarChart3 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Coluna 1: Logo e descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Jornada da Venda
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforme suas reuniões de venda em insights acionáveis
              com análises baseadas em dados.
            </p>
          </div>

          {/* Coluna 2: Produto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Produto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#funcionalidades" className="hover:text-foreground transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#pilares" className="hover:text-foreground transition-colors">
                  4 Pilares
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Casos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

        </div>

        <Separator className="my-8" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} Jornada da Venda. Todos os direitos reservados.
          </p>
          <p className="text-xs">
            Feito com ❤️ para vendedores que buscam excelência
          </p>
        </div>
      </div>
    </footer>
  );
}
