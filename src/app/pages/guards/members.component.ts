import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DemoAuthService } from '../../core/services/demo-auth.service';

/** The "protected" page behind membersGuard. */
@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div class="rounded-2xl border border-emerald-500/30 bg-[rgb(var(--panel-success-bg))] p-8 text-center">
        <p class="text-4xl">🔓</p>
        <h1 class="mt-3 text-2xl font-bold text-[rgb(var(--panel-success-heading))]">Welcome, member</h1>
        <p class="mt-2 text-stone-300">
          You are seeing this because <code class="text-gold-300">membersGuard</code> returned <code class="text-gold-300">true</code>.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <a routerLink="/guards" class="rounded-xl border border-stone-700 px-4 py-2.5 font-semibold text-stone-200 hover:bg-stone-800">← Back to the lesson</a>
          <button type="button" (click)="logOut()" class="rounded-xl bg-gold-500 px-4 py-2.5 font-semibold text-white hover:bg-gold-400">Log out and go back</button>
        </div>
      </div>
    </section>
  `,
})
export class MembersComponent {
  private readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);

  logOut(): void {
    this.auth.logOut();
    this.router.navigate(['/guards']);
  }
}
