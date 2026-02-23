# 📋 PRÓXIMOS PASSOS - GUINA IA STUDIO

## ✅ Status Atual

A aplicação **GUINA IA STUDIO** foi criada com sucesso e está rodando! 🎉

- ✅ Frontend Next.js funcionando
- ✅ Interface de login configurada
- ✅ Tema escuro com detalhes âmbar
- ✅ OpenAI integrado (chave configurada)
- ⚠️ **PENDENTE:** Configuração do Supabase

## 🔧 O Que Você Precisa Fazer Agora

### 1️⃣ CONFIGURAR SUPABASE (OBRIGATÓRIO)

A aplicação foi desenvolvida mas precisa do Supabase configurado para funcionar completamente.

#### **Passo 1: Criar Projeto no Supabase**

1. Acesse https://supabase.com
2. Faça login ou crie uma conta gratuita
3. Clique em "New Project"
4. Preencha:
   - **Name**: `guina-ia-studio` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **GUARDE**
   - **Region**: Escolha "South America (São Paulo)" se disponível
5. Clique em "Create new project"
6. **Aguarde ~2 minutos** para o projeto ser criado

#### **Passo 2: Copiar Credenciais**

1. No projeto criado, vá em **Settings** (ícone ⚙️) → **API**
2. Copie os seguintes valores:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: (clique em "Reveal" para ver)
```

#### **Passo 3: Configurar Banco de Dados**

1. No Supabase, vá em **SQL Editor** (ícone 🗄️)
2. Clique em "New query"
3. **Cole o SQL abaixo** e execute:

```sql
-- Criar tabela de produtos
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

-- Criar tabela de roteiros
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

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Políticas para products
CREATE POLICY \"Users can view their own products\"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert their own products\"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update their own products\"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can delete their own products\"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para scripts
CREATE POLICY \"Users can view their own scripts\"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert their own scripts\"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update their own scripts\"
  ON scripts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can delete their own scripts\"
  ON scripts FOR DELETE
  USING (auth.uid() = user_id);
```

4. Clique em **"Run"** (ou F5)
5. Verifique se aparece "Success. No rows returned"

#### **Passo 4: Configurar Storage para Imagens**

1. No Supabase, vá em **Storage** (ícone 🗃️)
2. Clique em "Create a new bucket"
3. Configure:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **MARQUE esta opção**
4. Clique em "Create bucket"

#### **Passo 5: Atualizar Variáveis de Ambiente**

**IMPORTANTE:** Agora você precisa atualizar o arquivo `.env` com suas credenciais:

1. Edite o arquivo `/app/.env`
2. Substitua as linhas do Supabase com seus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Passo 6: Reiniciar Aplicação**

Após atualizar o `.env`, execute:

```bash
cd /app
sudo supervisorctl restart nextjs
```

---

## 🧪 Testar a Aplicação

Após configurar o Supabase:

### 1. **Criar Conta**
- Acesse a aplicação
- Clique em "Não tem conta? Cadastre-se"
- Use um email válido (você receberá email de confirmação)
- Após criar, confirme o email

### 2. **Fazer Login**
- Entre com email e senha
- Você será redirecionado para o Dashboard

### 3. **Cadastrar Produto**
- Clique em "Novo Produto"
- Preencha os dados:
  - Nome
  - Descrição
  - Link (opcional)
  - Categoria
  - Persona sugerida
  - Upload de imagem (opcional)
- Clique em "Cadastrar Produto"

### 4. **Gerar Roteiro**
- Clique em "Gerar Roteiro"
- Selecione:
  - Produto (que você acabou de cadastrar)
  - Personagem (Rafaela/Vico/Guina)
  - Formato (R6U/R7V/H1C)
  - Objetivo (Vendas/Branding/Review)
- Clique em "Gerar Roteiro"
- **Aguarde** ~10-30 segundos (a IA está trabalhando! 🤖)
- O roteiro aparecerá na tela

### 5. **Ver Histórico**
- Clique em "Histórico"
- Veja todos os roteiros gerados
- Clique em "Ver Roteiro" para visualizar detalhes

---

## 📚 Arquitetura da Aplicação

### **Páginas Criadas:**
- `/` - Login e cadastro
- `/dashboard` - Dashboard principal
- `/products/new` - Cadastro de produtos
- `/generator` - Gerador de roteiros com IA
- `/history` - Histórico de projetos

### **Personagens Disponíveis:**
- **Rafaela**: Energ ética e persuasiva (ideal para vendas)
- **Vico**: Jovem gamer descontraído (público jovem)
- **Guina**: Estratégico e analítico (corporativo)

### **Formatos:**
- **R6U**: 6 blocos curtos (vídeos rápidos)
- **R7V**: 7 blocos detalhados (estrutura completa)
- **H1C**: Formato contínuo narrativo (storytelling)

### **Objetivos:**
- **Vendas**: Foco em conversão
- **Branding**: Construção de marca
- **Review**: Análise de produto

---

## 🎨 Design

- **Tema**: Escuro (zinc-900/950)
- **Cor principal**: Âmbar (#f59e0b)
- **Estilo**: Minimalista e moderno
- **Componentes**: shadcn/ui + Tailwind CSS

---

## ⚙️ Tecnologias

- **Frontend**: Next.js 14 (App Router)
- **Backend**: API Routes do Next.js
- **Banco**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **IA**: OpenAI GPT-4 Mini
- **UI**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React

---

## 🐛 Troubleshooting

### ❌ Erro "Supabase não configurado"
**Solução:** Siga os passos acima para configurar o Supabase

### ❌ Erro ao criar conta
**Possível causa:** Bucket de imagens não foi criado ou não está público
**Solução:** Vá em Storage → product-images → Settings → marque "Public bucket"

### ❌ Erro ao gerar roteiro
**Possível causa 1:** Supabase não configurado corretamente
**Possível causa 2:** Problema com OpenAI (improvável, chave já configurada)
**Solução:** Verifique os logs: `tail -f /var/log/supervisor/nextjs.out.log`

### ❌ Não recebeu email de confirmação
**Solução:** Verifique spam ou use outro email. Em desenvolvimento, pode desabilitar confirmação em Supabase → Authentication → Settings

---

## 📞 Suporte

Para dúvidas sobre:
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **OpenAI**: https://platform.openai.com/docs

---

## ✨ Próximas Melhorias (V2)

Sugestões para futuras versões:
- [ ] Edição de roteiros gerados
- [ ] Exportação em PDF
- [ ] Mais personagens personalizáveis
- [ ] Análise de sentimento do roteiro
- [ ] Integração com ferramentas de vídeo
- [ ] Sugestões de imagens para o roteiro
- [ ] Cronômetro/timming por bloco
- [ ] Compartilhamento de roteiros

---

**Versão**: 1.0.0
**Status**: ✅ Pronto para uso (após configurar Supabase)
**Data**: Junho 2025
