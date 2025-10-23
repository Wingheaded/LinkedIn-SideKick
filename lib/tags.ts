export type Bucket =
  | 'interiores' | 'mobiliario' | 'arquitetura' | 'acustica'
  | 'ia' | 'sustentabilidade' | 'iluminacao' | 'workplace';

type TagMap = Record<Bucket, string[]>;

export const TAGS: TagMap = {
  interiores: ['#DesignDeInteriores', '#Espaços', '#TendênciasDesign', '#BemEstar'],
  mobiliario: ['#Mobiliário', '#DesignDeProduto', '#TendênciasDesign', '#Artesanato'],
  arquitetura: ['#Arquitetura', '#EspaçosInteligentes', '#Cidades', '#Renovação'],
  acustica: ['#Acústica', '#Conforto', '#BemEstar', '#DesignDeInteriores'],
  ia: ['#IA', '#Design', '#Criatividade', '#TrabalhoDoFuturo'],
  sustentabilidade: ['#Sustentabilidade', '#Materiais', '#EconomiaCircular', '#Arquitetura'],
  iluminacao: ['#Iluminação', '#Arquitetura', '#Ambiente', '#Design'],
  workplace: ['#Workplace', '#Escritórios', '#Produtividade', '#BemEstar']
};

export function inferBucket(title?: string, summary?: string): Bucket | null {
  const hay = (title || '' + ' ' + (summary || '')).toLowerCase();
  if (/(ac[úu]stic|sound|noise)/.test(hay)) return 'acustica';
  if (/(ilumina|lighting|luz)/.test(hay)) return 'iluminacao';
  if (/(workplace|escrit[óo]rio|office)/.test(hay)) return 'workplace';
  if (/(mobili[aá]rio|furniture|cadeira|sof[aá])/i.test(hay)) return 'mobiliario';
  if (/(interiores|interior design|casa|apartamento)/i.test(hay)) return 'interiores';
  if (/(sustent|regener|circular|reuso|reutiliza)/i.test(hay)) return 'sustentabilidade';
  if (/(arquitet|architecture|urban)/i.test(hay)) return 'arquitetura';
  if (/(ai|intelig[êe]ncia artificial|generativa)/i.test(hay)) return 'ia';
  return null;
}

export function bucketTags(bucket: Bucket | null): string[] {
  if (!bucket) return ['#DesignDeInteriores', '#Arquitetura', '#TendênciasDesign'];
  return TAGS[bucket];
}