import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CLOCK } from '../../core/services/clock';
import type { ActivityEntry } from '../../core/models/learning.models';
import { HistoryComponent } from './history.component';

const NOW = new Date(2026, 9, 19, 15, 0);

/** Stored oldest first, like the real service: 10 old failed quizzes, 10 passed yesterday, 25 sections today. */
function seedActivity(): ActivityEntry[] {
  const old = Array.from({ length: 10 }, (_, i): ActivityEntry => ({ at: new Date(2026, 9, 11, 9, i).toISOString(), kind: 'quiz-failed', topicId: 'binding', score: 3 }));
  const yesterday = Array.from({ length: 10 }, (_, i): ActivityEntry => ({ at: new Date(2026, 9, 18, 9, i).toISOString(), kind: 'quiz-passed', topicId: 'signals', score: 5 }));
  const today = Array.from({ length: 25 }, (_, i): ActivityEntry => ({ at: new Date(2026, 9, 19, 8, i).toISOString(), kind: 'section-done', topicId: 'rxjs', sectionId: 'subjects' }));
  return [...old, ...yesterday, ...today];
}

describe('HistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let root: HTMLElement;

  function setup(activity: ActivityEntry[] = seedActivity()) {
    localStorage.clear();
    localStorage.setItem('angular-lab:progress', JSON.stringify({ version: 2, topics: {}, activity }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: CLOCK, useValue: { now: () => NOW } }] });
    fixture = TestBed.createComponent(HistoryComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  }

  const entries = () => root.querySelectorAll('[data-testid="history-entry"]');
  const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const click = (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
    fixture.detectChanges();
  };
  const pickTopic = (value: string) => {
    const select = root.querySelector<HTMLSelectElement>('[data-testid="topic-filter"]')!;
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  afterEach(() => localStorage.clear());

  it('shows the newest 20 entries first and says how many are left', () => {
    setup();

    expect(entries().length).toBe(20);
    expect(text('history-count')).toBe('Showing 20 of 45 activities');
    expect(text('show-more')).toBe('Show 20 more (25 left)');
  });

  it('reveals the rest with Show more and then removes the button', () => {
    setup();

    click('show-more');
    expect(entries().length).toBe(40);

    click('show-more');
    expect(entries().length).toBe(45);
    expect(root.querySelector('[data-testid="show-more"]')).toBeNull();
  });

  it('groups by day with Today and Yesterday labels and a full date for older days', () => {
    setup();
    click('show-more');
    click('show-more');

    const headings = Array.from(root.querySelectorAll('h2')).map((h) => h.textContent?.trim());

    expect(headings).toEqual(['Today', 'Yesterday', jasmine.stringMatching(/Oct 11, 2026/)]);
  });

  it('links a section entry to its section', () => {
    setup();

    expect(entries()[0].getAttribute('href')).toBe('/learn/rxjs/subjects');
    expect(entries()[0].textContent).toContain('Subjects');
  });

  it('filters by activity type and restarts the page size', () => {
    setup();
    click('show-more');

    click('kind-quiz-passed');

    expect(entries().length).toBe(10);
    expect(text('history-count')).toBe('Showing 10 of 10 activities');
    expect(root.querySelector('[data-testid="show-more"]')).toBeNull();
  });

  it('filters by topic', () => {
    setup();

    pickTopic('binding');

    expect(entries().length).toBe(10);
  });

  it('shows a helpful message when the filters match nothing', () => {
    setup();

    click('kind-quiz-passed');
    pickTopic('binding');

    expect(entries().length).toBe(0);
    expect(root.textContent).toContain('Nothing matches these filters');
  });

  it('shows an empty state when there is no history at all', () => {
    setup([]);

    expect(root.textContent).toContain('No history yet');
    expect(root.querySelector('[data-testid="kind-all"]')).toBeNull();
  });
});
