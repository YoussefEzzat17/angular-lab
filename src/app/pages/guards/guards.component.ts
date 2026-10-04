import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { DemoAuthService } from '../../core/services/demo-auth.service';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

@Component({
  standalone: true,
  imports: [RouterLink, FlowDiagramComponent, CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Route Guards" illustration="guards" pdf="guards.pdf">
        Routing decides <em>which</em> page to show; a guard decides <em>whether the user may see it at all</em>. A guard is
        a small function the router runs before it activates a route — return <code class="text-gold-300">true</code> to let
        the user in, or a redirect to send them somewhere else. Flip the switch below and try to open the members page.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · CANACTIVATE" heading="A function that answers yes or no">
          <p class="mt-2 text-sm text-stone-400">
            Attach a guard to a route with <code class="text-gold-300">canActivate</code>. Before the page loads, the router
            calls it. <code class="text-gold-300">true</code> opens the page; a <code class="text-gold-300">UrlTree</code>
            redirects; <code class="text-gold-300">false</code> just cancels the navigation.
          </p>
          <app-flow-diagram class="mt-4 block" from="navigate to /guards/members" to="membersGuard() → true / redirect" direction="right" />
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ guardCode }}</pre>
        </app-lesson-card>

        <app-lesson-card variant="highlight" label="2 · TRY IT" heading="Log in, then open the members page">
          <p class="mt-2 text-sm text-stone-400">
            The "login" is only a switch (no real account). With it off, the guard blocks the page and redirects you back here.
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

          <a routerLink="/guards/members" class="mt-4 inline-block rounded-xl bg-gold-500 px-4 py-2.5 font-semibold text-white hover:bg-gold-400">
            Open the members page →
          </a>

          @if (denied()) {
            <p role="alert" class="mt-4 rounded-xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-4 text-sm text-stone-200">
              <strong class="text-[rgb(var(--panel-danger-heading))]">Blocked.</strong> The guard returned a redirect to
              <code class="text-gold-300">/guards?denied=1</code> because you are logged out. Log in and try again.
            </p>
          }
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="3 · THE FIVE KINDS" heading="Pick the guard that matches the question">
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (kind of kinds; track kind.name) {
              <div class="rounded-xl bg-stone-800 p-4">
                <p class="font-mono text-sm font-semibold text-gold-300">{{ kind.name }}</p>
                <p class="mt-1 text-sm text-stone-400">{{ kind.when }}</p>
              </div>
            }
          </div>
        </app-lesson-card>
      </div>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class GuardsComponent {
  readonly auth = inject(DemoAuthService);
  private readonly route = inject(ActivatedRoute);

  readonly denied = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('denied') === '1')), { initialValue: false });

  readonly guardCode = `export const membersGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);

  return auth.loggedIn()
    ? true
    : router.createUrlTree(['/guards'], { queryParams: { denied: '1' } });
};

// in app.routes.ts
{ path: 'guards/members', canActivate: [membersGuard], loadComponent: ... }`;

  readonly kinds = [
    { name: 'canActivate', when: 'May this user open this route?' },
    { name: 'canActivateChild', when: 'Same question, for every child route under a parent.' },
    { name: 'canDeactivate', when: 'May the user leave? (e.g. unsaved changes)' },
    { name: 'canMatch', when: 'Should this route even exist for this user? (feature flags, roles)' },
    { name: 'resolve', when: 'Not a yes/no — load the data the page needs before it shows.' },
  ];

  readonly recapItems: RecapItem[] = [
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
