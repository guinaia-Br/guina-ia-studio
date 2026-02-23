import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Inicializar OpenAI apenas se a chave estiver configurada
let openai = null
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_')) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

// Inicializar Supabase com verificação
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Função para gerar roteiro MOCK (sem IA)
function generateMockScript(product, character, format, objective) {
  const characterStyles = {
    rafaela: {
      tone: 'ENERGÉTICA E PERSUASIVA',
      intro: 'Olááá, pessoal! É a Rafaela aqui e hoje eu trouxe uma NOVIDADE INCRÍVEL pra vocês!',
      cta: 'Então não perde tempo! Corre lá, garante o seu e me conta nos comentários o que você achou! 🔥'
    },
    vico: {
      tone: 'DESCONTRAÍDO E GAMER',
      intro: 'E aí, galera! Vico na área! Bora falar de um negócio que tá bombando...',
      cta: 'Então é isso, galera! Se gostou, já sabe: deixa o like e compartilha com a tropa! Vlw, flw! 🎮'
    },
    guina: {
      tone: 'ANALÍTICO E ESTRATÉGICO',
      intro: 'Olá, sou Guina. Hoje vamos analisar estrategicamente um produto que pode fazer diferença no seu negócio.',
      cta: 'Analise esses pontos e tome sua decisão de forma fundamentada. Até a próxima! 📊'
    }
  }

  const style = characterStyles[character]
  const productName = product.name
  const productDesc = product.description

  if (format === 'R6U') {
    return `🎬 ROTEIRO DE VÍDEO - FORMATO R6U (6 BLOCOS)
Personagem: ${character.toUpperCase()} (${style.tone})
Produto: ${productName}
Objetivo: ${objective.toUpperCase()}

─────────────────────────────────────────

📍 BLOCO 1 - GANCHO INICIAL (5-10 segundos)
${style.intro}
Você já se perguntou como melhorar [problema específico]?

📍 BLOCO 2 - PROBLEMA (10-15 segundos)
Muita gente sofre com isso todo dia. Perda de tempo, frustração, resultados abaixo do esperado...
Mas e se eu te disser que existe uma solução?

📍 BLOCO 3 - APRESENTAÇÃO DO PRODUTO (15-20 segundos)
Apresento o ${productName}!
${productDesc}

📍 BLOCO 4 - BENEFÍCIOS (20-25 segundos)
Com ele você vai:
✓ Economizar tempo
✓ Ter resultados melhores
✓ Simplificar seu dia a dia
✓ Estar sempre um passo à frente

📍 BLOCO 5 - PROVA SOCIAL (10-15 segundos)
Já são milhares de pessoas usando e aprovando!
Os resultados falam por si: satisfação garantida!

📍 BLOCO 6 - CTA FINAL (10-15 segundos)
${style.cta}

─────────────────────────────────────────
⚠️ MOCK GERADO - Configure OPENAI_API_KEY para usar IA real
Tempo total estimado: 70-100 segundos`
  } else if (format === 'R7V') {
    return `🎬 ROTEIRO DE VÍDEO - FORMATO R7V (7 BLOCOS DETALHADOS)
Personagem: ${character.toUpperCase()} (${style.tone})
Produto: ${productName}
Objetivo: ${objective.toUpperCase()}

─────────────────────────────────────────

📍 BLOCO 1 - GANCHO INICIAL
${style.intro}
Hoje o assunto é sério e vai mudar sua forma de encarar [situação].

📍 BLOCO 2 - DESENVOLVIMENTO DO PROBLEMA
Vamos falar a verdade: o mercado está cada vez mais competitivo.
Se você não se atualiza, fica para trás.
E o pior: muitas soluções prometem muito e entregam pouco.

📍 BLOCO 3 - TRANSIÇÃO
Mas existe uma forma diferente de fazer isso.
Uma solução que realmente funciona.
E eu vou te mostrar agora.

📍 BLOCO 4 - APRESENTAÇÃO COMPLETA
${productName}
${productDesc}

Isso mesmo! Um produto pensado para resolver EXATAMENTE esse problema.

📍 BLOCO 5 - BENEFÍCIOS E TRANSFORMAÇÃO
Imagina o seguinte cenário:
→ Você acorda e já está um passo à frente
→ Seus resultados melhoram consistentemente
→ Você economiza tempo e dinheiro
→ E ainda se destaca da concorrência

Tudo isso é possível!

📍 BLOCO 6 - PROVA E CREDIBILIDADE
Não é só promessa. Os números comprovam:
• Milhares de usuários satisfeitos
• Resultados comprovados
• Tecnologia de ponta
• Suporte dedicado

📍 BLOCO 7 - CTA FINAL FORTE
${style.cta}

─────────────────────────────────────────
⚠️ MOCK GERADO - Configure OPENAI_API_KEY para usar IA real
Tempo total estimado: 90-120 segundos`
  } else { // H1C
    return `🎬 ROTEIRO DE VÍDEO - FORMATO H1C (CONTÍNUO/NARRATIVO)
Personagem: ${character.toUpperCase()} (${style.tone})
Produto: ${productName}
Objetivo: ${objective.toUpperCase()}

─────────────────────────────────────────

${style.intro}

Sabe aquela sensação de que você poderia estar fazendo mais, mas algo sempre trava? Eu sei exatamente como é. Já passei por isso. E foi nessa busca por uma solução real que eu descobri algo que mudou completamente o jogo.

Deixa eu te contar uma história. Tem muita gente por aí tentando resolver problemas do dia a dia com ferramentas antigas, métodos ultrapassados. E o resultado? Frustração, tempo perdido e aquela sensação de que poderia ser melhor.

Foi pensando nisso que conheci o ${productName}. E olha, eu vou ser sincero: no começo eu também era cético. Mas quando eu vi que ${productDesc}, eu pensei: "Isso aqui é diferente."

Testei. Aprovei. E agora uso no meu dia a dia. A diferença? É absurda. Antes eu perdia tempo com [problema], agora eu foco no que realmente importa. Antes era complicado, agora é simples. Antes eu tinha dúvidas, agora eu tenho certeza.

E não sou só eu. São milhares de pessoas que descobriram que existe uma forma melhor de fazer as coisas. Uma forma mais inteligente, mais eficiente, mais prática.

O segredo está em usar a ferramenta certa. E essa ferramenta é ${productName}. Porque não adianta só ter vontade, tem que ter o recurso certo. E esse recurso está aqui, disponível, pronto para transformar sua realidade.

${style.cta}

─────────────────────────────────────────
⚠️ MOCK GERADO - Configure OPENAI_API_KEY para usar IA real
Tempo total estimado: 60-90 segundos (narrativo contínuo)`
  }
}

