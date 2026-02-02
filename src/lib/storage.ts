import { Analysis, calculateTrend } from '@/types/analysis';

const STORAGE_KEY = 'sales-journey-analyses';

export const saveAnalysis = (analysis: Analysis): void => {
  const analyses = getAnalyses();

  // Calculate trend if there's a previous analysis
  if (analyses.length > 0) {
    const previousAnalysis = analyses[0];
    analysis.trend = calculateTrend(analysis.averageScore, previousAnalysis.averageScore);
  }

  analyses.unshift(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};

export const getAnalyses = (): Analysis[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteAnalysis = (id: string): void => {
  const analyses = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};
