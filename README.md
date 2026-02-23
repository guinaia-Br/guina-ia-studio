# 🎬 GUINA IA STUDIO

> Gerador de roteiros para vídeos com Inteligência Artificial

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-blue?logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Características

- 🤖 **Geração de roteiros com IA** (OpenAI GPT-4 Mini ou MOCK)
- 🎭 **3 Personagens únicos**: Rafaela (energética), Vico (gamer), Guina (analítico)
- 📝 **3 Formatos**: R6U (6 blocos), R7V (7 blocos), H1C (narrativo)
- 🎯 **3 Objetivos**: Vendas, Branding, Review
- 🔐 **Autenticação segura** com Supabase Auth
- 📦 **Cadastro de produtos** com upload de imagens
- 📊 **Histórico completo** de roteiros gerados
- 🎨 **Design moderno** (tema escuro + detalhes âmbar)

## 🚀 Deploy Rápido no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USERNAME/guina-ia-studio)

### Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Conta no [Supabase](https://supabase.com) (gratuita)
3. (Opcional) Chave da [OpenAI](https://platform.openai.com/api-keys)

### Passo a Passo

#### 1. Configure o Supabase

**a) Criar Projeto:**
- Acesse [Supabase](https://supabase.com/dashboard)
- Clique em "New Project"
- Nome: `guina-ia-studio`
- Senha: (crie uma senha forte)
- Region: South America (São Paulo)
- Aguarde ~2 minutos

**b) Executar SQL:**
- Vá em **SQL Editor** → **New Query**
- Cole e execute:

```sql
-- Tabelas
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

-- Row Level Security
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

**c) Criar Bucket de Imagens:**
- Vá em **Storage** → **Create Bucket**
- Nome: `product-images`
- Public: ✅ **SIM**

**d) Copiar Credenciais:**
- Vá em **Settings** → **API**
- Copie:
  - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
  - `anon public` → NEXT_PUBLIC_SUPABASE_ANON_KEY
  - `service_role` (Reveal) → SUPABASE_SERVICE_ROLE_KEY

#### 2. Deploy no Vercel

**a) Conectar Repositório:**
- Acesse [Vercel](https://vercel.com/new)
- Importe seu repositório do GitHub
- Framework Preset: **Next.js** (detectado automaticamente)

**b) Configurar Variáveis de Ambiente:**

Adicione no Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Opcional) Para usar OpenAI ao invés de MOCK:
```bash
OPENAI_API_KEY=sk-proj-...
```

**c) Deploy:**
- Clique em **Deploy**
- Aguarde ~2 minutos
- ✅ Pronto! Aplicação no ar

#### 3. Configurar Redirect URL

- No Supabase: **Authentication** → **URL Configuration**
- Adicione sua URL do Vercel:
  - `https://seu-app.vercel.app/*`

---

## 🛠️ Desenvolvimento Local

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USERNAME/guina-ia-studio.git
cd guina-ia-studio

# Instale as dependências
yarn install
# ou
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o servidor de desenvolvimento
yarn dev
# ou
npm run dev
```

Acesse: http://localhost:3000

### Scripts Disponíveis

```bash
yarn dev          # Desenvolvimento (com hot reload)
yarn build        # Build de produção
yarn start        # Servidor de produção
yarn lint         # Verificar código
```

---

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── api/[[...path]]/       # API Routes (backend)
│   ├── dashboard/             # Dashboard principal
│   ├── products/new/          # Cadastro de produtos
│   ├── generator/             # Gerador de roteiros
│   ├── history/               # Histórico
│   ├── layout.js              # Layout global
│   ├── page.js                # Página de login
│   └── globals.css            # Estilos globais
├── components/ui/             # Componentes shadcn/ui
├── lib/
│   ├── supabase.js           # Cliente Supabase
│   └── utils.js              # Utilidades
├── .env.example              # Exemplo de variáveis
├── next.config.js            # Configuração Next.js
├── tailwind.config.js        # Configuração Tailwind
└── package.json
```

---

## 🎨 Tecnologias

- **Frontend:** Next.js 14 (App Router), React 18
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Authentication
- **Storage:** Supabase Storage
- **IA:** OpenAI GPT-4 Mini (com fallback MOCK)
- **UI:** Tailwind CSS, shadcn/ui
- **Ícones:** Lucide React

---

## 🎭 Personagens

### Rafaela
- **Tom:** Energética e persuasiva
- **Ideal para:** Vendas dinâmicas, produtos de massa
- **Estilo:** Empolgante, carismática, motivadora

### Vico
- **Tom:** Jovem, gamer, descontraído
- **Ideal para:** Público jovem, tech, gaming
- **Estilo:** Casual, autêntico, divertido

### Guina
- **Tom:** Estratégico e analítico
- **Ideal para:** B2B, corporativo, serviços
- **Estilo:** Profissional, objetivo, persuasivo

---

## 📝 Formatos de Roteiro

### R6U - 6 Blocos Curtos
- Duração: 70-100 segundos
- Estrutura: Gancho → Problema → Produto → Benefícios → Prova → CTA
- Ideal para: Vídeos rápidos de vendas

### R7V - 7 Blocos Detalhados
- Duração: 90-120 segundos
- Estrutura: Gancho → Desenvolvimento → Transição → Produto → Transformação → Prova → CTA
- Ideal para: Vídeos explicativos completos

### H1C - Narrativo Contínuo
- Duração: 60-90 segundos
- Estrutura: Storytelling sem blocos
- Ideal para: Conexão emocional

---

## 🎯 Objetivos

- **Vendas:** Foco em conversão, gatilhos de urgência, CTA forte
- **Branding:** Construção de autoridade e conexão emocional
- **Review:** Análise equilibrada e detalhada do produto

---

## 🧪 Modo MOCK

Sem configurar a chave da OpenAI, a aplicação funciona em **modo MOCK**:
- ✅ Gera roteiros personalizados
- ✅ Respeita personagem, formato e objetivo
- ✅ 100% funcional para testes
- ⚠️ Roteiros são templates (não gerados por IA)

Para usar IA real, configure `OPENAI_API_KEY`.

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/SEU_USERNAME/guina-ia-studio/issues)
- **Docs Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Docs Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Docs OpenAI:** [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Desenvolvido com ❤️ usando Next.js + Supabase + OpenAI**