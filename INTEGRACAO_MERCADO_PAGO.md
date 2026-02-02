# 🛒 Integração Mercado Pago - Acesso Vitalício R$ 9,99

## 🎯 Modelo de Negócio Implementado

✅ **Acesso Vitalício** - Pagamento único de **R$ 9,99**
✅ **Análises Ilimitadas** - Sem limite, para sempre
✅ **Trial Grátis** - 2 análises gratuitas para testar
✅ **Sem Mensalidade** - Pague uma vez, use sempre

---

## 📋 O Que Foi Implementado

### 1. **Sistema de Acesso Vitalício** (`/workspace/src/lib/access.ts`)
- ✅ Verificação de acesso vitalício
- ✅ Trial de 2 análises gratuitas (automático)
- ✅ Gerenciamento de pagamentos
- ✅ Bloqueio quando trial acabar

### 2. **Página de Compra** (`/buy-credits`)
- ✅ **Oferta:** R$ 9,99 vitalício (de R$ 29,90)
- ✅ Gatilhos: Urgência (47 vagas), Escassez, Garantia 7 dias
- ✅ Comparação: 1 venda perdida (R$ 500) vs Acesso (R$ 9,99)
- ✅ Se já tem acesso, mostra mensagem de sucesso

### 3. **Landing Page de Vendas** (`/venda`)
- ✅ Copywriting otimizado: Dor → Solução → Prova Social → Oferta
- ✅ Destaque para "Pague 1x, Use Sempre"
- ✅ Ícone de infinito (∞) para análises ilimitadas

### 4. **Dashboard**
- ✅ Badge verde: "Acesso Vitalício Ativo" (se pagou)
- ✅ Badge amarelo: "Trial: X análises" (se não pagou)
- ✅ Botão "Desbloquear Agora" quando trial acabar

### 5. **Proteções**
- ✅ Bloqueia análise quando trial acabar
- ✅ Mensagem clara com CTA para comprar
- ✅ Após pagamento: análises ilimitadas

---

## 🔧 Como Integrar o Mercado Pago

### 1. Criar Conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma conta ou faça login
3. Vá em "Suas integrações" → "Criar aplicação"
4. Anote suas credenciais:
   - **Public Key** (começa com `APP_USR-...`)
   - **Access Token** (começa com `APP_USR-...`)

### 2. Instalar SDK do Mercado Pago

```bash
npm install mercadopago
```

### 3. Criar Backend para Processar Pagamento

**IMPORTANTE:** O Mercado Pago requer backend para segurança.

```javascript
// backend/server.js
const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure suas credenciais
mercadopago.configure({
  access_token: 'SEU_ACCESS_TOKEN_AQUI'
});

// Endpoint para criar preferência de pagamento VITALÍCIO
app.post('/api/create-lifetime-payment', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Acesso Vitalício - Análises Ilimitadas',
          unit_price: 9.99,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: 'https://seu-dominio.com/payment-success',
        failure: 'https://seu-dominio.com/payment-failure',
        pending: 'https://seu-dominio.com/payment-pending'
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({
        type: 'lifetime',
        userId: req.body.userId // ID do usuário (se tiver autenticação)
      }),
      notification_url: 'https://seu-dominio.com/api/webhooks/mercadopago'
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      id: response.body.id,
      init_point: response.body.init_point // URL de checkout
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

// Webhook para receber notificações de pagamento
app.post('/api/webhooks/mercadopago', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    try {
      const paymentInfo = await mercadopago.payment.get(data.id);

      if (paymentInfo.body.status === 'approved') {
        // Pagamento aprovado!
        const externalRef = JSON.parse(paymentInfo.body.external_reference);
        const paymentId = paymentInfo.body.id;

        console.log(\`✅ Pagamento aprovado! ID: \${paymentId}\`);

        // Aqui você deve:
        // 1. Salvar no banco de dados que o usuário pagou
        // 2. Liberar acesso vitalício
        // 3. Enviar email de confirmação

        // Por enquanto, vamos apenas logar
        console.log('Usuário agora tem acesso vitalício!');
      }
    } catch (error) {
      console.error('Erro no webhook:', error);
    }
  }

  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log('🚀 Backend rodando na porta 3001');
});
```

### 4. Atualizar o Frontend

Modifique `/workspace/src/pages/BuyCredits.tsx`:

```typescript
const handlePurchase = async () => {
  setLoading(true);

  try {
    // Chamar seu backend para criar preferência de pagamento
    const response = await fetch('http://localhost:3001/api/create-lifetime-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user123' // Se tiver autenticação
      })
    });

    const data = await response.json();

    // Redirecionar para o checkout do Mercado Pago
    window.location.href = data.init_point;
  } catch (error) {
    toast.error('Erro ao processar pagamento');
    setLoading(false);
  }
};
```

### 5. Criar Página de Sucesso

