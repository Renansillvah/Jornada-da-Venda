// Integração com Mercado Pago para pagamento único de R$ 9,99

const MERCADO_PAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

export interface PaymentPreference {
  id: string;
  init_point: string; // URL para redirecionar o usuário
  sandbox_init_point: string;
}

export interface CreatePreferenceData {
  email?: string;
  name?: string;
}

// Criar preferência de pagamento no Mercado Pago
export async function createPaymentPreference(
  userData: CreatePreferenceData = {}
): Promise<PaymentPreference> {
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error('Token do Mercado Pago não configurado');
  }

  const preference = {
    items: [
      {
        title: 'Jornada da Venda - Acesso Vitalício',
        description: 'Análises ilimitadas da jornada de vendas com IA',
        quantity: 1,
        unit_price: 9.99,
        currency_id: 'BRL',
      },
    ],
    payer: {
      email: userData.email || '',
      name: userData.name || '',
    },
    back_urls: {
      success: `${window.location.origin}/payment/success`,
      failure: `${window.location.origin}/payment/failure`,
      pending: `${window.location.origin}/payment/pending`,
    },
    auto_return: 'approved',
    statement_descriptor: 'Jornada da Venda',
    external_reference: `order_${Date.now()}`,
    notification_url: undefined, // Webhook será configurado no backend futuramente
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar preferência de pagamento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    throw error;
  }
}

// Verificar status de um pagamento
export async function getPaymentStatus(paymentId: string): Promise<any> {
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error('Token do Mercado Pago não configurado');
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar status do pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
}
