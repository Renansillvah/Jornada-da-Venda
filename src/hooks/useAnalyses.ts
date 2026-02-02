import { useState, useEffect } from 'react';
import { getAnalyses } from '@/lib/storage';
import type { Analysis } from '@/types/analysis';

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const data = await getAnalyses();
      setAnalyses(data);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  return { analyses, loading, reload: loadAnalyses };
}
