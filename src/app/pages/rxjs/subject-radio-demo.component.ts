import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, Subscription } from 'rxjs';

export type StationKind = 'subject' | 'behavior' | 'replay';

interface Listener {
  id: string;
  name: string;
  emoji: string;
}

interface StationOption {
  id: StationKind;
  label: string;
  blurb: string;
}

const LISTENERS: Listener[] = [
  { id: 'ali', name: 'Ali', emoji: '🧑' },
  { id: 'mona', name: 'Mona', emoji: '👩' },
  { id: 'sara', name: 'Sara', emoji: '🧒' },
];

const STATIONS: StationOption[] = [
  { id: 'subject', label: 'Subject', blurb: 'Live only. Anyone who tunes in late misses everything that already played.' },
  { id: 'behavior', label: 'BehaviorSubject(0)', blurb: 'Remembers the latest song. A new listener hears it the moment they tune in.' },
  { id: 'replay', label: 'ReplaySubject(2)', blurb: 'Remembers the last 2 songs and replays both to every new listener.' },
];

/**
 * A radio-station playground for Subject, BehaviorSubject and ReplaySubject.
 * It runs the real RxJS classes: "broadcast" calls next(), "tune in" calls subscribe().
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-subject-radio-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Type of Subject">
      @for (option of stations; track option.id) {
        <button
          type="button"
          [attr.data-testid]="'station-' + option.id"
          [attr.aria-pressed]="kind() === option.id"
          (click)="setKind(option.id)"
          class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
          [class]="
            kind() === option.id
              ? 'border-gold-400 bg-gold-500/15 text-gold-300'
              : 'border-stone-700 text-stone-300 hover:bg-stone-800'
          "
        >
          {{ option.label }}
        </button>
      }
    </div>
    <p class="mt-3 text-sm text-stone-400" data-testid="station-blurb">{{ currentBlurb() }}</p>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-800 bg-stone-950 p-4">
      <div>
        <p class="text-xs font-bold tracking-wider text-stone-500">📻 THE STATION</p>
        <p class="mt-1 text-lg font-bold text-stone-100" data-testid="on-air">
          @if (songs() === 0) {
            Nothing broadcast yet
          } @else {
            On air: ♪{{ songs() }}
          }
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          data-testid="broadcast"
          (click)="broadcast()"
          class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white transition hover:bg-gold-solid-hover"
        >
          next(♪{{ songs() + 1 }}) — broadcast
        </button>
        <button
          type="button"
          data-testid="reset"
          (click)="setKind(kind())"
          class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-stone-300 hover:bg-stone-800"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      @for (listener of listeners; track listener.id) {
        <div class="rounded-xl border border-stone-800 bg-stone-900 p-4" [attr.data-testid]="'listener-' + listener.id">
          <div class="flex items-center justify-between gap-2">
            <p class="font-semibold text-stone-100"><span aria-hidden="true">{{ listener.emoji }}</span> {{ listener.name }}</p>
            <span class="text-xs font-bold" [class]="isTuned(listener.id) ? 'text-emerald-300' : 'text-stone-500'">
              {{ isTuned(listener.id) ? '● listening' : '○ not listening' }}
            </span>
          </div>
          <button
            type="button"
            [attr.data-testid]="'toggle-' + listener.id"
            (click)="toggle(listener.id)"
            class="mt-3 min-h-11 w-full rounded-lg border px-3 text-sm font-semibold transition"
            [class]="
              isTuned(listener.id)
                ? 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10'
                : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
            "
          >
            {{ isTuned(listener.id) ? 'unsubscribe()' : 'subscribe()' }}
          </button>
          <p class="mt-3 text-xs text-stone-500">Heard so far:</p>
          <div class="mt-1 flex min-h-8 flex-wrap gap-1.5" [attr.data-testid]="'heard-' + listener.id">
            @for (song of heardBy(listener.id); track $index) {
              <span class="rounded-md bg-gold-500/15 px-2 py-0.5 text-xs font-semibold text-gold-300">♪{{ song }}</span>
            } @empty {
              <span class="text-xs text-stone-600">nothing yet</span>
            }
          </div>
        </div>
      }
    </div>

    <p class="mt-4 rounded-xl bg-stone-950 p-3 text-sm text-stone-300" role="status" aria-live="polite" data-testid="note">{{ note() }}</p>
  `,
})
export class SubjectRadioDemoComponent {
  readonly stations = STATIONS;
  readonly listeners = LISTENERS;

  readonly kind = signal<StationKind>('subject');
  readonly songs = signal(0);
  readonly note = signal('Try it: press subscribe() on Ali, then broadcast a song.');

  private readonly tuned = signal<Record<string, boolean>>({});
  private readonly heard = signal<Record<string, number[]>>({});
  private readonly subscriptions = new Map<string, Subscription>();
  private station: Subject<number> = this.createStation('subject');

  constructor() {
    inject(DestroyRef).onDestroy(() => this.unsubscribeAll());
  }

  currentBlurb(): string {
    return STATIONS.find((s) => s.id === this.kind())?.blurb ?? '';
  }

  isTuned(id: string): boolean {
    return this.tuned()[id] === true;
  }

  heardBy(id: string): number[] {
    return this.heard()[id] ?? [];
  }

  setKind(kind: StationKind): void {
    this.unsubscribeAll();
    this.kind.set(kind);
    this.songs.set(0);
    this.tuned.set({});
    this.heard.set({});
    this.station = this.createStation(kind);
    this.note.set('New station. Press subscribe() on a listener, then broadcast a song.');
  }

  toggle(id: string): void {
    if (this.isTuned(id)) {
      this.leave(id);
    } else {
      this.tuneIn(id);
    }
  }

  broadcast(): void {
    const song = this.songs() + 1;
    this.songs.set(song);
    this.station.next(song);

    const listening = this.listeners.filter((l) => this.isTuned(l.id)).map((l) => l.name);
    this.note.set(
      listening.length
        ? `next(♪${song}) reached ${listening.join(', ')}.`
        : `next(♪${song}) went out, but nobody is subscribed — it is gone for a plain Subject.`,
    );
  }

  private tuneIn(id: string): void {
    const before = this.heardBy(id).length;
    this.subscriptions.set(
      id,
      this.station.subscribe((song) => this.heard.update((h) => ({ ...h, [id]: [...(h[id] ?? []), song] }))),
    );
    this.tuned.update((t) => ({ ...t, [id]: true }));

    const name = this.nameOf(id);
    const replayed = this.heardBy(id).length - before;
    if (replayed > 0) {
      this.note.set(`${name} subscribed and instantly received ${replayed} remembered song${replayed > 1 ? 's' : ''}.`);
    } else if (this.songs() > 0) {
      this.note.set(`${name} subscribed late. Songs ♪1–♪${this.songs()} already played, and a plain Subject does not replay them.`);
    } else {
      this.note.set(`${name} subscribed. Now broadcast a song.`);
    }
  }

  private leave(id: string): void {
    this.subscriptions.get(id)?.unsubscribe();
    this.subscriptions.delete(id);
    this.tuned.update((t) => ({ ...t, [id]: false }));
    this.note.set(`${this.nameOf(id)} unsubscribed and will not hear the next songs.`);
  }

  private nameOf(id: string): string {
    return this.listeners.find((l) => l.id === id)?.name ?? id;
  }

  private createStation(kind: StationKind): Subject<number> {
    switch (kind) {
      case 'behavior':
        return new BehaviorSubject<number>(0);
      case 'replay':
        return new ReplaySubject<number>(2);
      default:
        return new Subject<number>();
    }
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
  }
}
