import { routes } from '../../app.routes';
import { GROUPED_TOPICS, TOPICS, TOPIC_GROUPS } from './topics';

describe('topics data', () => {
  it('has unique paths and every topic has a route at its legacy path', () => {
    const paths = TOPICS.map((t) => t.path);
    expect(new Set(paths).size).toBe(paths.length);
    const routePaths = new Set(routes.map((r) => '/' + r.path));
    for (const topic of TOPICS) {
      expect(routePaths.has(topic.legacyPath)).withContext(topic.legacyPath).toBeTrue();
      expect(topic.path).withContext(topic.id).toBe('/learn/' + topic.legacyPath.slice(1));
    }
  });

  it('has unique ids, and unique section ids within each topic', () => {
    const ids = TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const topic of TOPICS) {
      const sectionIds = topic.sections.map((s) => s.id);
      expect(new Set(sectionIds).size).withContext(topic.id).toBe(sectionIds.length);
      expect(sectionIds).not.toContain('quiz');
      expect(sectionIds).not.toContain('complete');
    }
  });

  it('is sorted by group order, so Next/Previous follow the same path as the menus', () => {
    const order = TOPIC_GROUPS.map((g) => g.id);
    const indexes = TOPICS.map((t) => order.indexOf(t.group));
    expect(indexes.every((i) => i >= 0)).toBeTrue();
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
  });

  it('groups cover every topic exactly once', () => {
    const grouped = GROUPED_TOPICS.flatMap((g) => g.topics.map((t) => t.path));
    expect(grouped).toEqual(TOPICS.map((t) => t.path));
    expect(GROUPED_TOPICS.every((g) => g.topics.length > 0)).toBeTrue();
  });
});
