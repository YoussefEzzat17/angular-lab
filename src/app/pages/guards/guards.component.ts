import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { DemoAuthService } from '../../core/services/demo-auth.service';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { GuardGateDemoComponent } from './guard-gate-demo.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    FlowDiagramComponent,
    CodeBlockDirective,
    GuardGateDemoComponent,
    PageHeaderComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    KnowledgeCheckComponent,
    OrderStepsComponent,
    PredictOutputComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'guards'" [section]="section()">

      <!-- ── Section 1 · Why guards ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Route Guards" illustration="guards">
            Routing decides <em>which</em> page to show; a guard decides <em>whether the user may see it at all</em>. A guard is
            a small function the router runs before it activates a route. Return <code class="text-gold-300">true</code> to let
            the user in, or a redirect to send them somewhere else.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Anyone can type a URL">
            <p class="mt-2 text-sm text-stone-400">
              In a single-page app the router lives in the browser. If a visitor types <code class="text-gold-300">/admin</code> into the address bar, the router opens the admin page,
              because nothing told it not to. A guard is the thing that tells it.
            </p>
            <app-flow-diagram class="mt-4 block" from="visitor types /admin" to="router asks the guard first" direction="right" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="2 · THE MENTAL MODEL" heading="A bouncer at the door" tone="amber">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">The route</strong> is a room. <strong class="text-stone-100">The guard</strong> is the bouncer who checks you before you go in.</li>
              <li><strong class="text-stone-100">"Come in"</strong> is <code class="text-gold-300">true</code>. The page opens.</li>
              <li><strong class="text-stone-100">"Go to the other door"</strong> is a <code class="text-gold-300">UrlTree</code>. The router sends you somewhere else, such as the login page.</li>
              <li><strong class="text-stone-100">"Not tonight"</strong> is <code class="text-gold-300">false</code>. You stay where you were, and nothing happens.</li>
            </ul>
          </app-lesson-card>
        </section>
      </ng-template>

      <!-- ── Section 2 · canActivate ── -->
      <ng-template appLessonSection="can-activate">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="3 · CANACTIVATE" heading="A function that answers yes or no">
            <p class="mt-2 text-sm text-stone-400">
              Attach a guard to a route with <code class="text-gold-300">canActivate</code>. Before the page loads, the router calls it.
            </p>
            <app-flow-diagram class="mt-4 block" from="navigate to /guards/members" to="membersGuard() → true / redirect" direction="right" />
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ guardCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="4 · WHAT A GUARD CAN RETURN" heading="Three answers, in four wrappers">
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Return value</th><th class="px-4 py-2 font-semibold">What the router does</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of returnTypes; track row.value) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.value }}</td>
                      <td class="px-4 py-2">{{ row.effect }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="mt-3 text-sm text-stone-400">
              A guard may also return an <code class="text-gold-300">Observable</code> or a <code class="text-gold-300">Promise</code> of those answers, which is how a guard waits for a server check.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="5 · THE MODERN WAY" heading="A plain function that uses inject()">
            <p class="mt-2 text-sm text-stone-400">
              Guards are functions now. They use <code class="text-gold-300">inject()</code> to get what they need. Class-based guards still exist but are deprecated.
              A function that returns a guard lets you reuse one check with different settings.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ factoryCode }}</pre>
          </app-lesson-card>
        </section>
      </ng-template>

      <!-- ── Section 3 · Simulator ── -->
      <ng-template appLessonSection="simulator">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="6 · SEE IT" heading="Send visitors to three pages and watch the guard decide">
            <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
              <li>A <strong class="text-stone-200">guest</strong> opens <strong class="text-stone-200">/members</strong>: the guard redirects.</li>
              <li>A <strong class="text-stone-200">member</strong> opens <strong class="text-stone-200">/admin</strong>: the guard returns false, so nothing happens.</li>
              <li>An <strong class="text-stone-200">admin</strong> opens <strong class="text-stone-200">/admin</strong>: the guard returns true.</li>
            </ol>
            <app-guard-gate-demo />
          </app-lesson-card>
        </section>
      </ng-template>

      <!-- ── Section 4 · Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div class="grid gap-5 md:grid-cols-2">
            <app-lesson-card variant="highlight" label="7 · TRY IT FOR REAL" heading="Log in, then open the members page">
              <p class="mt-2 text-sm text-stone-400">
                This one uses this app's own router and guard. The "login" is only a switch (no real account). With it off, the guard blocks the page and redirects you back here.
              </p>

              <div class="mt-5 flex items-center justify-between gap-3 rounded-xl bg-stone-800 p-4">
                <span class="text-sm text-stone-300">
                  Status:
                  <strong [class]="auth.loggedIn() ? 'text-emerald-400' : 'text-[rgb(var(--panel-danger-heading))]'">
                    {{ auth.loggedIn() ? 'logged in' : 'logged out' }}
                  </strong>
                </span>
                <button
                  type="button"
                  role="switch"
                  [attr.aria-checked]="auth.loggedIn()"
                  (click)="auth.toggle()"
                  class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold hover:bg-stone-700"
                >
                  {{ auth.loggedIn() ? 'Log out' : 'Log in' }}
                </button>
              </div>

              <a routerLink="/guards/members" class="mt-4 inline-block rounded-xl bg-gold-solid px-4 py-2.5 font-semibold text-white hover:bg-gold-solid-hover">
                Open the members page →
              </a>

              @if (denied()) {
                <p role="alert" class="mt-4 rounded-xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-4 text-sm text-stone-200">
                  <strong class="text-[rgb(var(--panel-danger-heading))]">Blocked.</strong> The guard returned a redirect to
                  <code class="text-gold-300">/learn/guards/try-it?denied=1</code> because you are logged out. Log in and try again.
                </p>
              }
            </app-lesson-card>
          </div>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What does the visitor see?">
            <app-predict-output [challenge]="falseChallenge" />
          </app-lesson-card>
        </section>
      </ng-template>

      <!-- ── Section 5 · The five kinds ── -->
      <ng-template appLessonSection="five-kinds">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="8 · THE FIVE KINDS" heading="Pick the guard that matches the question">
            <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              @for (kind of kinds; track kind.name) {
                <div class="rounded-xl bg-stone-800 p-4">
                  <p class="font-mono text-sm font-semibold text-gold-300">{{ kind.name }}</p>
                  <p class="mt-1 text-sm text-stone-400">{{ kind.when }}</p>
                </div>
              }
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What the router does with a guard">
            <p class="mt-2 text-sm text-stone-400">Put these four steps in the order they happen when someone navigates to a protected page.</p>
            <app-order-steps
              [steps]="routerSteps"
              explanation="The router first finds the route for the URL, then asks its canActivate guards. Resolvers run only after every guard said yes, and the component is created last. A page that is turned away never gets built."
            />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Guard mistakes to avoid">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Treating a guard as security.</strong> A guard only controls the browser. Anyone can call your API directly, so the server must check permissions too.</li>
              <li><strong class="text-stone-100">Returning false and leaving the user stuck.</strong> <code class="text-gold-300">false</code> just cancels the navigation. Return a <code class="text-gold-300">UrlTree</code> to send the user somewhere useful, like the login page.</li>
              <li><strong class="text-stone-100">Checking inside the component instead.</strong> By then the component has already been created, so protected content can flash on screen first.</li>
              <li><strong class="text-stone-100">Calling router.navigate() inside the guard.</strong> Return a <code class="text-gold-300">UrlTree</code> instead, so the redirect is part of the same navigation.</li>
            </ul>
          </app-lesson-card>

          <app-knowledge-check [items]="recapItems" />
        </section>
      </ng-template>

    </app-lesson-player>
  `,
})
export class GuardsComponent {
  /** Set by the router from the :section URL param (withComponentInputBinding). */
  readonly section = input<string>();

  readonly auth = inject(DemoAuthService);
  private readonly route = inject(ActivatedRoute);

  readonly denied = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('denied') === '1')), { initialValue: false });

  readonly guardCode = `export const membersGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);

  return auth.loggedIn()
    ? true
    : router.createUrlTree(['/learn', 'guards', 'try-it'], { queryParams: { denied: '1' } });
};

