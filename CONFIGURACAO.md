# 🔧 GUIA DE CONFIGURAÇÃO COMPLETO - GUINA IA STUDIO

## ✅ STATUS ATUAL

- ✅ Aplicação 100% funcional com MOCK
- ✅ Frontend completo (todas as páginas)
- ✅ Backend completo (API Routes)
- ✅ Gerador de roteiros com MOCK implementado
- ⚠️ Aguardando: Configuração Supabase + OpenAI (você)

---

## 📋 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### **No Emergent, configure estas ENV VARS:**

```bash
# SUPABASE (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OPENAI (OPCIONAL - sem ela usa MOCK)
OPENAI_API_KEY=sk-proj-...

# Já configuradas (NÃO MODIFICAR):
MONGO_URL=mongodb://localhost:27017/guinastudio
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **⚠️ NOMES EXATOS DAS VARIÁVEIS:**
- `NEXT_PUBLIC_SUPABASE_URL` (não SUPABASE_URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (não SUPABASE_ANON_KEY)
- `SUPABASE_SERVICE_ROLE_KEY` (esse não tem NEXT_PUBLIC)
- `OPENAI_API_KEY`

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### **1) Criar Projeto**
1. Acesse: https://supabase.com
2. Login/Cadastro
3. "New Project"
4. Nome: `guina-ia-studio`
5. Senha forte (GUARDE!)
6. Region: South America (São Paulo) se disponível
7. Aguarde ~2 minutos

### **2) Copiar Credenciais**
1. Settings (⚙️) → API
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (Reveal) → `SUPABASE_SERVICE_ROLE_KEY`

### **3) Executar SQL no Supabase**

**No Supabase:** SQL Editor → New Query

**COLE E EXECUTE ESTE SQL:**

```sql
-- ============================================
-- GUINA IA STUDIO - DATABASE SETUP
-- ============================================

-- 1. TABELA DE PRODUTOS
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

-- 2. TABELA DE ROTEIROS
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

-- 3. HABILITAR ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE SEGURANÇA - PRODUCTS
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

-- 5. POLÍTICAS DE SEGURANÇA - SCRIPTS
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

**Resultado esperado:** "Success. No rows returned"

### **4) Criar Bucket de Imagens**

**No Supabase:** Storage → Create Bucket

**Configurações:**
- **Nome do bucket:** `product-images` (EXATO, sem hífen diferente)
- **Public bucket:** ✅ MARCAR
- Clique em "Create bucket"

**⚠️ IMPORTANTE:** O código espera o bucket chamado exatamente `product-images`

---

## 🔑 CONFIGURAR NO EMERGENT

### **Onde colocar as variáveis:**

1. **No dashboard do Emergent**, vá em:
   - **Settings** ou **Configuration** ou **Environment Variables**
   - Procure por "Environment Variables" ou "Secrets"

2. **Adicione uma por uma:**
   ```
   Nome: NEXT_PUBLIC_SUPABASE_URL
   Valor: https://xxxxx.supabase.co
   
   Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Nome: SUPABASE_SERVICE_ROLE_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Nome: OPENAI_API_KEY
   Valor: sk-proj-... (sua chave)
   ```

3. **Após adicionar TODAS as variáveis:**
   - Salve/Apply
   - **Reinicie a aplicação** (restart ou redeploy)

---

## ✅ CHECKLIST FINAL DE TESTE

### **TESTE 1: HEALTH CHECK**
```bash
curl http://localhost:3000/api/
```
**Esperado:**
```json
{
  "message": "API Guina IA Studio funcionando!",
  "supabase_configured": true,
  "openai_configured": true
}
```

---

### **TESTE 2: CRIAR CONTA**
1. Acesse a aplicação
2. Clique em "Não tem conta? Cadastre-se"
3. Email: `seu@email.com`
4. Senha: `SenhaForte123!`
5. Clique em "Criar Conta"
6. **Verifique seu email** (pode ir para spam)
7. **Clique no link de confirmação**

---

### **TESTE 3: LOGIN**
1. Volte para a página inicial
2. Email: `seu@email.com`
3. Senha: `SenhaForte123!`
4. Clique em "Entrar"
5. **Esperado:** Redirecionar para Dashboard

---

### **TESTE 4: CADASTRAR PRODUTO**
1. No Dashboard, clique em **"Novo Produto"**
2. Preencha:
   - **Nome:** Smartphone XYZ Pro
   - **Descrição:** Smartphone top de linha com câmera de 108MP, 5G, bateria de 5000mAh
   - **Link:** https://exemplo.com/produto (opcional)
   - **Categoria:** Tecnologia
   - **Persona sugerida:** Rafaela
   - **Imagem:** Upload uma imagem (opcional)
