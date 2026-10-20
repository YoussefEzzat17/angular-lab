import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Subscription, delay, of } from 'rxjs';

export interface FakeRequest {
  method: 'GET' | 'POST';
  url: string;
  body?: unknown;
}

export interface FakeResponse {
  status: number;
  statusText: string;
  body: unknown;
}

export interface Scenario {
  id: string;
  label: string;
  request: FakeRequest;
}

export const SCENARIOS: Scenario[] = [
  { id: 'list', label: 'Load all films', request: { method: 'GET', url: '/api/films' } },
  { id: 'one', label: 'Load film 2', request: { method: 'GET', url: '/api/films/2' } },
  { id: 'create', label: 'Add a film', request: { method: 'POST', url: '/api/films', body: { title: 'Spirited Away' } } },
  { id: 'missing', label: 'Load film 99', request: { method: 'GET', url: '/api/films/99' } },
  { id: 'crash', label: 'Server crash', request: { method: 'GET', url: '/api/crash' } },
];

/** How long the pretend server takes to answer. */
export const SERVER_MS = 700;

const FILMS = [
  { id: 1, title: 'Castle in the Sky' },
  { id: 2, title: 'Grave of the Fireflies' },
  { id: 3, title: 'My Neighbor Totoro' },
];

/** The pretend server: a status code and a body for each request. Pure, so it is easy to test. */
export function serve(request: FakeRequest): FakeResponse {
  if (request.method === 'GET' && request.url === '/api/films') {
    return { status: 200, statusText: 'OK', body: FILMS };
  }
  if (request.method === 'GET' && request.url === '/api/films/2') {
    return { status: 200, statusText: 'OK', body: FILMS[1] };
  }
  if (request.method === 'POST' && request.url === '/api/films') {
    return { status: 201, statusText: 'Created', body: { id: 4, ...(request.body as object) } };
  }
  if (request.url === '/api/crash') {
    return { status: 500, statusText: 'Internal Server Error', body: { message: 'Something broke on the server' } };
  }
  return { status: 404, statusText: 'Not Found', body: { message: 'Film not found' } };
}

type Phase = 'idle' | 'waiting' | 'done';

/** Send a request to a pretend server and see what HttpClient would give your code: next() or error(). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-http-lab-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Request to send">
      @for (s of scenarios; track s.id) {
        <button
          type="button"
          [attr.data-testid]="'send-' + s.id"
          [attr.aria-pressed]="chosen().id === s.id"
          (click)="send(s)"
          class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
          [class]="chosen().id === s.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ s.label }}
        </button>
      }
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">THE REQUEST</p>
        <p class="mt-2 font-mono text-sm text-gold-300" data-testid="http-request-line">{{ chosen().request.method }} {{ chosen().request.url }}</p>
        <p class="mt-1 font-mono text-xs text-stone-400">Accept: application/json</p>
        @if (chosen().request.body) {
          <pre class="mt-2 overflow-x-auto text-xs text-stone-300" data-testid="http-request-body">{{ requestBody() }}</pre>
        }
      </div>

      <div class="rounded-xl bg-stone-950 p-4" aria-live="polite">
        <p class="text-xs font-bold tracking-wider text-stone-500">THE RESPONSE</p>
        @switch (phase()) {
          @case ('idle') {
            <p class="mt-2 text-sm text-stone-500" data-testid="http-idle">Press a button to send a request.</p>
          }
          @case ('waiting') {
            <p class="mt-2 text-sm text-gold-300" data-testid="http-waiting">Waiting for the server…</p>
          }
          @default {
            <p class="mt-2 font-mono text-sm font-bold" [class]="isSuccess() ? 'text-emerald-300' : 'text-rose-300'" data-testid="http-status">
              {{ response()!.status }} {{ response()!.statusText }}
            </p>
            <pre class="mt-2 overflow-x-auto text-xs text-stone-300" data-testid="http-body">{{ responseBody() }}</pre>
          }
        }
      </div>
    </div>

    @if (phase() === 'done') {
      <div class="mt-4 rounded-xl p-4 text-sm" [class]="isSuccess() ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'" role="status">
        <p class="font-semibold">
          Your code gets: <code data-testid="http-callback">{{ isSuccess() ? 'next(body)' : 'error(HttpErrorResponse)' }}</code>
        </p>
        <p class="mt-1 text-stone-300" data-testid="http-explanation">{{ explanation() }}</p>
      </div>
    }
  `,
})
export class HttpLabDemoComponent {
  readonly scenarios = SCENARIOS;
  readonly chosen = signal<Scenario>(SCENARIOS[0]);
  protected readonly phase = signal<Phase>('idle');
  protected readonly response = signal<FakeResponse | null>(null);
  private readonly failure = signal<HttpErrorResponse | null>(null);
  private subscription?: Subscription;

  protected readonly isSuccess = computed(() => (this.response()?.status ?? 0) < 300 && this.failure() === null);
  protected readonly requestBody = computed(() => JSON.stringify(this.chosen().request.body, null, 2));
  protected readonly responseBody = computed(() => JSON.stringify(this.response()?.body, null, 2));
  protected readonly explanation = computed(() => {
    const failure = this.failure();
    return failure
      ? `A status outside 2xx is an error to HttpClient. ${failure.message}`
      : 'A 2xx status means success: HttpClient hands the parsed JSON body to next(), and nothing is thrown.';
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  send(scenario: Scenario): void {
    this.subscription?.unsubscribe();
    this.chosen.set(scenario);
    this.phase.set('waiting');
    this.response.set(null);
    this.failure.set(null);

    this.subscription = of(serve(scenario.request))
      .pipe(delay(SERVER_MS))
      .subscribe((response) => {
        this.response.set(response);
        if (response.status >= 300) {
          this.failure.set(new HttpErrorResponse({ status: response.status, statusText: response.statusText, url: scenario.request.url, error: response.body }));
        }
        this.phase.set('done');
      });
  }
}
