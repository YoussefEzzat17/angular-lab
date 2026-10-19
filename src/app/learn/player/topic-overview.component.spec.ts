import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import type { TopicId } from '../../core/models/learning.models';
import { ProgressService } from '../../core/services/progress.service';
import { TopicOverviewComponent } from './topic-overview.component';

describe('TopicOverviewComponent', () => {
  function setup(topicId: TopicId, seed?: (progress: ProgressService) => void) {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { data: { topicId } } } }],
    });
    seed?.(TestBed.inject(ProgressService));
    const fixture = TestBed.createComponent(TopicOverviewComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { root, text: (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim() };
  }

  afterEach(() => localStorage.clear());

  it('shows a beginner topic as Beginner', () => {
    expect(setup('binding').text('topic-level')).toBe('Beginner');
  });

  it('shows an advanced topic as Advanced', () => {
    expect(setup('rxjs').text('topic-level')).toBe('Advanced');
  });

  it('shows no "Before you start" box for a topic with no prerequisites', () => {
    const { root } = setup('binding');

    expect(root.querySelector('[data-testid="prerequisites"]')).toBeNull();
  });

  it('lists the prerequisites as links and marks the finished ones', () => {
    const { root, text } = setup('movies', (progress) => progress.toggleManualComplete('di'));

    expect(root.querySelector('[data-testid="prereq-di"]')?.getAttribute('href')).toBe('/learn/di');
    expect(text('prereq-di')).toContain('✓');
    expect(text('prereq-rxjs')).not.toContain('✓');
    expect(text('prerequisites')).toContain('builds on these');
  });

  it('says the learner is ready once every prerequisite is finished', () => {
    const { text } = setup('guards', (progress) => progress.toggleManualComplete('routing'));

    expect(text('prerequisites')).toContain('You have finished the topics this one builds on.');
  });
});
