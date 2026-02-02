import { PILLARS_CONFIG } from '@/types/analysis';

export interface AIAnalysisResult {
  scores: Record<string, number>;
  observations: Record<string, string>;
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

  const pillarsDescription = PILLARS_CONFIG.map(p =>
    `- ${p.name} (${p.id}): Camada ${p.layer === 'foundation' ? '1 - Fundamentos' : p.layer === 'conversion' ? '2 - Conversão' : '3 - Potencialização'}`
  ).join('\n');

  const prompt = `Você é um especialista em análise de vendas. Analise esta imagem (pode ser uma conversa de Instagram, WhatsApp, proposta comercial, etc.) e avalie a jornada mental do cliente nos seguintes 15 pilares:

${pillarsDescription}

Para cada pilar, dê uma nota de 0 a 10 e uma observação específica sobre o que foi identificado na imagem.

IMPORTANTE:
- Se a imagem não mostrar informação relevante para algum pilar, dê nota 5 (neutro) e explique que não há dados suficientes
- Analise o contexto: é Instagram? WhatsApp? Proposta? Email? Identifique isso
- Seja específico nas observações: cite trechos ou elementos da imagem
- Foque na PERCEPÇÃO do cliente, não na intenção do vendedor

Responda APENAS em formato JSON válido, seguindo exatamente esta estrutura:

{
  "context": "Descrição breve do contexto (ex: 'Conversa de Instagram DM', 'Proposta comercial por email', etc.)",
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
    "professionalism": "Observação específica sobre profissionalismo vista na imagem",
    "technical-clarity": "Observação específica sobre clareza técnica",
    (... continue para todos os 15 pilares ...)
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
        max_tokens: 2000,
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

    // Extrair JSON da resposta (pode vir com ```json ou texto antes/depois)
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
    }

    const result: AIAnalysisResult = JSON.parse(jsonContent);

    // Validar que todos os pilares foram avaliados
    const missingPillars = PILLARS_CONFIG.filter(
      p => !(p.id in result.scores) || !(p.id in result.observations)
    );

    if (missingPillars.length > 0) {
      console.warn('Pilares faltando na resposta da IA:', missingPillars);
      // Preencher pilares faltantes com valores neutros
      missingPillars.forEach(p => {
        if (!(p.id in result.scores)) result.scores[p.id] = 5;
        if (!(p.id in result.observations)) {
          result.observations[p.id] = 'Dados insuficientes para avaliação';
        }
      });
    }

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
