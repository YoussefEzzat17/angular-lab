import { ChangeDetectionStrategy, Component, contentChildren, effect, input, signal } from '@angular/core';

/** One slot: whatever the parent writes between the tags shows up where <ng-content /> is. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fancy-card',
  standalone: true,
  template: `
    <div class="rounded-2xl border border-gold-500/40 bg-gold-950/20 p-4" data-testid="fancy-card">
      <ng-content />
    </div>
  `,
})
export class FancyCardComponent {}

/** Three slots: a title, a footer, and everything else. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-slot-card',
  standalone: true,
  template: `
    <article class="overflow-hidden rounded-2xl border border-stone-700 bg-stone-900" data-testid="slot-card">
      <header class="border-b border-stone-800 bg-stone-800/60 px-4 py-2 text-sm font-bold text-gold-300"><ng-content select="[card-title]" /></header>
      <div class="px-4 py-3 text-sm text-stone-300"><ng-content /></div>
      <footer class="border-t border-stone-800 px-4 py-2 text-xs text-stone-400"><ng-content select="[card-footer]" /></footer>
    </article>
  `,
})
export class SlotCardComponent {}

/** One tab. It only shows its content while `active` is on; the tabs component switches that. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tab-panel',
  standalone: true,
  template: `
    @if (active()) {
      <div role="tabpanel" class="text-sm text-stone-300"><ng-content /></div>
    }
  `,
})
export class TabPanelComponent {
  readonly title = input.required<string>();
  readonly active = signal(false);
}

/** Builds its row of tab buttons from the app-tab-panel elements the parent put inside it. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div role="tablist" class="flex flex-wrap gap-2 border-b border-stone-800">
      @for (panel of panels(); track panel; let i = $index) {
        <button
          type="button"
          role="tab"
          [attr.data-testid]="'tab-' + i"
          [attr.aria-selected]="i === current()"
          (click)="selected.set(i)"
          class="min-h-11 border-b-2 px-3 text-sm font-semibold transition"
          [class]="i === current() ? 'border-gold-400 text-gold-300' : 'border-transparent text-stone-400 hover:text-stone-200'"
        >
          {{ panel.title() }}
        </button>
      }
    </div>
    <div class="pt-3" data-testid="tab-body"><ng-content /></div>
  `,
})
export class TabsComponent {
  /** Every <app-tab-panel> written directly inside <app-tabs>. It updates when panels come and go. */
  readonly panels = contentChildren(TabPanelComponent);
  protected readonly selected = signal(0);

  /** The selected index, kept inside the list if a panel was removed. */
  protected current(): number {
    return Math.min(this.selected(), Math.max(0, this.panels().length - 1));
  }

  constructor() {
    effect(() => {
      const current = this.current();
      this.panels().forEach((panel, index) => panel.active.set(index === current));
    });
  }
}

/** A child the parent reaches into with viewChild. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-counter-demo',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 rounded-xl bg-stone-950 p-3">
      <button type="button" data-testid="counter-add" (click)="increment()" class="min-h-11 rounded-lg border border-stone-600 px-3 text-sm font-semibold text-stone-100 hover:bg-stone-800">+1</button>
      <span class="text-sm text-stone-300">Child counter: <strong class="text-gold-300" data-testid="counter-value">{{ value() }}</strong></span>
    </div>
  `,
})
export class CounterDemoComponent {
  readonly value = signal(0);

  increment(): void {
    this.value.update((n) => n + 1);
  }

  reset(): void {
    this.value.set(0);
  }
}
