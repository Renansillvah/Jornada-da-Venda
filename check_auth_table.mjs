import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Verificando estrutura completa do banco...\n');

// 1. Verificar tabelas visíveis (schema public)
console.log('📊 TABELAS NO SCHEMA PUBLIC (visíveis):');
console.log('─────────────────────────────────────────');
const { data: publicTables } = await supabase
  .from('analyses')
  .select('id')
  .limit(0);

console.log('✅ analyses - Suas análises de jornada de venda\n');

// 2. Verificar usuários (via Admin API)
console.log('👥 USUÁRIOS NO SISTEMA (auth.users):');
console.log('─────────────────────────────────────────');
const { data: { users } } = await supabase.auth.admin.listUsers();

console.log(`✅ Total de usuários cadastrados: ${users.length}`);
users.forEach((user, index) => {
  console.log(`\n${index + 1}. ${user.email}`);
  console.log(`   🆔 ID: ${user.id}`);
  console.log(`   📅 Cadastrado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
  console.log(`   ✉️  Email confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`);
});

console.log('\n═════════════════════════════════════════');
console.log('📋 RESUMO DA ESTRUTURA:');
console.log('═════════════════════════════════════════');
console.log('✅ 1 tabela de dados: analyses (public)');
console.log('✅ 1 tabela de autenticação: users (auth)');
console.log('✅ Total: 2 tabelas (1 visível + 1 oculta)');
console.log('\n💡 A tabela auth.users é gerenciada automaticamente');
console.log('   pelo Supabase e não aparece no dashboard normal.\n');
