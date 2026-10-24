import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ProgressService } from '../../core/services/progress.service';
import { ToastService } from '../../core/services/toast.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { LessonPlayerComponent } from './lesson-player.component';
import { LessonSectionDirective } from './lesson-section.directive';

@Component({
  standalone: true,
  imports: [LessonPlayerComponent, LessonSectionDirective, PageHeaderComponent],
  template: `
    <app-lesson-player [topicId]="'binding'" [section]="section()">
      <ng-template appLessonSection="overview"><app-page-header title="Data Binding">Intro</app-page-header><p data-testid="body-overview">Overview body</p></ng-template>
      <ng-template appLessonSection="interpolation"><p data-testid="body-interpolation">Interpolation body</p></ng-template>
      <ng-template appLessonSection="property-binding"><p data-testid="body-property">Property body</p></ng-template>
      <ng-template appLessonSection="event-binding"><p data-testid="body-event">Event body</p></ng-template>
      <ng-template appLessonSection="two-way"><p data-testid="body-two-way">Two-way body</p></ng-template>
    </app-lesson-player>
  `,
})
class HostComponent {
  readonly section = signal<string | undefined>('interpolation');
}

/** The sections of the topic the host uses, read from the data so these tests survive lessons growing. */
const SECTIONS = TOPICS.find((t) => t.id === 'binding')!.sections;
const position = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;
const titleOf = (id: string) => SECTIONS.find((s) => s.id === id)!.title;

