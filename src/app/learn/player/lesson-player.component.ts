import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, contentChildren, effect, ElementRef, inject, Injector, input, signal, untracked, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TOPIC_GROUPS, TOPICS } from '../../core/data/topics';
import { BookmarkService } from '../../core/services/bookmark.service';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { SECTION_KIND_ICONS, SECTION_KIND_LABELS } from '../../shared/learning-icons';
import { IN_LESSON_PLAYER } from '../../shared/lesson-context';
import { LessonSectionDirective } from './lesson-section.directive';
import { SectionNavBarComponent, SectionNavItem } from './section-nav-bar.component';

import type { TopicId } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lesson-player',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, IconComponent, SectionNavBarComponent],
  template: `
    <div class="flex min-h-[calc(100vh-4rem)] flex-col">
      <!-- Lesson header: where you are, what this section is, and every step of the topic -->
      <header #sectionTop class="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        @if (topicMeta(); as t) {
          <nav aria-label="Breadcrumb">
            <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-stone-400">
              <li>{{ groupTitle() }}</li>
              <li aria-hidden="true"><app-icon name="chevron-right" class="h-3.5 w-3.5 text-stone-600" /></li>
              <li>
                <a [routerLink]="['/learn', t.id]" class="rounded font-medium text-stone-300 underline-offset-4 hover:text-gold-300 hover:underline">{{ t.title }}</a>
              </li>
              <li aria-hidden="true"><app-icon name="chevron-right" class="h-3.5 w-3.5 text-stone-600" /></li>
              <li aria-current="page" class="text-stone-200">{{ currentSection()?.title }}</li>
            </ol>
          </nav>

          <div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <h1 #heading tabindex="-1" class="text-2xl font-bold text-stone-100 [text-wrap:balance] focus:outline-none sm:text-3xl">
                {{ currentSection()?.title }}
              </h1>
  
              <p class="mt-2 text-sm text-stone-500" data-testid="section-meta">
                Section {{ currentIndex() + 1 }} of {{ t.sections.length }}
                @if (currentSection(); as s) {
                  · {{ kindLabels[s.kind] }} · ~{{ s.minutes }} min
                }
              </p>
            </div>
            <button type="button"
              (click)="toggleBookmark()"
              [attr.aria-pressed]="isBookmarked()"
              [attr.aria-label]="isBookmarked() ? 'Remove from saved' : 'Save this section for later'"
              class="btn-base shrink-0 self-start border"
              [class]="isBookmarked() ? 'border-gold-500/40 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:border-gold-400/50 hover:text-gold-300'"
            >
              @if (isBookmarked()) {
                <svg viewBox="0 0 24 24" width="16" height="16" class="shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-5-8 5V4a1 1 0 0 1 1-1z" />
                </svg>
                Saved
              } @else {
                <svg viewBox="0 0 24 24" width="16" height="16" class="shrink-0" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-5-8 5V4a1 1 0 0 1 1-1z" />
                </svg>
                Save for later
              }
            </button>
          </div>

          <!-- Section tabs: the topic's real sections, then the quiz. Links, because every section has its own URL. -->
          <!-- relative: the sr-only labels are absolutely positioned; without it they escape the scroll clip and widen the page on phones. -->
          <nav aria-label="Lesson sections" class="relative -mx-4 mt-6 overflow-x-auto border-b border-stone-800 px-4 sm:-mx-6 sm:px-6">
            <ol class="flex min-w-max gap-1">
              @for (s of navItems(); track s.id; let i = $index) {
                <li>
                  <a
                    [routerLink]="['/learn', t.id, s.id]"
                    [attr.aria-current]="s.id === activeSectionId() ? 'step' : null"
                    [attr.data-section-tab]="s.id"
                    class="-mb-px flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition"
                    [class]="s.id === activeSectionId()
                      ? 'border-gold-400 text-gold-300'
                      : 'border-transparent text-stone-400 hover:border-stone-600 hover:text-stone-100'"
                  >
                    @if (s.done) {
                      <app-icon name="check" class="h-4 w-4 text-emerald-400" />
                    } @else {
                      <app-icon [name]="kindIcons[t.sections[i].kind]" class="h-4 w-4 opacity-70" />
                    }
                    {{ s.title }}
                    <span class="sr-only">({{ kindLabels[t.sections[i].kind] }}{{ s.done ? ', done' : '' }})</span>
                  </a>
                </li>
              }
              <li>
                @if (quizUnlocked()) {
                  <a [routerLink]="['/learn', t.id, 'quiz']"
                     class="-mb-px flex min-h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:text-gold-300">
                    <app-icon name="help" class="h-4 w-4" />
                    Quiz
                  </a>
                } @else {
                  <span aria-disabled="true" data-testid="quiz-tab-locked"
                        title="Finish every section to unlock the quiz"
                        class="flex min-h-11 cursor-not-allowed items-center gap-2 px-3 text-sm font-semibold text-stone-500">
                    <app-icon name="lock" class="h-4 w-4" />
                    Quiz
                    <span class="sr-only">(locked until every section is done)</span>
                  </span>
                }
              </li>
            </ol>
          </nav>
        }
      </header>

      <!-- Moves to the next section from the bottom bar are announced here, since focus stays on that bar. -->
      <p class="sr-only" aria-live="polite">{{ announcement() }}</p>

      <!-- Content. Sections were written as standalone pages, so their top padding and first margin tighten under the
           header. The scroll margin keeps a control focused by keyboard clear of the sticky bar (and the mobile nav). -->
      <div class="flex-1 [&>section>:first-child]:mt-0 [&>section]:pt-6 sm:[&>section]:pt-8 [&_*]:scroll-mb-[calc(10rem+env(safe-area-inset-bottom))] lg:[&_*]:scroll-mb-24">
        @for (sec of sectionDirectives(); track sec.appLessonSection()) {
          @if (sec.appLessonSection() === activeSectionId()) {
            <ng-container [ngTemplateOutlet]="sec.tpl" [ngTemplateOutletInjector]="sectionInjector" />
          }
        }
      </div>

      <!-- Sticky bottom nav -->
      <app-section-nav-bar
        [sections]="navItems()"
        [currentSectionId]="activeSectionId()"
        (go)="navigateTo($event)"
        (completeAndGo)="completeAndNavigate($event)"
        (goQuiz)="goToQuiz()"
      />
    </div>
  `,
})
export class LessonPlayerComponent {
  readonly topicId = input.required<TopicId>();
  /** Section id from the URL. Passed in by the page component, which receives it via withComponentInputBinding. */
  readonly section = input<string>();

