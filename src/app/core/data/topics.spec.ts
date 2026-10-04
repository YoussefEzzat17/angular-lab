import { routes } from '../../app.routes';
import { GROUPED_TOPICS, TOPICS, TOPIC_GROUPS } from './topics';

describe('topics data', () => {
  it('has unique paths and every topic has a route', () => {
    const paths = TOPICS.map((t) => t.path);
    expect(new Set(paths).size).toBe(paths.length);
    const routePaths = new Set(routes.map((r) => '/' + r.path));
    for (const path of paths) expect(routePaths.has(path)).withContext(path).toBeTrue();
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
