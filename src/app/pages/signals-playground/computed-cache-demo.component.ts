import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

/**
 * A computed() only works when it is read, remembers its answer, and only works again when a signal it
 * actually read has changed. The counter is a plain field because signals cannot be written inside a computed,
 * and it is printed after the line that reads the computed so the number is already up to date.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-computed-cache-demo',
  standalone: true,
  template: `
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl bg-stone-950 p-3 text-sm text-stone-300">
        <p class="font-mono text-xs text-stone-500">price</p>
        <p class="mt-1 text-xl font-bold text-gold-300" data-testid="cache-price">{{ price() }}</p>
        <button type="button" data-testid="cache-price-up" (click)="price.update(inc)" class="mt-2 min-h-11 w-full rounded-lg border border-stone-600 text-xs font-semibold text-stone-100 hover:bg-stone-800">price + 1</button>
      </div>
      <div class="rounded-xl bg-stone-950 p-3 text-sm text-stone-300">
        <p class="font-mono text-xs text-stone-500">quantity</p>
        <p class="mt-1 text-xl font-bold text-gold-300" data-testid="cache-qty">{{ quantity() }}</p>
        <button type="button" data-testid="cache-qty-up" (click)="quantity.update(inc)" class="mt-2 min-h-11 w-full rounded-lg border border-stone-600 text-xs font-semibold text-stone-100 hover:bg-stone-800">quantity + 1</button>
      </div>
      <div class="rounded-xl bg-stone-950 p-3 text-sm text-stone-300">
        <p class="font-mono text-xs text-stone-500">note (not used by total)</p>
        <p class="mt-1 truncate text-xl font-bold text-stone-100" data-testid="cache-note">{{ note() }}</p>
        <button type="button" data-testid="cache-note-change" (click)="changeNote()" class="mt-2 min-h-11 w-full rounded-lg border border-stone-600 text-xs font-semibold text-stone-100 hover:bg-stone-800">change note</button>
      </div>
    </div>

    <label class="mt-3 flex min-h-11 items-center gap-2 text-sm text-stone-300">
      <input type="checkbox" data-testid="cache-show" [checked]="shown()" (change)="shown.set(!shown())" class="h-4 w-4 accent-gold-500" />
      Show total in the template (reads the computed)
    </label>

    <div class="mt-3 rounded-xl bg-stone-950 p-4 text-sm text-stone-300" aria-live="polite">
      @if (shown()) {
        <p>total = price × quantity = <strong class="text-gold-300" data-testid="cache-total">{{ total() }}</strong></p>
        <p class="mt-1">The computed ran <strong class="text-gold-300" data-testid="cache-runs">{{ runs }}</strong> time(s).</p>
      } @else {
        <p class="text-stone-500">Nothing reads total right now.</p>
        <p class="mt-1">The computed ran <strong class="text-gold-300" data-testid="cache-runs">{{ runs }}</strong> time(s).</p>
      }
    </div>
  `,
})
export class ComputedCacheDemoComponent {
  readonly price = signal(10);
  readonly quantity = signal(1);
  readonly note = signal('first note');
  readonly shown = signal(true);
  runs = 0;

  readonly total = computed(() => {
    this.runs++;
    return this.price() * this.quantity();
  });

  protected readonly inc = (n: number): number => n + 1;

  private notes = 1;

  changeNote(): void {
    this.notes++;
    this.note.set(`note number ${this.notes}`);
  }
}