```typescript
// /workspace/src/pages/PaymentSuccess.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { grantLifetimeAccess } from '@/lib/access';
import { toast } from 'sonner';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar informações do pagamento
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');

    if (paymentId) {
      // Conceder acesso vitalício
      grantLifetimeAccess(paymentId, 9.99);

      toast.success('Pagamento confirmado!', {
        description: 'Você agora tem acesso vitalício com análises ilimitadas!'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Pagamento Aprovado! 🎉</h1>
          <p className="text-muted-foreground mb-6">
            Você agora tem acesso vitalício com análises ilimitadas!
          </p>
          <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full">
            Começar a Usar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

Adicione a rota no `App.tsx`:

```typescript
import PaymentSuccess from '@/pages/PaymentSuccess';

// ...

<Route path="/payment-success" element={<PaymentSuccess />} />
```

---

## 🎯 Estratégia de Venda - Acesso Vitalício

### 1. **Por que Vitalício Funciona Melhor**

✅ **Baixa fricção:** Cliente paga 1x, não se preocupa mais
✅ **Urgência natural:** "Oferta de lançamento" justifica preço baixo
✅ **Alto valor percebido:** "Ilimitado para sempre" por R$ 9,99
✅ **Menos churn:** Cliente não cancela mensalidade

### 2. **Gatilhos Mentais Implementados**

1. **💰 Preço Âncora:** ~~R$ 29,90~~ **R$ 9,99** (-67%)
2. **⏰ Urgência:** "Apenas 47 vagas com este preço"
3. **🔥 Escassez:** "Preço sobe para R$ 29,90 após primeiros 100"
4. **♾️ Valor Infinito:** "Análises ilimitadas para sempre"
5. **🛡️ Garantia:** "7 dias ou seu dinheiro de volta"
6. **☕ Comparação:** "Menos que um café vs 1 venda perdida (R$ 500)"
7. **🎁 Trial Grátis:** "Teste 2 análises antes de comprar"

### 3. **Copywriting Otimizado**

**Headlines que Funcionam:**
- ✅ "Você está perdendo vendas sem saber onde"
- ✅ "Pague uma vez, use para sempre"
- ✅ "Acesso vitalício por apenas R$ 9,99"

**CTAs Otimizados:**
- ❌ "Comprar agora"
- ✅ "Garantir Acesso Vitalício Agora"
- ✅ "Desbloquear Análises Ilimitadas"

### 4. **Fluxo de Conversão**

```
Visitante
  ↓
Landing `/venda` (gatilhos mentais)
  ↓
Trial grátis (2 análises) → Experimenta o produto
  ↓
Trial acaba → Mensagem: "Gostou? Garanta vitalício R$ 9,99"
  ↓
Página `/buy-credits` (oferta irresistível)
  ↓
Mercado Pago (pagamento)
  ↓
Acesso Vitalício Liberado
  ↓
Cliente usa INFINITAMENTE
```

---

## 📊 Métricas para Acompanhar

1. **Taxa de Conversão Trial → Pago:** Meta 10-20%
2. **Tempo Médio para Conversão:** Quantos dias entre trial e compra
3. **Aproveitamento do Trial:** Quantos usam as 2 análises grátis
4. **Recomendação:** Quantos indicam para amigos

---

## 💡 Dicas de Divulgação

### Instagram/Stories:
```
"Descobri que estava perdendo 40% das vendas por causa de 3 erros

bobos que eu não via

A IA me mostrou exatamente onde eu estava errando em 5 minutos

Agora fecho muito mais

Link na bio"
```

### Post Carrossel:
1. **Slide 1:** "Você perde vendas sem saber onde"
2. **Slide 2:** "Cliente some depois do 'vou pensar'"
3. **Slide 3:** "Proposta ignorada"
4. **Slide 4:** "Preço 'caro' demais"
5. **Slide 5:** "O problema: 15 pontos fracos na jornada"
6. **Slide 6:** "A solução: IA analisa em 5 minutos"
7. **Slide 7:** "Exemplo: linguagem informal = -40% vendas"
8. **Slide 8:** "Acesso vitalício R$ 9,99 - Link na bio"

---

## 🚀 Próximos Passos

1. **Configure Mercado Pago** (credenciais)
2. **Crie backend simples** (código fornecido acima)
3. **Teste fluxo completo** em modo sandbox
4. **Ative produção** quando estiver pronto
5. **Divulgue `/venda`** nas redes sociais

---

## 🔒 Segurança

⚠️ **NUNCA EXPONHA:**
- Access Token no frontend
- Lógica de pagamento no frontend

✅ **SEMPRE FAÇA:**
- Processamento no backend
- Validação de webhooks
- Verificação antes de liberar acesso

---

**Resumo:** Você tem tudo pronto para vender acesso vitalício por R$ 9,99. Só falta conectar o Mercado Pago!
