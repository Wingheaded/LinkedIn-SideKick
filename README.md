# LinkedIn Sidekick (Next.js)

Mini‑app para gerar publicações de LinkedIn em PT‑PT a partir de fontes aprovadas (≤14 dias), com **apenas 1 link no final**.

## 🧰 Stack
- Next.js 14 (App Router)
- API Routes: `/api/search` (RSS) e `/api/generate` (OpenAI)
- Guardrails para 1 link final, sem referências à fonte no corpo

## ⚙️ Setup local
```bash
npm i
cp .env.example .env.local   # adiciona a tua OPENAI_API_KEY
npm run dev
```
Abre: http://localhost:3000

## 🚀 Deploy
### Vercel
1) Criar novo projeto a partir deste diretório.  
2) Definir `OPENAI_API_KEY` em Project Settings → Environment Variables.  
3) Deploy.

## 🔎 Pesquisa
- Lê vários RSS em paralelo de fontes aprovadas (extensível em `lib/sources.ts`).  
- Filtra por data (≤14 dias) e por termo de pesquisa.  
- Tenta recolher `og:image` para pré-visualização.

## 🧠 Geração
- Prompt system impõe: PT‑PT, 3–4 parágrafos curtos, pergunta final, 3–6 hashtags, **sem nomes de fonte** no corpo, **1 link no fim**.  
- Guardrail adicional remove quaisquer URLs no corpo e volta a anexar o link limpo no final.

## ⚠️ Notas
- Podes adicionar mais fontes/feeds em `lib/sources.ts`.  
- Se precisares de scraping avançado, integra Firecrawl/n8n no backend e salvaguarda rate limits.

## 📜 Licença
MIT

## 🧲 Auto‑seleção
- Endpoint: `GET /api/search?mode=auto&q=termo` devolve `item` melhor pontuado com base em recência, imagem OG, tamanho do título e match com a query.
- No UI há um botão **Auto‑seleção** que pré‑escolhe o artigo com melhor score.


## 🗂 Persistência (evitar repetir artigos em 14 dias)
- Ficheiro local: `data/used.json` armazena URLs já usados com timestamp.
- O endpoint `/api/search` **exclui** por defeito artigos usados nos últimos 14 dias (override com `forceUsed=true`). 
- Ao gerar um post com sucesso, o URL é guardado automaticamente.

> **Vercel**: file system é efémero. Para produção, usa um KV (Upstash/Redis ou Vercel KV) e troca as funções de `lib/store.ts` por chamadas ao KV.

## 🏷 Hashtags automáticas e bucket forçado
- `inferBucket(title, summary)` tenta deduzir o tema e sugere hashtags.
- Podes **forçar bucket** no UI (selector) ou enviar `bucket` no `POST /api/generate`.


## ☁️ Persistência em Produção (Vercel KV)
1. Em **Vercel → Project Settings → Storage → KV**, cria uma base KV.
2. Em **Environment Variables**, define:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - (opcional) `KV_REST_API_READ_ONLY_TOKEN`
3. Sem estas vars, a app usa **FS local** (`data/used.json`). Em produção, com KV definido, a app passa a usar **@vercel/kv** automaticamente.

