import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';

export interface DemoUser {
  id: number;
  name: string;
  role: string;
}

export const DEMO_USERS: DemoUser[] = [
  { id: 1, name: 'Mona', role: 'Designer' },
  { id: 2, name: 'Ali', role: 'Engineer' },
  { id: 3, name: 'Sara', role: 'Product manager' },
  { id: 4, name: 'Omar', role: 'Support' },
];

/** How long the pretend server takes to answer. */
export const LOAD_MS = 900;

/**
 * Waits like a slow server, and gives up straight away when the resource cancels the request.
 * Once the wait is over the abort listener is removed: the resource also aborts the signal of a request
 * that already finished when the params change, and that is not a cancellation.
 */
function wait(ms: number, abortSignal: AbortSignal, onAbort: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const onAbortEvent = () => {
      clearTimeout(timer);
      onAbort();
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      abortSignal.removeEventListener('abort', onAbortEvent);
      resolve();
    }, ms);
    abortSignal.addEventListener('abort', onAbortEvent, { once: true });
  });
}

/** A real resource() with a pretend server: pick a user, watch the status, cancel, fail, reload and edit. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-resource-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pick a user">
      @for (u of users; track u.id) {
        <button
          type="button"
          [attr.data-testid]="'user-' + u.id"
          [attr.aria-pressed]="userId() === u.id"
          (click)="userId.set(u.id)"
          class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
          [class]="userId() === u.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          User {{ u.id }}
        </button>
      }
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">THE RESOURCE</p>
        <p class="mt-2 text-sm text-stone-300">
          status():
          <span class="rounded-full px-2 py-0.5 text-xs font-bold" [class]="statusClass()" data-testid="res-status">{{ user.status() }}</span>
        </p>
        <p class="mt-1 text-sm text-stone-300">isLoading(): <strong class="text-stone-100" data-testid="res-loading">{{ user.isLoading() }}</strong></p>
        <p class="mt-1 text-sm text-stone-300">hasValue(): <strong class="text-stone-100" data-testid="res-has-value">{{ user.hasValue() }}</strong></p>
      </div>

      <div class="rounded-xl bg-stone-950 p-4" aria-live="polite">
        <p class="text-xs font-bold tracking-wider text-stone-500">WHAT THE PAGE SHOWS</p>
        @if (user.error()) {
          <p class="mt-2 text-sm text-rose-300" data-testid="res-error">{{ user.error()?.message }}</p>
        } @else if (user.hasValue()) {
          <p class="mt-2 text-sm font-semibold text-stone-100" data-testid="res-name">{{ user.value().name }}</p>
          <p class="text-sm text-stone-400" data-testid="res-role">{{ user.value().role }}</p>
        } @else {
          <p class="mt-2 text-sm text-gold-300" data-testid="res-wait">Loading…</p>
        }
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" data-testid="res-reload" (click)="user.reload()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Reload</button>
      <button
        type="button"
        data-testid="res-fail"
        [attr.aria-pressed]="failNext()"
        (click)="failNext.set(!failNext())"
        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
        [class]="failNext() ? 'border-rose-400 bg-rose-500/10 text-rose-300' : 'border-stone-600 text-stone-100 hover:bg-stone-800'"
      >
        {{ failNext() ? 'The next request will fail' : 'Make the next request fail' }}
      </button>
      <button type="button" data-testid="res-edit" (click)="editLocally()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Edit the value locally</button>
    </div>

    <div class="mt-4 rounded-xl bg-stone-950 p-4">
      <p class="text-xs font-bold tracking-wider text-stone-500">WHAT THE PRETEND SERVER SAW</p>
      <ul class="mt-2 space-y-1 text-sm text-emerald-300" data-testid="res-log">
        @for (line of log(); track $index) {
          <li>{{ line }}</li>
        } @empty {
          <li class="text-stone-600">Nothing yet.</li>
        }
      </ul>
    </div>
    <p class="mt-3 text-xs text-stone-500">Click two users quickly: the first request is cancelled and only the second one answers.</p>
  `,
})
export class ResourceDemoComponent {
  readonly users = DEMO_USERS;
  readonly userId = signal(1);
  readonly failNext = signal(false);
  readonly log = signal<string[]>([]);

  readonly user = resource({
    // A signal read in here is tracked: when it changes, the loader runs again.
    params: () => this.userId(),
    loader: async ({ params, abortSignal }) => {
      this.addLog(`Asking for user ${params}`);
      await wait(LOAD_MS, abortSignal, () => this.addLog(`Request for user ${params} was cancelled`));
      if (this.failNext()) {
        this.addLog(`User ${params} failed`);
        throw new Error('The server said no. Press Reload to try again.');
      }
      this.addLog(`User ${params} arrived`);
      return DEMO_USERS.find((u) => u.id === params) as DemoUser;
    },
  });

  protected statusClass(): string {
    switch (this.user.status()) {
      case 'resolved':
        return 'bg-emerald-500/15 text-emerald-300';
      case 'error':
        return 'bg-rose-500/15 text-rose-300';
      case 'local':
        return 'bg-sky-500/15 text-sky-300';
      default:
        return 'bg-gold-500/15 text-gold-300';
    }
  }

  protected editLocally(): void {
    if (this.user.hasValue()) {
      this.user.set({ ...this.user.value(), role: 'Edited by you' });
    }
  }

  private addLog(message: string): void {
    this.log.update((lines) => [...lines, message].slice(-6));
  }
}
