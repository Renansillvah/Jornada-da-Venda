import type { Analysis } from '@/types/analysis';
import { calculateTrend } from '@/types/analysis';
import { supabase } from './supabase';
import { saveAnalysisToSupabase, getAnalysesFromSupabase, deleteAnalysisFromSupabase } from './supabase';

const STORAGE_KEY = 'sales-journey-analyses';

// Helper para verificar se está usando Supabase
const isUsingSupabase = async (): Promise<boolean> => {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const saveAnalysis = async (analysis: Analysis): Promise<void> => {
  const usingSupabase = await isUsingSupabase();

  if (usingSupabase) {
    // Tentar salvar no Supabase
    try {
      const analyses = await getAnalyses();

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

      await saveAnalysisToSupabase(analysis);
      return; // Sucesso, sair da função
    } catch (error) {
      console.warn('Erro ao salvar no Supabase, usando localStorage:', error);
      // Continuar para salvar no localStorage
    }
  }

  // Salvar no localStorage (fallback ou se não estiver usando Supabase)
  const analyses = getAnalysesSync();

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

export const updateAnalysis = async (originalId: string, newAnalysis: Omit<Analysis, 'id' | 'type' | 'parentId' | 'isActive'>): Promise<void> => {
  const updatedAnalysis: Analysis = {
    ...newAnalysis,
    id: Date.now().toString(),
    type: 'update',
    parentId: originalId,
    isActive: true,
  };

  await saveAnalysis(updatedAnalysis);
};

// Versão síncrona para localStorage
const getAnalysesSync = (): Analysis[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Versão assíncrona que suporta Supabase
export const getAnalyses = async (): Promise<Analysis[]> => {
  const usingSupabase = await isUsingSupabase();

  if (usingSupabase) {
    try {
      return await getAnalysesFromSupabase();
    } catch (error) {
      console.error('Erro ao buscar do Supabase, usando localStorage:', error);
      return getAnalysesSync();
    }
  }

  return getAnalysesSync();
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const usingSupabase = await isUsingSupabase();

  if (usingSupabase) {
    await deleteAnalysisFromSupabase(id);
  } else {
    const analyses = getAnalysesSync().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  }
};
