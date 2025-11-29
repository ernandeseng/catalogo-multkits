# Guia de Implantação na Vercel

Este guia irá ajudá-lo a colocar seu sistema no ar usando a Vercel.

## Pré-requisitos

1.  Uma conta no [GitHub](https://github.com).
2.  Uma conta na [Vercel](https://vercel.com).
3.  O código do projeto salvo no seu computador.

## Passo 1: Colocar o código no GitHub

Se você ainda não tem esse código no GitHub, siga estes passos no seu terminal (ou use o GitHub Desktop):

1.  Crie um **novo repositório** no GitHub (ex: `catalogo-supabase`).
2.  No terminal do seu projeto (`c:\Users\setortecnico1\Desktop\catalogo-main`), execute:

```bash
# Inicializa o git se ainda não foi feito
git init

# Adiciona todos os arquivos
git add .

# Faz o primeiro commit
git commit -m "Versão inicial com Supabase e Admin"

# Renomeia a branch para main
git branch -M main

# Conecta com o seu repositório (substitua SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Envia o código
git push -u origin main
```

## Passo 2: Importar na Vercel

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Na lista "Import Git Repository", encontre o repositório que você acabou de criar e clique em **"Import"**.

## Passo 3: Configurar Variáveis de Ambiente (MUITO IMPORTANTE)

Na tela de configuração do projeto na Vercel (antes de clicar em Deploy):

1.  Abra a seção **"Environment Variables"**.
2.  Você precisa adicionar **TODAS** as variáveis que estão no seu arquivo `.env` local. Copie os valores exatamente como estão no seu arquivo:

| Nome (Key) | Valor (Value) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zjlwfmntrglgsnudjfhh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Copie do seu arquivo .env)* |
| `NEXT_PUBLIC_ADMIN_ID` | `a873f6bc-6d33-4e17-ab95-713347011c75` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `douglasernandes87@gmail.com` |

3.  Clique em **"Add"** para cada uma.

## Passo 4: Fazer o Deploy

1.  Após adicionar as variáveis, clique em **"Deploy"**.
2.  Aguarde a Vercel construir o projeto.
3.  Se tudo der certo, você verá uma tela de sucesso com o link do seu site (ex: `https://catalogo-supabase.vercel.app`).

## Passo 5: Configurar URL no Supabase

1.  Copie a URL do seu novo site na Vercel (ex: `https://catalogo-supabase.vercel.app`).
2.  Vá no **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
3.  Em **Site URL**, cole o link do seu site.
4.  Em **Redirect URLs**, adicione:
    *   `https://catalogo-supabase.vercel.app/**`
    *   `https://catalogo-supabase.vercel.app/auth/callback` (se estiver usando callback)

## Solução de Problemas Comuns

*   **Erro de Build**: Se a Vercel falhar no build, verifique os logs. Geralmente é algum erro de TypeScript ou dependência.
*   **Login não funciona**: Verifique se as variáveis de ambiente foram copiadas corretamente e se a URL do site foi adicionada no Supabase.
