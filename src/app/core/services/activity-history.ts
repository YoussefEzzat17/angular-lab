import { TOPICS } from '../data/topics';
import { QUIZ_RULES } from '../models/learning.models';
import type { ActivityEntry, ActivityKind, TopicId } from '../models/learning.models';
import { dayKey } from './clock';

/** How many activity entries are kept in storage (about 20 KB at this size). */
export const ACTIVITY_LIMIT = 200;
/** How many entries the history page shows before "Show more". */
export const HISTORY_PAGE_SIZE = 20;
/** How many entries the dashboard preview shows. */
export const PREVIEW_SIZE = 5;

export type ActivityKindFilter = 'all' | ActivityKind;

export interface ActivityFilter {
  kind: ActivityKindFilter;
  topicId: TopicId | 'all';
}

export interface ActivityDayGroup {
  /** `YYYY-MM-DD` in local time. */
  key: string;
  label: string;
  entries: ActivityEntry[];
}

export const KIND_FILTERS: { id: ActivityKindFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'section-done', label: 'Sections' },
  { id: 'quiz-passed', label: 'Quizzes passed' },
  { id: 'quiz-failed', label: 'Quizzes failed' },
];

export function activityLabel(kind: ActivityKind): string {
  switch (kind) {
    case 'quiz-passed':
      return 'Passed quiz — ';
    case 'quiz-failed':
      return 'Attempted quiz — ';
    default:
      return 'Completed section in ';
  }
}

export function activityIcon(kind: ActivityKind): string {
  switch (kind) {
    case 'quiz-passed':
      return '🎉';
    case 'quiz-failed':
      return '📝';
    default:
      return '✓';
  }
}

export function topicTitleOf(topicId: TopicId): string {
  return TOPICS.find((t) => t.id === topicId)?.title ?? topicId;
}

export function sectionTitleOf(topicId: TopicId, sectionId: string | undefined): string | undefined {
  if (!sectionId) {
    return undefined;
  }
  return TOPICS.find((t) => t.id === topicId)?.sections.find((s) => s.id === sectionId)?.title;
}

/** "5/6" for a quiz entry, or undefined when it has no score. */
export function scoreText(entry: ActivityEntry): string | undefined {
  return entry.score === undefined ? undefined : `${entry.score}/${QUIZ_RULES.draw}`;
}

/** Where clicking an entry should go: the section for a section entry, the topic overview otherwise. */
export function activityLink(entry: ActivityEntry): string[] {
  const base = ['/learn', entry.topicId];
  return entry.kind === 'section-done' && entry.sectionId ? [...base, entry.sectionId] : base;
}

export function filterActivity(entries: ActivityEntry[], filter: ActivityFilter): ActivityEntry[] {
  return entries.filter(
    (e) => (filter.kind === 'all' || e.kind === filter.kind) && (filter.topicId === 'all' || e.topicId === filter.topicId),
  );
}

/** "Today", "Yesterday", or a full date with the year, e.g. "Sun, Oct 11, 2026". */
export function dayLabel(date: Date, now: Date): string {
  const key = dayKey(date);
  if (key === dayKey(now)) {
    return 'Today';
  }
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (key === dayKey(yesterday)) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeLabel(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Groups entries by local calendar day, keeping the order they come in (newest first). */
export function groupActivityByDay(entries: ActivityEntry[], now: Date): ActivityDayGroup[] {
  const groups: ActivityDayGroup[] = [];
  for (const entry of entries) {
    const date = new Date(entry.at);
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    const key = dayKey(date);
    const last = groups.at(-1);
    if (last && last.key === key) {
      last.entries.push(entry);
    } else {
      groups.push({ key, label: dayLabel(date, now), entries: [entry] });
    }
  }
  return groups;
}