// in app.routes.ts
{ path: 'guards/members', canActivate: [membersGuard], loadComponent: ... }`;

  readonly factoryCode = `// one function, many routes
export const roleGuard = (role: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  return auth.role() === role ? true : inject(Router).createUrlTree(['/login']);
};

{ path: 'admin',   canActivate: [roleGuard('admin')],   loadComponent: ... }
{ path: 'billing', canActivate: [roleGuard('finance')], loadComponent: ... }`;

  readonly returnTypes = [
    { value: 'true', effect: 'The navigation goes ahead and the page opens.' },
    { value: 'false', effect: 'The navigation is cancelled. The user stays where they were.' },
    { value: 'UrlTree', effect: 'The navigation is cancelled and the router goes to that URL instead.' },
    { value: 'Observable | Promise', effect: 'The router waits for it, then treats the result like one of the above.' },
  ];

  readonly kinds = [
    { name: 'canActivate', when: 'May this user open this route?' },
    { name: 'canActivateChild', when: 'Same question, for every child route under a parent.' },
    { name: 'canDeactivate', when: 'May the user leave? (e.g. unsaved changes)' },
    { name: 'canMatch', when: 'Should this route even exist for this user? (feature flags, roles)' },
    { name: 'resolve', when: 'Not a yes/no — load the data the page needs before it shows.' },
  ];

  readonly falseChallenge: PredictChallenge = {
    question: 'A guard returns false for /admin. What does the visitor see?',
    code: 'export const adminGuard: CanActivateFn = () => {\n  return false;\n};',
    options: [
      { id: 'login', text: 'They are sent to the login page' },
      { id: 'error', text: 'An error page appears' },
      { id: 'stay', text: 'Nothing: they stay on the page they were on' },
      { id: 'open', text: 'The admin page opens anyway' },
    ],
    correct: 'stay',
    explanation: 'false only cancels the navigation. If you want the visitor to land somewhere useful, return a UrlTree such as the login page.',
  };

  readonly routerSteps = [
    'The router finds the route that matches the URL',
    'The router runs the canActivate guards of that route',
    'The router runs the resolvers, if there are any',
    'The component is created and shown',
  ];

  readonly recapItems: KnowledgeCheckItem[] = [
    {
      question: 'What can a canActivate guard return, and what does each result do?',
      answer: 'true lets the navigation continue; false cancels it and the user stays where they were; a UrlTree cancels it and redirects to that URL instead.',
    },
    {
      question: 'Why return a UrlTree instead of calling router.navigate() inside the guard?',
      answer: 'A UrlTree lets the router handle the redirect as part of the same navigation, so history stays clean and there is no race between your navigate() call and the original one.',
    },
    {
      question: 'Does a guard make a page secure?',
      answer: 'No. Guards only control what the browser shows — anyone can change client-side code. Real protection must also happen on the server, for example by checking the token on every API call.',
    },
  ];
}
