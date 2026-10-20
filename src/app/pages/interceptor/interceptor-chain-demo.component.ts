import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EnvironmentInjector, computed, createEnvironmentInjector, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

export type InterceptorId = 'auth' | 'log' | 'errors';
export type ServerMode = 'ok' | 'error';

export interface ChainRun {
  trace: string[];
  serverSawAuth: boolean;
  outcome: string;
}

export const ORDER_A: InterceptorId[] = ['auth', 'log', 'errors'];
export const ORDER_B: InterceptorId[] = ['log', 'auth', 'errors'];

const hasAuth = (req: HttpRequest<unknown>): string => (req.headers.has('Authorization') ? 'yes' : 'no');

function makeInterceptor(id: InterceptorId, trace: string[]): HttpInterceptorFn {
  switch (id) {
    case 'auth':
      return (req, next) => {
        trace.push('→ auth: clones the request and adds Authorization');
        return next(req.clone({ setHeaders: { Authorization: 'Bearer abc' } })).pipe(
          tap({
            next: (event) => event instanceof HttpResponse && trace.push('← auth: response passes back'),
            error: () => trace.push('← auth: error passes back'),
          }),
        );
      };
    case 'log':
      return (req, next) => {
        trace.push(`→ log: ${req.method} ${req.url}, Authorization seen: ${hasAuth(req)}`);
        return next(req).pipe(
          tap({
            next: (event) => event instanceof HttpResponse && trace.push(`← log: status ${event.status}`),
            error: (error: HttpErrorResponse) => trace.push(`← log: status ${error.status}`),
          }),
        );
      };
    case 'errors':
      return (req, next) => {
        trace.push('→ errors: passes the request on');
        return next(req).pipe(
          catchError(() => {
            trace.push('← errors: catches the failure and rewrites it');
            return throwError(() => new Error('Something went wrong, please try again.'));
          }),
        );
      };
  }
}

/** Builds a real HttpClient with the chosen interceptors and a fake server, then makes one GET. */
export function runChain(order: InterceptorId[], server: ServerMode, parent: EnvironmentInjector): ChainRun {
  const trace: string[] = [];
  let serverSawAuth = false;
  let outcome = '';

  const backend: HttpBackend = {
    handle: (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
      serverSawAuth = req.headers.has('Authorization');
      trace.push(`server: receives it, Authorization present: ${hasAuth(req)}`);
      return server === 'ok'
        ? of(new HttpResponse({ status: 200, body: ['Mona', 'Ali'] }))
        : throwError(() => new HttpErrorResponse({ status: 500, url: req.url }));
    },
  };

  const injector = createEnvironmentInjector(
    [provideHttpClient(withInterceptors(order.map((id) => makeInterceptor(id, trace)))), { provide: HttpBackend, useValue: backend }],
    parent,
  );
  injector.get(HttpClient).get<string[]>('/api/users').subscribe({
    next: (users) => (outcome = `Component receives: ${users.join(', ')}`),
    error: (error: Error) => (outcome = `Component receives an error: "${error.message}"`),
  });
  injector.destroy();

  return { trace, serverSawAuth, outcome };
}

/**
 * Reorder two real interceptors and watch the request go down the chain and the response come back up.
 * The trace is recorded by the interceptors themselves, running on a real HttpClient with a fake server.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-interceptor-chain-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Registration order">
      <button
        type="button"
        data-testid="order-a"
        [attr.aria-pressed]="orderKey() === 'a'"
        (click)="orderKey.set('a')"
        class="min-h-11 rounded-xl border px-4 font-mono text-sm"
        [class]="orderKey() === 'a' ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        auth, log, errors
      </button>
      <button
        type="button"
        data-testid="order-b"
        [attr.aria-pressed]="orderKey() === 'b'"
        (click)="orderKey.set('b')"
        class="min-h-11 rounded-xl border px-4 font-mono text-sm"
        [class]="orderKey() === 'b' ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        log, auth, errors
      </button>
    </div>
    <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="What the server does">
      <button
        type="button"
        data-testid="server-ok"
        [attr.aria-pressed]="server() === 'ok'"
        (click)="server.set('ok')"
        class="min-h-11 rounded-xl border px-4 text-sm"
        [class]="server() === 'ok' ? 'border-emerald-400 text-emerald-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        Server answers 200
      </button>
      <button
        type="button"
        data-testid="server-error"
        [attr.aria-pressed]="server() === 'error'"
        (click)="server.set('error')"
        class="min-h-11 rounded-xl border px-4 text-sm"
        [class]="server() === 'error' ? 'border-rose-400 text-rose-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        Server answers 500
      </button>
    </div>

    <ol class="mt-4 space-y-1 rounded-xl bg-stone-950 p-4 font-mono text-xs" data-testid="chain-trace" aria-label="What happened, in order">
      @for (line of run().trace; track $index) {
        <li [class]="lineClass(line)">{{ line }}</li>
      }
    </ol>
    <p class="mt-3 rounded-xl bg-stone-950 p-3 text-sm text-stone-200" data-testid="chain-outcome" aria-live="polite">{{ run().outcome }}</p>
  `,
})
export class InterceptorChainDemoComponent {
  private readonly parent = inject(EnvironmentInjector);
  readonly orderKey = signal<'a' | 'b'>('a');
  readonly server = signal<ServerMode>('ok');

  readonly run = computed(() => runChain(this.orderKey() === 'a' ? ORDER_A : ORDER_B, this.server(), this.parent));

  lineClass(line: string): string {
    if (line.startsWith('→')) {
      return 'text-gold-300';
    }
    if (line.startsWith('←')) {
      return 'text-emerald-300';
    }
    return 'text-stone-300';
  }
}
