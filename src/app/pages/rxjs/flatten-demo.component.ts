import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Subject, Subscription, concatMap, defer, finalize, map, mergeMap, switchMap, tap, timer } from 'rxjs';

export type FlattenMode = 'switchMap' | 'mergeMap' | 'concatMap';
export type RequestStatus = 'queued' | 'running' | 'done' | 'cancelled';

export interface RequestLane {
  id: number;
  status: RequestStatus;
}

/** How long every fake request takes. */
export const REQUEST_MS = 1500;
const MAX_LANES = 6;

const MODES: { id: FlattenMode; blurb: string }[] = [
  { id: 'switchMap', blurb: 'A new request cancels the one still running. Only the latest answer survives — perfect for a search box.' },
  { id: 'mergeMap', blurb: 'Every request runs at the same time and nothing is cancelled. Answers arrive whenever each one finishes.' },
  { id: 'concatMap', blurb: 'Requests wait in a queue and run one after another, so answers always come back in the order you sent them.' },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  queued: 'waiting in line',
  running: 'running…',
  done: '✓ answered',
  cancelled: '✕ cancelled',
};

/**
 * Press "Send request" a few times quickly and watch what switchMap, mergeMap and concatMap each do
 * with the requests that are still in flight. It runs the real operators over a fake 1.5s request.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-flatten-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Flattening operator">
      @for (m of modes; track m.id) {
        <button
          type="button"
          [attr.data-testid]="'mode-' + m.id"
          [attr.aria-pressed]="mode() === m.id"
          (click)="setMode(m.id)"
          class="min-h-11 rounded-xl border px-4 font-mono text-sm font-semibold transition"
          [class]="
            mode() === m.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'
          "
        >
          {{ m.id }}
        </button>
      }
    </div>
    <p class="mt-3 text-sm text-stone-400" data-testid="flatten-blurb">{{ blurb() }}</p>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        data-testid="send-request"
        (click)="send()"
        class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white transition hover:bg-gold-solid-hover"
      >
        Send request #{{ nextId() }}
      </button>
      <button
        type="button"
        data-testid="flatten-reset"
        (click)="setMode(mode())"
        class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-stone-300 hover:bg-stone-800"
      >
        Reset
      </button>
      <span class="text-xs text-stone-500">Each request takes 1.5 seconds. Click it 3 times fast.</span>
    </div>

    <div class="mt-4 space-y-2" aria-live="polite">
      @for (lane of lanes(); track lane.id) {
        <div class="rounded-xl border border-stone-800 bg-stone-900 px-3 py-2" [attr.data-testid]="'lane-' + lane.id">
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="font-semibold text-stone-100">Request #{{ lane.id }}</span>
            <span class="text-xs font-bold" [attr.data-testid]="'lane-status-' + lane.id" [class]="statusClass(lane.status)">{{ statusLabel(lane.status) }}</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-stone-800">
            <div
              class="h-full rounded-full ease-linear motion-reduce:transition-none"
              [class]="barClass(lane.status)"
            ></div>
          </div>
        </div>
      } @empty {
        <p class="rounded-xl bg-stone-950 p-4 text-sm text-stone-500">No requests yet — press the button.</p>
      }
    </div>

    <p class="mt-4 rounded-xl bg-stone-950 p-3 text-sm text-stone-300" data-testid="flatten-results">
      Answers received, in order:
      <strong class="text-emerald-300">{{ answers().length ? answers().join(', ') : '—' }}</strong>
    </p>
  `,
})
export class FlattenDemoComponent {
  readonly modes = MODES;
  readonly mode = signal<FlattenMode>('switchMap');
  readonly lanes = signal<RequestLane[]>([]);
  readonly answers = signal<string[]>([]);
  readonly nextId = signal(1);

  private readonly clicks$ = new Subject<number>();
  private subscription?: Subscription;

  constructor() {
    this.connect('switchMap');
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  blurb(): string {
    return MODES.find((m) => m.id === this.mode())?.blurb ?? '';
  }

  statusLabel(status: RequestStatus): string {
    return STATUS_LABEL[status];
  }

  statusClass(status: RequestStatus): string {
    switch (status) {
      case 'done':
        return 'text-emerald-300';
      case 'cancelled':
        return 'text-rose-300';
      case 'running':
        return 'text-gold-300';
      default:
        return 'text-stone-500';
    }
  }

  barClass(status: RequestStatus): string {
    switch (status) {
      case 'running':
        return 'w-full bg-gold-400 transition-[width] duration-[1500ms]';
      case 'done':
        return 'w-full bg-emerald-400';
      case 'cancelled':
        return 'w-full bg-rose-500/40';
      default:
        return 'w-0 bg-gold-400';
    }
  }

  setMode(mode: FlattenMode): void {
    this.mode.set(mode);
    this.lanes.set([]);
    this.answers.set([]);
    this.nextId.set(1);
    this.connect(mode);
  }

  send(): void {
    const id = this.nextId();
    this.nextId.set(id + 1);
    this.lanes.update((lanes) => [...lanes, { id, status: 'queued' as RequestStatus }].slice(-MAX_LANES));
    this.clicks$.next(id);
  }

  /** One fake request: marks itself running when it really starts, done when it answers, cancelled if unsubscribed early. */
  private request(id: number) {
    return defer(() => {
      this.setStatus(id, 'running');
      return timer(REQUEST_MS).pipe(
        map(() => id),
        tap(() => this.setStatus(id, 'done')),
        finalize(() => this.cancelIfStillRunning(id)),
      );
    });
  }

  private connect(mode: FlattenMode): void {
    this.subscription?.unsubscribe();
    const request = (id: number) => this.request(id);
    const stream =
      mode === 'switchMap'
        ? this.clicks$.pipe(switchMap(request))
        : mode === 'mergeMap'
          ? this.clicks$.pipe(mergeMap(request))
          : this.clicks$.pipe(concatMap(request));
    this.subscription = stream.subscribe((id) => this.answers.update((a) => [...a, `#${id}`]));
  }

  private setStatus(id: number, status: RequestStatus): void {
    this.lanes.update((lanes) => lanes.map((lane) => (lane.id === id ? { ...lane, status } : lane)));
  }

  private cancelIfStillRunning(id: number): void {
    this.lanes.update((lanes) =>
      lanes.map((lane) => (lane.id === id && lane.status === 'running' ? { ...lane, status: 'cancelled' as RequestStatus } : lane)),
    );
  }
}
