export interface Pillar {
  id: string;
  name: string;
  score: number;
  observation: string;
  action: string;
  confidence?: 'high' | 'medium' | 'low' | 'none'; // Nível de confiança da análise
  example?: string; // Exemplo prático pronto para copiar
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
  conclusion?: string; // Conclusão geral da análise da IA
  // Novos campos para versionamento
  type: 'single' | 'update'; // single = nova análise, update = atualização de análise existente
  parentId?: string; // ID da análise que está sendo atualizada
  isActive: boolean; // Se esta análise deve contar no painel geral
  tags?: string[]; // Tags para agrupar análises relacionadas (ex: "orçamento-cliente-X")
}

export interface CompanyHealth {
  pillarScores: Record<string, {
    average: number;
    count: number;
    confidence: 'high' | 'medium' | 'low';
    trend: 'up' | 'stable' | 'down';
    lastUpdated: string;
  }>;
  overallScore: number;
  totalAnalyses: number;
  lastAnalysisDate: string;
}

export const PILLARS_CONFIG = [
  // CAMADA 1 - FUNDAMENTOS (peso: crítico)
  // Base essencial que sustenta toda conversação comercial
  { id: 'professionalism', name: 'Profissionalismo', layer: 'foundation', weight: 3 },
  { id: 'technical-clarity', name: 'Clareza Técnica', layer: 'foundation', weight: 3 },
  { id: 'trust-security', name: 'Confiança e Segurança', layer: 'foundation', weight: 3 },
  { id: 'risk-reduction', name: 'Redução de Risco Percebido', layer: 'foundation', weight: 3 },
  { id: 'timing', name: 'Timing da Conversa', layer: 'foundation', weight: 3 },

  // CAMADA 2 - CONVERSÃO (peso: alto)
  // Pilares que transformam interesse em decisão de compra
  { id: 'positioning', name: 'Posicionamento Percebido', layer: 'conversion', weight: 2 },
  { id: 'expectation-alignment', name: 'Alinhamento de Expectativa', layer: 'conversion', weight: 2 },
  { id: 'differentiation', name: 'Diferenciação', layer: 'conversion', weight: 2 },
  { id: 'value-perception', name: 'Sensação de Valor', layer: 'conversion', weight: 2 },
  { id: 'ease-closing', name: 'Facilidade de Fechar', layer: 'conversion', weight: 2 },
  { id: 'client-control', name: 'Sensação de Controle do Cliente', layer: 'conversion', weight: 2 },

  // CAMADA 3 - POTENCIALIZAÇÃO (peso: normal)
  // Amplificadores que multiplicam os resultados
  { id: 'charisma', name: 'Carisma', layer: 'amplification', weight: 1 },
  { id: 'authority-behavioral', name: 'Autoridade (Comportamental)', layer: 'amplification', weight: 1 },
  { id: 'energy-flow', name: 'Energia e Fluxo da Conversa', layer: 'amplification', weight: 1 },
];

export const CONTEXT_OPTIONS = [
  'Instagram',
  'WhatsApp',
  'Proposta comercial',
  'Orçamento',
  'Site',
  'Outro',
];

export const getScoreLevel = (score: number): { level: string; color: string; bgColor: string } => {
  if (score === 0) return { level: 'Não avaliado', color: 'text-muted-foreground', bgColor: 'bg-muted' };
  if (score <= 4) return { level: 'Crítico', color: 'text-destructive', bgColor: 'bg-destructive/10' };
  if (score <= 6) return { level: 'Atenção', color: 'text-warning-foreground', bgColor: 'bg-warning/10' };
  if (score <= 9) return { level: 'Adequado', color: 'text-info-foreground', bgColor: 'bg-info/10' };
  return { level: 'Excelente', color: 'text-success-foreground', bgColor: 'bg-success/10' };
};

export const getActionableInsight = (pillarName: string, _score: number): { issue: string; action: string } => {
  const insights: Record<string, { issue: string; action: string }> = {
    // CAMADA 1 - FUNDAMENTOS
    'professionalism': {
      issue: 'Comunicação transmitindo informalidade ou desorganização',
      action: 'Revise tom da mensagem, corrija erros de digitação e responda em até 2h no horário comercial'
    },
    'technical-clarity': {
      issue: 'Cliente não entendeu exatamente o que você entrega',
      action: 'Reformule a descrição do serviço em 1 frase clara e envie exemplo visual do resultado final'
    },
    'trust-security': {
      issue: 'Cliente não tem segurança suficiente para fechar',
      action: 'Adicione 1 depoimento recente com foto/vídeo real do cliente satisfeito'
    },
    'risk-reduction': {
      issue: 'Cliente percebe muito risco em avançar com a compra',
      action: 'Ofereça garantia clara de 7-30 dias ou divida pagamento para reduzir risco percebido'
    },
    'timing': {
      issue: 'Oferta feita no momento errado da conversa',
      action: 'Faça 2-3 perguntas qualificadoras antes de apresentar preço ou proposta'
    },

    // CAMADA 2 - CONVERSÃO
    'positioning': {
      issue: 'Cliente não entendeu seu posicionamento ou nível de serviço',
      action: 'Reforce sua categoria: "Somos referência em..." ou "Nossos clientes são empresas que..."'
    },
    'expectation-alignment': {
      issue: 'Expectativas desalinhadas entre o que você promete e o que o cliente espera',
      action: 'Deixe claro o que ESTÁ e o que NÃO ESTÁ incluído no seu serviço/produto'
    },
    'differentiation': {
      issue: 'Cliente não viu diferença entre você e concorrentes',
      action: 'Destaque 1 elemento único: garantia exclusiva, método próprio ou benefício que só você entrega'
    },
    'value-perception': {
      issue: 'Cliente não percebeu o valor real do investimento',
      action: 'Mostre resultado concreto em números: economia de tempo, aumento de receita ou redução de custo'
    },
    'ease-closing': {
      issue: 'Processo de fechamento complexo ou confuso',
      action: 'Simplifique para 1 botão/link direto: "Fechar agora" com próximo passo óbvio'
    },
    'client-control': {
      issue: 'Cliente se sentindo pressionado ou sem controle da decisão',
      action: 'Deixe ele no comando: "Quando você quiser avançar, é só me avisar" ou ofereça teste/trial'
    },

    // CAMADA 3 - POTENCIALIZAÇÃO
    'charisma': {
      issue: 'Comunicação sem conexão emocional ou engajamento',
      action: 'Use storytelling: conte 1 caso real de transformação que seu cliente viveu'
    },
    'authority-behavioral': {
      issue: 'Comportamento não transmite confiança ou autoridade no assunto',
      action: 'Demonstre domínio técnico: cite dados, tendências do mercado ou cases de sucesso específicos'
    },
    'energy-flow': {
      issue: 'Conversa arrastada, sem momentum ou empolgação',
      action: 'Reduza tempo de resposta pela metade e faça perguntas que criem curiosidade'
    }
  };

  const pillarId = PILLARS_CONFIG.find(p => p.name === pillarName)?.id || '';
  return insights[pillarId] || {
    issue: 'Pilar abaixo do ideal para conversão',
    action: 'Revise este ponto e identifique o que pode ser melhorado imediatamente'
  };
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
