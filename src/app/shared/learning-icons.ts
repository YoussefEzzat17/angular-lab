import type { TopicGroup } from '../core/data/topics';
import type { SectionKind } from '../core/models/learning.models';
import type { IconName } from './icon.component';

/** One drawn icon per curriculum group: the navigation's icon system instead of each topic's emoji. */
export const GROUP_ICONS: Record<TopicGroup, IconName> = {
  'fundamentals': 'layers',
  'forms-navigation': 'compass',
  'reactivity': 'zap',
  'services-data': 'database',
  'performance': 'gauge',
};

/** What kind of section this is, shown next to its title in the lesson tabs and the sidebar. */
export const SECTION_KIND_ICONS: Record<SectionKind, IconName> = {
  'concept': 'book',
  'try-it': 'play',
  'reference': 'list',
};

export const SECTION_KIND_LABELS: Record<SectionKind, string> = {
  'concept': 'Explanation',
  'try-it': 'Try it',
  'reference': 'Reference',
};
