# ✅ Checklist - GitHub & Vercel Deploy

## 📦 Arquivos Criados/Atualizados

- ✅ `.gitignore` - Ignora arquivos sensíveis e desnecessários
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `README.md` - Documentação completa do projeto
- ✅ `DEPLOY_VERCEL.md` - Guia passo-a-passo de deploy
- ✅ `GITHUB_SETUP.md` - Instruções para GitHub
- ✅ `vercel.json` - Configuração do Vercel
- ✅ Queries otimizadas (`.limit(100)`)
- ✅ Removidos arquivos Emergent-specific

## 🚀 Próximos Passos

### 1️⃣ Execute o SQL no Supabase

**IMPORTANTE:** Você ainda precisa fazer isso!

1. Acesse: https://supabase.com/dashboard/project/kupowtlvcskxdldcjdpl
2. Vá em **SQL Editor** → **New Query**
3. Cole e execute o SQL completo (está em `DEPLOY_VERCEL.md` ou abaixo)
4. Crie o bucket `product-images` (público)

<details>
<summary>📄 Clique para ver o SQL</summary>

```sql
-- Criar tabelas
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT,
  category TEXT NOT NULL,
  suggested_persona TEXT NOT NULL,
  image_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  character TEXT NOT NULL,
  format TEXT NOT NULL,
  objective TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON products FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scripts" ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scripts" ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scripts" ON scripts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scripts" ON scripts FOR DELETE USING (auth.uid() = user_id);
```

</details>

### 2️⃣ Push para GitHub

```bash
cd /app

# Inicializar Git
git init
git add .
git commit -m "feat: Initial commit - Guina IA Studio MVP"

# Criar repositório no GitHub (via web interface)
# Depois adicionar remote:
git remote add origin https://github.com/SEU_USERNAME/guina-ia-studio.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy no Vercel

1. Acesse: https://vercel.com/new
2. Importe o repositório do GitHub
3. Configure as **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://kupowtlvcskxdldcjdpl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cG93dHZsY3NreGRsZGNqZHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTQ0OTcsImV4cCI6MjA4NzQzMDQ5N30.t5Sth3Xch6KXqz6Fo9WFLoixVzQyksxMKx2jGrx4dh4
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cG93dHZsY3NreGRsZGNqZHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1NDQ5NywiZXhwIjoyMDg3NDMwNDk3fQ.yI9D0k-RVrUrpPJOaYGxXoSuCfU3BdE5KnVeZHhjtEo
   ```
4. Clique em **Deploy**
5. Aguarde ~2 minutos

### 4️⃣ Configurar Redirect URL

1. Volte ao Supabase
2. **Authentication** → **URL Configuration**
3. Adicione: `https://seu-app.vercel.app/*`

### 5️⃣ Testar

- ✅ Criar conta
- ✅ Fazer login
- ✅ Cadastrar produto
- ✅ Gerar roteiro (MOCK)
- ✅ Ver histórico

## 📚 Documentação Disponível

- `README.md` - Documentação principal
- `DEPLOY_VERCEL.md` - Guia completo de deploy (⭐ LEIA ESTE)
- `GITHUB_SETUP.md` - Setup do Git/GitHub
- `.env.example` - Template de configuração

## 🎯 Status Atual

### ✅ Pronto
- Código production-ready
- Queries otimizadas
- UI completa e funcional
- Supabase configurado localmente
- MOCK funcionando
- Documentação completa
- Estrutura GitHub pronta

### ⚠️ Pendente (você precisa fazer)
- [ ] Executar SQL no Supabase
- [ ] Criar bucket `product-images`
- [ ] Push para GitHub
- [ ] Deploy no Vercel
- [ ] Configurar redirect URLs
- [ ] (Opcional) Adicionar OPENAI_API_KEY

## 🎉 Resultado Final

Após completar os passos acima, você terá:
- ✅ Repositório público/privado no GitHub
- ✅ Aplicação no ar no Vercel
- ✅ SSL/HTTPS automático
- ✅ Deploy automático a cada push
- ✅ URL personalizada disponível

## 💡 Dicas

### Domínio Customizado
No Vercel: Settings → Domains → Adicionar seu domínio

### CI/CD Automático
Já configurado! Cada push no GitHub = deploy automático no Vercel

### Logs e Monitoramento
- Vercel: Dashboard → Analytics
- Supabase: Dashboard → Logs

### Custos
- GitHub: Gratuito
- Vercel: Gratuito (Hobby Plan)
- Supabase: Gratuito (Free Plan)
- **Total: $0/mês** (usando MOCK)

## 🆘 Precisa de Ajuda?

Consulte:
- `DEPLOY_VERCEL.md` - Troubleshooting completo
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Pronto para começar?** Siga os passos acima! 🚀
