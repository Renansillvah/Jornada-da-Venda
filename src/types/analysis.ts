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
  { id: 'professionalism', name: 'Profissionalismo' },
  { id: 'technical-clarity', name: 'Clareza técnica' },
  { id: 'charisma', name: 'Carisma / Comunicação' },
  { id: 'authority', name: 'Autoridade' },
  { id: 'differentiation', name: 'Diferenciação' },
  { id: 'value-perception', name: 'Sensação de valor' },
  { id: 'trust', name: 'Confiança / Segurança' },
  { id: 'ease-closing', name: 'Facilidade de fechar' },
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
  if (score <= 20) return { level: 'Crítico', color: 'text-destructive' };
  if (score <= 40) return { level: 'Fraco', color: 'text-orange-600' };
  if (score <= 60) return { level: 'Aceitável', color: 'text-yellow-600' };
  if (score <= 80) return { level: 'Bom', color: 'text-blue-600' };
  return { level: 'Excelente', color: 'text-green-600' };
};

export const calculateTrend = (currentScore: number, previousScore: number): 'up' | 'stable' | 'down' => {
  const diff = currentScore - previousScore;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
};
