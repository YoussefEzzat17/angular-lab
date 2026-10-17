import { Component, input } from '@angular/core';
import type { TopicStatus } from '../../core/models/learning.models';

@Component({
  selector: 'app-topic-status-icon',
  standalone: true,
  template: `
    <span [attr.aria-label]="label()" class="inline-flex h-5 w-5 shrink-0 items-center justify-center text-sm">
      @switch (status()) {
        @case ('completed') { <span class="text-emerald-400">✓</span> }
        @case ('in-progress') { <span class="text-gold-400">◐</span> }
        @default { <span class="text-stone-600">○</span> }
      }
    </span>
  `,
})
export class TopicStatusIconComponent {
  readonly status = input.required<TopicStatus>();
  protected readonly label = () => {
    const map: Record<TopicStatus, string> = { 'completed': 'Completed', 'in-progress': 'In progress', 'not-started': 'Not started' };
    return map[this.status()];
  };
}
