// Sistema de créditos para análises com IA

const CREDITS_KEY = 'user_credits';
const CREDITS_HISTORY_KEY = 'credits_history';

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage';
  amount: number;
  date: string;
  description: string;
  paymentId?: string; // ID do pagamento do Mercado Pago
}

// Obter saldo de créditos atual
export function getCredits(): number {
  const credits = localStorage.getItem(CREDITS_KEY);
  return credits ? parseInt(credits, 10) : 0;
}

// Adicionar créditos (compra)
export function addCredits(amount: number, paymentId?: string): void {
  const currentCredits = getCredits();
  const newCredits = currentCredits + amount;
  localStorage.setItem(CREDITS_KEY, newCredits.toString());

  // Registrar transação
  const transaction: CreditTransaction = {
    id: Date.now().toString(),
    type: 'purchase',
    amount,
    date: new Date().toISOString(),
    description: `Compra de ${amount} créditos`,
    paymentId,
  };
  addTransaction(transaction);
}

// Usar crédito (análise)
export function useCredit(): boolean {
  const currentCredits = getCredits();

  if (currentCredits <= 0) {
    return false; // Sem créditos
  }

  const newCredits = currentCredits - 1;
  localStorage.setItem(CREDITS_KEY, newCredits.toString());

  // Registrar transação
  const transaction: CreditTransaction = {
    id: Date.now().toString(),
    type: 'usage',
    amount: -1,
    date: new Date().toISOString(),
    description: 'Análise com IA',
  };
  addTransaction(transaction);

  return true;
}

// Verificar se tem créditos disponíveis
export function hasCredits(): boolean {
  return getCredits() > 0;
}

// Obter histórico de transações
export function getCreditHistory(): CreditTransaction[] {
  const history = localStorage.getItem(CREDITS_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

// Adicionar transação ao histórico
function addTransaction(transaction: CreditTransaction): void {
  const history = getCreditHistory();
  history.unshift(transaction); // Adiciona no início

  // Manter apenas últimas 50 transações
  const limitedHistory = history.slice(0, 50);

  localStorage.setItem(CREDITS_HISTORY_KEY, JSON.stringify(limitedHistory));
}

// Resetar créditos (apenas para testes/admin)
export function resetCredits(): void {
  localStorage.removeItem(CREDITS_KEY);
  localStorage.removeItem(CREDITS_HISTORY_KEY);
}

// Dar créditos iniciais (primeiro acesso)
export function giveWelcomeCredits(): void {
  const currentCredits = getCredits();

  // Se nunca teve créditos, dar 2 análises grátis
  if (currentCredits === 0 && getCreditHistory().length === 0) {
    addCredits(2, 'welcome_bonus');
  }
}
