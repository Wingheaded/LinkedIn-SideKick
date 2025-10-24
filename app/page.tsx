'use client';

import { useState } from 'react';
import Image from 'next/image';
import PostPreview from '../components/PostPreview';

type Item = {
  source: string;
  domain: string;
  title: string;
  url: string;
  isoDate?: string;
  summary?: string;
  image?: string | null;
};

export default function Page() {
  const [q, setQ] = useState('interiores');
  const [items, setItems] = useState<Item[]>([]);
  const [bucket, setBucket] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [chosen, setChosen] = useState<Item | null>(null);
  const [post, setPost] = useState('');

  async function search() {
  async function autoSearch() {
    setLoading(true);
    setChosen(null);
    setPost('');
    const r = await fetch(`/api/search?mode=auto&q=${encodeURIComponent(q)}`);
    const j = await r.json();
    const arr = j.items || [];
    setItems(arr);
    if (j.item) setChosen(j.item);
    setLoading(false);
  }

    setLoading(true);
    setChosen(null);
    setPost('');
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setItems(j.items || []);
    setLoading(false);
  }

  async function generate() {
    if (!chosen) return;
    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: chosen.title, url: chosen.url, summary: chosen.summary, bucket })
    });
    const j = await r.json();
    if (j.ok) setPost(j.post);
    else alert(j.error || 'Erro ao gerar');
  }
// add this above the return()
const autoSearch = () => {
  // For now just reuse the regular search.
  // Replace with your auto-selection logic later.
  return search();
};

  return (
    <main style={{maxWidth: 980, margin: '32px auto', padding: 16}}>
      <h1>LinkedIn Sidekick</h1>
      <p>Pesquisa em fontes aprovadas (≤ 14 dias) e gera posts reflexivos em PT‑PT com um único link no final.</p>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="tema (ex.: acústica, mobiliário, IA, arquitetura)"
          style={{flex:1, padding:8, borderRadius:8, border:'1px solid #e5e7eb'}}
        />
        <select name="bucket" value={bucket} onChange={e=>setBucket(e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #e5e7eb'}}>
          <option value="">(auto hashtags)</option>
          <option value="interiores">Interiores</option>
          <option value="mobiliario">Mobiliário</option>
          <option value="arquitetura">Arquitetura</option>
          <option value="acustica">Acústica</option>
          <option value="ia">IA</option>
          <option value="sustentabilidade">Sustentabilidade</option>
          <option value="iluminacao">Iluminação</option>
          <option value="workplace">Workplace</option>
        </select>
        <button onClick={search} disabled={loading}>{loading ? 'A procurar…' : 'Procurar'}</button>
        <button onClick={autoSearch} disabled={loading}>{loading ? 'A escolher…' : 'Auto‑seleção'}</button>
      </div>

      {items.length > 0 && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16}}>
          {items.map((it, idx)=>(
            <div key={idx} className={`item ${chosen?.url===it.url ? 'active':''}`} onClick={()=>setChosen(it)}>
              {it.image && (<div style={{position:'relative', width:'100%', height:140, overflow:'hidden', borderRadius:8}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />
              </div>)}
              <div style={{padding:'8px 4px'}}>
                <div style={{fontSize:12, color:'#6b7280'}}>{it.domain} · {new Date(it.isoDate || '').toLocaleDateString()}</div>
                <div style={{fontWeight:600, marginTop:4}}>{it.title}</div>
              </div>
              <style jsx>{`
                .item { border:1px solid #e5e7eb; border-radius:12px; cursor:pointer; background:#fff; }
                .item.active { outline:2px solid #111827; }
                .item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
              `}</style>
            </div>
          ))}
        </div>
      )}

      {chosen && (
        <div style={{marginTop:16, display:'flex', gap:12}}>
          <button onClick={generate}>Gerar post</button>
          <a href={chosen.url} target="_blank" rel="noreferrer">Abrir artigo</a>
        </div>
      )}

      {post && (
        <div style={{marginTop:16}}>
          <PostPreview content={post} />
        </div>
      )}
    </main>
  );
}
