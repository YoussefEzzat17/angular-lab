import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ProgressService } from '../../core/services/progress.service';
import { ToastService } from '../../core/services/toast.service';
import { LessonPlayerComponent } from './lesson-player.component';
import { LessonSectionDirective } from './lesson-section.directive';

@Component({
  standalone: true,
  imports: [LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'binding'" [section]="section()">
      <ng-template appLessonSection="overview"><p data-testid="body-overview">Overview body</p></ng-template>
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
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.section.set(section ?? undefined);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const has = (testId: string) => root.querySelector(`[data-testid="${testId}"]`) !== null;
    const headerText = () => root.querySelector('.border-b')?.textContent?.replace(/\s+/g, ' ').trim();
    const navButtons = () => Array.from(root.querySelectorAll<HTMLButtonElement>('nav[aria-label="Section navigation"] button'));
    return { fixture, root, has, headerText, navButtons, navigate };
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

  it('marks the current dot as the current step', () => {
    const { root } = setup('property-binding');

    const current = root.querySelector('[aria-current="step"]');

    expect(current?.getAttribute('aria-label')).toBe(`Section ${position('property-binding')}: ${titleOf('property-binding')}`);
  });
});