describe('LessonPlayerComponent', () => {
  /** `null` means no section in the URL (a default parameter would turn `undefined` into 'interpolation'). */
  function setup(section: string | null = 'interpolation', seed?: () => void) {
    localStorage.clear();
    seed?.();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const scrollIntoView = spyOn(HTMLElement.prototype, 'scrollIntoView');
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.section.set(section ?? undefined);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const has = (testId: string) => root.querySelector(`[data-testid="${testId}"]`) !== null;
    const headerText = () => root.querySelector('header')?.textContent?.replace(/\s+/g, ' ').trim();
    const navButtons = () => Array.from(root.querySelectorAll<HTMLButtonElement>('nav[aria-label="Section navigation"] button'));
    /** What the router does after a navigation: hand the player the new :section, then let it render. */
    const arrive = async (id: string) => {
      fixture.componentInstance.section.set(id);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const sectionTabs = () => Array.from(root.querySelectorAll<HTMLAnchorElement>('nav[aria-label="Lesson sections"] a[data-section-tab]'));
    return { fixture, root, has, headerText, navButtons, navigate, scrollIntoView, arrive, sectionTabs };
  }

  afterEach(() => localStorage.clear());

  it('shows only the section from the URL', () => {
    const { has } = setup('property-binding');

    expect(has('body-property')).toBeTrue();
    expect(has('body-interpolation')).toBeFalse();
    expect(has('body-event')).toBeFalse();
  });

  it('swaps the content when the section changes', () => {
    const { fixture, has } = setup('interpolation');

    fixture.componentInstance.section.set('event-binding');
    fixture.detectChanges();

    expect(has('body-event')).toBeTrue();
    expect(has('body-interpolation')).toBeFalse();
  });

  it('says which section of how many the learner is on', () => {
    const { headerText } = setup('event-binding');

    expect(headerText()).toContain(`Section ${position('event-binding')} of ${SECTIONS.length}`);
    expect(headerText()).toContain(titleOf('event-binding'));
  });

  it('records the visit so Continue can bring the learner back', () => {
    setup('property-binding');

    const progress = TestBed.inject(ProgressService);

    expect(progress.getLastSection('binding')).toBe('property-binding');
    expect(progress.isVisited('/learn/binding')).toBeTrue();
  });

  it('opens the last visited section when the URL has none', () => {
    const { has } = setup(null, () =>
      localStorage.setItem(
        'angular-lab:progress',
        JSON.stringify({ version: 2, topics: { binding: { sectionsDone: [], attempts: [], lastSectionId: 'event-binding' } }, activity: [] }),
      ),
    );

    expect(has('body-event')).toBeTrue();
    expect(has('body-overview')).toBeFalse();
  });

  it('opens the first section when the URL has none and nothing was visited', () => {
    const { has } = setup(null);

    expect(has('body-overview')).toBeTrue();
  });

  it('falls back to the first section for an id that does not exist', () => {
    const { has } = setup('no-such-section');

    expect(has('body-overview')).toBeTrue();
  });

  it('saves the section for later and tells the learner', () => {
    const { root, fixture } = setup('interpolation');

    root.querySelector<HTMLButtonElement>('button[aria-pressed]')!.click();
    fixture.detectChanges();

    expect(TestBed.inject(BookmarkService).isBookmarked('binding', 'interpolation')).toBeTrue();
    expect(TestBed.inject(ToastService).toasts()[0].title).toBe('Added to Saved Topics');
    expect(root.querySelector('button[aria-pressed]')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('removes the bookmark on a second press', () => {
    const { root, fixture } = setup('interpolation');
    const press = () => {
      root.querySelector<HTMLButtonElement>('button[aria-pressed]')!.click();
      fixture.detectChanges();
    };

    press();
    press();

    expect(TestBed.inject(BookmarkService).isBookmarked('binding', 'interpolation')).toBeFalse();
    expect(TestBed.inject(ToastService).toasts().at(-1)?.title).toBe('Removed from Saved Topics');
  });

  it('marks the section done and moves on when the learner presses Next', () => {
    const { navButtons, navigate } = setup('interpolation');

    navButtons().at(-1)!.click();

    expect(TestBed.inject(ProgressService).isSectionDone('binding', 'interpolation')).toBeTrue();
    expect(navigate).toHaveBeenCalledWith(['/learn', 'binding', 'property-binding']);
  });

  it('goes to the quiz from the last section, and finishes that section first', () => {
    const lastId = SECTIONS.at(-1)!.id;
    const { navButtons, navigate } = setup(lastId);

    navButtons().at(-1)!.click();

    expect(TestBed.inject(ProgressService).isSectionDone('binding', lastId)).toBeTrue();
    expect(navigate).toHaveBeenCalledWith(['/learn', 'binding', 'quiz']);
  });

  it('jumps to a section from its dot without marking the current one done', () => {
    const { root, navigate } = setup('interpolation');

    root.querySelector<HTMLButtonElement>(`[aria-label="Section ${position('event-binding')}: ${titleOf('event-binding')}"]`)!.click();

    expect(navigate).toHaveBeenCalledWith(['/learn', 'binding', 'event-binding']);
    expect(TestBed.inject(ProgressService).isSectionDone('binding', 'interpolation')).toBeFalse();
  });

  it('keeps the section bar sticky on its host, where it has room to move', () => {
    const { root } = setup('interpolation');

    const host = root.querySelector('app-section-nav-bar')!;

    expect(host.classList).toContain('sticky');
    expect(host.classList).toContain('bottom-0');
  });

  it('opens the next section at its top, even when Next is pressed far down the page', async () => {
    const { root, navButtons, scrollIntoView, arrive } = setup('interpolation');

    navButtons().at(-1)!.click();
    await arrive('property-binding');

    expect(scrollIntoView).toHaveBeenCalledOnceWith({ block: 'start', behavior: 'smooth' });
    const scrolled: unknown = scrollIntoView.calls.mostRecent().object;
    expect(scrolled).toBe(root.querySelector('header'));
  });

  it('does not scroll or move focus when the lesson first opens', async () => {
    const { fixture, scrollIntoView } = setup('interpolation');
    await fixture.whenStable();

    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(document.activeElement?.tagName).not.toBe('H1');
  });

  it('jumps instead of gliding when the learner prefers reduced motion', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const { navButtons, scrollIntoView, arrive } = setup('interpolation');

    navButtons().at(-1)!.click();
    await arrive('property-binding');

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(scrollIntoView).toHaveBeenCalledOnceWith({ block: 'start', behavior: 'auto' });
  });

  it('keeps focus on the bottom bar and announces the new section when Next is pressed there', async () => {
    const { root, navButtons, arrive } = setup('interpolation');
    const next = navButtons().at(-1)!;

    next.focus();
    next.click();
    await arrive('property-binding');

    expect(document.activeElement).toBe(next);
    expect(root.querySelector('[aria-live="polite"]')?.textContent).toContain(
      `Section ${position('property-binding')} of ${SECTIONS.length}: ${titleOf('property-binding')}`,
    );
  });

  it('moves focus to the new section title when the learner arrives another way (tab, sidebar, link)', async () => {
    const { root, arrive } = setup('interpolation');

    await arrive('event-binding');

    expect(document.activeElement).toBe(root.querySelector('h1'));
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(titleOf('event-binding'));
  });

  it('heads the page with breadcrumbs and one h1, the section title', () => {
    const { root } = setup('overview');

    const crumbs = root.querySelector('nav[aria-label="Breadcrumb"]')?.textContent?.replace(/\s+/g, ' ').trim();
    expect(crumbs).toContain('Fundamentals');
    expect(crumbs).toContain('Data Binding');
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(titleOf('overview'));
    // The topic intro inside the section steps down to h2.
    expect(root.querySelector('app-page-header h2')?.textContent?.trim()).toBe('Data Binding');
  });

  it('lists every section as a tab, marks the current and done ones, and links each to its URL', () => {
    const { root, sectionTabs } = setup('property-binding', () =>
      localStorage.setItem(
        'angular-lab:progress',
        JSON.stringify({ version: 2, topics: { binding: { sectionsDone: ['overview'], attempts: [] } }, activity: [] }),
      ),
    );

    const tabs = sectionTabs();
    expect(tabs.map((t) => t.dataset['sectionTab'])).toEqual(SECTIONS.map((s) => s.id));
    expect(tabs.find((t) => t.getAttribute('aria-current') === 'step')?.dataset['sectionTab']).toBe('property-binding');
    expect(tabs[0].textContent).toContain('done');
    expect(tabs[0].getAttribute('href')).toBe('/learn/binding/overview');
    expect(root.querySelector('[data-testid="quiz-tab-locked"]')).not.toBeNull();
  });

  it('unlocks the quiz tab once every section is done', () => {
    const { root } = setup('overview', () =>
      localStorage.setItem(
        'angular-lab:progress',
        JSON.stringify({ version: 2, topics: { binding: { sectionsDone: SECTIONS.map((s) => s.id), attempts: [] } }, activity: [] }),
      ),
    );

    expect(root.querySelector('[data-testid="quiz-tab-locked"]')).toBeNull();
    const quiz = Array.from(root.querySelectorAll('nav[aria-label="Lesson sections"] a')).find((a) => a.textContent?.includes('Quiz'));
    expect(quiz?.getAttribute('href')).toBe('/learn/binding/quiz');
  });

  it('marks the current dot as the current step', () => {
    const { root } = setup('property-binding');

    const current = root.querySelector('nav[aria-label="Section navigation"] [aria-current="step"]');

    expect(current?.getAttribute('aria-label')).toBe(`Section ${position('property-binding')}: ${titleOf('property-binding')}`);
  });
});
