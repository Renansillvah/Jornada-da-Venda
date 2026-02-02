import type { Analysis, CompanyHealth } from '@/types/analysis';
import { PILLARS_CONFIG } from '@/types/analysis';

/**
 * Calcula a saúde comercial da empresa com base nas análises ativas
 * Ignora pilares não avaliados e usa ponderação por recência
 */
export const calculateCompanyHealth = (analyses: Analysis[]): CompanyHealth => {
  // Filtrar apenas análises ativas
  const activeAnalyses = analyses.filter(a => a.isActive);

  if (activeAnalyses.length === 0) {
    return {
      pillarScores: {},
      overallScore: 0,
      totalAnalyses: 0,
      lastAnalysisDate: '',
    };
  }

  // Calcular peso por recência (análises mais recentes têm mais peso)
  const now = Date.now();
  const analysesWithWeight = activeAnalyses.map(analysis => {
    const ageInDays = (now - new Date(analysis.date).getTime()) / (1000 * 60 * 60 * 24);
    // Peso decai exponencialmente: análises com menos de 7 dias = peso 1, depois decai
    const weight = Math.max(0.3, Math.exp(-ageInDays / 14));
    return { analysis, weight };
  });

  // Agrupar notas por pilar
  const pillarData: Record<string, { scores: { value: number; weight: number }[]; dates: string[] }> = {};

  analysesWithWeight.forEach(({ analysis, weight }) => {
    analysis.pillars.forEach(pillar => {
      // Ignorar pilares não avaliados (score === 0)
      if (pillar.score > 0) {
        if (!pillarData[pillar.id]) {
          pillarData[pillar.id] = { scores: [], dates: [] };
        }
        pillarData[pillar.id].scores.push({ value: pillar.score, weight });
        pillarData[pillar.id].dates.push(analysis.date);
      }
    });
  });

  // Calcular médias ponderadas e confiança por pilar
  const pillarScores: CompanyHealth['pillarScores'] = {};

  PILLARS_CONFIG.forEach(config => {
    const data = pillarData[config.id];

    if (!data || data.scores.length === 0) {
      // Pilar sem dados - não adicionar ao resultado
      return;
    }

    // Média ponderada
    const totalWeight = data.scores.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = data.scores.reduce((sum, s) => sum + s.value * s.weight, 0);
    const average = weightedSum / totalWeight;

    // Confiança baseada na quantidade de análises
    const count = data.scores.length;
    const confidence = count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low';

    // Tendência (comparar últimas 2 análises se houver)
    let trend: 'up' | 'stable' | 'down' = 'stable';
    if (data.scores.length >= 2) {
      const recent = data.scores[0].value;
      const previous = data.scores[1].value;
      const diff = recent - previous;
      if (diff > 0.5) trend = 'up';
      else if (diff < -0.5) trend = 'down';
    }

    pillarScores[config.id] = {
      average: Math.round(average * 10) / 10,
      count,
      confidence,
      trend,
      lastUpdated: data.dates[0],
    };
  });

  // Calcular nota geral ponderada (considerando pesos das camadas)
  let totalWeightedScore = 0;
  let totalWeight = 0;

  Object.entries(pillarScores).forEach(([pillarId, data]) => {
    const config = PILLARS_CONFIG.find(c => c.id === pillarId);
    if (config) {
      const weight = config.weight || 1;
      totalWeightedScore += data.average * weight;
      totalWeight += weight;
    }
  });

  const overallScore = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 10) / 10 : 0;

  return {
    pillarScores,
    overallScore,
    totalAnalyses: activeAnalyses.length,
    lastAnalysisDate: activeAnalyses[0]?.date || '',
  };
};

/**
 * Retorna análises relacionadas (mesmas tags ou atualizações)
 */
export const getRelatedAnalyses = (analysis: Analysis, allAnalyses: Analysis[]): Analysis[] => {
  const related: Analysis[] = [];

  // Buscar análises com mesmas tags
  if (analysis.tags && analysis.tags.length > 0) {
    allAnalyses.forEach(a => {
      if (a.id !== analysis.id && a.tags) {
        const hasCommonTag = a.tags.some(tag => analysis.tags?.includes(tag));
        if (hasCommonTag) {
          related.push(a);
        }
      }
    });
  }

  // Buscar histórico de atualizações
  if (analysis.type === 'update' && analysis.parentId) {
    const parent = allAnalyses.find(a => a.id === analysis.parentId);
    if (parent) {
      related.push(parent);
      // Buscar outras atualizações do mesmo parent
      allAnalyses.forEach(a => {
        if (a.id !== analysis.id && a.parentId === analysis.parentId) {
          related.push(a);
        }
      });
    }
  }

  // Se esta análise é um parent, buscar suas atualizações
  const updates = allAnalyses.filter(a => a.parentId === analysis.id);
  related.push(...updates);

  // Remover duplicatas e ordenar por data
  return Array.from(new Set(related))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
