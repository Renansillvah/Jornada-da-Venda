import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 MONITORANDO BANCO DE DADOS EM TEMPO REAL\n');
console.log('═════════════════════════════════════════\n');

async function checkDatabase() {
  // Buscar todas as análises
  const { data: analyses, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar análises:', error.message);
    return;
  }

  console.clear();
  console.log('🔍 MONITORANDO BANCO DE DADOS EM TEMPO REAL\n');
  console.log('═════════════════════════════════════════\n');
  console.log(`📊 Total de análises no banco: ${analyses.length}\n`);

  if (analyses.length === 0) {
    console.log('📭 Nenhuma análise encontrada ainda...');
    console.log('\n💡 AGUARDANDO você criar uma análise no app!\n');
    console.log('👉 Vá até a aplicação e:');
    console.log('   1. Faça login (se ainda não fez)');
    console.log('   2. Clique em "Nova Análise"');
    console.log('   3. Preencha os dados dos pilares');
    console.log('   4. Clique em "Salvar"');
    console.log('\n⏳ Atualizando a cada 3 segundos...\n');
  } else {
    console.log('✅ ANÁLISES ENCONTRADAS:\n');

    analyses.forEach((analysis, index) => {
      const createdDate = new Date(analysis.created_at);
      const timeAgo = Math.floor((Date.now() - createdDate.getTime()) / 1000);

      let timeStr = '';
      if (timeAgo < 60) {
        timeStr = `há ${timeAgo} segundos`;
      } else if (timeAgo < 3600) {
        timeStr = `há ${Math.floor(timeAgo / 60)} minutos`;
      } else {
        timeStr = `há ${Math.floor(timeAgo / 3600)} horas`;
      }

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📋 ANÁLISE #${index + 1} ${timeAgo < 10 ? '🆕 NOVA!' : ''}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🆔 ID: ${analysis.id}`);
      console.log(`👤 Usuário: ${analysis.user_id === '72f3dd99-190c-46f0-95e9-c4a5a0a0ba85' ? 'renan.wow.blizz@gmail.com' : analysis.user_id}`);
      console.log(`📅 Data da análise: ${new Date(analysis.date).toLocaleDateString('pt-BR')}`);
      console.log(`⏰ Criada: ${createdDate.toLocaleString('pt-BR')} (${timeStr})`);
      console.log(`📝 Descrição: ${analysis.description}`);
      console.log(`📍 Contexto: ${analysis.context.join(', ')}`);
      console.log(`⭐ Pontuação média: ${analysis.average_score}/10`);
      console.log(`💪 Pilar mais forte: ${analysis.strongest_pillar}`);
      console.log(`⚠️  Pilar mais fraco: ${analysis.weakest_pillar}`);

      // Mostrar pontuação de cada pilar
      console.log(`\n📊 Pontuações dos Pilares:`);
      const pillars = analysis.pillars;
      console.log(`   🔍 Descoberta: ${pillars.discovery?.score || 0}/10`);
      console.log(`   💼 Proposta: ${pillars.proposal?.score || 0}/10`);
      console.log(`   🤝 Negociação: ${pillars.negotiation?.score || 0}/10`);
      console.log(`   ✅ Fechamento: ${pillars.closing?.score || 0}/10`);

      if (analysis.tags && analysis.tags.length > 0) {
        console.log(`\n🏷️  Tags: ${analysis.tags.join(', ')}`);
      }

      console.log('');
    });

    console.log(`\n⏳ Atualizando a cada 3 segundos...\n`);
    console.log(`💡 Pressione Ctrl+C para parar o monitoramento\n`);
  }
}

// Primeira verificação
await checkDatabase();

// Atualizar a cada 3 segundos
const interval = setInterval(checkDatabase, 3000);

// Cleanup ao parar
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('\n\n✅ Monitoramento encerrado!\n');
  process.exit(0);
});
