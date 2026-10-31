import type { TopicGroup } from '../core/data/topics';
import type { SectionKind, TopicId } from '../core/models/learning.models';
import type { IconName } from './icon.component';
import type { IllustrationName } from './topic-illustration.component';

/** The animated drawing that stands for each lesson on its card and overview page. */
export const TOPIC_ILLUSTRATIONS: Record<TopicId, IllustrationName> = {
  'binding': 'binding',
  'pipes': 'pipes',
  'directives': 'directives',
  'communication': 'communication',
  'content-projection': 'projection',
  'forms': 'forms',
  'routing': 'routing',
  'guards': 'guards',
  'signals': 'signals',
  'rxjs': 'rxjs',
  'di': 'di',
  'movies': 'http',
  'resource': 'resource',
  'interceptor': 'interceptor',
  'facade': 'facade',
  'change-detection': 'change-detection',
  'lazy-loading': 'lazy',
  'defer': 'defer',
};

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
