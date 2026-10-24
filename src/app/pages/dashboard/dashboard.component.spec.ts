import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  function setup(progress?: object) {
    localStorage.clear();
    if (progress) localStorage.setItem('angular-lab:progress', JSON.stringify(progress));
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const text = (sel: string) => root.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return { root, text };
  }

  afterEach(() => localStorage.clear());

  it('keeps the welcome card: greeting, topic progress ring and Continue', () => {
    const { root, text } = setup({
      version: 2,
      topics: { binding: { sectionsDone: [], attempts: [], completedAt: new Date().toISOString(), completedVia: 'quiz' } },
      activity: [],
    });

    expect(text('h1')).toContain('Your learning');
    expect(root.querySelector('svg[role="progressbar"]')?.getAttribute('aria-valuetext')).toBe(`1 of ${TOPICS.length} topics complete`);
    expect(root.querySelector(`a[href="${TOPICS[1].path}/${TOPICS[1].sections[0].id}"]`)?.textContent).toContain('Continue');
  });

  it('writes out each topic status for screen readers', () => {
    const { root } = setup({ version: 2, topics: { signals: { sectionsDone: ['basics'], attempts: [] } }, activity: [] });

    const signals = root.querySelector('a[href="/learn/signals"]')!;
    expect(signals.textContent).toContain(', in progress');
    expect(root.querySelector('a[href="/learn/rxjs"]')!.textContent).toContain(', not started');
  });

  it('makes the whole level card a link to the journey', () => {
    const { root } = setup();

    const card = root.querySelector('[data-testid="open-journey"]')!;
    expect(card.tagName).toBe('A');
    expect(card.getAttribute('href')).toBe('/journey');
    expect(card.classList).toContain('interactive-card');
  });
});
