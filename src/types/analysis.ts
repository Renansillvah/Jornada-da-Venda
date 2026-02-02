export interface Pillar {
  id: string;
  name: string;
  score: number;
  observation: string;
  action: string;
}

export interface Analysis {
  id: string;
  date: string;
  context: string[];
  description: string;
  pillars: Pillar[];
  averageScore: number;
  strongestPillar: string;
  weakestPillar: string;
  trend?: 'up' | 'stable' | 'down';
  changes?: string;
}

export const PILLARS_CONFIG = [
  // CAMADA 1 - FUNDAMENTOS (peso: crítico)
  { id: 'technical-clarity', name: 'Clareza Técnica', layer: 'foundation', weight: 3 },
  { id: 'professionalism', name: 'Profissionalismo', layer: 'foundation', weight: 3 },
  { id: 'trust', name: 'Confiança / Segurança', layer: 'foundation', weight: 3 },
  { id: 'timing', name: 'Timing da Conversa', layer: 'foundation', weight: 3 },

  // CAMADA 2 - CONVERSÃO (peso: alto)
  { id: 'ease-closing', name: 'Facilidade de Fechar', layer: 'conversion', weight: 2 },
  { id: 'value-perception', name: 'Sensação de Valor', layer: 'conversion', weight: 2 },
  { id: 'differentiation', name: 'Diferenciação', layer: 'conversion', weight: 2 },

  // CAMADA 3 - POTENCIALIZAÇÃO (peso: normal)
  { id: 'charisma', name: 'Carisma / Comunicação', layer: 'amplification', weight: 1 },
  { id: 'authority', name: 'Autoridade', layer: 'amplification', weight: 1 },
  { id: 'energy', name: 'Energia / Fluxo da Conversa', layer: 'amplification', weight: 1 },
];

export const CONTEXT_OPTIONS = [
  'Instagram',
  'WhatsApp',
  'Proposta comercial',
  'Orçamento',
  'Site',
  'Outro',
];

export const getScoreLevel = (score: number): { level: string; color: string } => {
  if (score === 0) return { level: 'Não avaliado', color: 'text-muted-foreground' };
  if (score <= 3) return { level: 'Bloqueio crítico', color: 'text-red-600' };
  if (score <= 5) return { level: 'Gargalo ativo', color: 'text-orange-600' };
  if (score <= 7) return { level: 'Precisa ajuste', color: 'text-yellow-600' };
  if (score <= 9) return { level: 'Funcional', color: 'text-blue-600' };
  return { level: 'Otimizado', color: 'text-green-600' };
};

export const getLayerInfo = (layer: string): { name: string; description: string; icon: string } => {
  switch (layer) {
    case 'foundation':
      return {
        name: 'Fundamentos',
        description: 'Sem isso, não existe venda',
        icon: '🎯',
      };
    case 'conversion':
      return {
        name: 'Conversão',
        description: 'Acelera o SIM',
        icon: '⚡',
      };
    case 'amplification':
      return {
        name: 'Potencialização',
        description: 'Escala e impacto',
        icon: '🚀',
      };
    default:
      return { name: '', description: '', icon: '' };
  }
};

export const calculateTrend = (currentScore: number, previousScore: number): 'up' | 'stable' | 'down' => {
  const diff = currentScore - previousScore;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
};
