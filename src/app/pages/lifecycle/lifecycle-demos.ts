import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injectable,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

/** Collects what the demo components report, so the lesson can show it. Writes wait a microtask so they never land mid-render. */
@Injectable({ providedIn: 'root' })
export class LifecycleLog {
  readonly lines = signal<string[]>([]);
  readonly timers = signal(0);

  add(line: string): void {
    queueMicrotask(() => this.lines.update((all) => [...all, line].slice(-8)));
  }

  clear(): void {
    this.lines.set([]);
  }

  changeTimers(by: number): void {
    queueMicrotask(() => this.timers.update((n) => n + by));
  }
}

/** Reports every moment of its life, in the order it happens. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lifecycle-probe',
  standalone: true,
  template: `<p class="rounded-xl border border-gold-400/40 bg-stone-900 px-3 py-2 text-sm text-gold-200">I am alive: <strong>{{ label() }}</strong></p>`,
})
export class LifecycleProbeComponent implements OnInit, OnDestroy {
  readonly label = input('probe');
  private readonly log = inject(LifecycleLog);

  constructor() {
    this.log.add('constructor: the object exists, inputs are not set');
    afterNextRender(() => this.log.add('afterNextRender: the DOM exists'));
  }

  ngOnInit(): void {
    this.log.add('ngOnInit: inputs are ready');
  }

  ngOnDestroy(): void {
    this.log.add('ngOnDestroy: about to be removed');
  }
}

/** Starts a timer when it appears and stops it when it goes. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ticker-demo',
  standalone: true,
  template: `<p class="rounded-xl bg-stone-800 px-3 py-2 text-sm text-stone-100">Seconds since I appeared: <strong class="text-gold-300">{{ seconds() }}</strong></p>`,
})
export class TickerDemoComponent implements OnInit {
  protected readonly seconds = signal(0);
  private readonly log = inject(LifecycleLog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const id = setInterval(() => this.seconds.update((n) => n + 1), 1000);
    this.log.changeTimers(1);
    this.destroyRef.onDestroy(() => {
      clearInterval(id);
      this.log.changeTimers(-1);
    });
  }
}

/** Reads its own width, which only exists once the page has been drawn. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-measure-demo',
  standalone: true,
  template: `<p class="rounded-xl bg-stone-800 px-3 py-2 text-sm text-stone-100">I measured myself after render: <strong class="text-gold-300">{{ width() }} px</strong> wide</p>`,
})
export class MeasureDemoComponent {
  protected readonly width = signal(0);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => this.width.set(Math.round(this.el.nativeElement.getBoundingClientRect().width)));
  }
}

/** Shows a value worked out with computed() and a side effect run with effect(), both following an input. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-change-demo',
  standalone: true,
  template: `
    <div class="rounded-xl bg-stone-800 px-3 py-2 text-sm text-stone-100">
      <p>count = <strong class="text-gold-300">{{ count() }}</strong></p>
      <p>doubled (computed) = <strong class="text-gold-300">{{ doubled() }}</strong></p>
      <p>effect has run <strong class="text-gold-300">{{ runs() }}</strong> time(s)</p>
    </div>
  `,
})
export class ChangeDemoComponent {
  readonly count = input.required<number>();
  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly runs = signal(0);

  constructor() {
    effect(() => {
      this.count();
      // Written without tracking the signal it changes; this is a side effect, not a derived value.
      queueMicrotask(() => this.runs.update((n) => n + 1));
    });
  }
}
