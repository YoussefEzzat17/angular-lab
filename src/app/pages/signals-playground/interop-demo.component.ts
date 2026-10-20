import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/**
 * Both directions of the bridge on one page. toSignal keeps the latest value of a stream.
 * toObservable emits when the signal settles, so a burst of changes becomes one emission.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-interop-demo',
  standalone: true,
  template: `
    <div class="mt-4 grid gap-4 md:grid-cols-2">
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold text-gold-300">Observable → signal · toSignal()</p>
        <p class="mt-2 text-sm text-stone-400">Each button calls <code class="text-gold-300">next()</code> on a Subject. The signal holds only the latest value.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" data-testid="stream-next" (click)="emitNext()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">next(&#35;{{ emitted() + 1 }})</button>
        </div>
        <p class="mt-3 text-sm text-stone-300">latest = <strong class="text-gold-300" data-testid="stream-latest">{{ latest() }}</strong></p>
        <p class="mt-1 text-xs text-stone-500">Before the first next(), it shows the initialValue (0).</p>
      </div>

      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold text-emerald-300">Signal → Observable · toObservable()</p>
        <p class="mt-2 text-sm text-stone-400">Press the burst button: it sets the signal three times in a row.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" data-testid="signal-one" (click)="bump(1)" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">set 1 time</button>
          <button type="button" data-testid="signal-burst" (click)="bump(3)" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">set 3 times fast</button>
        </div>
        <p class="mt-3 text-sm text-stone-300">signal value = <strong class="text-gold-300" data-testid="signal-value">{{ counter() }}</strong></p>
        <p class="mt-1 text-sm text-stone-300">observable emitted: <strong class="text-emerald-300" data-testid="signal-emissions">{{ emissions().length ? emissions().join(', ') : 'nothing yet' }}</strong></p>
      </div>
    </div>
  `,
})
export class InteropDemoComponent {
  private readonly source = new Subject<number>();
  readonly emitted = signal(0);
  readonly latest = toSignal(this.source, { initialValue: 0 });

  readonly counter = signal(0);
  readonly emissions = signal<number[]>([]);

  constructor() {
    const subscription = toObservable(this.counter).subscribe((value) => {
      if (value !== 0) {
        this.emissions.update((list) => [...list, value]);
      }
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  emitNext(): void {
    this.emitted.update((n) => n + 1);
    this.source.next(this.emitted());
  }

  bump(times: number): void {
    for (let i = 0; i < times; i++) {
      this.counter.update((n) => n + 1);
    }
  }
}
