import type { Analysis } from '@/types/analysis';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Exporta análises para CSV
 */
export const exportToCSV = (analyses: Analysis[]): void => {
  if (analyses.length === 0) {
    alert('Nenhuma análise para exportar');
    return;
  }

  // Cabeçalho do CSV
  const headers = [
    'Data',
    'Contexto',
    'Descrição',
    'Nota Geral',
    'Ponto Forte',
    'Gargalo',
    'Tipo',
    'Status',
    'Tags'
  ];

  // Linhas de dados
  const rows = analyses.map(analysis => [
    format(new Date(analysis.date), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    analysis.context.join(' | '),
    analysis.description.replace(/"/g, '""'), // Escapar aspas
    analysis.averageScore.toString(),
    analysis.strongestPillar,
    analysis.weakestPillar,
    analysis.type === 'single' ? 'Nova' : 'Atualização',
    analysis.isActive ? 'Ativa' : 'Inativa',
    (analysis.tags || []).join(' | ')
  ]);

  // Montar CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `analises-jornada-venda-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporta análise individual para JSON
 */
export const exportToJSON = (analysis: Analysis): void => {
  const jsonContent = JSON.stringify(analysis, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `analise-${analysis.id}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporta relatório em texto formatado
 */
export const exportToText = (analysis: Analysis): void => {
  const content = `
═══════════════════════════════════════════════
   ANÁLISE DE JORNADA DE VENDA
═══════════════════════════════════════════════

DATA: ${format(new Date(analysis.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
CONTEXTO: ${analysis.context.join(', ')}
TIPO: ${analysis.type === 'single' ? 'Nova Análise' : 'Atualização'}
STATUS: ${analysis.isActive ? 'Ativa' : 'Inativa'}

DESCRIÇÃO:
${analysis.description}

───────────────────────────────────────────────
DIAGNÓSTICO GERAL
───────────────────────────────────────────────

Nota Geral: ${analysis.averageScore}/10

✓ Ponto Forte: ${analysis.strongestPillar}
✗ Gargalo: ${analysis.weakestPillar}

${analysis.trend ? `Tendência: ${analysis.trend === 'up' ? '↑ Melhoria' : analysis.trend === 'down' ? '↓ Piora' : '→ Estável'}` : ''}
${analysis.changes ? `Mudanças: ${analysis.changes}` : ''}

───────────────────────────────────────────────
AVALIAÇÃO POR PILARES
───────────────────────────────────────────────

${analysis.pillars.map(pillar => `
${pillar.name}
  Nota: ${pillar.score}/10
  Observação: ${pillar.observation}
  Ação Sugerida: ${pillar.action}
`).join('\n')}

═══════════════════════════════════════════════
Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
═══════════════════════════════════════════════
`.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio-analise-${format(new Date(analysis.date), 'yyyy-MM-dd')}.txt`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copia análise para área de transferência (markdown)
 */
export const copyToClipboard = async (analysis: Analysis): Promise<boolean> => {
  const markdown = `
# Análise de Jornada de Venda

**Data:** ${format(new Date(analysis.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
**Contexto:** ${analysis.context.join(', ')}
**Nota Geral:** ${analysis.averageScore}/10

## Descrição
${analysis.description}

## Diagnóstico
- **Ponto Forte:** ${analysis.strongestPillar}
- **Gargalo:** ${analysis.weakestPillar}

${analysis.trend ? `**Tendência:** ${analysis.trend === 'up' ? '↑ Melhoria' : analysis.trend === 'down' ? '↓ Piora' : '→ Estável'}` : ''}

## Avaliação por Pilares

${analysis.pillars.map(pillar => `
### ${pillar.name} - ${pillar.score}/10
**Observação:** ${pillar.observation}
**Ação Sugerida:** ${pillar.action}
`).join('\n')}
`.trim();

  try {
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (err) {
    console.error('Erro ao copiar para área de transferência:', err);
    return false;
  }
};
