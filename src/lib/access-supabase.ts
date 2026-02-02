// Sistema centralizado de acesso com Supabase
import { supabase } from './supabase';

export interface UserAccess {
  id: string;
  email: string;
  has_lifetime_access: boolean;
  payment_id: string | null;
  payment_amount: number;
  payment_status: 'pending' | 'paid' | 'free_trial' | 'admin_granted';
  granted_by: string | null;
  granted_at: string;
  trial_analyses_used: number;
  trial_analyses_limit: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AccessStatus {
  email: string;
  has_lifetime_access: boolean;
  can_analyze: boolean;
  trial_remaining: number;
  payment_status: string;
  granted_by: string | null;
}

// ✅ Verificar acesso do usuário
export async function checkUserAccess(email: string): Promise<AccessStatus | null> {
  if (!supabase) {
    console.error('❌ Supabase não está configurado');
    return null;
  }

  try {
    const { data, error } = await supabase.rpc('check_user_access', {
      user_email: email,
    });

    if (error) {
      console.error('❌ Erro ao verificar acesso:', error);
      return null;
    }

    return data as AccessStatus;
  } catch (error) {
    console.error('❌ Erro ao verificar acesso:', error);
    return null;
  }
}

// 🔓 Conceder acesso vitalício (ADMIN)
export async function grantLifetimeAccessSupabase(
  email: string,
  paymentId?: string,
  grantedBy: string = 'admin'
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase não está configurado' };
  }

  try {
    const { data, error } = await supabase.rpc('grant_lifetime_access', {
      user_email: email,
      payment_identifier: paymentId,
      granted_by_source: grantedBy,
    });

    if (error) {
      console.error('❌ Erro ao conceder acesso:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Acesso vitalício concedido:', data);
    return {
      success: true,
      message: `Acesso vitalício concedido para ${email}`,
    };
  } catch (error) {
    console.error('❌ Erro ao conceder acesso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// 📊 Consumir análise do trial
export async function useTrialAnalysisSupabase(
  email: string
): Promise<{ success: boolean; trial_remaining?: number; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase não está configurado' };
  }

  try {
    const { data, error } = await supabase.rpc('use_trial_analysis', {
      user_email: email,
    });

    if (error) {
      console.error('❌ Erro ao consumir trial:', error);
      return { success: false, error: error.message };
    }

    return data as { success: boolean; trial_remaining?: number; error?: string };
  } catch (error) {
    console.error('❌ Erro ao consumir trial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// 📋 Listar todos os usuários (ADMIN)
export async function listAllUsers(): Promise<UserAccess[]> {
  if (!supabase) {
    console.error('❌ Supabase não está configurado');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao listar usuários:', error);
      return [];
    }

    return (data as UserAccess[]) || [];
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    return [];
  }
}

// 🔍 Buscar usuário por email (ADMIN)
export async function getUserByEmail(email: string): Promise<UserAccess | null> {
  if (!supabase) {
    console.error('❌ Supabase não está configurado');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
    }

    return data as UserAccess;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    return null;
  }
}

// 🔄 Sincronizar acesso local com Supabase
export async function syncAccessWithSupabase(email: string): Promise<boolean> {
  const status = await checkUserAccess(email);

  if (!status) {
    console.warn('⚠️ Não foi possível sincronizar acesso com Supabase');
    return false;
  }

  // Atualizar localStorage local
  if (status.has_lifetime_access) {
    localStorage.setItem('lifetime_access', 'true');
    localStorage.setItem('user_email', email);
  } else {
    localStorage.removeItem('lifetime_access');
    const trialUsed = 2 - status.trial_remaining;
    localStorage.setItem('trial_analyses_count', trialUsed.toString());
  }

  console.log('✅ Acesso sincronizado com Supabase:', status);
  return true;
}

// 🎯 Hook de análise - verificar acesso (SEM TRIAL - apenas vitalício)
export async function performAnalysisWithAccessCheck(
  email: string
): Promise<{ canAnalyze: boolean; message?: string; error?: string }> {
  // Verificar acesso
  const status = await checkUserAccess(email);

  if (!status) {
    return {
      canAnalyze: false,
      error: 'Não foi possível verificar seu acesso. Tente novamente.',
    };
  }

  // ✅ APENAS acesso vitalício permite análise (SEM TRIAL GRATUITO)
  if (!status.has_lifetime_access) {
    return {
      canAnalyze: false,
      error: 'Acesso vitalício necessário. Adquira por apenas R$ 9,99!',
    };
  }

  // Acesso vitalício confirmado
  return {
    canAnalyze: true,
    message: '🎉 Acesso vitalício - análises ilimitadas!',
  };
}
