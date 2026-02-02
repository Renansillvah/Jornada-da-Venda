import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { SocialProof } from '@/components/landing/SocialProof';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Jornada da Venda
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button
              onClick={() => navigate('/venda')}
            >
              Garantir Acesso (R$ 9,99)
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Sections */}
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Social Proof (Notificações de compras) */}
      <SocialProof />
    </div>
  );
}
