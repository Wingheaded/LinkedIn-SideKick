'use client';
import { useState } from 'react';
import { marked } from 'marked';

export default function PostPreview({ content }: { content: string }) {
  const html = marked.parse(content || '');
  const [copied, setCopied] = useState(false);

  return (
    <div className="preview">
      <div className="toolbar">
        <button
          onClick={() => {
            navigator.clipboard.writeText(content || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          Copiar post
        </button>
        {copied && <span style={{ marginLeft: 8 }}>✔ Copiado</span>}
      </div>

      <div className="card" dangerouslySetInnerHTML={{ __html: html as string }} />

      <style jsx>{`
        .preview { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff; }
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; gap: 8px; }
        .card :global(p) { margin: 0 0 8px; line-height: 1.55; }
        .card :global(h1), .card :global(h2), .card :global(strong) { margin: 8px 0; }
        .card :global(code) { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
      `}</style>
    </div>
  );
}