// Função auxiliar para criar prompts personalizados
function createScriptPrompt(product, character, format, objective) {
  // Definir estilo do personagem
  const characterStyles = {
    rafaela: 'Você é Rafaela, uma apresentadora energética e persuasiva. Use linguagem vibrante, empolgante e motivadora. Seja carismática e convincente.',
    vico: 'Você é Vico, um jovem gamer descontraído. Use linguagem casual, gírias moderadas e referências à cultura pop. Seja autêntico e divertido.',
    guina: 'Você é Guina, um estrategista analítico. Use linguagem profissional, dados concretos e argumentos lógicos. Seja objetivo e persuasivo.'
  }

  // Definir estrutura do formato
  const formatStructures = {
    R6U: `Estruture o roteiro em 6 BLOCOS CURTOS:

BLOCO 1 - GANCHO INICIAL (5-10 segundos)
BLOCO 2 - PROBLEMA/DOR (10-15 segundos)
BLOCO 3 - APRESENTAÇÃO DO PRODUTO (15-20 segundos)
BLOCO 4 - BENEFÍCIOS PRINCIPAIS (20-25 segundos)
BLOCO 5 - PROVA SOCIAL/ARGUMENTO (10-15 segundos)
BLOCO 6 - CTA FINAL (10-15 segundos)`,
    
    R7V: `Estruture o roteiro em 7 BLOCOS DETALHADOS:

BLOCO 1 - GANCHO INICIAL (contexto e atenção)
BLOCO 2 - DESENVOLVIMENTO (problema expandido)
BLOCO 3 - TRANSIÇÃO (ponte para solução)
BLOCO 4 - APRESENTAÇÃO DO PRODUTO (características)
BLOCO 5 - BENEFÍCIOS E TRANSFORMAÇÃO (impacto)
BLOCO 6 - PROVA E CREDIBILIDADE (argumentos)
BLOCO 7 - CTA FINAL (call-to-action forte)`,
    
    H1C: `Crie um roteiro CONTÍNUO E NARRATIVO sem divisão em blocos.

O roteiro deve fluir naturalmente seguindo esta ordem:
- Abertura impactante
- Desenvolvimento da história/problema
- Apresentação natural do produto
- Benefícios integrados à narrativa
- Argumentos e provas sociais
- Fechamento com CTA forte

Sem marcações de blocos, apenas um texto corrido e envolvente.`
  }

  // Definir objetivo da campanha
  const objectiveGuidance = {
    vendas: 'FOCO EM VENDAS: Use gatilhos de escassez, urgência e valor. CTA deve ser direto: comprar, adquirir, aproveitar oferta. Enfatize benefícios práticos e ROI.',
    branding: 'FOCO EM BRANDING: Construa autoridade e conexão emocional. CTA deve ser: conhecer mais, seguir, se conectar. Enfatize valores, missão e diferencial da marca.',
    review: 'FOCO EM REVIEW: Análise honesta e detalhada. CTA deve ser: experimentar, testar, conhecer. Enfatize prós e contras de forma equilibrada mas positiva.'
  }

  return `${characterStyles[character]}

${objectiveGuidance[objective]}

PRODUTO:
Nome: ${product.name}
Descrição: ${product.description}
Categoria: ${product.category}
${product.link ? `Link: ${product.link}` : ''}

FORMATO DO ROTEIRO:
${formatStructures[format]}

CRIE UM ROTEIRO COMPLETO E DETALHADO seguindo exatamente a estrutura do formato ${format}.
Seja específico com o produto mencionado.
Mantenha o tom de voz do personagem ${character}.
Gere um roteiro pronto para ser usado, com timing e direção emocional.`
}

