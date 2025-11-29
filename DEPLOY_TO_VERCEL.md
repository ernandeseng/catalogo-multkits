# Guia de Implantação na Vercel

Este guia irá ajudá-lo a colocar seu sistema no ar usando a Vercel, conectado ao seu repositório GitHub.

## Pré-requisitos

1.  Uma conta no [GitHub](https://github.com).
2.  Uma conta na [Vercel](https://vercel.com).
3.  O código do projeto já está configurado localmente.

## Passo 1: Enviar o código para o GitHub

O projeto já foi inicializado e configurado para o repositório: `https://github.com/ernandeseng/catalogo-multkits.git`.

Agora você precisa enviar o código. No terminal do seu projeto, execute:

```bash
# Envia o código para o GitHub
git push -u origin main
```

*Nota: Se for solicitado login, insira suas credenciais do GitHub.*

## Passo 2: Importar na Vercel

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Na lista "Import Git Repository", você deve ver o repositório `catalogo-multkits`. Clique em **"Import"**.

## Passo 3: Configurar Variáveis de Ambiente (MUITO IMPORTANTE)

Na tela de configuração do projeto na Vercel (antes de clicar em Deploy):

1.  Abra a seção **"Environment Variables"**.
2.  Adicione as seguintes variáveis. Você deve pegar os valores do seu projeto Supabase e das suas configurações locais:

| Nome (Key) | Descrição / Onde encontrar |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase (Dashboard -> Settings -> API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave Anon/Public do seu projeto Supabase (Dashboard -> Settings -> API) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | O e-mail que você definiu como administrador (ex: seu e-mail) |
| `NEXT_PUBLIC_ADMIN_ID` | O ID (UUID) do usuário administrador no Supabase (Authentication -> Users -> Copiar User UID) |

3.  Clique em **"Add"** para cada uma.

## Passo 4: Fazer o Deploy

1.  Após adicionar as variáveis, clique em **"Deploy"**.
2.  Aguarde a Vercel construir o projeto.
3.  Se tudo der certo, você verá uma tela de sucesso com o link do seu site.

## Passo 5: Configurar URL no Supabase

1.  Copie a URL do seu novo site na Vercel (ex: `https://catalogo-multkits.vercel.app`).
2.  Vá no **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
3.  Em **Site URL**, cole o link do seu site.
4.  Em **Redirect URLs**, adicione:
    *   `https://seu-projeto.vercel.app/**`
# Guia de Implantação na Vercel

Este guia irá ajudá-lo a colocar seu sistema no ar usando a Vercel, conectado ao seu repositório GitHub.

## Pré-requisitos

1.  Uma conta no [GitHub](https://github.com).
2.  Uma conta na [Vercel](https://vercel.com).
3.  O código do projeto já está configurado localmente.

## Passo 1: Enviar o código para o GitHub

O projeto já foi inicializado e configurado para o repositório: `https://github.com/ernandeseng/catalogo-multkits.git`.

Agora você precisa enviar o código. No terminal do seu projeto, execute:

```bash
# Envia o código para o GitHub
git push -u origin main
```

*Nota: Se for solicitado login, insira suas credenciais do GitHub.*

## Passo 2: Importar na Vercel

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Na lista "Import Git Repository", você deve ver o repositório `catalogo-multkits`. Clique em **"Import"**.

## Passo 3: Configurar Variáveis de Ambiente (MUITO IMPORTANTE)

Na tela de configuração do projeto na Vercel (antes de clicar em Deploy):

1.  Abra a seção **"Environment Variables"**.
2.  Adicione as seguintes variáveis. Você deve pegar os valores do seu projeto Supabase e das suas configurações locais:

| Nome (Key) | Descrição / Onde encontrar |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase (Dashboard -> Settings -> API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave Anon/Public do seu projeto Supabase (Dashboard -> Settings -> API) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | O e-mail que você definiu como administrador (ex: seu e-mail) |
| `NEXT_PUBLIC_ADMIN_ID` | O ID (UUID) do usuário administrador no Supabase (Authentication -> Users -> Copiar User UID) |

3.  Clique em **"Add"** para cada uma.

## Passo 4: Fazer o Deploy

1.  Após adicionar as variáveis, clique em **"Deploy"**.
2.  Aguarde a Vercel construir o projeto.
3.  Se tudo der certo, você verá uma tela de sucesso com o link do seu site.

## Passo 5: Configurar URL no Supabase

1.  Copie a URL do seu novo site na Vercel (ex: `https://catalogo-multkits.vercel.app`).
2.  Vá no **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
3.  Em **Site URL**, cole o link do seu site.
4.  Em **Redirect URLs**, adicione:
    *   `https://seu-projeto.vercel.app/**`
    *   `https://seu-projeto.vercel.app/auth/callback` (se aplicável)

## Solução de Problemas Comuns

*   **Erro de Build**: Se a Vercel falhar no build, verifique os logs na Vercel.
*   **Login não funciona**: Verifique se `NEXT_PUBLIC_ADMIN_ID` corresponde exatamente ao UID do usuário no Supabase e se `NEXT_PUBLIC_ADMIN_EMAIL` está correto.
*   **Erro "requested path is invalid" ao confirmar e-mail**: Isso significa que a URL de redirecionamento não está autorizada no Supabase.
    1. Vá no **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
    2. Certifique-se de que a **Site URL** é a URL do seu site (ex: `https://seu-projeto.vercel.app` ou `http://localhost:3000` se estiver testando localmente).
    3. Em **Redirect URLs**, adicione explicitamente:
       * `http://localhost:3000/**` (para testes locais)
       * `https://seu-projeto.vercel.app/**` (para produção)
