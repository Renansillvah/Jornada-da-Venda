import { PILLARS_CONFIG } from '@/types/analysis';

export interface AIAnalysisResult {
  scores: Record<string, number>;
  observations: Record<string, string>;
  explanations: Record<string, string>; // Explicação detalhada do que foi visto
  confidence: Record<string, 'high' | 'medium' | 'low' | 'none'>; // Nível de confiança da análise
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
    "professionalism": "O QUE FOI VISTO: Na análise da conversa do WhatsApp Business, identifiquei diversos elementos que impactam diretamente a percepção de profissionalismo. Primeiro, o perfil utiliza foto pessoal informal ao invés de logo empresarial, o que já estabelece um tom não-corporativo desde o primeiro contato. Nas 8 mensagens trocadas, detectei uso recorrente de gírias e abreviações inadequadas para contexto B2B: 'blz' (2x), 'tmj' (1x), 'vlw' (1x), além de emojis excessivamente casuais (👍 usado 3x em propostas comerciais). A ausência total de assinatura profissional nas mensagens - sem nome completo, cargo, empresa ou informações de contato - agrava ainda mais essa impressão. O timing das respostas também chama atenção: mensagens enviadas às 23h47 e 00h15, sugerindo operação sem horário comercial definido. Por fim, a formatação das mensagens é completamente informal, com texto corrido sem parágrafos, ausência de pontuação adequada e linguagem que parece chat pessoal ao invés de comunicação empresarial estruturada. IMPACTO: Esses elementos combinados criam uma percepção devastadora de falta de profissionalismo que impacta diretamente na jornada de decisão do cliente de múltiplas formas. Primeiro, o uso de gírias e linguagem casual em contexto B2B faz o prospect questionar imediatamente se está lidando com uma empresa estruturada ou apenas um freelancer informal operando de forma amadora. Essa dúvida aumenta significativamente a percepção de risco sobre aspectos críticos como: suporte pós-venda (será que terei assistência adequada?), cumprimento de prazos (empresa sem estrutura consegue entregar?), e profissionalismo na execução do projeto (o resultado final terá qualidade enterprise?). Segundo, a ausência de assinatura profissional e identidade visual corporativa dificulta que o cliente 'visualize' a empresa como entidade sólida e confiável - há uma desconexão cognitiva entre o discurso de vendas e a experiência real de comunicação, gerando inconsistência que aumenta hesitação. Terceiro, mensagens fora do horário comercial e sem formatação adequada reforçam a imagem de operação 'one-man show' sem processos definidos, o que é particularmente problemático para clientes corporativos que precisam de fornecedores previsíveis e escaláveis. O resultado prático é que, mesmo que o produto/serviço oferecido seja tecnicamente excelente, o cliente corporativo hesita fortemente no fechamento pensando: 'Posso confiar meu projeto/orçamento a essa empresa? E se algo der errado, terei suporte adequado? Esta é uma empresa que meus superiores aprovarão como fornecedor?'. Estudos de psicologia de vendas B2B mostram que essa insegurança gerada por falta de profissionalismo percebido aumenta em até 60% o ciclo de decisão e reduz em 40% a taxa de conversão final, especialmente em vendas de ticket médio-alto (+R$5k) onde o risco percebido é maior. O QUE FAZER: 1. URGENTE - Migre HOJE para WhatsApp Business e configure identidade profissional completa (Impacto: +40% credibilidade imediata) - Ação específica: Baixe WhatsApp Business (gratuito), crie conta empresarial verificada, adicione logo da empresa como foto de perfil (300x300px, PNG com fundo transparente), configure nome empresarial exato (razão social), preencha todos os campos: descrição da empresa (50-100 palavras sobre o que faz), endereço físico se houver, horário de atendimento (ex: Seg-Sex 9h-18h), site, email corporativo, categorias de negócio. Por quê funciona: No primeiro contato, cliente vê imediatamente selo verde de verificação + logo profissional + informações estruturadas = percepção instantânea de empresa estabelecida ao invés de pessoa física. Resultado: Cliente pensa 'Ok, é uma empresa de verdade'. 2. Elimine 100% das gírias e implemente glossário de linguagem profissional-acessível (Impacto: +35% percepção de seriedade) - Crie documento interno com substituições: 'blz' → 'perfeito' ou 'entendido' | 'tmj' → 'conte conosco' | 'vlw' → 'obrigado pelo contato' | 'top' → 'excelente' | 'fechou?' → 'podemos prosseguir?' - Mantenha tom acessível mas corporativo: 'Entendi perfeitamente sua necessidade!' ao invés de 'saquei tudo blz' - Treine toda equipe comercial: envie o glossário, faça role-play de conversas antes/depois - Por quê funciona: Linguagem profissional = empresa séria aos olhos do cliente corporativo. Você pode ser acessível sem ser informal demais. Exemplo: 'Perfeito, vou preparar a proposta e envio ainda hoje!' comunica o mesmo que 'blz mando isso hj' mas com 300% mais profissionalismo percebido. 3. Implemente assinatura automática padronizada em TODAS as mensagens comerciais (Impacto: +30% autoridade e credibilidade) - Template obrigatório: [Nome Completo] | [Cargo] | [Nome da Empresa] | [Telefone com DDD] | [Email corporativo] | [Site opcional] - Exemplo: 'João Silva | Consultor de Projetos | TechSolutions Ltda | (11) 98765-4321 | joao@techsolutions.com.br' - Configure no WhatsApp Business como resposta rápida '/ass' para inserir rapidamente - Use SEMPRE ao: finalizar proposta, confirmar reunião, enviar qualquer documento importante - Por quê funciona: Cliente associa imediatamente a conversa a uma pessoa real com cargo definido dentro de estrutura organizacional. Aumenta accountability (responsabilização) e confiança. Bônus: facilita que cliente salve seu contato corretamente e repasse para outras pessoas da empresa dele. 4. Transforme TODA comunicação em blocos estruturados e formatados (Impacto: +25% clareza e percepção de organização) - Regra de ouro: NUNCA envie texto corrido de +3 linhas. Sempre use: quebras de linha, tópicos numerados, negrito para destaque (*texto em negrito*), emojis profissionais apenas para marcar seções (⚠️ atenção, ✅ confirmado, 📅 prazo) - Antes (ERRADO): 'oi td bem entao sobre o projeto vou te mandar proposta ate amanha e ai depois a gente ve os detalhes do cronograma e alinha os proximos passos blz qualquer coisa me chama' - Depois (CORRETO): 'Olá, [Nome]! Tudo bem?\n\nSobre o projeto [Nome do Projeto], seguem os próximos passos:\n\n1️⃣ *Proposta comercial*: envio até amanhã (15/03) às 17h\n2️⃣ *Reunião de alinhamento*: sugestão para quinta-feira 10h (aguardo sua confirmação)\n3️⃣ *Definição de cronograma*: após aprovação comercial\n\nAlguma dúvida sobre o processo?\n\n[Assinatura]' - Crie templates para situações recorrentes: primeiro contato, envio de proposta, follow-up, confirmação de reunião, encerramento - Por quê funciona: Formatação adequada = processos definidos = empresa organizada. Cliente vê que você tem método e clareza, não está 'improvisando' a conversa. Facilita leitura e tomada de decisão. Continue para mais 6 ações práticas...",
    "technical-clarity": "[Mesmo formato se houver dados, ou 'Não foi possível avaliar...' se confidence: none]",
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
        max_tokens: 16000,
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
