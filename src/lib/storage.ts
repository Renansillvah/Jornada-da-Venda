import type { Analysis } from '@/types/analysis';
import { calculateTrend } from '@/types/analysis';

const STORAGE_KEY = 'sales-journey-analyses';

export const saveAnalysis = (analysis: Analysis): void => {
  const analyses = getAnalyses();

  // Se é uma atualização, desativar a análise anterior
  if (analysis.type === 'update' && analysis.parentId) {
    const parentIndex = analyses.findIndex(a => a.id === analysis.parentId);
    if (parentIndex !== -1) {
      analyses[parentIndex].isActive = false;
    }
  }

  // Calculate trend if there's a previous ACTIVE analysis
  const activeAnalyses = analyses.filter(a => a.isActive);
  if (activeAnalyses.length > 0) {
    const previousAnalysis = activeAnalyses[0];
    analysis.trend = calculateTrend(analysis.averageScore, previousAnalysis.averageScore);
  }

  analyses.unshift(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};

export const updateAnalysis = (originalId: string, newAnalysis: Omit<Analysis, 'id' | 'type' | 'parentId' | 'isActive'>): void => {
  const updatedAnalysis: Analysis = {
    ...newAnalysis,
    id: Date.now().toString(),
    type: 'update',
    parentId: originalId,
    isActive: true,
  };

  saveAnalysis(updatedAnalysis);
};

export const getAnalyses = (): Analysis[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteAnalysis = (id: string): void => {
  const analyses = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};
