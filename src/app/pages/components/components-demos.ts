import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A tiny component, used twice in the lesson to show that one definition can be used many times. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-greeting-demo',
  standalone: true,
  template: `<p class="rounded-lg bg-stone-800 px-3 py-2 text-sm text-stone-100">Hello, <strong class="text-gold-300">{{ name() }}</strong>!</p>`,
})
export class GreetingDemoComponent {
  readonly name = input('friend');
}

/** Its own styles apply only to its own template: that is view encapsulation. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-scoped-demo',
  standalone: true,
  template: `<span class="tag">tag inside the component</span>`,
  styles: `
    .tag {
      color: rgb(var(--gold-300));
      font-weight: 700;
      border: 1px solid rgb(var(--gold-400));
      border-radius: 9999px;
      padding: 0.1rem 0.6rem;
    }
  `,
})
export class ScopedDemoComponent {}

/** :host styles the component's own tag from the inside. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-host-demo',
  standalone: true,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      border: 1px dashed rgb(var(--gold-400));
      border-radius: 0.75rem;
      padding: 0.75rem;
    }
  `,
})
export class HostDemoComponent {}

/** The component the learner "builds" in the last section. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile-card',
  standalone: true,
  template: `
    <article class="rounded-xl border border-stone-700 bg-stone-900 p-4">
      <p class="font-bold text-stone-100">{{ name() }}</p>
      <p class="text-sm text-stone-400">{{ role() }}</p>
    </article>
  `,
})
export class ProfileCardComponent {
  readonly name = input.required<string>();
  readonly role = input('Learner');
}