// POST /api/generate-script
export async function POST(request) {
  try {
    const { pathname } = new URL(request.url)

    // Rota: Gerar Roteiro
    if (pathname === '/api/generate-script') {
      const body = await request.json()
      const { product, character, format, objective, user_id } = body

      // Validar dados
      if (!product || !character || !format || !objective || !user_id) {
        return NextResponse.json(
          { error: 'Dados incompletos' },
          { status: 400 }
        )
      }

      // Criar prompt personalizado
      const prompt = createScriptPrompt(product, character, format, objective)

      // Gerar roteiro (MOCK ou OpenAI)
      let scriptContent
      
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('emergent')) {
        // MOCK - Gerar roteiro simulado
        scriptContent = generateMockScript(product, character, format, objective)
      } else {
        // OpenAI REAL
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em criação de roteiros para vídeos de marketing e vendas. Crie roteiros persuasivos, envolventes e prontos para uso.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
        scriptContent = completion.choices[0].message.content
      }

      // Tentar salvar no banco se Supabase estiver configurado
      const supabase = getSupabaseClient()
      let script = null
      let dbError = null

      if (supabase) {
        const { data: savedScript, error } = await supabase
          .from('scripts')
          .insert({
            product_id: product.id,
            character,
            format,
            objective,
            content: scriptContent,
            status: 'completed',
            user_id
          })
          .select()
          .single()

        script = savedScript
        dbError = error
      } else {
        // Mock script object when Supabase is not configured
        script = {
          id: `mock-${Date.now()}`,
          product_id: product.id,
          character,
          format,
          objective,
          content: scriptContent,
          status: 'completed',
          user_id,
          created_at: new Date().toISOString()
        }
      }

      return NextResponse.json({
        success: true,
        script,
        supabase_configured: !!supabase,
        saved_to_database: !!supabase && !dbError,
        database_error: dbError?.message || null
      })
    }

    return NextResponse.json(
      { error: 'Rota não encontrada' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  return NextResponse.json({ 
    message: 'API Guina IA Studio funcionando!',
    supabase_configured: !!getSupabaseClient(),
    openai_configured: !!process.env.OPENAI_API_KEY
  })
}