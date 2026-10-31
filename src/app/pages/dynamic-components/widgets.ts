import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Three small widgets. The lesson picks one at run time. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-widget',
  standalone: true,
  template: `
    <div class="rounded-xl border border-stone-700 bg-stone-900 p-3">
      <p class="text-xs font-bold tracking-wider text-gold-300">CHART</p>
      <p class="text-sm text-stone-100">{{ title() }}</p>
      <div class="mt-2 flex h-10 items-end gap-1" aria-hidden="true">
        <span class="w-3 rounded-t bg-gold-400" style="height: 40%"></span>
        <span class="w-3 rounded-t bg-gold-400" style="height: 80%"></span>
        <span class="w-3 rounded-t bg-gold-400" style="height: 60%"></span>
        <span class="w-3 rounded-t bg-gold-400" style="height: 100%"></span>
      </div>
    </div>
  `,
})
export class ChartWidgetComponent {
  readonly title = input('Chart');
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-widget',
  standalone: true,
  template: `
    <div class="rounded-xl border border-stone-700 bg-stone-900 p-3">
      <p class="text-xs font-bold tracking-wider text-gold-300">TABLE</p>
      <p class="text-sm text-stone-100">{{ title() }}</p>
      <table class="mt-2 w-full text-xs text-stone-300">
        <tr><td class="py-0.5">Ada</td><td class="text-right">12</td></tr>
        <tr><td class="py-0.5">Grace</td><td class="text-right">9</td></tr>
      </table>
    </div>
  `,
})
export class TableWidgetComponent {
  readonly title = input('Table');
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-note-widget',
  standalone: true,
  template: `
    <div class="rounded-xl border border-stone-700 bg-stone-900 p-3">
      <p class="text-xs font-bold tracking-wider text-gold-300">NOTE</p>
      <p class="text-sm text-stone-100">{{ title() }}</p>
      <p class="mt-1 text-xs text-stone-400">Remember to review the lesson tomorrow.</p>
    </div>
  `,
})
export class NoteWidgetComponent {
  readonly title = input('Note');
}
