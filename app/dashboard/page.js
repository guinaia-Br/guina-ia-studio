'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, FileText, History, Package, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

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
        .limit(5)
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500">GUINA IA STUDIO</h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">Dashboard</h2>
          <p className="text-zinc-400">Gerencie seus produtos e roteiros</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            className="bg-zinc-900 border-zinc-800 hover:border-amber-600 transition-colors cursor-pointer"
            onClick={() => router.push('/products/new')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-lg">
                  <Package className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-zinc-100">Novo Produto</CardTitle>
                  <CardDescription className="text-zinc-400">Cadastrar produto</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 hover:border-amber-600 transition-colors cursor-pointer"
            onClick={() => router.push('/generator')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-lg">
                  <FileText className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-zinc-100">Gerar Roteiro</CardTitle>
                  <CardDescription className="text-zinc-400">Criar com IA</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 hover:border-amber-600 transition-colors cursor-pointer"
            onClick={() => router.push('/history')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-lg">
                  <History className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-zinc-100">Histórico</CardTitle>
                  <CardDescription className="text-zinc-400">Ver projetos</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <h3 className="text-xl font-bold text-zinc-100 mb-4">Projetos Recentes</h3>
          {loading ? (
            <div className="text-zinc-400">Carregando...</div>
          ) : projects.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="py-8 text-center">
                <p className="text-zinc-400">Nenhum projeto criado ainda.</p>
                <Button
                  onClick={() => router.push('/generator')}
                  className="mt-4 bg-amber-600 hover:bg-amber-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar Primeiro Roteiro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-zinc-100">{project.products?.name || 'Produto não encontrado'}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                          <span>Personagem: <span className="text-amber-500">{project.character}</span></span>
                          <span>Formato: <span className="text-amber-500">{project.format}</span></span>
                          <span>Objetivo: <span className="text-amber-500">{project.objective}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-500">{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}