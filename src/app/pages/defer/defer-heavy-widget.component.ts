import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeferStatsService } from './defer-stats.service';

/**
 * Stands in for something expensive, like a chart or a rich-text editor.
 * It lives in its own file on purpose: Angular only splits a deferred component into its own chunk
 * when nothing else in the same file uses it outside a @defer block.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-defer-heavy-widget',
  standalone: true,
  template: `
    <div class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4" data-testid="defer-widget">
      <p class="text-sm font-semibold text-emerald-200">📊 Heavy widget loaded</p>
      <p class="mt-1 text-xs text-stone-300">It was created at {{ createdAt }}. Its code was not in the first download.</p>
    </div>
  `,
})
export class DeferHeavyWidgetComponent {
  readonly createdAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  constructor() {
    inject(DeferStatsService).created.update((n) => n + 1);
  }
}
