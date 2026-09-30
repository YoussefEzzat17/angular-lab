import { Component, OnDestroy, signal } from '@angular/core';

type Stage = 'idle' | 'built' | 'cloned' | 'sent' | 'response' | 'handled';

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
        An <code class="text-gold-300">HttpInterceptor</code> is <strong class="text-gold-300">one function standing in the middle</strong> —
        every request your app sends passes through it on the way out, and every response passes through it on the way back, before your component ever sees it.
      </p>

      <!-- 1 · STANDING IN THE MIDDLE -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · What is an interceptor?</p>
        <h2 class="mt-2 text-xl font-bold">One function standing in the middle</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">Request — on the way out</p>
            <div class="mt-3 flex flex-col items-center gap-1 text-center text-sm">
              <span class="rounded-lg bg-stone-950 px-3 py-1.5 text-stone-200">Angular App</span>
              <span class="text-gold-400">↓</span>
              <span class="rounded-lg border border-gold-400/50 bg-gold-500/10 px-3 py-1.5 font-semibold text-gold-300">Interceptor</span>
              <span class="text-gold-400">↓</span>
              <span class="rounded-lg bg-stone-950 px-3 py-1.5 text-stone-200">Backend</span>
            </div>
            <p class="mt-3 text-xs text-stone-500">The request passes through the interceptor before it ever reaches the backend.</p>
          </div>
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-emerald-300">Response — on the way back</p>
            <div class="mt-3 flex flex-col items-center gap-1 text-center text-sm">
              <span class="rounded-lg bg-stone-950 px-3 py-1.5 text-stone-200">Backend</span>
              <span class="text-emerald-400">↓</span>
              <span class="rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-300">Interceptor</span>
              <span class="text-emerald-400">↓</span>
              <span class="rounded-lg bg-stone-950 px-3 py-1.5 text-stone-200">Angular App</span>
            </div>
            <p class="mt-3 text-xs text-stone-500">The response — or the error — passes through it again on the way back.</p>
          </div>
        </div>
      </article>

      <!-- 2 · ANALOGY -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · A simple analogy</p>
        <h2 class="mt-2 text-xl font-bold">A security guard standing at the door</h2>
        <p class="mt-2 text-sm text-stone-400">
          Imagine you're walking into a company building. Before you reach your desk, there's a <strong class="text-stone-200">Security Guard</strong> at the door.
        </p>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-stone-800 p-5 text-center text-sm">
          <span class="rounded-lg bg-stone-950 px-4 py-2 text-stone-200">🚪 The Door</span>
          <span class="text-gold-400">→</span>
          <span class="rounded-lg border border-gold-400/50 bg-gold-500/10 px-4 py-2 font-semibold text-gold-300">💂 Security</span>
          <span class="text-gold-400">→</span>
          <span class="rounded-lg bg-stone-950 px-4 py-2 text-stone-200">🏢 The Company</span>
        </div>
        <p class="mt-4 text-sm text-stone-400">The guard might say:</p>
        <ul class="mt-2 space-y-1.5 text-sm text-stone-300">
          <li>💬 "Show me your ID."</li>
          <li>💬 "Wear your badge."</li>
          <li>🚫 "You can't come in."</li>
        </ul>
        <p class="mt-3 text-sm text-stone-400">
          The interceptor is exactly that guard — it inspects every HTTP request before it's allowed to reach the backend.
        </p>
      </article>

      <!-- 3 · INTERACTIVE DEMO -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · Try it — attach a token automatically</p>
        <h2 class="mt-2 text-xl font-bold">Watch the interceptor add the Authorization header, without any component knowing how</h2>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="sendRequest()"
            [disabled]="stage() !== 'idle' && stage() !== 'handled'"
            class="rounded-lg bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ Send GET /api/users
          </button>
          <label class="flex items-center gap-2 text-sm text-stone-400">
            <input type="checkbox" [checked]="simulateExpired()" (change)="simulateExpired.set(!simulateExpired())" class="h-4 w-4 accent-rose-500" />
            Simulate an expired token (server returns 401)
          </label>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-900 p-4" [class.opacity-40]="stage() === 'idle'">
            <p class="text-xs font-bold text-rose-300">① Original request — built by the component</p>
            <pre class="mt-2 overflow-x-auto rounded-lg bg-stone-950 p-3 text-[11px] text-stone-300">GET /api/users
