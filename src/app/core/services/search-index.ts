import { DEMO_LINKS, TOPICS } from '../data/topics';

export type SearchKind = 'topic' | 'section' | 'demo';

export interface SearchItem {
  path: string;
  icon: string;
  title: string;
  description: string;
  kind: SearchKind;
}

export const MAX_SEARCH_RESULTS = 12;

/** Every topic, every section of every topic, and the demo-app pages. */
export function buildSearchIndex(): SearchItem[] {
  return [
    ...TOPICS.map((t): SearchItem => ({ path: t.path, icon: t.icon, title: t.title, description: t.description, kind: 'topic' })),
    ...TOPICS.flatMap((t) =>
      t.sections.map((s): SearchItem => ({ path: `${t.path}/${s.id}`, icon: t.icon, title: s.title, description: `${t.title} · section`, kind: 'section' })),
    ),
    ...DEMO_LINKS.map((d): SearchItem => ({ path: d.path, icon: '🎬', title: d.label, description: 'Demo app', kind: 'demo' })),
  ];
}

/** Lower is better: a title that starts with the query, then a title that contains it, then a description match. */
function score(item: SearchItem, q: string): number {
  const title = item.title.toLowerCase();
  if (title.startsWith(q)) return 0;
  if (title.includes(q)) return 1;
  if (item.description.toLowerCase().includes(q)) return 2;
  return Infinity;
}

/**
 * With no query: the topics and demo pages, in learning order. With a query: the best matches first,
 * topics before sections when they score the same, capped so the list stays short.
 */
export function searchIndex(index: SearchItem[], query: string, limit = MAX_SEARCH_RESULTS): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return index.filter((item) => item.kind !== 'section');
  }
  const kindOrder: Record<SearchKind, number> = { topic: 0, section: 1, demo: 2 };
  return index
    .map((item, position) => ({ item, position, score: score(item, q) }))
    .filter((r) => r.score !== Infinity)
    .sort((a, b) => a.score - b.score || kindOrder[a.item.kind] - kindOrder[b.item.kind] || a.position - b.position)
    .slice(0, limit)
    .map((r) => r.item);
}
