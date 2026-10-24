import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPICS } from '../../core/data/topics';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { IconComponent } from '../../shared/icon.component';
import { GROUP_ICONS } from '../../shared/learning-icons';
import { TOPIC_STATUS_LABELS, TopicStatusIconComponent } from './topic-status-icon.component';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-curriculum-tree',
  standalone: true,
  imports: [RouterLink, IconComponent, TopicStatusIconComponent],
  template: `
    <!-- relative: keeps the absolutely positioned sr-only labels inside the scrolling list. -->
    <nav aria-label="Course curriculum" class="relative flex-1 overflow-y-auto px-2 py-3">
      <ul class="space-y-1">
        @for (group of facade.groups(); track group.id) {
          <li>
            <button
              type="button"
              [attr.aria-expanded]="isExpanded(group.id)"
              [attr.aria-controls]="'curriculum-group-' + group.id"
              (click)="sidebarState.toggleGroup(group.id)"
              class="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 text-left transition hover:bg-stone-800"
            >
              <app-icon [name]="groupIcons[group.id]" class="h-[18px] w-[18px] shrink-0 text-gold-400" />
              <span class="flex-1 truncate text-[13px] font-semibold text-stone-200">{{ group.title }}</span>
              <span class="text-xs tabular-nums text-stone-500">
                {{ group.completedCount }}/{{ group.topics.length }}
                <span class="sr-only">topics completed</span>
              </span>
              <app-icon name="chevron-down" class="h-4 w-4 shrink-0 text-stone-500 transition" [class.rotate-180]="isExpanded(group.id)" />
            </button>

            @if (isExpanded(group.id)) {
              <ul [id]="'curriculum-group-' + group.id" class="mt-0.5 space-y-0.5 pb-1">
                @for (topic of group.topics; track topic.id) {
                  <li>
                    <a
                      [routerLink]="['/learn', topic.id]"
                      [attr.aria-current]="isCurrentTopic(topic.id) ? (isTopicOverview(topic.id) ? 'page' : 'true') : null"
                      [attr.title]="topic.title"
                      class="flex min-h-11 items-center gap-2.5 rounded-xl pl-3 pr-2.5 text-sm transition"
                      [class]="isCurrentTopic(topic.id) ? 'bg-gold-500/10 text-gold-300' : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'"
                    >
                      <app-topic-status-icon [status]="topic.status" [fraction]="sectionFraction(topic.id)" />
                      <span class="min-w-0 flex-1 truncate font-medium">{{ topic.title }}</span>
                      <span class="sr-only">, {{ statusLabels[topic.status] }}</span>
                    </a>

                    <!-- The current topic opens onto its sections -->
                    @if (isCurrentTopic(topic.id)) {
                      <ul class="mb-1 ml-[1.375rem] mt-0.5 space-y-0.5 border-l border-stone-800 pl-2.5">
                        @for (sec of topic.sections; track sec.id) {
                          <li>
                            <a
                              [routerLink]="['/learn', topic.id, sec.id]"
                              [attr.aria-current]="isCurrentSection(topic.id, sec.id) ? 'page' : null"
                              [attr.title]="sec.title"
                              class="flex min-h-10 items-center gap-2 rounded-lg px-2 text-[13px] transition"
                              [class]="isCurrentSection(topic.id, sec.id) ? 'bg-stone-800 font-semibold text-gold-300' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'"
                            >
                              @if (progress.isSectionDone(topic.id, sec.id)) {
                                <app-icon name="check" class="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              } @else {
                                <span aria-hidden="true" class="grid h-3.5 w-3.5 shrink-0 place-items-center">
                                  <span class="h-1.5 w-1.5 rounded-full" [class]="isCurrentSection(topic.id, sec.id) ? 'bg-gold-400' : 'bg-stone-600'"></span>
                                </span>
                              }
                              <span class="min-w-0 flex-1 truncate">{{ sec.title }}</span>
                              @if (progress.isSectionDone(topic.id, sec.id)) {
                                <span class="sr-only">, done</span>
                              }
                            </a>
                          </li>
                        }
                      </ul>
                    }
                  </li>
                }
              </ul>
            }
          </li>
        }
      </ul>
    </nav>
  `,
})
export class CurriculumTreeComponent {
  readonly facade = inject(LearningFacade);
  readonly progress = inject(ProgressService);
  protected readonly sidebarState = inject(SidebarStateService);

  protected readonly groupIcons = GROUP_ICONS;
  protected readonly statusLabels = TOPIC_STATUS_LABELS;

  constructor() {
    // Open the group of the topic being studied whenever the learner arrives in it (other groups keep their state).
    // With no topic in view and nothing open yet, start with the first group.
    effect(() => {
      const topic = TOPICS.find((t) => this.isCurrentTopic(t.id as TopicId));
      untracked(() => {
        const expanded = this.sidebarState.expandedGroups();
        const group = topic?.group ?? (expanded.size === 0 ? 'fundamentals' : null);
        if (group && !expanded.has(group)) this.sidebarState.toggleGroup(group);
      });
    });
  }

  isExpanded(groupId: string): boolean {
    return this.sidebarState.expandedGroups().has(groupId);
  }

  sectionFraction(topicId: TopicId): number {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic?.sections.length) return 0;
    return topic.sections.filter((s) => this.progress.isSectionDone(topicId, s.id)).length / topic.sections.length;
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

  isTopicOverview(topicId: TopicId): boolean {
    return this.path() === `/learn/${topicId}`;
  }

  isCurrentSection(topicId: TopicId, sectionId: string): boolean {
    return this.path() === `/learn/${topicId}/${sectionId}`;
  }
}
