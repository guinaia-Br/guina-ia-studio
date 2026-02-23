'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Sparkles, FileText } from 'lucide-react'

const PERSONAGENS = [
  { value: 'rafaela', label: 'Rafaela', desc: 'Energética e Persuasiva' },
  { value: 'vico', label: 'Vico', desc: 'Jovem, Gamer, Descontraído' },
  { value: 'guina', label: 'Guina', desc: 'Estratégico e Analítico' }
]

const FORMATOS = [
  { value: 'R6U', label: 'R6U', desc: 'Roteiro em 6 blocos curtos para vídeo de vendas' },
  { value: 'R7V', label: 'R7V', desc: 'Roteiro em 7 blocos com estrutura detalhada' },
  { value: 'H1C', label: 'H1C', desc: 'Formato contínuo, narrativo, sem blocos' }
]

const OBJETIVOS = [
  { value: 'vendas', label: 'Vendas', desc: 'Foco em conversão e CTA forte' },
  { value: 'branding', label: 'Branding', desc: 'Construção de marca e autoridade' },
  { value: 'review', label: 'Review', desc: 'Análise detalhada do produto' }
]

export default function GeneratorPage() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    product_id: '',
    character: '',
    format: '',
    objective: ''
  })
  const [generatedScript, setGeneratedScript] = useState(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }
      setUser(session.user)
      await loadProducts(session.user.id)
    }
    checkUser()
  }, [])

  const loadProducts = async (userId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!formData.product_id || !formData.character || !formData.format || !formData.objective) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setGenerating(true)

    try {
      const selectedProduct = products.find(p => p.id === formData.product_id)
      
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          character: formData.character,
          format: formData.format,
          objective: formData.objective,
          user_id: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar roteiro')
      }

      setGeneratedScript(data.script)
      alert('Roteiro gerado com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar roteiro: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Gerador de Roteiros</h2>
            <p className="text-zinc-400">Configure e gere roteiros personalizados com IA</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">Configurações</CardTitle>
                <CardDescription className="text-zinc-400">Selecione as opções para o roteiro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-200">Produto *</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="text-zinc-100">
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {products.length === 0 && !loading && (
                    <p className="text-sm text-amber-500">Nenhum produto cadastrado. <a href="/products/new" className="underline">Cadastre um produto</a></p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-200">Personagem *</Label>
                  <Select
                    value={formData.character}
                    onValueChange={(value) => setFormData({ ...formData, character: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um personagem" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {PERSONAGENS.map((char) => (
                        <SelectItem key={char.value} value={char.value} className="text-zinc-100">
                          <div>
                            <div className="font-semibold">{char.label}</div>
                            <div className="text-xs text-zinc-400">{char.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-200">Formato *</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => setFormData({ ...formData, format: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {FORMATOS.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value} className="text-zinc-100">
                          <div>
                            <div className="font-semibold">{fmt.label}</div>
                            <div className="text-xs text-zinc-400">{fmt.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-200">Objetivo *</Label>
                  <Select
                    value={formData.objective}
                    onValueChange={(value) => setFormData({ ...formData, objective: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {OBJETIVOS.map((obj) => (
                        <SelectItem key={obj.value} value={obj.value} className="text-zinc-100">
                          <div>
                            <div className="font-semibold">{obj.label}</div>
                            <div className="text-xs text-zinc-400">{obj.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {generating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Gerando Roteiro...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Roteiro
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">Roteiro Gerado</CardTitle>
                <CardDescription className="text-zinc-400">
                  {generatedScript ? 'Seu roteiro está pronto!' : 'Configure e clique em Gerar Roteiro'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                      <pre className="text-zinc-100 text-sm whitespace-pre-wrap font-sans">{generatedScript.content}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push('/history')}
                        variant="outline"
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver no Histórico
                      </Button>
                      <Button
                        onClick={() => setGeneratedScript(null)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Novo Roteiro
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-zinc-700 mb-4" />
                    <p className="text-zinc-500">Nenhum roteiro gerado ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}