Host: api.example.com</pre>
            <p class="mt-2 text-xs text-stone-500">No <code class="text-gold-300">Authorization</code> header — the component never has to think about the token.</p>
          </div>
          <div class="rounded-xl bg-gold-950/30 p-4" [class.opacity-40]="stage() === 'idle' || stage() === 'built'">
            <p class="text-xs font-bold text-emerald-300">② Cloned request — after the interceptor</p>
            <pre class="mt-2 overflow-x-auto rounded-lg bg-stone-950 p-3 text-[11px] text-gold-100">GET /api/users
Host: api.example.com
Authorization: Bearer {{ tokenPreview() }}</pre>
            <p class="mt-2 text-xs text-stone-500"><code class="text-gold-300">req.clone(&#123; setHeaders: ... &#125;)</code> — a new request object, token attached.</p>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('built')">
            <p class="text-xs font-bold">Component</p>
            <p class="mt-1 text-[10px] text-stone-500">builds request</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('cloned')">
            <p class="text-xs font-bold">Interceptor</p>
            <p class="mt-1 text-[10px] text-stone-500">clone + add token</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('sent')">
            <p class="text-xs font-bold">Backend</p>
            <p class="mt-1 text-[10px] text-stone-500">receives request</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('response')">
            <p class="text-xs font-bold">Backend</p>
            <p class="mt-1 text-[10px] text-stone-500">{{ stage() === 'response' && simulateExpired() ? '401 Unauthorized' : '200 OK' }}</p>
          </div>
          <div class="rounded-xl border p-3 text-center transition" [class]="nodeClass('handled')">
            <p class="text-xs font-bold">Interceptor</p>
            <p class="mt-1 text-[10px] text-stone-500">{{ simulateExpired() ? 'handles the error' : 'passes it through' }}</p>
          </div>
        </div>

        @if (log().length) {
          <div class="mt-5 rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Console</p>
            <ul class="mt-2 space-y-1 text-xs">
              @for (line of log(); track $index) {
                <li [class.text-rose-300]="line.startsWith('✗')" [class.text-emerald-300]="line.startsWith('✓')" [class.text-stone-300]="!line.startsWith('✗') && !line.startsWith('✓')">
                  {{ line }}
                </li>
              }
            </ul>
          </div>
        }
      </article>

      <!-- 4 · THE CODE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">4 · The code</p>
        <h2 class="mt-2 text-xl font-bold">authInterceptor — line by line</h2>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">export const authInterceptor: HttpInterceptorFn = (req, next) =&gt; &#123;

  const token = localStorage.getItem('token');

  const clonedRequest = req.clone(&#123;
    setHeaders: &#123; Authorization: &#96;Bearer $&#123;token&#125;&#96; &#125;
  &#125;);

  return next(clonedRequest);
&#125;;</pre>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300"><code>req</code></p>
            <p class="mt-1 text-xs text-stone-400">The current HTTP request — e.g. <code class="text-gold-300">GET /api/users</code>. It's read-only.</p>
          </div>
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300"><code>next</code></p>
            <p class="mt-1 text-xs text-stone-400">Means "continue the request through the pipeline" — call it once you're done inspecting or modifying.</p>
          </div>
        </div>
      </article>

      <!-- 5 · WHY CLONE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">5 · Why clone()?</p>
        <h2 class="mt-2 text-xl font-bold">HttpRequest objects are immutable</h2>
        <p class="mt-2 text-sm text-stone-400">
          A common question: "why not just edit <code class="text-gold-300">req</code> directly?" — because in Angular, an
          <code class="text-gold-300">HttpRequest</code> can't be changed in place. Instead, you create a modified <em>copy</em>:
        </p>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-stone-800 p-5 text-center text-sm">
          <span class="rounded-lg bg-stone-950 px-4 py-2 text-stone-200">Original request</span>
          <span class="text-gold-400">→</span>
          <span class="rounded-lg border border-gold-400/50 bg-gold-500/10 px-4 py-2 font-semibold text-gold-300">req.clone(&#123; ... &#125;)</span>
          <span class="text-gold-400">→</span>
          <span class="rounded-lg bg-stone-950 px-4 py-2 text-stone-200">Modified request</span>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ return next(clonedRequest)</p>
            <p class="mt-1 text-xs text-stone-400">"I'm done editing — send the modified version onward."</p>
          </div>
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-rose-300">❌ return next(req)</p>
            <p class="mt-1 text-xs text-stone-400">Sends the original, unmodified request — your token never gets attached.</p>
          </div>
        </div>
      </article>

      <!-- 6 · RESPONSE HANDLING -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">6 · Handling the response too</p>
        <h2 class="mt-2 text-xl font-bold">Not just requests — the response flows through it as well</h2>
        <p class="mt-2 text-sm text-stone-400">
          Imagine the backend replies with <code class="text-rose-300">401 Unauthorized</code> — usually meaning the token is invalid or expired.
          The interceptor sees that status on the way back and reacts, before your component even gets the error:
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">return next(clonedRequest).pipe(
  catchError((error: HttpErrorResponse) =&gt; &#123;
    if (error.status === 401) &#123;
      localStorage.removeItem('token');
      router.navigate(['/login']);
    &#125;
    return throwError(() =&gt; error);
  &#125;)
);</pre>
        <p class="mt-3 text-sm text-stone-400">
          Depending on the app's architecture, that reaction could be a token refresh, a forced logout, a redirect to
          <code class="text-gold-300">/login</code>, or a shared error toast — decided in <strong class="text-stone-200">one place</strong>, instead of every component that calls the API.
        </p>
      </article>

      <!-- 7 · NOT JUST AUTH -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">7 · Not just for authentication</p>
        <h2 class="mt-2 text-xl font-bold">The same "one checkpoint" idea, reused for other things</h2>
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-800 text-stone-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Use case</th>
                <th class="px-4 py-2 font-semibold">What it does</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-400">
              @for (row of useCases; track row.title) {
                <tr>
                  <td class="whitespace-nowrap px-4 py-2 font-semibold text-gold-300">{{ row.title }}</td>
                  <td class="px-4 py-2">{{ row.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
})
export class InterceptorComponent implements OnDestroy {
  readonly stage = signal<Stage>('idle');
  readonly simulateExpired = signal(false);
  readonly log = signal<string[]>([]);

  private readonly token = 'eyJhbGciOiJIUzI1NiJ9.abc123';
  private timers: ReturnType<typeof setTimeout>[] = [];

  readonly useCases = [
    { title: 'Authentication', description: 'Attach the Authorization header to every request automatically.' },
    { title: 'Logging', description: 'Record every request URL and its response status for debugging.' },
    { title: 'Error handling', description: 'Catch 401 / 403 / 500 in one place instead of every component.' },
    { title: 'Loading indicator', description: 'Show a spinner when a request starts, hide it when it finishes.' },
    { title: 'Common headers', description: 'Add Content-Type, Accept-Language, or a Correlation-ID to every call.' },
  ];

  tokenPreview(): string {
    return this.token;
  }

  sendRequest(): void {
    this.log.set([]);
    this.stage.set('built');
    this.pushLog('→ Component: httpClient.get(\'/api/users\')');

    this.after(500, () => {
      this.stage.set('cloned');
      this.pushLog('→ Interceptor: req.clone({ setHeaders: { Authorization } })');
    });

    this.after(1000, () => {
      this.stage.set('sent');
      this.pushLog('→ Interceptor: next(clonedRequest) — sent to backend');
    });

    this.after(1600, () => {
      this.stage.set('response');
      this.pushLog(this.simulateExpired() ? '→ Backend: responds 401 Unauthorized' : '→ Backend: responds 200 OK');
    });

    this.after(2200, () => {
      this.stage.set('handled');
      if (this.simulateExpired()) {
        this.pushLog('✗ Interceptor: catchError sees 401 → clears token → router.navigate([\'/login\'])');
      } else {
        this.pushLog('✓ Interceptor: response passes through untouched → Component gets the users');
      }
    });
  }

  private pushLog(line: string): void {
    this.log.update((lines) => [...lines, line]);
  }

  private after(delayMs: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, delayMs));
  }

  nodeClass(node: Stage): string {
    const active = this.stage() === node;
    const failedHandled = node === 'handled' && this.stage() === 'handled' && this.simulateExpired();
    if (failedHandled) {
      return 'border-rose-400/60 bg-rose-500/10 text-rose-300';
    }
    if (active) {
      return 'border-gold-400/60 bg-gold-500/15 text-gold-300 scale-105';
    }
    return 'border-stone-800 bg-stone-950 text-stone-400';
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }
}
