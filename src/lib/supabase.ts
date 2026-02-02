import { createClient } from '@supabase/supabase-js';
import type { Analysis } from '@/types/analysis';

// Cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar se as variáveis de ambiente estão configuradas
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

/**
 * Salva análise no Supabase
 */
export const saveAnalysisToSupabase = async (analysis: Analysis): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase não está configurado');
  }

  // Obter user_id da sessão atual
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn('Usuário não autenticado, salvando no localStorage');
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase.from('analyses').insert({
    date: analysis.date,
    context: analysis.context,
    description: analysis.description,
    pillars: analysis.pillars,
    average_score: analysis.averageScore,
    strongest_pillar: analysis.strongestPillar,
    weakest_pillar: analysis.weakestPillar,
    trend: analysis.trend || null,
    changes: analysis.changes || null,
    type: analysis.type,
    parent_id: analysis.parentId || null,
    is_active: analysis.isActive ?? true,
    tags: analysis.tags || [],
    user_id: user.id,
  });

  if (error) {
    console.error('Erro ao salvar análise no Supabase:', error);
    throw error;
  }
};

/**
 * Busca todas as análises do usuário no Supabase
 */
export const getAnalysesFromSupabase = async (): Promise<Analysis[]> => {
  if (!supabase) {
    throw new Error('Supabase não está configurado');
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar análises do Supabase:', error);
    throw error;
  }

  // Mapear dados do banco para o tipo Analysis
  return (data || []).map(row => ({
    id: row.id,
    date: row.date,
    context: row.context,
    description: row.description,
    pillars: row.pillars,
    averageScore: row.average_score,
    strongestPillar: row.strongest_pillar,
    weakestPillar: row.weakest_pillar,
    trend: row.trend,
    changes: row.changes,
    type: row.type,
    parentId: row.parent_id,
    isActive: row.is_active,
    tags: row.tags,
  }));
};

/**
 * Atualiza análise no Supabase
 */
export const updateAnalysisInSupabase = async (
  id: string,
  updates: Partial<Analysis>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase não está configurado');
  }

  const { error } = await supabase
    .from('analyses')
    .update({
      context: updates.context,
      description: updates.description,
      pillars: updates.pillars,
      average_score: updates.averageScore,
      strongest_pillar: updates.strongestPillar,
      weakest_pillar: updates.weakestPillar,
      trend: updates.trend,
      changes: updates.changes,
      is_active: updates.isActive,
      tags: updates.tags,
    })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar análise no Supabase:', error);
    throw error;
  }
};

/**
 * Deleta análise do Supabase
 */
export const deleteAnalysisFromSupabase = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase não está configurado');
  }

  const { error } = await supabase.from('analyses').delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar análise do Supabase:', error);
    throw error;
  }
};

/**
 * Migra dados do localStorage para Supabase
 */
export const migrateLocalStorageToSupabase = async (
  analyses: Analysis[]
): Promise<{ success: number; errors: number }> => {
  if (!supabase) {
    throw new Error('Supabase não está configurado');
  }

  let success = 0;
  let errors = 0;

  for (const analysis of analyses) {
    try {
      await saveAnalysisToSupabase(analysis);
      success++;
    } catch (err) {
      console.error(`Erro ao migrar análise ${analysis.id}:`, err);
      errors++;
    }
  }

  return { success, errors };
};

/**
 * Verifica se Supabase está configurado e conectado
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('analyses').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};
