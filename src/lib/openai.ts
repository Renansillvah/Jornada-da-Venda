import { PILLARS_CONFIG } from '@/types/analysis';

export interface AIAnalysisResult {
  scores: Record<string, number>;
  observations: Record<string, string>;
  explanations: Record<string, string>; // Explicação detalhada do que foi visto
  confidence: Record<string, 'high' | 'medium' | 'low' | 'none'>; // Nível de confiança da análise
  examples: Record<string, string>; // Exemplos práticos prontos para copiar
  summary: string;
  context: string;
  conclusion: string; // Conclusão geral da análise
}

export type AnalysisMode = 'quick' | 'detailed';

export async function analyzeImageWithAI(
  base64Images: string | string[],
  apiKey: string,
  mode: AnalysisMode = 'detailed'
): Promise<AIAnalysisResult> {
  if (!apiKey) {
    throw new Error('ERRO: Variável de ambiente VITE_OPENAI_API_KEY não está definida. Configure o arquivo .env com sua chave da OpenAI.');
  }

  // Suporta uma ou múltiplas imagens
  const images = Array.isArray(base64Images) ? base64Images : [base64Images];

  const pillarsDescription = PILLARS_CONFIG.map(p => {
    const layerName = p.layer === 'foundation' ? '1 - Fundamentos' :
                     p.layer === 'conversion' ? '2 - Conversão' :
                     '3 - Potencialização';
    return `- ${p.name} (ID: ${p.id}) - ${layerName}`;
  }).join('\n');

  const imagesContext = images.length > 1
    ? `estas ${images.length} imagens que mostram diferentes momentos da jornada de vendas`
    : 'esta imagem';

  // Escolher prompt baseado no modo
  const prompt = mode === 'quick' ? getQuickPrompt(imagesContext, images.length, pillarsDescription) : getDetailedPrompt(imagesContext, images.length, pillarsDescription);

  // Função para gerar prompt rápido (15-30 segundos)
  function getQuickPrompt(context: string, imageCount: number, pillars: string): string {
    return `ATENCAO CRITICA: Voce DEVE responder APENAS com JSON valido. NAO adicione texto antes ou depois do JSON. Responda DIRETAMENTE com o objeto JSON puro começando com { e terminando com }.

Você é um especialista em análise de vendas consultivo. Analise ${context} (conversa de Instagram, WhatsApp, proposta, etc.) e avalie RAPIDAMENTE a jornada do cliente nos 15 pilares:

${imageCount > 1 ? `⚠️ Você recebeu ${imageCount} imagens - analise todas de forma integrada.` : ''}

${pillars}

MODO RÁPIDO - Para cada pilar:
1. Dê nota de 0 a 10 baseada no que VIU
2. Escreva observação CURTA (2-3 frases diretas)
3. Escreva explicação OBJETIVA (4-6 frases sobre: O que viu + Principal impacto + 2-3 ações de melhoria)
4. Indique confiança: "high", "medium", "low" ou "none"
5. Se confidence = "none", dê nota 0 e escreva: "Não foi possível avaliar com base na imagem."

Responda em JSON com esta estrutura:
{
  "context": "Descrição breve do contexto",
  "summary": "Resumo geral em 2 frases",
  "conclusion": "Conclusão estratégica objetiva (80-100 palavras): padrão geral identificado + principal foco de melhoria para impactar vendas",
  "scores": { "professionalism": 8, "technical-clarity": 7, ... },
  "observations": { "professionalism": "Resumo curto", ... },
  "explanations": { "professionalism": "O que vi + impacto + ações", ... },
  "examples": { "professionalism": "Exemplo prático breve se relevante", ... },
  "confidence": { "professionalism": "high", ... }
}`;
  }

  // Função para gerar prompt detalhado (60-90 segundos)
  function getDetailedPrompt(context: string, imageCount: number, pillars: string): string {
    return `ATENCAO CRITICA: Voce DEVE responder APENAS com JSON valido. NAO adicione texto antes ou depois do JSON. NAO use blocos markdown. Responda DIRETAMENTE com o objeto JSON puro começando com { e terminando com }.

Você é um especialista em análise de vendas consultivo. Analise ${context} (pode ser conversa de Instagram, WhatsApp, proposta comercial, etc.) e avalie a jornada mental do cliente nos seguintes 15 pilares:

${imageCount > 1 ? `
⚠️ IMPORTANTE - ANÁLISE DE MÚLTIPLAS IMAGENS:
Você recebeu ${imageCount} imagens. Analise TODAS elas de forma integrada:
- Imagem 1 pode ser: primeiro contato (Instagram/WhatsApp)
- Imagem 2 pode ser: proposta comercial
- Imagem 3 pode ser: follow-up ou reunião
- Etc.

Combine informações de TODAS as imagens para dar notas mais precisas. Quanto mais imagens, mais dados você tem para avaliar cada pilar com alta confiança!
` : ''}

${pillars}

ESTRUTURA DA ANÁLISE DE CADA PILAR:

Para cada pilar, você DEVE criar uma explicação EXTREMAMENTE DETALHADA e COMPLETA, como se estivesse escrevendo uma análise consultiva profunda. Siga este formato:

📊 O QUE FOI VISTO (4-6 frases detalhadas):
- Descreva MINUCIOSAMENTE tudo que você identificou na imagem relacionado a este pilar
- Cite trechos EXATOS, elementos visuais específicos, tom de linguagem, timing, formatação, etc.
- Analise CADA detalhe relevante: palavras usadas, estrutura das frases, emojis, pontuação, tempo de resposta
- Exemplo completo: "Na conversa do WhatsApp com cliente corporativo, identifiquei os seguintes elementos relacionados ao profissionalismo: 1) Foto de perfil pessoal informal ao invés de logo empresarial, 2) Uso recorrente de gírias como 'blz', 'tmj' e 'vlw' em 5 das 8 mensagens analisadas, 3) Ausência completa de assinatura profissional (nome, cargo, empresa), 4) Mensagens sem formatação adequada - texto corrido sem parágrafos, 5) Horário de resposta às 23h47 sugere falta de estrutura de atendimento, 6) Linguagem muito casual para contexto B2B (empresa de tecnologia conversando com multinacional)."

⚠️ IMPACTO NA PERCEPÇÃO DO CLIENTE (4-5 frases explicativas):
- Explique PROFUNDAMENTE como cada elemento identificado afeta a jornada mental e emocional do cliente
- Detalhe os pensamentos, dúvidas e sentimentos que surgem na mente do cliente
- Conecte com a psicologia de vendas: confiança, credibilidade, percepção de risco, autoridade
- Explique as consequências diretas e indiretas na decisão de compra
- Exemplo completo: "Esses elementos criam uma percepção de informalidade excessiva que gera múltiplos impactos negativos na jornada mental do cliente. Primeiro, o uso de gírias e linguagem casual em contexto B2B faz o cliente questionar se está lidando com uma empresa estruturada ou apenas um freelancer informal, o que aumenta a percepção de risco sobre suporte pós-venda, cumprimento de prazos e profissionalismo na execução. Segundo, a ausência de assinatura profissional e logo empresarial dificulta que o cliente 'visualize' a empresa como entidade sólida - ele não consegue associar aquela conversa a uma marca ou estrutura organizacional confiável. Terceiro, mensagens sem formatação e enviadas fora do horário comercial reforçam a imagem de operação 'one-man show' sem processos definidos. O resultado é que, mesmo que o produto/serviço seja excelente, o cliente hesita no fechamento pensando: 'Será que posso confiar? E se algo der errado, terei suporte adequado? Esta empresa tem estrutura para me atender?'. Essa insegurança aumenta em até 60% o tempo de decisão e reduz drasticamente a taxa de conversão em vendas B2B de ticket médio-alto."

✅ O QUE FAZER PARA MELHORAR (6-10 ações práticas detalhadas):
- Liste ações MUITO ESPECÍFICAS, PASSO A PASSO, que podem ser implementadas HOJE
- Para CADA ação, explique COMO fazer e POR QUÊ funciona
- Dê exemplos CONCRETOS de antes/depois, scripts, templates
- Priorize do mais impactante ao menos impactante
- Exemplo completo com detalhamento:

1. URGENTE - Migre para WhatsApp Business e configure identidade profissional (Impacto: +40% credibilidade):
   - Ação: Crie conta WhatsApp Business gratuita
   - Configure: Logo da empresa como foto, nome empresarial, horário de atendimento, endereço, site
   - Por quê: Cliente vê imediatamente que está falando com empresa estruturada, não pessoa física
   - Exemplo: Ao invés de "João - foto pessoal", cliente vê "TechSolutions Ltda - Logo profissional - Seg-Sex 9h-18h"

2. Elimine 100% das gírias e crie glossário de linguagem profissional (Impacto: +35% percepção de profissionalismo):
   - Substitua: 'blz' → 'perfeito' | 'tmj' → 'estamos juntos' | 'vlw' → 'agradeço o contato'
   - Mantenha tom acessível mas profissional: "Entendi perfeitamente!" ao invés de "saquei tudo blz"
   - Crie documento interno com 50 substituições comuns para treinar equipe
   - Por quê: Linguagem profissional = empresa séria aos olhos do cliente B2B

3. Implemente assinatura automática em TODAS as mensagens (Impacto: +30% autoridade):
   - Template: "João Silva | Consultor Comercial | TechSolutions | (11) 9999-9999 | contato@techsolutions.com"
   - Configure no WhatsApp Business como resposta rápida "/assinatura"
   - Use SEMPRE ao finalizar cada interação importante
   - Por quê: Cliente associa a conversa a pessoa real com cargo definido dentro de estrutura empresarial

4. Crie blocos de texto formatados ao invés de texto corrido (Impacto: +25% clareza e profissionalismo):
   - Use: Quebras de linha, tópicos numerados, negrito para destaque (*texto*)
   - Antes: "oi tudo bem entao sobre o projeto vou te mandar proposta ate amanha e ai depois a gente ve os detalhes blz"
   - Depois: "Olá! Tudo bem?

   Sobre o projeto, seguem os próximos passos:

   1️⃣ Envio da proposta comercial: até amanhã 17h
   2️⃣ Reunião de alinhamento: sugestão para quinta-feira 10h
   3️⃣ Definição de cronograma: após aprovação da proposta

   Alguma dúvida sobre o processo?"

5. Defina e respeite horário comercial rigoroso (Impacto: +20% percepção de estrutura):
   - Atenda: Seg-Sex 9h-18h | Responda fora do horário apenas emergências
   - Configure mensagem automática: "Recebemos sua mensagem! Nosso horário de atendimento é seg-sex 9h-18h. Retornaremos em breve."
   - Por quê: Empresa estruturada tem processos e limites, não fica disponível 24/7 como freelancer

6. Adicione elementos de prova social em momentos estratégicos:
   - "Recentemente fizemos projeto similar para [Cliente Grande do Setor]"
   - "Já atendemos +50 empresas neste segmento"
   - Envie mini case study em PDF quando cliente demonstrar interesse

[Continue com mais 4-5 ações detalhadas...]

INSTRUÇÕES CRÍTICAS:
- Para cada pilar, dê uma nota de 0 a 10 baseada APENAS no que VIU na imagem
- A explicação DEVE ter as 3 partes: O QUE VIU + IMPACTO + O QUE FAZER
- Use quebras de linha e formatação clara (mas mantenha como string, não markdown)
- Analise o contexto: é Instagram? WhatsApp? Proposta? Email?
- Foque na PERCEPÇÃO do cliente, não na intenção do vendedor

IMPORTANTE - NÍVEL DE CONFIANÇA:
Para cada pilar, você DEVE indicar o nível de confiança da análise:
- "high": A imagem mostra CLARAMENTE informações sobre este pilar (ex: conversa tem timing claro, tom de voz explícito)
- "medium": A imagem mostra informações PARCIAIS sobre este pilar (ex: é possível inferir algumas coisas)
- "low": A imagem mostra informações MÍNIMAS sobre este pilar (ex: consegue deduzir algo, mas com incerteza)
- "none": A imagem NÃO mostra informações relevantes sobre este pilar

REGRAS PARA PILARES SEM DADOS (confidence: "none"):
- Dê nota 0 (não inventar nota se não há dados)
- Na explicação, escreva apenas: "Não foi possível avaliar este pilar com base na imagem fornecida. Este contexto não apresenta elementos suficientes para análise."
- Não invente análises para pilares que não podem ser avaliados na imagem

ATENÇÃO - EXEMPLOS PRÁTICOS PRONTOS PARA COPIAR:
Para CADA pilar analisado, você DEVE criar exemplos CONCRETOS e PRONTOS para o usuário copiar e usar IMEDIATAMENTE. Esses exemplos devem ser:
- Scripts de mensagem prontos (antes/depois)
- Templates formatados
- Textos completos que podem ser copiados e colados
- Exemplos de como reescrever trechos problemáticos

Formato dos exemplos:
🎯 EXEMPLO PRÁTICO - PRONTO PARA USAR:

[Forneça 2-3 exemplos práticos completos que o usuário pode copiar]

Exemplo: Se o problema é linguagem informal, mostre:

ANTES (❌ Evite):
"oi blz, vi seu perfil e achei top, bora conversar sobre aquele projeto?"

DEPOIS (✅ Use assim):
"Olá [Nome]! Tudo bem?

Vi que você atua com [área] e acredito que posso agregar valor ao seu projeto de [tema].

Podemos agendar 15min esta semana para eu entender melhor sua necessidade?

[Sua Assinatura Profissional]"

Responda APENAS em formato JSON válido, seguindo EXATAMENTE esta estrutura (todos os 15 pilares são obrigatórios):

{
  "context": "Descrição breve do contexto (ex: 'Conversa de Instagram DM')",
  "summary": "Resumo geral da análise em 2-3 frases",
  "conclusion": "CONCLUSÃO GERAL E RECOMENDAÇÃO ESTRATÉGICA: Faça uma análise final integrando todos os pilares avaliados. Identifique o padrão geral (ex: 'jornada com fundamentos sólidos mas baixa conversão', 'excelente relacionamento mas falta estrutura comercial', 'alta energia mas baixa credibilidade'). Dê a principal recomendação estratégica: qual deve ser o foco de melhoria IMEDIATO para gerar maior impacto nas vendas? Seja específico e actionable. 150-200 palavras.",
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
    "professionalism": "O QUE FOI VISTO: [4-6 frases detalhadas] IMPACTO: [4-5 frases explicativas] O QUE FAZER: [6-10 ações práticas detalhadas]",
    "technical-clarity": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "trust-security": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "risk-reduction": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "timing": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "positioning": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "expectation-alignment": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "differentiation": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "value-perception": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "ease-closing": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "client-control": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "charisma": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "authority-behavioral": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]",
    "energy-flow": "O QUE FOI VISTO: [...] IMPACTO: [...] O QUE FAZER: [...]"
  },
  "examples": {
    "professionalism": "🎯 EXEMPLO PRÁTICO - COPIE E USE:\n\nANTES (❌):\n'oi blz vi seu perfil achei top bora conversar sobre aquele projeto'\n\nDEPOIS (✅):\n'Olá [Nome]! Tudo bem?\n\nVi que você atua com [área] e acredito que posso agregar ao projeto de [tema].\n\nPodemos agendar 15min esta semana?\n\n[Nome] | [Cargo] | [Empresa] | [Telefone]'",
    "technical-clarity": "[Exemplos práticos com antes/depois se houver dados]",
    "trust-security": "[Exemplos práticos]",
    "risk-reduction": "[Exemplos práticos]",
    "timing": "[Exemplos práticos]",
    "positioning": "[Exemplos práticos]",
    "expectation-alignment": "[Exemplos práticos]",
    "differentiation": "[Exemplos práticos]",
    "value-perception": "[Exemplos práticos]",
    "ease-closing": "[Exemplos práticos]",
    "client-control": "[Exemplos práticos]",
    "charisma": "[Exemplos práticos]",
    "authority-behavioral": "[Exemplos práticos]",
    "energy-flow": "[Exemplos práticos]"
  },
  "confidence": {
    "professionalism": "high",
    "technical-clarity": "medium",
    "trust-security": "low",
    "risk-reduction": "none",
    "timing": "high",
    "positioning": "medium",
    "expectation-alignment": "low",
    "differentiation": "none",
    "value-perception": "medium",
    "ease-closing": "high",
    "client-control": "low",
    "charisma": "medium",
    "authority-behavioral": "low",
    "energy-flow": "high"
  }
}`;
  }

  try {
    // Construir array de conteúdo com texto + todas as imagens
    const messageContent: Array<{type: string; text?: string; image_url?: {url: string; detail: string}}> = [
      {
        type: 'text',
        text: prompt
      }
    ];

    // Adicionar todas as imagens
    images.forEach(base64Image => {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: base64Image,
          detail: 'high'
        }
      });
    });

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
            content: messageContent
          }
        ],
        max_tokens: mode === 'quick' ? 6000 : 16000,
        temperature: mode === 'quick' ? 0.5 : 0.7,
        response_format: { type: 'json_object' }
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

    // Verificar se a resposta é uma recusa/erro da IA
    if (!content.includes('{') || content.toLowerCase().includes("i'm sorry") || content.toLowerCase().includes("i cannot")) {
      throw new Error('A IA nao conseguiu analisar a imagem. Isso pode acontecer se a imagem contem conteudo sensivel, esta muito pequena/ilegivel, ou nao contem informacoes de vendas. Tente com outra imagem ou faca a analise manual.');
    }

    // Extrair JSON da resposta (pode vir com ```json ou texto antes/depois)
    let jsonContent = content;

    // Tentar extrair JSON de várias formas
    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonObjectMatch = content.match(/\{[\s\S]*\}/);

    if (jsonBlockMatch) {
      jsonContent = jsonBlockMatch[1];
      console.log('✂️ JSON extraído de bloco markdown');
    } else if (jsonObjectMatch) {
      jsonContent = jsonObjectMatch[0];
      console.log('✂️ JSON extraído do texto');
    } else {
      // Último recurso: tentar limpar texto antes/depois de { e }
      const startIndex = content.indexOf('{');
      const endIndex = content.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonContent = content.substring(startIndex, endIndex + 1);
        console.log('✂️ JSON extraído por índices de chaves');
      }
    }

    console.log('🔄 Tentando fazer parse do JSON...');
    let result: AIAnalysisResult;
    try {
      result = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Conteudo que tentou parsear:', jsonContent.substring(0, 1000));
      throw new Error('A resposta da IA nao esta no formato esperado. Isso pode ser um problema temporario da API. Tente novamente em alguns segundos.');
    }
    console.log('✅ Parse bem sucedido! Estrutura:', {
      hasScores: !!result.scores,
      hasObservations: !!result.observations,
      hasExplanations: !!result.explanations,
      numScores: Object.keys(result.scores || {}).length,
      numExplanations: Object.keys(result.explanations || {}).length
    });

    // Validar que todos os pilares foram avaliados
    const missingPillars = PILLARS_CONFIG.filter(
      p => !(p.id in result.scores) || !(p.id in result.observations) || !(p.id in result.explanations) || !(p.id in result.confidence)
    );

    if (missingPillars.length > 0) {
      console.warn('Pilares faltando na resposta da IA:', missingPillars);
      // Preencher pilares faltantes com valores neutros
      missingPillars.forEach(p => {
        if (!(p.id in result.scores)) result.scores[p.id] = 0;
        if (!(p.id in result.observations)) {
          result.observations[p.id] = 'Não avaliado';
        }
        if (!(p.id in result.explanations)) {
          result.explanations[p.id] = 'Não foi possível avaliar este pilar com base na imagem fornecida.';
        }
        if (!(p.id in result.confidence)) {
          result.confidence[p.id] = 'none';
        }
      });
    }

    console.log('Resultado da análise da IA:', result);
    console.log('📊 Pilares por confiança:', {
      high: Object.entries(result.confidence).filter(([, c]) => c === 'high').length,
      medium: Object.entries(result.confidence).filter(([, c]) => c === 'medium').length,
      low: Object.entries(result.confidence).filter(([, c]) => c === 'low').length,
      none: Object.entries(result.confidence).filter(([, c]) => c === 'none').length,
    });
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
