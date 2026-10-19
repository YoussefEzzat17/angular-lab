import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { TopicStatusIconComponent } from './topic-status-icon.component';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-curriculum-tree',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TopicStatusIconComponent],
  template: `
    <nav aria-label="Course curriculum" class="flex-1 overflow-y-auto px-2 py-3">
      @for (group of facade.groups(); track group.id) {
        <div class="mb-2">
          <button
            type="button"
            [attr.aria-expanded]="isExpanded(group.id)"
            (click)="toggleGroup(group.id)"
            class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-stone-800"
          >
            <span class="text-[11px] font-bold uppercase tracking-wider text-gold-400">{{ group.title }}</span>
            <span class="flex items-center gap-2 text-xs text-stone-500">
              {{ group.completedCount }}/{{ group.topics.length }}
              <span class="transition" [class.rotate-180]="isExpanded(group.id)">▾</span>
            </span>
          </button>

          @if (isExpanded(group.id)) {
            <div class="mt-1 space-y-0.5">
              @for (topic of group.topics; track topic.id) {
                <div>
                  <a
                    [routerLink]="['/learn', topic.id]"
                    [routerLinkActive]="'bg-gold-500/10 text-gold-300'"
                    class="flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-stone-800"
                    [attr.aria-current]="isCurrentTopic(topic.id) ? 'page' : null"
                  >
                    <app-topic-status-icon [status]="topic.status" />
                    <span class="flex-1 truncate font-medium text-stone-200">{{ topic.icon }} {{ topic.title }}</span>
                  </a>

                  <!-- Show sections when this topic is active -->
                  @if (isCurrentTopic(topic.id)) {
                    <div class="ml-8 mt-0.5 space-y-0.5">
                      @for (sec of topic.sections; track sec.id) {
                        <a
                          [routerLink]="['/learn', topic.id, sec.id]"
                          class="flex min-h-8 items-center gap-2 rounded-lg px-2 py-1 text-xs transition hover:bg-stone-800"
                          [class.text-gold-300]="isCurrentSection(topic.id, sec.id)"
                          [class.text-stone-400]="!isCurrentSection(topic.id, sec.id)"
                        >
                          <span class="text-[10px]">{{ progress.isSectionDone(topic.id, sec.id) ? '✓' : '·' }}</span>
                          {{ sec.title }}
                        </a>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
})
export class CurriculumTreeComponent {
  readonly facade = inject(LearningFacade);
  readonly progress = inject(ProgressService);
  private readonly expanded = signal<Set<string>>(new Set(['fundamentals', 'forms-navigation']));

  isExpanded(groupId: string): boolean {
    return this.expanded().has(groupId);
  }

  toggleGroup(groupId: string): void {
    this.expanded.update((s) => {
      const next = new Set(s);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  // Reads facade.currentUrl (a signal), so these checks re-run on every navigation.
  private path(): string {
    return this.facade.currentUrl().split('?')[0].split('#')[0];
  }

  isCurrentTopic(topicId: TopicId): boolean {
    const base = `/learn/${topicId}`;
    const path = this.path();
    return path === base || path.startsWith(`${base}/`);
  }

  isCurrentSection(topicId: TopicId, sectionId: string): boolean {
    return this.path() === `/learn/${topicId}/${sectionId}`;
  }
}
