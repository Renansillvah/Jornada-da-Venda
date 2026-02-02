import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Crown, Sparkles, Mail, AlertCircle, UserPlus } from 'lucide-react';
import { createAccountAfterPayment } from '@/lib/access';
import { grantLifetimeAccessSupabase } from '@/lib/access-supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    async function processPayment() {
      // Capturar parâmetros do Mercado Pago
      const paymentId = searchParams.get('payment_id') || searchParams.get('preference_id') || `mp_${Date.now()}`;
      const collectionId = searchParams.get('collection_id');
      const collectionStatus = searchParams.get('collection_status');
      const paymentType = searchParams.get('payment_type');
      const merchantOrderId = searchParams.get('merchant_order_id');
      const externalReference = searchParams.get('external_reference');

      console.log('Mercado Pago callback:', {
        paymentId,
        collectionId,
        collectionStatus,
        paymentType,
        merchantOrderId,
        externalReference,
      });

      // ✅ PRIORIDADE 1: Email do usuário logado
      let email = user?.email || '';

      // ✅ PRIORIDADE 2: Email nos parâmetros da URL
      if (!email) {
        email = searchParams.get('email') || '';
      }

      // ✅ PRIORIDADE 3: Pedir email se não tiver
      if (!email) {
        email = localStorage.getItem('user_email') || '';
      }

      if (!email) {
        email = prompt('Digite seu email para ativar o acesso:') || 'comprador@jornadadavenda.com';
      }

      // ✅ CONCEDER ACESSO NO SUPABASE (centralizado)
      if (email) {
        try {
          await grantLifetimeAccessSupabase(email, paymentId, 'mercadopago');
          console.log('✅ Acesso vitalício concedido no Supabase para:', email);
        } catch (error) {
          console.error('❌ Erro ao conceder acesso no Supabase:', error);
        }
      }

      // ✅ TAMBÉM salvar no localStorage (compatibilidade)
      const result = createAccountAfterPayment(email, paymentId, 9.99);

      if (result.success) {
        setAccountCreated(true);
        setUserEmail(result.email);
      }

      setProcessing(false);

      // Se não está logado, mostrar formulário de cadastro
      if (!user && email) {
        setShowSignupForm(true);
        setSignupData(prev => ({ ...prev, email }));
      }
    }

    setTimeout(() => processPayment(), 2000);
  }, [searchParams, user]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Validações
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('As senhas não coincidem');
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setSignupLoading(true);

    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);

    if (error) {
      setSignupError(error.message || 'Erro ao criar conta');
      setSignupLoading(false);
    } else {
      setAccountCreated(true);
      setUserEmail(signupData.email);
      setShowSignupForm(false);
      setSignupLoading(false);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Processando seu pagamento...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos sua compra
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se precisa criar conta, mostrar formulário de cadastro
  if (showSignupForm && !accountCreated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-success/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-success">
              Pagamento Aprovado!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Agora crie sua conta para acessar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {signupError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="João Silva"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                  disabled={signupLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  disabled={signupLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  disabled={signupLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                  disabled={signupLoading}
                />
              </div>

              <Alert className="bg-success/5 border-success/30">
                <Crown className="h-4 w-4 text-success" />
                <AlertDescription className="text-sm">
                  Sua conta já terá <strong>acesso vitalício ILIMITADO</strong> ativado!
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={signupLoading}
                size="lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {signupLoading ? 'Criando conta...' : 'Criar Conta e Acessar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-success/30 shadow-xl">
        <CardContent className="pt-8 pb-8">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 text-success">
              Pagamento Aprovado!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Bem-vindo ao <strong>Jornada da Venda</strong>
            </p>
          </div>

          {/* Informações da conta */}
          {accountCreated && (
            <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Sua conta foi criada automaticamente</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesso vitalício ativado com sucesso!
                  </p>
                </div>
              </div>

              {userEmail && (
                <div className="flex items-center gap-2 text-sm bg-background rounded-lg p-3 border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{userEmail}</span>
                </div>
              )}
            </div>
          )}

          {/* Benefícios desbloqueados */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-center mb-4">Você agora tem acesso a:</h3>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Análises Ilimitadas com IA</p>
                <p className="text-sm text-muted-foreground">
                  Quantas quiser, quando quiser. Para sempre.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Diagnóstico dos 15 Pilares</p>
                <p className="text-sm text-muted-foreground">
                  Análise completa da jornada mental do cliente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Scripts e Ações Práticas</p>
                <p className="text-sm text-muted-foreground">
                  Exemplos prontos para copiar e aplicar hoje
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Atualizações Futuras Gratuitas</p>
                <p className="text-sm text-muted-foreground">
                  Todas as melhorias incluídas sem custo adicional
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="w-full text-lg py-6 h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Minha Primeira Análise
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Seu acesso vitalício está ativo. Aproveite! 🎉
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