3. Clique em **"Cadastrar Produto"**
4. **Esperado:** Mensagem de sucesso + redirecionar para Dashboard

---

### **TESTE 5: GERAR ROTEIRO (MOCK)**
1. No Dashboard, clique em **"Gerar Roteiro"**
2. Selecione:
   - **Produto:** Smartphone XYZ Pro
   - **Personagem:** Rafaela
   - **Formato:** R6U
   - **Objetivo:** Vendas
3. Clique em **"Gerar Roteiro"**
4. **Aguarde 2-5 segundos**
5. **Esperado:** Roteiro aparece na tela direita
6. **Verifique:** Deve ter aviso "⚠️ MOCK GERADO" no final

---

### **TESTE 6: VERIFICAR HISTÓRICO**
1. Clique em **"Histórico"**
2. **Esperado:** Ver o roteiro que você acabou de gerar
3. **Detalhes devem mostrar:**
   - Produto: Smartphone XYZ Pro
   - Personagem: Rafaela
   - Formato: R6U
   - Objetivo: Vendas
   - Data de criação
4. Clique em **"Ver Roteiro"**
5. **Esperado:** Modal abre com roteiro completo

---

### **TESTE 7: GERAR ROTEIRO COM OPENAI (SE CONFIGURADA)**
**⚠️ APENAS SE VOCÊ CONFIGUROU A CHAVE DA OPENAI**

1. Repita o TESTE 5
2. Mas desta vez teste com:
   - **Personagem:** Vico
   - **Formato:** H1C
   - **Objetivo:** Review
3. **Esperado:** 
   - Aguarde 10-30 segundos (OpenAI processando)
   - Roteiro **SEM** aviso de MOCK
   - Conteúdo mais elaborado e personalizado

---

### **TESTE 8: TESTAR TODOS OS FORMATOS**
Gere roteiros com cada combinação:

**Teste 8.1 - Rafaela + R6U + Vendas**
- Formato: 6 blocos curtos
- Tom: Enérgico

**Teste 8.2 - Vico + H1C + Review**
- Formato: Contínuo/Narrativo
- Tom: Descontraído

**Teste 8.3 - Guina + R7V + Branding**
- Formato: 7 blocos detalhados
- Tom: Analítico

---

## 🐛 TROUBLESHOOTING

### **Erro: "Supabase não configurado"**
✅ **Solução:** Verifique se as 3 variáveis de ambiente estão corretas
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### **Erro: "Cannot insert into table products"**
✅ **Solução:** 
1. Verifique se executou o SQL completo
2. Verifique se RLS está habilitado
3. Verifique se está logado (auth.uid() precisa existir)

### **Erro ao fazer upload de imagem**
✅ **Solução:**
1. Verifique se o bucket `product-images` existe
2. Verifique se o bucket está PÚBLICO
3. Storage → product-images → Settings → Public bucket ✅

### **Roteiro gerado está sempre MOCK**
✅ **Solução:**
1. Verifique se `OPENAI_API_KEY` está configurada
2. Chave deve começar com `sk-proj-` ou `sk-`
3. Reinicie a aplicação após adicionar a chave

### **Email de confirmação não chega**
✅ **Solução:**
1. Verifique spam/lixo eletrônico
2. Ou desabilite confirmação: Supabase → Authentication → Settings → "Enable email confirmations" → OFF

---

## 📊 VALIDAÇÃO COMPLETA

**Após todos os testes, você deve ter:**
- ✅ 1 conta criada e confirmada
- ✅ Login funcionando
- ✅ 1-3 produtos cadastrados
- ✅ 3-5 roteiros gerados (com MOCK ou OpenAI)
- ✅ Histórico mostrando todos os roteiros
- ✅ Imagens dos produtos aparecendo (se fez upload)

---

## 🎯 PRÓXIMOS PASSOS (Opcional)

Melhorias futuras:
- [ ] Edição de roteiros gerados
- [ ] Exportar roteiro em PDF
- [ ] Mais personagens customizados
- [ ] Sistema de templates
- [ ] Compartilhamento de roteiros
- [ ] Analytics de performance

---

## 📞 SUPORTE

**Documentação:**
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- OpenAI: https://platform.openai.com/docs

**Arquivos importantes:**
- `/app/.env` - Variáveis de ambiente
- `/app/README.md` - Documentação geral
- `/app/PROXIMOS_PASSOS.md` - Guia anterior
- `/app/CONFIGURACAO.md` - Este arquivo

---

**Versão:** 1.0.0 (MOCK Pronto)
**Status:** ✅ 100% Funcional (aguardando suas configurações)
**Data:** Junho 2025
