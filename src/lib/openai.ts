import { PILLARS_CONFIG } from '@/types/analysis';

export interface AIAnalysisResult {
  scores: Record<string, number>;
  observations: Record<string, string>;
  explanations: Record<string, string>; // Explicação detalhada do que foi visto
  summary: string;
  context: string;
}

export async function analyzeImageWithAI(
  base64Image: string,
  apiKey: string
): Promise<AIAnalysisResult> {
  if (!apiKey) {
    throw new Error('ERRO: Variável de ambiente VITE_OPENAI_API_KEY não está definida. Configure o arquivo .env com sua chave da OpenAI.');
  }

  const pillarsDescription = PILLARS_CONFIG.map(p => {
    const layerName = p.layer === 'foundation' ? '1 - Fundamentos' :
                     p.layer === 'conversion' ? '2 - Conversão' :
                     '3 - Potencialização';
    return `- ${p.name} (ID: ${p.id}) - ${layerName}`;
  }).join('\n');

  const prompt = `Você é um especialista em análise de vendas consultivo. Analise esta imagem (pode ser uma conversa de Instagram, WhatsApp, proposta comercial, etc.) e avalie a jornada mental do cliente nos seguintes 15 pilares:

${pillarsDescription}

ESTRUTURA DA ANÁLISE DE CADA PILAR:

Para cada pilar, você DEVE criar uma explicação COMPLETA e ACIONÁVEL seguindo este formato:

📊 O QUE FOI VISTO (2-3 frases):
- Descreva ESPECIFICAMENTE o que você identificou na imagem
- Cite trechos, elementos visuais, tom de linguagem, etc.
- Exemplo: "Na conversa, o vendedor respondeu em 2 minutos mas usou gírias ('blz', 'tmj') em contexto B2B"

⚠️ IMPACTO NA PERCEPÇÃO DO CLIENTE (1-2 frases):
- Explique COMO isso afeta a decisão de compra do cliente
- Foque na jornada mental: o que o cliente está pensando/sentindo
- Exemplo: "Isso gera insegurança: cliente pode pensar 'será que essa empresa é profissional?' e hesitar no fechamento"

✅ O QUE FAZER PARA MELHORAR (2-3 ações práticas):
- Liste ações ESPECÍFICAS e PRÁTICAS que podem ser implementadas IMEDIATAMENTE
- Seja direto e objetivo
- Exemplo:
  1. Evite gírias em contextos B2B - use linguagem profissional mas acessível
  2. Adicione assinatura com cargo e empresa nas respostas
  3. Responda em até 5min (manter rapidez) mas com texto formatado e sem abreviações

INSTRUÇÕES CRÍTICAS:
- Para cada pilar, dê uma nota de 0 a 10 baseada no que VIU na imagem
- A explicação DEVE ter as 3 partes: O QUE VIU + IMPACTO + O QUE FAZER
- Use quebras de linha e formatação clara (mas mantenha como string, não markdown)
- Se a imagem não mostrar informação relevante para algum pilar, dê nota 5 e explique que não há dados
- Analise o contexto: é Instagram? WhatsApp? Proposta? Email?
- Foque na PERCEPÇÃO do cliente, não na intenção do vendedor

Responda APENAS em formato JSON válido, seguindo EXATAMENTE esta estrutura (todos os 15 pilares são obrigatórios):

{
  "context": "Descrição breve do contexto (ex: 'Conversa de Instagram DM')",
  "summary": "Resumo geral da análise em 2-3 frases",
  "scores": {
    "professionalism": 8,
    "technical-clarity": 7,
    "trust-security": 6,
    "risk-reduction": 5,
    "timing": 7,
    "positioning": 8,
    "expectation-alignment": 6,
    "differentiation": 5,
    "value-perception": 7,
    "ease-closing": 6,
    "client-control": 8,
    "charisma": 7,
    "authority-behavioral": 6,
    "energy-flow": 8
  },
  "observations": {
    "professionalism": "Resumo curto do profissionalismo",
    "technical-clarity": "Resumo curto da clareza técnica",
    "trust-security": "Resumo curto de confiança",
    "risk-reduction": "Resumo curto de redução de risco",
    "timing": "Resumo curto do timing",
    "positioning": "Resumo curto do posicionamento",
    "expectation-alignment": "Resumo curto do alinhamento",
    "differentiation": "Resumo curto da diferenciação",
    "value-perception": "Resumo curto da percepção de valor",
    "ease-closing": "Resumo curto da facilidade de fechar",
    "client-control": "Resumo curto do controle do cliente",
    "charisma": "Resumo curto do carisma",
    "authority-behavioral": "Resumo curto da autoridade",
    "energy-flow": "Resumo curto da energia"
  },
  "explanations": {
    "professionalism": "O QUE FOI VISTO: Na conversa do WhatsApp, o vendedor usou foto de perfil pessoal (não corporativa), respondeu 'blz' e 'tmj', e não assinou as mensagens com nome/cargo. IMPACTO: Cliente pode questionar se está falando com empresa estruturada ou apenas um freelancer informal, gerando dúvida sobre suporte pós-venda. O QUE FAZER: 1) Use foto profissional/logo da empresa no WhatsApp Business, 2) Evite gírias - escreva 'certo' ao invés de 'blz', 3) Adicione assinatura automática: 'João Silva - Consultor Comercial | Nome da Empresa'",
    "technical-clarity": "[Mesmo formato: O QUE FOI VISTO + IMPACTO + O QUE FAZER com ações práticas numeradas]",
    "trust-security": "[Mesmo formato]",
    "risk-reduction": "[Mesmo formato]",
    "timing": "[Mesmo formato]",
    "positioning": "[Mesmo formato]",
    "expectation-alignment": "[Mesmo formato]",
    "differentiation": "[Mesmo formato]",
    "value-perception": "[Mesmo formato]",
    "ease-closing": "[Mesmo formato]",
    "client-control": "[Mesmo formato]",
    "charisma": "[Mesmo formato]",
    "authority-behavioral": "[Mesmo formato]",
    "energy-flow": "[Mesmo formato]"
  }
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 6000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message ||
        `Erro na API da OpenAI: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('📄 Resposta bruta da OpenAI (primeiros 500 chars):', content.substring(0, 500));

    // Extrair JSON da resposta (pode vir com ```json ou texto antes/depois)
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
      console.log('✂️ JSON extraído (primeiros 500 chars):', jsonContent.substring(0, 500));
    }

    console.log('🔄 Tentando fazer parse do JSON...');
    const result: AIAnalysisResult = JSON.parse(jsonContent);
    console.log('✅ Parse bem sucedido! Estrutura:', {
      hasScores: !!result.scores,
      hasObservations: !!result.observations,
      hasExplanations: !!result.explanations,
      numScores: Object.keys(result.scores || {}).length,
      numExplanations: Object.keys(result.explanations || {}).length
    });

    // Validar que todos os pilares foram avaliados
    const missingPillars = PILLARS_CONFIG.filter(
      p => !(p.id in result.scores) || !(p.id in result.observations) || !(p.id in result.explanations)
    );

    if (missingPillars.length > 0) {
      console.warn('Pilares faltando na resposta da IA:', missingPillars);
      // Preencher pilares faltantes com valores neutros
      missingPillars.forEach(p => {
        if (!(p.id in result.scores)) result.scores[p.id] = 5;
        if (!(p.id in result.observations)) {
          result.observations[p.id] = 'Dados insuficientes para avaliação';
        }
        if (!(p.id in result.explanations)) {
          result.explanations[p.id] = 'Não foi possível identificar informações relevantes na imagem para avaliar este pilar.';
        }
      });
    }

    console.log('Resultado da análise da IA:', result);
    return result;
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw error;
  }
}

// Função auxiliar para verificar se a chave da OpenAI está configurada
export function isOpenAIConfigured(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!apiKey && apiKey.trim().length > 0;
}

// Função para obter a chave da OpenAI (do .env ou localStorage)
export function getOpenAIKey(): string | null {
  // Primeiro tenta pegar do .env
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey;
  }

  // Se não tiver no .env, tenta pegar do localStorage
  return localStorage.getItem('openai_api_key');
}

// Função para salvar a chave da OpenAI no localStorage
export function saveOpenAIKey(apiKey: string): void {
  localStorage.setItem('openai_api_key', apiKey);
}
