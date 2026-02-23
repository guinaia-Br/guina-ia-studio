# GUINA IA STUDIO

Aplicação web para geração de roteiros de vídeo com Inteligência Artificial.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: API Routes do Next.js
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **IA**: OpenAI GPT-4
- **UI**: Tailwind CSS + shadcn/ui

## 📋 Funcionalidades

### Versão 1.0

1. ✅ **Autenticação**
   - Login com email e senha
   - Cadastro de novos usuários
   - Proteção de rotas

2. ✅ **Dashboard**
   - Visualização de projetos recentes
   - Acesso rápido às principais funcionalidades

3. ✅ **Cadastro de Produtos**
   - Nome, descrição, link
   - Categoria
   - Persona sugerida
   - Upload de imagem

4. ✅ **Gerador de Roteiros**
   - Seleção de produto cadastrado
   - Escolha de personagem (Rafaela, Vico, Guina)
   - Seleção de formato (R6U, R7V, H1C)
   - Definição de objetivo (Vendas, Branding, Review)
   - Geração automática com IA

5. ✅ **Histórico de Projetos**
   - Lista completa de roteiros gerados
   - Visualização detalhada
   - Filtros por data, produto, personagem

## 🎨 Design

- **Tema**: Escuro
- **Cores**: Cinza grafite (#18181b, #27272a) com detalhes âmbar (#f59e0b, #d97706)
- **Estilo**: Interface limpa, moderna e minimalista
- **Componentes**: Cards com bordas suaves e transições suaves

## ⚙️ Configuração do Ambiente

### 1. Configurar Supabase

#### Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login ou crie uma conta
4. Clique em "New Project"
5. Preencha:
   - **Name**: guina-ia-studio (ou nome de sua escolha)
   - **Database Password**: crie uma senha forte e GUARDE
   - **Region**: escolha a mais próxima (ex: South America - São Paulo)
6. Clique em "Create new project" e aguarde (~2 minutos)

#### Passo 2: Obter Credenciais

1. No projeto criado, vá em **Settings** (ícone de engrenagem) → **API**
2. Copie os valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (clique em "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

#### Passo 3: Configurar Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Cole o seguinte SQL:

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

-- Criar políticas de segurança (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Políticas para products
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

-- Políticas para scripts
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

4. Clique em "Run" para executar
5. Verifique se aparece "Success. No rows returned"

#### Passo 4: Configurar Storage para Imagens

1. No Supabase, vá em **Storage**
2. Clique em "Create bucket"
3. Configure:
   - **Name**: `product-images`
   - **Public bucket**: ✅ MARQUE esta opção
4. Clique em "Create bucket"

#### Passo 5: Configurar Variáveis de Ambiente

1. Abra o arquivo `/app/.env`
2. Substitua as credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 2. Instalar Dependências

```bash
cd /app
yarn install
```

### 3. Adicionar Dependências do Supabase

Adicione ao `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7"
  }
}
```

Depois execute:

```bash
yarn install
```

### 4. Reiniciar Servidor

```bash
sudo supervisorctl restart nextjs
```

## 🎭 Personagens Disponíveis

- **Rafaela**: Energética e persuasiva - ideal para vendas dinâmicas
- **Vico**: Jovem, gamer, descontraído - ideal para público jovem
- **Guina**: Estratégico e analítico - ideal para conteúdo corporativo

## 📝 Formatos de Roteiro

- **R6U**: 6 blocos curtos para vídeos de vendas rápidos
- **R7V**: 7 blocos com estrutura detalhada
- **H1C**: Formato contínuo e narrativo sem divisão em blocos

## 🎯 Objetivos

- **Vendas**: Foco em conversão e call-to-action forte
- **Branding**: Construção de marca e autoridade
- **Review**: Análise detalhada do produto

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Variáveis de ambiente protegidas
- Validação de dados no backend

## 📦 Estrutura do Projeto

```
/app
├── app/
│   ├── api/[[...path]]/route.js  # Backend API
│   ├── page.js                    # Login
│   ├── dashboard/page.js          # Dashboard
│   ├── products/new/page.js       # Cadastro de produto
│   ├── generator/page.js          # Gerador de roteiro
│   ├── history/page.js            # Histórico
│   ├── layout.js                  # Layout global
│   └── globals.css                # Estilos globais
├── components/ui/                 # Componentes shadcn
├── .env                           # Variáveis de ambiente
└── package.json
```

## 🐛 Troubleshooting

### Erro de autenticação
- Verifique se as credenciais do Supabase estão corretas
- Certifique-se de que o projeto está ativo

### Erro ao criar produto
- Verifique se o bucket `product-images` foi criado
- Confirme que o bucket está público

### Erro ao gerar roteiro
- Verifique se a chave da OpenAI está configurada
- Confirme se há créditos na conta OpenAI

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Versão**: 1.0.0  
**Última atualização**: 2025
