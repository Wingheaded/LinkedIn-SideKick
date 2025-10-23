import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addUsed } from '@/lib/store';
import { inferBucket, bucketTags } from '@/lib/tags';

const bodySchema = z.object({
  title: z.string().min(4).max(280),
  url: z.string().url(),
  summary: z.string().optional(),
  bucket: z.string().optional()
});

const SYSTEM = `Cria posts de LinkedIn em PT-PT, 3–4 parágrafos curtos + pergunta + 3–6 hashtags + apenas 1 link no final, sem referência ao nome da fonte no corpo. Emojis 0–2 no total, só se reforçarem o sentido. Remove quaisquer parâmetros de tracking do link se existirem. Estrutura: reflexão de abertura; expansão com 1–2 parágrafos; takeaway humano/profissional; pergunta final; hashtags; link único no fim. Tom: calmo, claro, humano; frases curtas; zero jargão. O tema deve relacionar design/arquitetura/interiores/IA com liderança e vida real.`;

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const inferred = inferBucket(data.title, data.summary);
    const chosenBucket = (data.bucket as any) || inferred;
    const tags = bucketTags(chosenBucket as any).slice(0,6).join(' ');
    const userPrompt = `Artigo: ${data.title}\nURL: ${data.url}\nResumo: ${data.summary || ''}\nHASHTAGS SUGERIDAS: ${tags}\n\nEscreve o post agora em PT-PT. Usa 3–6 hashtags (prioriza as sugeridas). Garante que só colocas o URL no último bloco e não mencionas o nome do site.`;

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ ok: false, error: 'Missing OPENAI_API_KEY' }, { status: 500 });

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.6
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }
    const out = await resp.json();
    const text = out.choices?.[0]?.message?.content || "";

    // Guardrails: ensure exactly one link at the end
    const url = data.url;
    const body = text
      .replace(/https?:\/\/\S+/g, '') // strip any links generated in body
      .trim();

    const final = `${body}\n\n${url}`.replace(/\n{3,}/g, '\n\n');

    await addUsed(url);
    return NextResponse.json({ ok: true, post: final });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}