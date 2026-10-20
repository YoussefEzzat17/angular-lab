import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type Visitor = 'guest' | 'member' | 'admin';
export type Destination = 'home' | 'members' | 'admin';
export type GateOutcome = 'allow' | 'redirect' | 'cancel';

export interface GateResult {
  /** The guard that ran, or null when the route has none. */
  guard: string | null;
  steps: string[];
  /** What the guard function returned, as it would read in code. */
  returned: string;
  outcome: GateOutcome;
  message: string;
}

export const VISITORS: { id: Visitor; label: string; blurb: string }[] = [
  { id: 'guest', label: 'Guest', blurb: 'not logged in' },
  { id: 'member', label: 'Member', blurb: 'logged in' },
  { id: 'admin', label: 'Admin', blurb: 'logged in, role admin' },
];

export const DESTINATIONS: { id: Destination; path: string; guard: string }[] = [
  { id: 'home', path: '/home', guard: 'no guard' },
  { id: 'members', path: '/members', guard: 'membersGuard' },
  { id: 'admin', path: '/admin', guard: 'adminGuard' },
];

export const GUARD_CODE: Record<Destination, string> = {
  home: '{ path: "home", component: HomeComponent }   // nothing to check',
  members: `export const membersGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.loggedIn() ? true : inject(Router).createUrlTree(['/login']);
};`,
  admin: `export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (!auth.loggedIn()) return inject(Router).createUrlTree(['/login']);
  return auth.role() === 'admin';   // false = cancel, the user stays where they were
};`,
};

/** What the router does when this visitor tries to open this page. Pure, so it is easy to test. */
export function openGate(visitor: Visitor, destination: Destination): GateResult {
  const path = DESTINATIONS.find((d) => d.id === destination)!.path;
  const steps = [`The router matches ${path}`];

  if (destination === 'home') {
    steps.push('The route has no guard');
    return { guard: null, steps, returned: 'no guard to run', outcome: 'allow', message: 'The page opens.' };
  }

  const guard = destination === 'members' ? 'membersGuard' : 'adminGuard';
  steps.push(`The router runs ${guard}()`);
  const loggedIn = visitor !== 'guest';
  steps.push(`The guard asks: is the visitor logged in? ${loggedIn ? 'Yes' : 'No'}`);

  if (!loggedIn) {
    return {
      guard,
      steps,
      returned: "router.createUrlTree(['/login'])",
      outcome: 'redirect',
      message: 'The router sends the visitor to /login instead.',
    };
  }

  if (destination === 'admin') {
    const isAdmin = visitor === 'admin';
    steps.push(`The guard asks: is the role admin? ${isAdmin ? 'Yes' : 'No'}`);
    if (!isAdmin) {
      return {
        guard,
        steps,
        returned: 'false',
        outcome: 'cancel',
        message: 'The navigation is cancelled. The visitor stays on the page they were on and nothing seems to happen.',
      };
    }
  }

  return { guard, steps, returned: 'true', outcome: 'allow', message: 'The page opens.' };
}

/** Pick who is visiting and where they are going, and see exactly what the router and the guard do. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guard-gate-demo',
  standalone: true,
  template: `
    <p class="mt-3 text-xs font-bold tracking-wider text-stone-500">WHO IS VISITING?</p>
    <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Visitor">
      @for (v of visitors; track v.id) {
        <button
          type="button"
          [attr.data-testid]="'visitor-' + v.id"
          [attr.aria-pressed]="visitor() === v.id"
          (click)="visitor.set(v.id)"
          class="min-h-11 rounded-xl border px-4 text-left text-sm transition"
          [class]="visitor() === v.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          <span class="block font-semibold">{{ v.label }}</span>
          <span class="block text-xs text-stone-400">{{ v.blurb }}</span>
        </button>
      }
    </div>

    <p class="mt-4 text-xs font-bold tracking-wider text-stone-500">WHERE ARE THEY GOING?</p>
    <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Destination">
      @for (d of destinations; track d.id) {
        <button
          type="button"
          [attr.data-testid]="'dest-' + d.id"
          [attr.aria-pressed]="destination() === d.id"
          (click)="destination.set(d.id)"
          class="min-h-11 rounded-xl border px-4 text-left text-sm transition"
          [class]="destination() === d.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          <span class="block font-mono font-semibold">{{ d.path }}</span>
          <span class="block text-xs text-stone-400">{{ d.guard }}</span>
        </button>
      }
    </div>

    <ol class="mt-5 space-y-2" data-testid="gate-steps">
      @for (step of result().steps; track $index) {
        <li class="flex items-start gap-3 rounded-xl bg-stone-950 px-3 py-2 text-sm text-stone-300">
          <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stone-800 text-xs font-bold text-stone-300" aria-hidden="true">{{ $index + 1 }}</span>
          <span>{{ step }}</span>
        </li>
      }
    </ol>

    <p class="mt-4 text-xs font-bold tracking-wider text-stone-500">THE GUARD THAT RAN</p>
    <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ code() }}</pre>

    <div class="mt-4 rounded-xl p-4 text-sm" [class]="outcomeClass()" role="status" aria-live="polite">
      <p class="font-semibold">
        Returned: <code data-testid="gate-returned">{{ result().returned }}</code>
      </p>
      <p class="mt-1 font-bold" data-testid="gate-outcome">{{ outcomeLabel() }}</p>
      <p class="mt-1" data-testid="gate-message">{{ result().message }}</p>
    </div>
  `,
})
export class GuardGateDemoComponent {
  readonly visitors = VISITORS;
  readonly destinations = DESTINATIONS;
  readonly visitor = signal<Visitor>('guest');
  readonly destination = signal<Destination>('members');

  protected readonly result = computed(() => openGate(this.visitor(), this.destination()));
  protected readonly code = computed(() => GUARD_CODE[this.destination()]);

  protected outcomeLabel(): string {
    switch (this.result().outcome) {
      case 'allow':
        return '✓ Allowed';
      case 'redirect':
        return '↪ Redirected';
      default:
        return '✕ Cancelled';
    }
  }

  protected outcomeClass(): string {
    switch (this.result().outcome) {
      case 'allow':
        return 'bg-emerald-500/10 text-emerald-200';
      case 'redirect':
        return 'bg-gold-500/10 text-gold-200';
      default:
        return 'bg-rose-500/10 text-rose-200';
    }
  }
}
