'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload } from 'lucide-react'

const CATEGORIAS = [
  'Tecnologia',
  'Moda',
  'Beleza',
  'Alimentos',
  'Saúde',
  'Educação',
  'Serviços',
  'Outros'
]

const PERSONAS = [
  { value: 'rafaela', label: 'Rafaela (Energética e Persuasiva)' },
  { value: 'vico', label: 'Vico (Jovem, Gamer, Descontraído)' },
  { value: 'guina', label: 'Guina (Estratégico e Analítico)' }
]

export default function NewProductPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    category: '',
    suggested_persona: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
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
    }
    checkUser()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''

      // Upload da imagem para o Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Inserir produto no banco
      const { error } = await supabase
        .from('products')
        .insert({
          ...formData,
          image_url: imageUrl,
          user_id: user.id
        })

      if (error) throw error

      alert('Produto cadastrado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto: ' + error.message)
    } finally {
      setLoading(false)
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Cadastrar Produto</h2>
            <p className="text-zinc-400">Preencha as informações do seu produto</p>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Informações do Produto</CardTitle>
              <CardDescription className="text-zinc-400">Dados básicos e características</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-200">Nome do Produto *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    placeholder="Ex: Smartphone XYZ Pro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-200">Descrição *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[100px]"
                    placeholder="Descreva as características principais do produto..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link" className="text-zinc-200">Link do Produto</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-zinc-200">Categoria *</Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {CATEGORIAS.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-zinc-100">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persona" className="text-zinc-200">Persona Sugerida *</Label>
                  <Select
                    required
                    value={formData.suggested_persona}
                    onValueChange={(value) => setFormData({ ...formData, suggested_persona: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione uma persona" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {PERSONAS.map((persona) => (
                        <SelectItem key={persona.value} value={persona.value} className="text-zinc-100">
                          {persona.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-zinc-200">Imagem do Produto</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}