import { Analysis } from '@/types/analysis';

const STORAGE_KEY = 'sales-journey-analyses';

export const saveAnalysis = (analysis: Analysis): void => {
  const analyses = getAnalyses();
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
