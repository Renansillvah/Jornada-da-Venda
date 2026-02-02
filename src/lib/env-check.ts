// Verificar se as variáveis de ambiente necessárias estão configuradas

export function checkEnvironmentVariables() {
  const checks = {
    supabase: {
      url: !!import.meta.env.VITE_SUPABASE_URL,
      anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    mercadoPago: {
      accessToken: !!import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN,
      publicKey: !!import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY,
    },
  };

  const allConfigured =
    checks.supabase.url &&
    checks.supabase.anonKey &&
    checks.mercadoPago.accessToken &&
    checks.mercadoPago.publicKey;

  if (import.meta.env.DEV) {
    console.log('🔍 Verificação de variáveis de ambiente:', checks);

    if (!allConfigured) {
      console.warn('⚠️ Algumas variáveis de ambiente não estão configuradas');

      if (!checks.mercadoPago.accessToken) {
        console.error('❌ VITE_MERCADO_PAGO_ACCESS_TOKEN não encontrado');
        console.info('💡 Verifique se o .env possui VITE_MERCADO_PAGO_ACCESS_TOKEN e reinicie o servidor');
      }

      if (!checks.mercadoPago.publicKey) {
        console.error('❌ VITE_MERCADO_PAGO_PUBLIC_KEY não encontrado');
        console.info('💡 Verifique se o .env possui VITE_MERCADO_PAGO_PUBLIC_KEY e reinicie o servidor');
      }
    } else {
      console.log('✅ Todas as variáveis de ambiente estão configuradas');
      console.log('   • Supabase: Conectado');
      console.log('   • Mercado Pago: Access Token + Public Key carregados');
    }
  }

  return {
    checks,
    allConfigured,
  };
}

// Executar verificação apenas em desenvolvimento
if (import.meta.env.DEV) {
  checkEnvironmentVariables();
}
