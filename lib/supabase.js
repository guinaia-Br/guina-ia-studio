import { createClient } from '@supabase/supabase-js'

export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    console.warn('⚠️ Supabase credentials not configured. Please check README.md for setup instructions.')
    // Return a mock client para não quebrar a aplicação
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signUp: async () => ({ data: null, error: { message: 'Supabase não configurado. Veja README.md' } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase não configurado. Veja README.md' } }),
        signOut: async () => ({ error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null })
            }),
            order: () => Promise.resolve({ data: [], error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase não configurado' } })
          })
        })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    }
  }

  return createClient(supabaseUrl, supabaseKey)
}

