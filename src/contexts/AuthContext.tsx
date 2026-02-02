import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Escutar mudanças de autenticação
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase não configurado' } };
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // ✅ INTEGRAÇÃO: Verificar se existe na tabela user_access, senão criar
    if (!error && data.user) {
      try {
        const { data: existingUser } = await supabase
          .from('user_access')
          .select('*')
          .eq('email', email.toLowerCase().trim())
          .single();

        // Se não existe, criar registro
        if (!existingUser) {
          await supabase.from('user_access').insert({
            email: email.toLowerCase().trim(),
            has_lifetime_access: false,
            payment_status: 'pending',
            granted_by: 'login',
          });
          console.log('✅ Registro criado no login para:', email);
        }
      } catch (checkError) {
        console.warn('⚠️ Erro ao verificar/criar registro de acesso:', checkError);
      }
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase não configurado' } };
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    // ✅ INTEGRAÇÃO: Criar registro na tabela user_access automaticamente
    if (!error && data.user) {
      try {
        await supabase.from('user_access').insert({
          email: email.toLowerCase().trim(),
          has_lifetime_access: false, // SEM acesso até pagar
          payment_status: 'pending', // Aguardando pagamento
          granted_by: 'signup', // Veio do cadastro
        });
        console.log('✅ Usuário criado na tabela user_access:', email);
      } catch (insertError) {
        console.warn('⚠️ Erro ao criar registro de acesso:', insertError);
        // Não bloquear o cadastro se der erro aqui
      }
    }

    return { error };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase não configurado' } };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
