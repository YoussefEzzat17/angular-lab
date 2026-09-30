import { Component, OnDestroy, signal } from '@angular/core';

type Stage = 'idle' | 'component' | 'interceptor-out' | 'server' | 'interceptor-in' | 'done' | 'error';

@Component({
  standalone: true,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">HttpInterceptor</h1>
        </div>
        <a
          href="/pdfs/http-interceptor.pdf"
          download="http-interceptor.pdf"
          class="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <svg
            class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download PDF Guide
        </a>
      </div>
      <p class="mt-3 max-w-3xl text-stone-400">
        An <code class="text-gold-300">HttpInterceptor</code> is one checkpoint that <strong class="text-gold-300">every outgoing HTTP request and incoming response</strong>
        passes through — think of it as airport security for HTTP calls: one place for loading state, auth headers, or error logging.
      </p>

      <!-- 1 · EXPLAINED SIMPLY -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · Explained simply</p>
        <h2 class="mt-2 text-xl font-bold">Every request passes through the same checkpoint</h2>
        <p class="mt-2 text-sm text-stone-400">
          An interceptor sits between your code and the network. It can inspect or modify the outgoing request, and inspect or modify the response
          (or error) on the way back — for every single HTTP call, without touching each component individually.
        </p>
      </article>

      <!-- 2 · INTERACTIVE PIPELINE -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · Try it — send a request through the pipeline</p>
        <h2 class="mt-2 text-xl font-bold">Watch each checkpoint light up as a request flows through</h2>

        <div class="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="sendRequest(false)"
            [disabled]="stage() !== 'idle' && stage() !== 'done' && stage() !== 'error'"
            class="rounded-lg bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ Send request
          </button>
          <button
            type="button"
            (click)="sendRequest(true)"
            [disabled]="stage() !== 'idle' && stage() !== 'done' && stage() !== 'error'"
            class="rounded-lg border border-rose-400/50 px-4 py-2 font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ Send request (server fails)
          </button>
          <span class="text-sm text-stone-400">
            LoadingService.isLoading(): <strong [class.text-gold-300]="isLoading()" [class.text-stone-500]="!isLoading()">{{ isLoading() }}</strong>
          </span>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('component')">
            <p class="text-xs font-bold">Component</p>
            <p class="mt-1 text-[10px] text-stone-500">calls HttpClient</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('interceptor-out')">
            <p class="text-xs font-bold">Interceptor</p>
            <p class="mt-1 text-[10px] text-stone-500">show loading bar</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('server')">
            <p class="text-xs font-bold">Server</p>
            <p class="mt-1 text-[10px] text-stone-500">{{ stage() === 'server' && failing() ? '500 error' : 'API responds' }}</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('interceptor-in')">
            <p class="text-xs font-bold">Interceptor</p>
            <p class="mt-1 text-[10px] text-stone-500">hide bar{{ failing() ? ' / log error' : '' }}</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('done')">
            <p class="text-xs font-bold">Component</p>
            <p class="mt-1 text-[10px] text-stone-500">gets the result</p>
          </div>
        </div>

        @if (log().length) {
          <div class="mt-5 rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Console</p>
            <ul class="mt-2 space-y-1 text-xs">
              @for (line of log(); track $index) {
                <li [class.text-rose-300]="line.startsWith('✗')" [class.text-stone-300]="!line.startsWith('✗')">{{ line }}</li>
              }
            </ul>
          </div>
        }
      </article>

      <!-- 3 · THE CODE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · The code</p>
        <h2 class="mt-2 text-xl font-bold">A functional HttpInterceptorFn</h2>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">export const loadingInterceptor: HttpInterceptorFn = (req, next) =&gt; &#123;
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    catchError((error) =&gt; &#123;
      console.error(&#96;Request to $&#123;req.url&#125; failed:&#96;, error.message);
      return throwError(() =&gt; error);
    &#125;),
    finalize(() =&gt; loadingService.hide())
  );
&#125;;</pre>
        <ul class="mt-4 space-y-2 text-sm text-stone-400">
          <li><code class="text-gold-300">show()</code> / <code class="text-gold-300">hide()</code> just increment / decrement a counter signal — <code class="text-gold-300">LoadingService.isLoading()</code> is true while it's above zero.</li>
          <li><code class="text-gold-300">finalize()</code> runs whether the request succeeds, fails, or is cancelled by <code class="text-gold-300">switchMap</code> — the loading bar never gets stuck on.</li>
          <li>Registered once: <code class="text-gold-300">provideHttpClient(withInterceptors([loadingInterceptor]))</code> in <code class="text-gold-300">app.config.ts</code>.</li>
        </ul>
        <p class="mt-3 text-xs text-stone-500">src/app/core/interceptors/loading.interceptor.ts</p>
      </article>
    </section>
  `,
})
export class InterceptorComponent implements OnDestroy {
  readonly stage = signal<Stage>('idle');
  readonly isLoading = signal(false);
  readonly failing = signal(false);
  readonly log = signal<string[]>([]);

  private timers: ReturnType<typeof setTimeout>[] = [];

  sendRequest(shouldFail: boolean): void {
    this.failing.set(shouldFail);
    this.log.set([]);
    this.stage.set('component');
    this.pushLog('→ Component calls httpClient.get(...)');

    this.after(400, () => {
      this.stage.set('interceptor-out');
      this.isLoading.set(true);
      this.pushLog('→ Interceptor: loadingService.show() — isLoading() = true');
    });

    this.after(900, () => {
      this.stage.set('server');
      this.pushLog(shouldFail ? '→ Server: responds with a 500 error' : '→ Server: responds 200 OK');
    });

    this.after(1400, () => {
      this.stage.set('interceptor-in');
      if (shouldFail) {
        this.pushLog('✗ Interceptor: catchError logs it, rethrows to the caller');
      } else {
        this.pushLog('→ Interceptor: response passes through untouched');
      }
      this.pushLog('→ Interceptor: finalize() → loadingService.hide() — isLoading() = false');
      this.isLoading.set(false);
    });

    this.after(1800, () => {
      this.stage.set(shouldFail ? 'error' : 'done');
      this.pushLog(shouldFail ? '✗ Component: subscribe error handler runs' : '✓ Component: gets the result');
    });
  }

  private pushLog(line: string): void {
    this.log.update((lines) => [...lines, line]);
  }

  private after(delayMs: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, delayMs));
  }

  nodeClass(node: 'component' | 'interceptor-out' | 'server' | 'interceptor-in' | 'done'): string {
    const active = this.isActiveNode(node);
    const failed = this.failing() && this.stage() === 'error' && node === 'done';
    if (failed) {
      return 'border-rose-400/60 bg-rose-500/10 text-rose-300';
    }
    if (active) {
      return 'border-gold-400/60 bg-gold-500/15 text-gold-300 scale-105';
    }
    return 'border-stone-800 bg-stone-950 text-stone-400';
  }

  private isActiveNode(node: 'component' | 'interceptor-out' | 'server' | 'interceptor-in' | 'done'): boolean {
    const current = this.stage();
    if (node === 'done') {
      return current === 'done' || current === 'error';
    }
    return current === node;
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }
}
