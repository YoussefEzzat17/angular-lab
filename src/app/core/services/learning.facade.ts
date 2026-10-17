import { Injectable, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TOPICS, GROUPED_TOPICS } from '../data/topics';
import { ProgressService } from './progress.service';
import { ProfileService } from './profile.service';
import { BookmarkService } from './bookmark.service';
import type { TopicId } from '../models/learning.models';

@Injectable({ providedIn: 'root' })
export class LearningFacade {
  private readonly progress = inject(ProgressService);
  private readonly profile = inject(ProfileService);
  private readonly bookmarks = inject(BookmarkService);
  private readonly router = inject(Router);

  // ── Profile passthrough ──────────────────────────────────────────────────
  readonly name = this.profile.name;
  readonly initials = this.profile.initials;
  readonly streak = this.profile.streak;
  readonly onboardingDone = this.profile.onboardingDone;

  // ── Progress passthrough ─────────────────────────────────────────────────
  readonly completedCount = this.progress.completedCount;
  readonly percent = this.progress.percent;
  readonly totalCount = this.progress.totalCount;
  readonly recentActivity = this.progress.recentActivity;

  // ── Bookmark passthrough ─────────────────────────────────────────────────
  readonly bookmarkCount = this.bookmarks.count;

  // ── Curriculum with status ───────────────────────────────────────────────
  readonly groups = computed(() =>
    GROUPED_TOPICS.map((g) => ({
      ...g,
      topics: g.topics.map((t) => ({
        ...t,
        status: this.progress.status(t.id as TopicId),
        allSectionsDone: this.progress.allSectionsDone(t.id as TopicId),
      })),
      completedCount: g.topics.filter((t) => this.progress.status(t.id as TopicId) === 'completed').length,
    }))
  );

  /** The path the "Continue" button should go to. */
  readonly continueTarget = computed(() => {
    const firstIncomplete = TOPICS.find((t) => this.progress.status(t.id) !== 'completed');
    if (!firstIncomplete) return TOPICS[0].path;
    const lastSection = this.progress.getLastSection(firstIncomplete.id);
    if (lastSection) return `${firstIncomplete.path}/${lastSection}`;
    const firstSection = firstIncomplete.sections[0]?.id;
    return firstSection ? `${firstIncomplete.path}/${firstSection}` : firstIncomplete.path;
  });

  // ── Current location from router ─────────────────────────────────────────
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // ── Actions ──────────────────────────────────────────────────────────────
  visitSection(topicId: TopicId, sectionId: string): void {
    this.progress.markVisited(topicId);
    this.progress.setLastSection(topicId, sectionId);
    this.profile.recordActiveDay();
  }

  completeSection(topicId: TopicId, sectionId: string): void {
    this.progress.completeSection(topicId, sectionId);
    this.profile.recordActiveDay();
  }

  toggleBookmark(topicId: TopicId, sectionId: string): void {
    this.bookmarks.toggle(topicId, sectionId);
  }

  setName(name: string): void { this.profile.setName(name); }
  finishOnboarding(): void { this.profile.finishOnboarding(); }
  resetProgress(): void { this.progress.reset(); }
}
