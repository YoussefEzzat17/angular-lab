import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { GROUPED_TOPICS, TOPICS } from '../../core/data/topics';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { CourseSidebarComponent } from './course-sidebar.component';

const SIGNALS = TOPICS.find((t) => t.id === 'signals')!;
const EMOJI = /\p{Extended_Pictographic}/u;

describe('CourseSidebarComponent', () => {
  async function setup(url: string, opts: { variant?: 'desktop' | 'drawer'; progress?: object } = {}) {
    localStorage.clear();
    if (opts.progress) localStorage.setItem('angular-lab:progress', JSON.stringify(opts.progress));
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
    await TestBed.inject(Router).navigateByUrl(url);
    const fixture = TestBed.createComponent(CourseSidebarComponent);
    if (opts.variant) fixture.componentRef.setInput('variant', opts.variant);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const groupButton = (title: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('nav[aria-label="Course curriculum"] button')).find((b) => b.textContent?.includes(title))!;
    const link = (href: string) => root.querySelector<HTMLAnchorElement>(`nav[aria-label="Course curriculum"] a[href="${href}"]`);
    return { fixture, root, groupButton, link };
  }

  afterEach(() => localStorage.clear());

  it('leaves the app pages to the top navbar', async () => {
    const { root } = await setup('/dashboard');

    expect(root.querySelector('a[href="/dashboard"]')).toBeNull();
    expect(root.querySelector('a[href="/history"]')).toBeNull();
  });

  it('lists every curriculum group from the topic data, each with a drawn icon and its progress', async () => {
    const { root } = await setup('/dashboard');

    const buttons = Array.from(root.querySelectorAll('nav[aria-label="Course curriculum"] > ul > li > button'));
    expect(buttons.map((b) => b.textContent!.replace(/\s+/g, ' ').trim())).toEqual(
      GROUPED_TOPICS.map((g) => `${g.title} 0/${g.topics.length} topics completed`),
    );
    expect(buttons.every((b) => b.querySelector('app-icon svg'))).toBeTrue();
  });

  it('uses no emoji in the navigation', async () => {
    const { root } = await setup('/learn/signals/basics');

    expect(EMOJI.test(root.querySelector('nav[aria-label="Course curriculum"]')!.textContent!)).toBeFalse();
  });

  it('opens the group of the topic being studied, and wires each toggle to the list it controls', async () => {
    const { root, groupButton } = await setup('/learn/signals/computed');

    const reactivity = groupButton('Reactivity');
    expect(reactivity.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector(`#${reactivity.getAttribute('aria-controls')}`)).not.toBeNull();
    expect(groupButton('Performance').getAttribute('aria-expanded')).toBe('false');
  });

  it('expands and collapses a group on click', async () => {
    const { fixture, groupButton, link } = await setup('/dashboard');

    groupButton('Performance').click();
    fixture.detectChanges();
    expect(groupButton('Performance').getAttribute('aria-expanded')).toBe('true');
    expect(link('/learn/defer')).not.toBeNull();

    groupButton('Performance').click();
    fixture.detectChanges();
    expect(link('/learn/defer')).toBeNull();
  });

  it('marks the current topic and section, says each topic status, and keeps full names for truncated rows', async () => {
    const { link } = await setup('/learn/signals/computed', {
      progress: { version: 2, topics: { signals: { sectionsDone: ['basics'], attempts: [] } }, activity: [] },
    });

    const topic = link('/learn/signals')!;
    expect(topic.getAttribute('aria-current')).toBe('true');
    expect(topic.getAttribute('title')).toBe('Signals');
    expect(topic.textContent!.replace(/\s+/g, ' ').trim()).toBe('Signals, in progress');

    expect(link('/learn/signals/computed')!.getAttribute('aria-current')).toBe('page');
    expect(link('/learn/signals/basics')!.textContent).toContain('done');
    expect(link('/learn/signals/computed')!.textContent).not.toContain('done');
  });

  it('shows the sections of the current topic only', async () => {
    const { link } = await setup('/learn/signals/basics');

    for (const s of SIGNALS.sections) expect(link(`/learn/signals/${s.id}`)).withContext(s.id).not.toBeNull();
    expect(link('/learn/rxjs/observables')).toBeNull();
  });

  it('fills the status ring with the share of sections done', async () => {
    const { link } = await setup('/learn/signals/basics', {
      progress: { version: 2, topics: { signals: { sectionsDone: ['basics', 'computed', 'effects'], attempts: [] } }, activity: [] },
    });

    const arc = link('/learn/signals')!.querySelectorAll('app-topic-status-icon circle')[1];
    const dash = Number(arc.getAttribute('stroke-dasharray'));
    const offset = Number(arc.getAttribute('stroke-dashoffset'));
    expect(1 - offset / dash).toBeCloseTo(3 / SIGNALS.sections.length, 2);
  });

  it('keeps the phone drawer to the curriculum, with no collapse button', async () => {
    const { root } = await setup('/learn/signals/basics', { variant: 'drawer' });

    expect(root.querySelector('[aria-label="Collapse sidebar"]')).toBeNull();
    expect(root.querySelector('nav[aria-label="Course curriculum"]')).not.toBeNull();
  });

  it('collapses the desktop sidebar from its button', async () => {
    const { root } = await setup('/dashboard');
    const state = TestBed.inject(SidebarStateService);
    const before = state.collapsed();

    root.querySelector<HTMLButtonElement>('[aria-label="Collapse sidebar"]')!.click();

    expect(state.collapsed()).toBe(!before);
    state.collapsed.set(before);
  });
});
