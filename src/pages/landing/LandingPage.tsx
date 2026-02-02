import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { JDVLogo } from '@/components/JDVLogo';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

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
            <JDVLogo className="w-8 h-8 text-primary" />
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
              onClick={() => navigate('/signup')}
            >
              Começar Grátis
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
    </div>
  );
}
