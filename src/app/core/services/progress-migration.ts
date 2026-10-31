import { TOPICS } from '../data/topics';
import type { ProgressStateV2, TopicProgress } from '../models/learning.models';

const OLD_VISITED_KEY = 'angular-lab:visited-topics';
const OLD_COMPLETED_KEY = 'angular-lab:completed-topics';

function readOldPaths(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch { return []; }
}

export function migrateProgress(): ProgressStateV2 {
  const visited = new Set<string>(readOldPaths(OLD_VISITED_KEY));
  const completed = new Set<string>(readOldPaths(OLD_COMPLETED_KEY));

  const topics: ProgressStateV2['topics'] = {};
  const now = new Date().toISOString();

  for (const topic of TOPICS) {
    const wasVisited = visited.has(topic.legacyPath);
    const wasCompleted = completed.has(topic.legacyPath);
    if (!wasVisited && !wasCompleted) continue;

    const progress: TopicProgress = {
      sectionsDone: wasCompleted ? topic.sections.map((s) => s.id) : [],
      attempts: [],
      ...(wasVisited ? { firstVisitedAt: now, lastVisitedAt: now } : {}),
      ...(wasCompleted ? { completedAt: now, completedVia: 'legacy' as const, bestScore: undefined } : {}),
    };
    topics[topic.id] = progress;
  }

  // Remove legacy keys so migration doesn't re-run on next load
  try { localStorage.removeItem(OLD_VISITED_KEY); } catch { /* ignore */ }
  try { localStorage.removeItem(OLD_COMPLETED_KEY); } catch { /* ignore */ }

  return { version: 2, topics, activity: [] };
}
