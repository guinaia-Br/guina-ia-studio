# 🎯 RESUMO RÁPIDO - GUINA IA STUDIO

## ✅ PRONTO PARA USAR (COM MOCK)

Aplicação 100% funcional! Gerador de roteiros funciona com MOCK (sem IA real).

---

## 🔑 VARIÁVEIS DE AMBIENTE - NOMES EXATOS

**Configure no Emergent (Environment Variables / Secrets):**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-... (opcional - sem ela usa MOCK)
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_SUPABASE_URL` ← tem NEXT_PUBLIC
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← tem NEXT_PUBLIC  
- `SUPABASE_SERVICE_ROLE_KEY` ← NÃO tem NEXT_PUBLIC
- Após adicionar, **REINICIE a aplicação**

---

## 📦 SQL PARA EXECUTAR NO SUPABASE

**No Supabase:** SQL Editor → New Query → Cole isto:

```sql
-- TABELAS
CREATE TABLE products (
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

CREATE TABLE scripts (
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

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS
CREATE POLICY "Users can view their own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON products FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scripts" ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scripts" ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scripts" ON scripts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scripts" ON scripts FOR DELETE USING (auth.uid() = user_id);
```

---

## 🗃️ BUCKET DE IMAGENS

**No Supabase:** Storage → Create Bucket

- **Nome:** `product-images` (exato)
- **Public:** ✅ SIM

---

## ✅ CHECKLIST DE TESTE

1. **Criar conta** → Confirmar email
2. **Login** → Dashboard
3. **Cadastrar produto** → Nome, descrição, categoria, persona, imagem
4. **Gerar roteiro** → Selecionar produto, personagem, formato, objetivo
5. **Ver histórico** → Verificar roteiro salvo

---

## 📁 ARQUIVOS IMPORTANTES

- `/app/CONFIGURACAO.md` ← Guia completo detalhado
- `/app/README.md` ← Documentação geral
- `/app/.env` ← Configurar variáveis aqui (local) ou no Emergent

---

## 🎭 PERSONAGENS E FORMATOS

**Personagens:**
- **Rafaela** - Energética e persuasiva
- **Vico** - Jovem gamer descontraído
- **Guina** - Estratégico e analítico

**Formatos:**
- **R6U** - 6 blocos curtos
- **R7V** - 7 blocos detalhados
- **H1C** - Contínuo narrativo

**Objetivos:**
- **Vendas** - Conversão e CTA forte
- **Branding** - Construção de marca
- **Review** - Análise de produto

---

## 🐛 PROBLEMAS COMUNS

**"Supabase não configurado"**
→ Verifique as 3 ENV VARS e reinicie app

**"Cannot insert into products"**
→ Execute o SQL completo no Supabase

**Erro ao fazer upload**
→ Bucket `product-images` deve ser PÚBLICO

**Roteiro sempre MOCK**
→ Adicione `OPENAI_API_KEY` e reinicie

---

**Status:** ✅ Funcionando com MOCK
**Próximo passo:** Você configurar Supabase + OpenAI
