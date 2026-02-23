# 🚀 Deploy no Vercel - Guia Completo

## Pré-requisitos

- ✅ Conta GitHub
- ✅ Conta Vercel (gratuita)
- ✅ Conta Supabase (gratuita)
- ⚠️ Chave OpenAI (opcional)

---

## Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Configuração:
   - **Name:** `guina-ia-studio`
   - **Database Password:** (senha forte)
   - **Region:** South America (São Paulo)
4. Aguarde ~2 minutos

### 1.2 Executar SQL

1. Vá em **SQL Editor** (ícone 🗄️)
2. Clique em **New Query**
3. Cole o SQL abaixo:

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

-- Políticas de acesso
CREATE POLICY "Users can view their own products" 
  ON products FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" 
  ON products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
  ON products FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
  ON products FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scripts" 
  ON scripts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scripts" 
  ON scripts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scripts" 
  ON scripts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scripts" 
  ON scripts FOR DELETE 
  USING (auth.uid() = user_id);
```

4. Clique em **Run** (ou F5)
5. Verifique: "Success. No rows returned"

### 1.3 Criar Bucket

1. Vá em **Storage** (ícone 🗃️)
2. Clique em **Create Bucket**
3. Configuração:
   - **Name:** `product-images`
   - **Public bucket:** ✅ SIM
4. Clique em **Create bucket**

### 1.4 Copiar Credenciais

1. Vá em **Settings** → **API**
2. Copie e salve:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Passo 2: Preparar GitHub

### 2.1 Criar Repositório

```bash
# No diretório do projeto
git init
git add .
git commit -m "Initial commit - Guina IA Studio"

# Criar repositório no GitHub (via interface web)
# Depois:
git remote add origin https://github.com/SEU_USERNAME/guina-ia-studio.git
git branch -M main
git push -u origin main
```

---

## Passo 3: Deploy no Vercel

### 3.1 Importar Projeto

1. Acesse: https://vercel.com/new
2. Clique em **Import Git Repository**
3. Selecione seu repositório `guina-ia-studio`
4. Framework Preset: **Next.js** (auto-detectado)

### 3.2 Configurar Environment Variables

Clique em **Environment Variables** e adicione:

```bash
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (OPCIONAL - sem isso usa MOCK)
OPENAI_API_KEY=sk-proj-...
```

**⚠️ IMPORTANTE:**
- Copie as chaves EXATAS do Supabase
- `NEXT_PUBLIC_SUPABASE_URL` começa com `https://`
- As keys começam com `eyJ...`

### 3.3 Deploy

1. Clique em **Deploy**
2. Aguarde ~2-3 minutos
3. ✅ Deploy completo!
4. Anote sua URL: `https://seu-app.vercel.app`

---

## Passo 4: Configurar Auth Redirect

### 4.1 Adicionar URL no Supabase

1. Volte ao Supabase Dashboard
2. Vá em **Authentication** → **URL Configuration**
3. Em **Redirect URLs**, adicione:
   ```
   https://seu-app.vercel.app/*
   https://seu-app.vercel.app/dashboard
   ```
4. Salve

---

## Passo 5: Testar Aplicação

### 5.1 Criar Conta

1. Acesse: `https://seu-app.vercel.app`
2. Clique em "Não tem conta? Cadastre-se"
3. Email + Senha
4. **Verifique seu email** (pode ir para spam)
5. Clique no link de confirmação

### 5.2 Fazer Login

1. Volte para a aplicação
2. Entre com email e senha
3. Deve redirecionar para o Dashboard

### 5.3 Cadastrar Produto

1. Clique em "Novo Produto"
2. Preencha:
   - Nome: Teste
   - Descrição: Produto de teste
   - Categoria: Tecnologia
   - Persona: Rafaela
3. Upload imagem (opcional)
4. Cadastrar

### 5.4 Gerar Roteiro

1. Clique em "Gerar Roteiro"
2. Selecione:
   - Produto: Teste
   - Personagem: Rafaela
   - Formato: R6U
   - Objetivo: Vendas
3. Clique em "Gerar Roteiro"
4. Aguarde 5-30 segundos
5. Roteiro aparece na tela

### 5.5 Ver Histórico

1. Clique em "Histórico"
2. Veja todos os roteiros
3. Clique em "Ver Roteiro"

---

## 🎉 Pronto!

Sua aplicação está no ar em:
`https://seu-app.vercel.app`

---

## 🔧 Atualizações

Para atualizar a aplicação:

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

O Vercel faz **deploy automático** a cada push!

---

## 🐛 Problemas Comuns

### Erro: "Invalid supabaseUrl"
**Solução:** Verifique se `NEXT_PUBLIC_SUPABASE_URL` está correta

### Erro: "Cannot insert into products"
**Solução:** Execute o SQL completo no Supabase

### Erro ao fazer upload
**Solução:** Verifique se o bucket `product-images` é PÚBLICO

### Email de confirmação não chega
**Solução:** 
1. Verifique spam
2. Ou desabilite confirmação: Supabase → Authentication → Settings → "Enable email confirmations" → OFF

### Roteiro sempre MOCK
**Solução:** Adicione `OPENAI_API_KEY` nas environment variables do Vercel

---

## 📊 Monitoramento

### Vercel Analytics
- Acesse: Vercel Dashboard → seu projeto → Analytics
- Veja: Visitas, performance, erros

### Supabase Logs
- Acesse: Supabase → Logs
- Veja: Database queries, Auth events

---

## 💰 Custos

### Vercel (Hobby Plan - GRÁTIS)
- ✅ 100GB bandwidth/mês
- ✅ Deploy ilimitados
- ✅ HTTPS automático
- ✅ Custom domain

### Supabase (Free Plan - GRÁTIS)
- ✅ 500MB database
- ✅ 1GB storage
- ✅ 50.000 usuários ativos/mês
- ✅ Unlimited API requests

### OpenAI (Pay-as-you-go)
- GPT-4 Mini: ~$0.15 / 1M tokens
- Estimativa: $0.01-0.05 por roteiro

**Total para MVP: $0/mês** (usando MOCK)

---

## 🔐 Segurança

### Checklist
- ✅ Row Level Security habilitado
- ✅ API keys em environment variables
- ✅ HTTPS automático (Vercel)
- ✅ Auth com email verification
- ✅ CORS configurado

---

## 🚀 Performance

### Otimizações Aplicadas
- ✅ Queries com `.limit(100)`
- ✅ Next.js SSR/SSG
- ✅ Vercel Edge Network
- ✅ Supabase CDN

---

**Dúvidas?** Abra uma [issue no GitHub](https://github.com/SEU_USERNAME/guina-ia-studio/issues)