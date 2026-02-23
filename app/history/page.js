'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Calendar, User, Layout, Target, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function HistoryPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScript, setSelectedScript] = useState(null)
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
      await loadProjects(session.user.id)
    }
    checkUser()
  }, [])

  const loadProjects = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*, products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">Histórico de Projetos</h2>
          <p className="text-zinc-400">Todos os roteiros gerados</p>
        </div>

        {loading ? (
          <div className="text-zinc-400">Carregando...</div>
        ) : projects.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">Nenhum projeto encontrado</p>
              <Button
                onClick={() => router.push('/generator')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Criar Primeiro Roteiro
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zinc-100 mb-3">
                        {project.products?.name || 'Produto não encontrado'}
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-zinc-500">Personagem</div>
                            <div className="text-zinc-200 capitalize">{project.character}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Layout className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-zinc-500">Formato</div>
                            <div className="text-zinc-200">{project.format}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-zinc-500">Objetivo</div>
                            <div className="text-zinc-200 capitalize">{project.objective}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-zinc-500">Data</div>
                            <div className="text-zinc-200">{new Date(project.created_at).toLocaleDateString('pt-BR')}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedScript(project)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Roteiro
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Script Modal */}
      <Dialog open={!!selectedScript} onOpenChange={() => setSelectedScript(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedScript?.products?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedScript?.character} • {selectedScript?.format} • {selectedScript?.objective}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-zinc-800 rounded-lg p-6">
              <pre className="text-zinc-100 whitespace-pre-wrap font-sans">{selectedScript?.content}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}