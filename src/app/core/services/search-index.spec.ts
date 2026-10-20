import { TOPICS } from '../data/topics';
import { MAX_SEARCH_RESULTS, SearchItem, buildSearchIndex, searchIndex } from './search-index';

describe('search index', () => {
  const index = buildSearchIndex();
  const titles = (items: SearchItem[]) => items.map((i) => i.title);

  it('contains every topic and every section', () => {
    const sections = TOPICS.reduce((n, t) => n + t.sections.length, 0);

    expect(index.filter((i) => i.kind === 'topic').length).toBe(TOPICS.length);
    expect(index.filter((i) => i.kind === 'section').length).toBe(sections);
  });

  it('links a section to its section page', () => {
    const subjects = index.find((i) => i.kind === 'section' && i.title === 'Subjects');

    expect(subjects?.path).toBe('/learn/rxjs/subjects');
    expect(subjects?.description).toBe('RxJS · section');
  });

  it('shows topics and demo pages, without sections, for an empty query', () => {
    const result = searchIndex(index, '   ');

    expect(result.some((i) => i.kind === 'section')).toBeFalse();
    expect(result.filter((i) => i.kind === 'topic').length).toBe(TOPICS.length);
  });

  it('finds a section by name', () => {
    const result = searchIndex(index, 'subjects');

    expect(result[0].path).toBe('/learn/rxjs/subjects');
  });

  it('ranks a title that starts with the query above one that only contains it', () => {
    const result = searchIndex(index, 'sig');

    expect(titles(result)[0]).toBe('Signals');
  });

  it('is not case sensitive and trims the query', () => {
    expect(titles(searchIndex(index, '  ROUTING '))).toContain('Routing');
  });

  it('puts a topic before its same-score sections', () => {
    const result = searchIndex(index, 'interceptor');

    expect(result[0].kind).toBe('topic');
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(searchIndex(index, 'zzzzzz')).toEqual([]);
  });

  it('caps the number of results', () => {
    expect(searchIndex(index, 'e').length).toBeLessThanOrEqual(MAX_SEARCH_RESULTS);
  });
});
