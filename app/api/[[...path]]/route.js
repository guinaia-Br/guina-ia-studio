import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Inicializar Supabase com verificação
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
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
      const supabase = getSupabaseClient()
      if (!supabase) {
        return NextResponse.json(
          { error: 'Supabase não configurado. Consulte README.md' },
          { status: 503 }
        )
      }

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

      // Gerar roteiro com OpenAI
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

      const scriptContent = completion.choices[0].message.content

      // Salvar no banco
      const { data: script, error: dbError } = await supabase
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

      if (dbError) throw dbError

      return NextResponse.json({
        success: true,
        script
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