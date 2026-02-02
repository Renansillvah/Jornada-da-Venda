# 🛒 Integração com Mercado Pago - Sistema de Créditos

## 📋 O Que Foi Implementado

✅ **Sistema de Créditos Completo:**
- Gerenciamento de créditos no localStorage
- Verificação antes da análise com IA
- Consumo de 1 crédito por análise
- Histórico de transações

✅ **Página de Compra (`/buy-credits`):**
- 2 pacotes: Inicial (10 créditos - R$ 9,99) e Profissional (30 créditos - R$ 24,99)
- Gatilhos mentais de urgência e escassez
- Comparação de preços e economia
- Garantia de 7 dias

✅ **Landing Page de Vendas (`/venda`):**
- Otimizada para conversão
- Gatilhos mentais: urgência, escassez, prova social, garantia
- Copywriting focado em dor → solução → ação

✅ **Indicadores de Créditos:**
- Dashboard mostra saldo atual
- Alerta quando créditos estão baixos
- Botão para comprar mais créditos

✅ **Bônus de Boas-Vindas:**
- Usuários novos ganham 2 análises grátis automaticamente

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

### 3. Implementar no Backend (Necessário!)

**IMPORTANTE:** A integração do Mercado Pago requer um backend para processar pagamentos de forma segura. Você tem 2 opções:

#### Opção A: Backend Separado (Recomendado)

Crie um backend Node.js/Express simples:

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

// Endpoint para criar preferência de pagamento
app.post('/api/create-payment', async (req, res) => {
  const { packageId } = req.body;

  // Definir pacotes
  const packages = {
    starter: {
      title: 'Pacote Inicial - 10 Análises',
      unit_price: 9.99,
      quantity: 1,
      credits: 10
    },
    pro: {
      title: 'Pacote Profissional - 30 Análises',
      unit_price: 24.99,
      quantity: 1,
      credits: 30
    }
  };

  const selectedPackage = packages[packageId];

  try {
    const preference = {
      items: [
        {
          title: selectedPackage.title,
          unit_price: selectedPackage.unit_price,
          quantity: selectedPackage.quantity,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: 'http://localhost:5173/payment-success',
        failure: 'http://localhost:5173/payment-failure',
        pending: 'http://localhost:5173/payment-pending'
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({
        packageId,
        credits: selectedPackage.credits
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
        const credits = externalRef.credits;
        const paymentId = paymentInfo.body.id;

        // Aqui você deve:
        // 1. Salvar no banco de dados que o usuário pagou
        // 2. Adicionar créditos ao usuário
        // 3. Enviar email de confirmação

        console.log(\`Pagamento aprovado! Adicionar \${credits} créditos\`);
      }
    } catch (error) {
      console.error('Erro no webhook:', error);
    }
  }

  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});
```

#### Opção B: Supabase Edge Functions

Se você já usa Supabase, pode criar Edge Functions para processar pagamentos.

### 4. Atualizar o Frontend

Modifique o arquivo `/workspace/src/pages/BuyCredits.tsx`:

```typescript
const handlePurchase = async (packageId: string) => {
  setLoading(true);

  try {
    // Chamar seu backend para criar preferência de pagamento
    const response = await fetch('http://localhost:3001/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId })
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

### 5. Criar Páginas de Retorno

Crie 3 páginas para lidar com os retornos do Mercado Pago:

```typescript
// /workspace/src/pages/PaymentSuccess.tsx
export default function PaymentSuccess() {
  useEffect(() => {
    // Buscar informações do pagamento
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');

    if (externalReference) {
      const { credits } = JSON.parse(externalReference);
      addCredits(credits, paymentId);
      toast.success(\`\${credits} créditos adicionados!\`);
    }
  }, []);

  return (
    <div>
      <h1>Pagamento Aprovado! 🎉</h1>
      <p>Seus créditos foram adicionados.</p>
      <Button onClick={() => navigate('/dashboard')}>
        Começar a Usar
      </Button>
    </div>
  );
}
```

---

## 🎯 Estratégia de Venda Recomendada

### 1. **Landing Page de Captura**
   - Use `/venda` como página principal de vendas
   - Tráfego: Instagram, Google Ads, indicações

### 2. **Preço Âncora**
   - Sempre mostre o preço original riscado (R$ 29,90)
   - Destaque a economia (67% OFF)

### 3. **Urgência**
   - "Primeiros 100 clientes pagam R$ 9,99"
   - "Apenas 47 vagas restantes"
   - "Oferta válida até [data]"

### 4. **Prova Social**
   - Adicione prints de resultados reais
   - Depoimentos de clientes
   - Número de usuários

### 5. **Gatilhos Implementados**
   - ✅ Escassez (vagas limitadas)
   - ✅ Urgência (oferta de lançamento)
   - ✅ Prova social (depoimentos)
   - ✅ Garantia (7 dias)
   - ✅ Comparação (menos que um café)
   - ✅ Benefício claro (descubra onde está perdendo vendas)

---

## 📊 Métricas para Acompanhar

1. **Taxa de Conversão:** Visitantes → Compradores
2. **Ticket Médio:** R$ 9,99 vs R$ 24,99
3. **Recompra:** Quantos compram mais créditos depois
4. **Churn:** Créditos comprados mas não usados

---

## 🚀 Próximos Passos

1. **Configure suas credenciais do Mercado Pago**
2. **Crie o backend simples** (ou use Supabase Edge Functions)
3. **Teste o fluxo completo** em modo sandbox
4. **Ative o modo produção** quando estiver pronto
5. **Divulgue a landing `/venda`**

---

## 💡 Dicas de Venda

### Copywriting que Funciona:

**Headline:**
- ❌ "Ferramenta de análise de vendas"
- ✅ "Descubra onde você está perdendo vendas (em 5 minutos)"

**CTA:**
- ❌ "Comprar agora"
- ✅ "Começar minha primeira análise"

**Preço:**
- ❌ "R$ 9,99"
- ✅ "De R$ 29,90 por apenas R$ 9,99 (menos que um café)"

### Objeções a Quebrar:

1. **"Não preciso"** → Mostre a dor (vendas perdidas)
2. **"É caro"** → Comparação (café, 1 venda perdida = R$ 500)
3. **"Não confio"** → Garantia de 7 dias
4. **"Vou pensar"** → Urgência (vagas limitadas)

---

## 🔒 Segurança

⚠️ **NUNCA EXPONHA:**
- Access Token do Mercado Pago no frontend
- Credenciais de API no código fonte público

✅ **SEMPRE FAÇA:**
- Processamento de pagamento no backend
- Validação de webhooks com assinatura
- Verificação de status do pagamento antes de adicionar créditos

---

## 📞 Suporte

Se tiver dúvidas sobre a integração:
- Documentação Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
- Suporte Mercado Pago: suporte@mercadopago.com.br
