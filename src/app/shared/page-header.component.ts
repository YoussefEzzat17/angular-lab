import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { IN_LESSON_PLAYER } from './lesson-context';
import { IllustrationName, TopicIllustrationComponent } from './topic-illustration.component';

/**
 * The top of a topic page: small eyebrow, big title, and the intro
 * paragraph (projected, so it can contain <strong>/<code> markup).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-header',
  standalone: true,
  imports: [TopicIllustrationComponent],
  host: { class: 'block' },
  template: `
    <div [class]="illustration() ? 'md:flex md:items-start md:justify-between md:gap-8' : ''">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-start justify-between gap-4" [class.md:block]="illustration()">
          <div>
            @if (inLesson) {
              <!-- Inside the lesson player the breadcrumbs already place the page, and the section title is the h1. -->
              <h2 class="text-2xl font-bold sm:text-3xl">{{ title() }}</h2>
            } @else {
              <p class="text-sm font-semibold text-gold-400">{{ eyebrow() }}</p>
              <h1 class="mt-1 text-3xl font-bold sm:text-4xl">{{ title() }}</h1>
            }
          </div>
        </div>
        <p class="mt-3 max-w-3xl text-stone-400"><ng-content /></p>
      </div>

      @if (illustration(); as art) {
        <div class="hidden shrink-0 md:flex md:w-64 md:flex-col md:items-end md:gap-4 lg:w-72">
          <app-topic-illustration [name]="art" class="w-full" />
        </div>
      }
    </div>
    @if (illustration(); as art) {
      <app-topic-illustration [name]="art" class="mx-auto mt-6 w-full max-w-xs md:hidden" />
    }
  `,
})
export class PageHeaderComponent {
  protected readonly inLesson = inject(IN_LESSON_PLAYER, { optional: true }) ?? false;

  readonly title = input.required<string>();
  readonly eyebrow = input('HANDS-ON WORKSHOP');
  /** Optional animated diagram shown beside the intro (below it on phones). */
  readonly illustration = input<IllustrationName>();
}