  protected readonly facade = inject(LearningFacade);
  private readonly progress = inject(ProgressService);
  private readonly bookmarks = inject(BookmarkService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  protected readonly kindIcons = SECTION_KIND_ICONS;
  protected readonly kindLabels = SECTION_KIND_LABELS;

  protected readonly sectionDirectives = contentChildren(LessonSectionDirective);
  private readonly sectionTop = viewChild<ElementRef<HTMLElement>>('sectionTop');
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  /** Tells the sections they are inside the player, so their own headings step down below its h1. */
  protected readonly sectionInjector = Injector.create({
    providers: [{ provide: IN_LESSON_PLAYER, useValue: true }],
    parent: this.injector,
  });

  protected readonly announcement = signal('');
  private previousSectionId: string | null = null;
  /** True while a move comes from the bottom bar: focus stays on its button and the move is announced instead. */
  private keepFocus = false;

  protected readonly topicMeta = () => TOPICS.find((t) => t.id === this.topicId()) ?? null;

  protected readonly groupTitle = () => TOPIC_GROUPS.find((g) => g.id === this.topicMeta()?.group)?.title ?? '';

  protected readonly quizUnlocked = () => this.progress.allSectionsDone(this.topicId());

  protected readonly activeSectionId = () => {
    const s = this.section();
    const meta = this.topicMeta();
    if (!meta) return '';
    if (s && meta.sections.some((sec) => sec.id === s)) return s;
    // Default: last visited section (if it still exists) or the first section
    // untracked: visiting a section writes progress state, and that must not re-run the active-section computation.
    const last = untracked(() => this.progress.getLastSection(this.topicId()));
    if (last && meta.sections.some((sec) => sec.id === last)) return last;
    return meta.sections[0]?.id ?? '';
  };

  protected readonly currentIndex = () => {
    const meta = this.topicMeta();
    if (!meta) return 0;
    return meta.sections.findIndex((s) => s.id === this.activeSectionId());
  };

  protected readonly currentSection = () => {
    const meta = this.topicMeta();
    if (!meta) return null;
    return meta.sections.find((s) => s.id === this.activeSectionId()) ?? null;
  };

  protected readonly navItems = (): SectionNavItem[] => {
    const meta = this.topicMeta();
    if (!meta) return [];
    return meta.sections.map((s) => ({
      id: s.id,
      title: s.title,
      done: this.progress.isSectionDone(this.topicId(), s.id),
    }));
  };

  constructor() {
    // Runs again when the :section param changes, because Angular reuses this component across sections.
    effect(() => {
      const sectionId = this.activeSectionId();
      if (!sectionId) return;
      untracked(() => {
        this.facade.visitSection(this.topicId(), sectionId);
        const changed = this.previousSectionId !== null && this.previousSectionId !== sectionId;
        this.previousSectionId = sectionId;
        afterNextRender(() => (changed ? this.onSectionChanged() : this.revealCurrentTab()), { injector: this.injector });
      });
    });
  }

  isBookmarked(): boolean {
    return this.bookmarks.isBookmarked(this.topicId(), this.activeSectionId());
  }

  toggleBookmark(): void {
    const wasSaved = this.isBookmarked();
    this.bookmarks.toggle(this.topicId(), this.activeSectionId());

    const description = [this.topicMeta()?.title, this.currentSection()?.title].filter(Boolean).join(' · ') || undefined;
    if (wasSaved) {
      this.toast.info('Removed from Saved Topics', description);
    } else {
      this.toast.success('Added to Saved Topics', description);
    }
  }

  navigateTo(sectionId: string): void {
    this.keepFocus = true;
    this.router.navigate(['/learn', this.topicId(), sectionId]);
  }

  completeAndNavigate(nextSectionId: string): void {
    this.facade.completeSection(this.topicId(), this.activeSectionId());
    this.keepFocus = true;
    this.router.navigate(['/learn', this.topicId(), nextSectionId]);
  }

  goToQuiz(): void {
    this.facade.completeSection(this.topicId(), this.activeSectionId());
    this.router.navigate(['/learn', this.topicId(), 'quiz']);
  }

  /**
   * A new section opens at its top, wherever the learner was. Moves from the tabs, the sidebar or a link put focus
   * on the new h1, so the next Tab starts in the new section; moves from the bottom bar leave focus on its button
   * (pressing Next again is the common next step) and announce the new section instead. The lesson layout scrolls
   * its content column, not the window, so the header is scrolled into view. A JS smooth scroll ignores the CSS
   * reduced-motion rule, so check it here.
   */
  private onSectionChanged(): void {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.sectionTop()?.nativeElement.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    this.revealCurrentTab();

    const focusLost = !this.document.activeElement || this.document.activeElement === this.document.body;
    if (this.keepFocus && !focusLost) {
      const meta = this.topicMeta();
      this.announcement.set(`Section ${this.currentIndex() + 1} of ${meta?.sections.length ?? 0}: ${this.currentSection()?.title ?? ''}`);
    } else {
      this.heading()?.nativeElement.focus({ preventScroll: true });
    }
    this.keepFocus = false;
  }

  /** On a phone the tab row scrolls sideways; keep the current tab in view. */
  private revealCurrentTab(): void {
    const tab = this.sectionTop()?.nativeElement.querySelector<HTMLElement>(`[data-section-tab="${this.activeSectionId()}"]`);
    const row = tab?.closest('nav');
    if (!tab || !row) return;
    const tabBox = tab.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    row.scrollLeft = Math.max(0, row.scrollLeft + tabBox.left - rowBox.left - row.clientWidth / 2 + tabBox.width / 2);
  }
}
