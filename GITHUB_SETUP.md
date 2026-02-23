# 📦 Setup do GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Configure:
   - **Repository name:** `guina-ia-studio`
   - **Description:** Gerador de roteiros para vídeos com IA
   - **Visibility:** Public ou Private
   - ❌ NÃO inicialize com README (já temos)
3. Clique em **Create repository**

## Passo 2: Push do Código

```bash
# No diretório /app do projeto
cd /app

# Inicializar Git (se ainda não foi)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: Initial commit - Guina IA Studio MVP

- Autenticação com Supabase
- Cadastro de produtos com upload
- Gerador de roteiros com IA (OpenAI + MOCK)
- Histórico de projetos
- 3 personagens x 3 formatos x 3 objetivos
- UI moderna: tema escuro + detalhes âmbar
- Next.js 14 + Supabase + OpenAI"

# Adicionar remote (substitua SEU_USERNAME)
git remote add origin https://github.com/SEU_USERNAME/guina-ia-studio.git

# Renomear branch para main
git branch -M main

# Push
git push -u origin main
```

## Passo 3: Configurar .gitignore

O arquivo `.gitignore` já está configurado e ignora:
- ✅ `node_modules/`
- ✅ `.env` (credenciais locais)
- ✅ `.next/` (build cache)
- ✅ Arquivos específicos do Emergent

## Passo 4: Adicionar README Badge

Edite o README.md e substitua:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USERNAME/guina-ia-studio)
```

Por:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USERNAME/guina-ia-studio)
```

## Passo 5: Criar Topics

No GitHub, adicione topics:
- `nextjs`
- `supabase`
- `openai`
- `ai`
- `video-scripts`
- `content-creation`
- `tailwindcss`
- `typescript`

## Passo 6: Adicionar Licença

Crie `LICENSE`:

```
MIT License

Copyright (c) 2025 [Seu Nome]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Passo 7: Verificar

Acesse seu repositório e verifique:
- ✅ Código está no GitHub
- ✅ README renderiza corretamente
- ✅ `.env` NÃO está no repositório
- ✅ `.env.example` ESTÁ no repositório

## Próximo Passo

Agora você pode:
1. **Deploy no Vercel** (veja `DEPLOY_VERCEL.md`)
2. **Compartilhar o repositório**
3. **Receber contribuições**

---

**Dica:** Configure GitHub Actions para CI/CD automático!

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn build
```