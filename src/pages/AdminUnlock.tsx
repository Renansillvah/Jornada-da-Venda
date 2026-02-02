import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  grantLifetimeAccessSupabase,
  checkUserAccess,
  listAllUsers,
  type UserAccess,
} from '@/lib/access-supabase';
import { toast } from 'sonner';
import { Shield, Unlock, Search, Crown, AlertCircle, CheckCircle2, Users, Loader2 } from 'lucide-react';

export default function AdminUnlock() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<{
    hasLifetime: boolean;
    trialRemaining: number;
  } | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccess[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const handleCheckStatus = async () => {
    if (!email.trim()) {
      toast.error('Digite o email para verificar');
      return;
    }

    setCheckingStatus(true);
    try {
      const status = await checkUserAccess(email);

      if (!status) {
        toast.error('Não foi possível verificar o acesso');
        return;
      }

      setCurrentStatus({
        hasLifetime: status.has_lifetime_access,
        trialRemaining: status.trial_remaining,
      });

      toast.info('Status verificado', {
        description: `Acesso vitalício: ${status.has_lifetime_access ? 'SIM ✅' : 'NÃO ❌'} | Trial restante: ${status.trial_remaining}`,
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro ao verificar status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleUnlock = async () => {
    if (!email.trim()) {
      toast.error('Digite o email do usuário');
      return;
    }

    setLoading(true);
    try {
      const result = await grantLifetimeAccessSupabase(email, `admin_${Date.now()}`, 'admin');

      if (!result.success) {
        toast.error('Erro ao conceder acesso', {
          description: result.error || 'Erro desconhecido',
        });
        return;
      }

      toast.success('✅ Acesso vitalício concedido no Supabase!', {
        description: `Usuário ${email} agora tem análises ILIMITADAS em todos os dispositivos`,
        duration: 8000,
      });

      // Atualizar status
      await handleCheckStatus();

      // Limpar campos
      setEmail('');
      setReason('');

      // Recarregar lista de usuários
      if (showAllUsers) {
        loadAllUsers();
      }
    } catch (error) {
      console.error('Erro ao desbloquear:', error);
      toast.error('Erro ao conceder acesso', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const users = await listAllUsers();
      setAllUsers(users);
      toast.success(`${users.length} usuários carregados`);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAllUsers) {
      loadAllUsers();
    }
  }, [showAllUsers]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Painel de Administração</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciar acesso de usuários
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Status Atual do Sistema */}
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Verificar Status Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Digite o email para verificar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleCheckStatus}
                variant="outline"
                disabled={checkingStatus || !email.trim()}
              >
                {checkingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {currentStatus && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Acesso Vitalício:</span>
                  <Badge
                    variant={currentStatus.hasLifetime ? 'default' : 'destructive'}
                    className="gap-1"
                  >
                    {currentStatus.hasLifetime ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        ATIVO
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        INATIVO
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Análises Trial Restantes:</span>
                  <Badge variant="outline">{currentStatus.trialRemaining}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Desbloquear Usuário */}
        <Card className="border-success/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Unlock className="w-5 h-5" />
              Conceder Acesso Vitalício
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use esta ferramenta para liberar usuários que compraram mas estão bloqueados
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email do Usuário</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do Desbloqueio (opcional)</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Pagamento confirmado via Mercado Pago, suporte manual, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Botão de Ação */}
            <Button
              onClick={handleUnlock}
              size="lg"
              className="w-full gap-2"
              disabled={!email.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Concedendo acesso...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Conceder Acesso Vitalício ILIMITADO (Supabase)
                </>
              )}
            </Button>

            {/* Aviso */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-primary">O que esta ação faz:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✅ Concede acesso vitalício ILIMITADO</li>
                    <li>✅ Remove qualquer limite de análise</li>
                    <li>✅ Reseta contador de trial (se houver)</li>
                    <li>✅ Cria registro de pagamento administrativo</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Usuários Conhecidos */}
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Desbloqueio Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => {
                setEmail('renan.wow.blizz@gmail.com');
                setReason('Cliente pagou R$ 9,99 - Desbloqueio administrativo');
              }}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Crown className="w-4 h-4 mr-2 text-primary" />
              renan.wow.blizz@gmail.com (Cliente que pagou)
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Todos os Usuários */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Todos os Usuários
              </CardTitle>
              <Button
                onClick={() => setShowAllUsers(!showAllUsers)}
                variant="outline"
                size="sm"
              >
                {showAllUsers ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </CardHeader>
          {showAllUsers && (
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : allUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum usuário encontrado
                </p>
              ) : (
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={user.has_lifetime_access ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {user.has_lifetime_access ? 'Vitalício' : 'Trial'}
                          </Badge>
                          {!user.has_lifetime_access && (
                            <span className="text-xs text-muted-foreground">
                              {user.trial_analyses_limit - user.trial_analyses_used} restantes
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            • {user.granted_by}
                          </span>
                        </div>
                      </div>
                      {!user.has_lifetime_access && (
                        <Button
                          onClick={() => {
                            setEmail(user.email);
                            handleUnlock();
                          }}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Unlock className="w-3 h-3" />
                          Desbloquear
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
