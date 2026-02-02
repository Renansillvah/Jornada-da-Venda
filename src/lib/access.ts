// Sistema de acesso vitalício - Pagamento único de R$ 9,99

const ACCESS_KEY = 'lifetime_access';
const PAYMENT_KEY = 'payment_info';
const AUTO_ACCOUNT_KEY = 'auto_created_account';

export interface PaymentInfo {
  paymentId: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'free_trial';
}

// Verificar se o usuário tem acesso vitalício
export function hasLifetimeAccess(): boolean {
  const access = localStorage.getItem(ACCESS_KEY);
  return access === 'true';
}

// Conceder acesso vitalício após pagamento
export function grantLifetimeAccess(paymentId: string, amount: number = 9.99): void {
  localStorage.setItem(ACCESS_KEY, 'true');

  const paymentInfo: PaymentInfo = {
    paymentId,
    date: new Date().toISOString(),
    amount,
    status: 'paid',
  };

  localStorage.setItem(PAYMENT_KEY, JSON.stringify(paymentInfo));
}

// Obter informações do pagamento
export function getPaymentInfo(): PaymentInfo | null {
  const info = localStorage.getItem(PAYMENT_KEY);
  return info ? JSON.parse(info) : null;
}

// Verificar status de acesso (para exibir na UI)
export function getAccessStatus(): {
  hasAccess: boolean;
  isPaid: boolean;
  isFreeTrial: boolean;
  needsToPay: boolean;
} {
  const hasAccess = hasLifetimeAccess();
  const paymentInfo = getPaymentInfo();

  return {
    hasAccess,
    isPaid: paymentInfo?.status === 'paid',
    isFreeTrial: paymentInfo?.status === 'free_trial',
    needsToPay: !hasAccess,
  };
}

// Remover acesso (apenas para testes/admin)
export function revokeAccess(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(PAYMENT_KEY);
}

// Dar trial temporário de 2 análises (para testar antes de comprar)
export function giveFreeTrial(): void {
  const paymentInfo = getPaymentInfo();

  // Se nunca teve pagamento, dar trial
  if (!paymentInfo) {
    const trialInfo: PaymentInfo = {
      paymentId: 'free_trial',
      date: new Date().toISOString(),
      amount: 0,
      status: 'free_trial',
    };

    localStorage.setItem(PAYMENT_KEY, JSON.stringify(trialInfo));
  }
}

// Verificar quantas análises restam no trial (máximo 2)
export function getRemainingTrialAnalyses(): number {
  const trialCount = localStorage.getItem('trial_analyses_count');
  const count = trialCount ? parseInt(trialCount, 10) : 0;
  return Math.max(0, 2 - count);
}

// Usar uma análise do trial
export function useTrialAnalysis(): boolean {
  const remaining = getRemainingTrialAnalyses();

  if (remaining <= 0) {
    return false; // Trial acabou
  }

  const trialCount = localStorage.getItem('trial_analyses_count');
  const count = trialCount ? parseInt(trialCount, 10) : 0;
  localStorage.setItem('trial_analyses_count', (count + 1).toString());

  return true;
}

// Verificar se pode fazer análise (acesso vitalício OU trial)
export function canAnalyze(): boolean {
  if (hasLifetimeAccess()) {
    return true; // Acesso vitalício = ilimitado
  }

  // Sem acesso vitalício, verificar trial
  return getRemainingTrialAnalyses() > 0;
}

// Criar conta automaticamente após pagamento bem-sucedido
export function createAccountAfterPayment(email: string, paymentId: string, amount: number = 9.99): {
  success: boolean;
  userId: string;
  email: string;
} {
  // Gerar ID único para o usuário
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Salvar dados da conta criada automaticamente
  const accountData = {
    userId,
    email,
    createdAt: new Date().toISOString(),
    source: 'auto_created_after_payment',
    paymentId,
  };

  localStorage.setItem(AUTO_ACCOUNT_KEY, JSON.stringify(accountData));

  // Conceder acesso vitalício
  grantLifetimeAccess(paymentId, amount);

  return {
    success: true,
    userId,
    email,
  };
}

// Obter dados da conta criada automaticamente
export function getAutoCreatedAccount(): {
  userId: string;
  email: string;
  createdAt: string;
  paymentId: string;
} | null {
  const data = localStorage.getItem(AUTO_ACCOUNT_KEY);
  return data ? JSON.parse(data) : null;
}
