export type Source = { name: string; domain: string; rss: string[] };

export const SOURCES: Source[] = [
  // 1ª linha da lista original e estendida (best-effort RSS)
  { name: "Dezeen", domain: "dezeen.com", rss: ["https://www.dezeen.com/feed/"] },
  { name: "ArchDaily", domain: "archdaily.com", rss: ["https://www.archdaily.com/rss"] },
  { name: "Designboom", domain: "designboom.com", rss: ["https://www.designboom.com/feed/"] },
  { name: "Wallpaper*", domain: "wallpaper.com", rss: ["https://www.wallpaper.com/rss"] },
  { name: "Dwell", domain: "dwell.com", rss: ["https://www.dwell.com/latest/rss"] },
  { name: "Frameweb", domain: "frameweb.com", rss: ["https://frameweb.com/feed"] },

  // Restantes fontes aprovadas (adicionadas)
  { name: "Architectural Digest", domain: "architecturaldigest.com", rss: ["https://www.architecturaldigest.com/feed"] },
  { name: "Casa Vogue (Brasil)", domain: "casavogue.globo.com", rss: [] },
  { name: "Inhabitat", domain: "inhabitat.com", rss: ["https://inhabitat.com/feed/"] },
  { name: "Patricia Urquiola", domain: "patriciaurquiola.com", rss: [] },
  { name: "Lightecture", domain: "lightecture.com", rss: ["https://www.lightecture.com/feed/"] },
  { name: "Acoustics", domain: "acoustics.com", rss: [] },
  { name: "Jader Almeida", domain: "jaderalmeida.com", rss: [] },
  { name: "Revista Projeto", domain: "revistaprojeto.com.br", rss: ["https://www.revistaprojeto.com.br/feed/"] },
  { name: "Vitruvius", domain: "vitruvius.com.br", rss: ["https://vitruvius.com.br/jornal/rss"] },
  { name: "Studio MK27", domain: "mk27.com", rss: [] },
  { name: "Workplace Design", domain: "workplacedesign.com", rss: [] },
  { name: "BIG – Bjarke Ingels Group", domain: "big.dk", rss: [] },
  { name: "Core77", domain: "core77.com", rss: ["https://www.core77.com/feed"] },
  { name: "Carlo Ratti", domain: "carloratti.com", rss: [] },
  { name: "Tom Dixon", domain: "tomdixon.net", rss: ["https://www.tomdixon.net/blog/feed/"] },
  { name: "SustentÁrqui", domain: "sustentarqui.com.br", rss: [] },
  { name: "Architizer", domain: "architizer.com", rss: ["https://architizer.com/blog/feed/"] },
  { name: "Vitra", domain: "vitra.com", rss: [] },
  { name: "Histórias de Casa", domain: "historiasdecasa.com.br", rss: ["https://www.historiasdecasa.com.br/feed/"] },
  { name: "Casa de Valentina", domain: "casadevalentina.com.br", rss: ["https://www.casadevalentina.com.br/feed/"] },
  { name: "Studioilse", domain: "studioilse.com", rss: [] },
  { name: "Sight Unseen", domain: "sightunseen.com", rss: ["https://www.sightunseen.com/feed/"] },
  { name: "Business of Home", domain: "businessofhome.com", rss: ["https://businessofhome.com/atom.xml"] },
  { name: "ASID", domain: "asid.org", rss: [] },
  { name: "Salone del Mobile.Milano", domain: "salonemilano.it", rss: [] },
  { name: "USGBC", domain: "usgbc.org", rss: ["https://www.usgbc.org/articles/rss.xml"] },
  { name: "Material Bank EU", domain: "materialbank.eu", rss: [] }
];

export const APPROVED_DOMAINS = new Set(SOURCES.map(s=>s.domain));