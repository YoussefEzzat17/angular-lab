import { Component, contentChildren, effect, inject, input, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { TOPICS } from '../../core/data/topics';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { LessonSectionDirective } from './lesson-section.directive';
import { SectionNavBarComponent, SectionNavItem } from './section-nav-bar.component';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [NgTemplateOutlet, SectionNavBarComponent],
  template: `
    <div class="flex min-h-[calc(100vh-4rem)] flex-col">
      <!-- Section header -->
      <div class="border-b border-stone-800 bg-stone-950/80 px-4 py-3 sm:px-6">
        <div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <p class="text-sm text-stone-400">
              Section {{ currentIndex() + 1 }} of {{ topicMeta()?.sections?.length ?? 0 }}
              @if (currentSection()) {
                · <span class="font-semibold text-stone-200">{{ currentSection()!.title }}</span>
              }
            </p>
            <button type="button"
              (click)="toggleBookmark()"
              [attr.aria-pressed]="isBookmarked()"
              [attr.aria-label]="isBookmarked() ? 'Remove bookmark' : 'Bookmark this section'"
              class="text-lg transition"
              [class.text-gold-400]="isBookmarked()"
              [class.text-stone-600]="!isBookmarked()"
            >🔖</button>
          </div>
          @if (facade.initials()) {
            <span class="text-xs text-stone-500">{{ topicMeta()?.title }}</span>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1">
        @for (sec of sectionDirectives(); track sec.appLessonSection()) {
          @if (sec.appLessonSection() === activeSectionId()) {
            <ng-container [ngTemplateOutlet]="sec.tpl" />
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
  private readonly router = inject(Router);

  protected readonly sectionDirectives = contentChildren(LessonSectionDirective);

  protected readonly topicMeta = () => TOPICS.find((t) => t.id === this.topicId()) ?? null;

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
      if (sectionId) {
        untracked(() => this.facade.visitSection(this.topicId(), sectionId));
      }
    });
  }

  isBookmarked(): boolean {
    return this.bookmarks.isBookmarked(this.topicId(), this.activeSectionId());
  }

  toggleBookmark(): void {
    this.bookmarks.toggle(this.topicId(), this.activeSectionId());
  }

  navigateTo(sectionId: string): void {
    this.router.navigate(['/learn', this.topicId(), sectionId]);
  }

  completeAndNavigate(nextSectionId: string): void {
    this.facade.completeSection(this.topicId(), this.activeSectionId());
    this.router.navigate(['/learn', this.topicId(), nextSectionId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToQuiz(): void {
    this.facade.completeSection(this.topicId(), this.activeSectionId());
    this.router.navigate(['/learn', this.topicId(), 'quiz']);
  }
}
