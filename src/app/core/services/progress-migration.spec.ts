import { TOPICS } from '../data/topics';
import { migrateProgress } from './progress-migration';

describe('migrateProgress', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty topics when there is no old storage', () => {
    const state = migrateProgress();
    expect(state.version).toBe(2);
    expect(state.topics).toEqual({});
    expect(state.activity).toEqual([]);
  });

  it('sets firstVisitedAt for topics whose old legacy path was visited', () => {
    localStorage.setItem('angular-lab:visited-topics', JSON.stringify(['/signals']));
    const state = migrateProgress();
    expect(state.topics.signals?.firstVisitedAt).toBeDefined();
    expect(state.topics.signals?.completedAt).toBeUndefined();
    expect(state.topics.signals?.sectionsDone).toEqual([]);
  });

  it('marks old completed topics as legacy with every section done', () => {
    localStorage.setItem('angular-lab:completed-topics', JSON.stringify(['/binding']));
    const state = migrateProgress();
    const binding = state.topics.binding!;
    const expectedSections = TOPICS.find((t) => t.id === 'binding')!.sections.map((s) => s.id);
    expect(binding.completedVia).toBe('legacy');
    expect(binding.completedAt).toBeDefined();
    expect(binding.sectionsDone).toEqual(expectedSections);
    expect(binding.attempts).toEqual([]);
  });

  it('ignores unknown old paths', () => {
    localStorage.setItem('angular-lab:visited-topics', JSON.stringify(['/does-not-exist', '/nope']));
    localStorage.setItem('angular-lab:completed-topics', JSON.stringify(['/also-missing']));
    expect(migrateProgress().topics).toEqual({});
  });

  it('ignores corrupt old storage instead of throwing', () => {
    localStorage.setItem('angular-lab:visited-topics', '{not json');
    expect(migrateProgress().topics).toEqual({});
  });
});
