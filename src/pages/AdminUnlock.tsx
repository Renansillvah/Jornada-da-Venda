import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  grantLifetimeAccessAdmin,
  debugAccessStatus,
  hasLifetimeAccess,
  getRemainingTrialAnalyses
} from '@/lib/access';
import { toast } from 'sonner';
import { Shield, Unlock, Search, Crown, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminUnlock() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [currentStatus, setCurrentStatus] = useState<{
    hasLifetime: boolean;
    trialRemaining: number;
  } | null>(null);

  const handleCheckStatus = () => {
    const status = debugAccessStatus();
    setCurrentStatus({
      hasLifetime: status.hasLifetimeAccess,
      trialRemaining: status.trialRemaining,
    });

    toast.info('Status verificado', {
      description: `Acesso vitalício: ${status.hasLifetimeAccess ? 'SIM ✅' : 'NÃO ❌'} | Trial restante: ${status.trialRemaining}`,
    });
  };

  const handleUnlock = () => {
    if (!email.trim()) {
      toast.error('Digite o email do usuário');
      return;
    }

    if (!reason.trim()) {
      setReason('Desbloqueio manual via admin');
    }

    try {
      // Conceder acesso vitalício
      grantLifetimeAccessAdmin(email, reason);

      toast.success('✅ Acesso vitalício concedido!', {
        description: `Usuário ${email} agora tem análises ILIMITADAS`,
        duration: 6000,
      });

      // Atualizar status
      setCurrentStatus({
        hasLifetime: true,
        trialRemaining: 0,
      });

      // Limpar campos
      setEmail('');
      setReason('');
    } catch (error) {
      console.error('Erro ao desbloquear:', error);
      toast.error('Erro ao conceder acesso', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

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
            <Button onClick={handleCheckStatus} variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Verificar Status do Sistema
            </Button>

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
              disabled={!email.trim()}
            >
              <Crown className="w-5 h-5" />
              Conceder Acesso Vitalício ILIMITADO
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
      </div>
    </div>
  );
}
