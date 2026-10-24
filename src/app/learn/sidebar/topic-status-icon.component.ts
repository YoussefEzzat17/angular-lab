import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TopicStatus } from '../../core/models/learning.models';

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  'completed': 'completed',
  'in-progress': 'in progress',
  'not-started': 'not started',
};

const RADIUS = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Topic progress at a glance: an empty ring (not started), a ring that fills with the share of sections done
 * (in progress), or a filled Patina check (completed). Decorative: the link it sits in writes the status out
 * (see `TOPIC_STATUS_LABELS`), after the topic name, so it is read as "Signals, in progress".
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-topic-status-icon',
  standalone: true,
  host: { class: 'inline-flex h-5 w-5 shrink-0 items-center justify-center', 'aria-hidden': 'true' },
  template: `
    @switch (status()) {
      @case ('completed') {
        <svg viewBox="0 0 20 20" class="h-5 w-5 text-emerald-400" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="currentColor" />
          <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="rgb(var(--stone-950))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @default {
        <svg viewBox="0 0 20 20" class="h-5 w-5 -rotate-90" aria-hidden="true">
          <!-- An empty ring stays visible on its own; behind progress the track dims so the brass arc reads. -->
          <circle cx="10" cy="10" [attr.r]="radius" fill="none" stroke-width="2"
                  [attr.stroke]="status() === 'in-progress' ? 'rgb(var(--stone-700))' : 'rgb(var(--stone-600))'" />
          @if (status() === 'in-progress') {
            <circle cx="10" cy="10" [attr.r]="radius" fill="none" stroke="rgb(var(--gold-400))" stroke-width="2.5" stroke-linecap="round"
                    [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="dashOffset()" />
          }
        </svg>
      }
    }
  `,
})
export class TopicStatusIconComponent {
  readonly status = input.required<TopicStatus>();
  /** Share of sections done, 0–1. Drawn only while in progress; a visited topic with none done still shows a sliver. */
  readonly fraction = input(0);

  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;
  protected readonly dashOffset = computed(() => CIRCUMFERENCE * (1 - Math.max(0.08, Math.min(1, this.fraction()))));
}
