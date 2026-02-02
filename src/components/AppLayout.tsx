import { ThemeToggle } from '@/components/theme-toggle';
import UserMenu from '@/components/UserMenu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <UserMenu />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
