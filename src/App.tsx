import { Routes, Route } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import Home from '@/pages/Home';
import Analysis from '@/pages/Analysis';
import History from '@/pages/History';

export function App() {
  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
      <Toaster />
    </>
  );
}

export default App;