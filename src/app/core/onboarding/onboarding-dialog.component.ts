import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-onboarding-dialog',
  standalone: true,
  imports: [FormsModule, A11yModule],
  template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        class="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-8 shadow-2xl shadow-black/60"
      >
        <p class="text-4xl text-center">👋</p>
        <h2 id="onboarding-title" class="mt-4 text-2xl font-bold text-center text-stone-100">
          Welcome to Angular Lab
        </h2>
        <p class="mt-2 text-center text-stone-400">
          A hands-on playground for learning Angular — one interactive topic at a time.
        </p>

        <div class="mt-7">
          <label for="onboarding-name" class="block text-sm font-semibold text-stone-300 mb-2">
            What should we call you? <span class="font-normal text-stone-500">(optional)</span>
          </label>
          <input
            id="onboarding-name"
            type="text"
            [(ngModel)]="name"
            (keydown.enter)="done()"
            placeholder="Your name"
            maxlength="40"
            class="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-stone-100 placeholder:text-stone-500 focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div class="mt-6 flex flex-col gap-3">
          <button
            type="button"
            (click)="done()"
            class="w-full rounded-xl bg-gold-500 py-3 font-semibold text-white transition hover:bg-gold-400"
          >
            Start Learning →
          </button>
          <button
            type="button"
            (click)="skip()"
            class="w-full rounded-xl py-2 text-sm text-stone-500 transition hover:text-stone-300"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OnboardingDialogComponent {
  private readonly profile = inject(ProfileService);
  readonly closed = output<void>();

  name = '';

  done(): void {
    if (this.name.trim()) { this.profile.setName(this.name); }
    this.profile.finishOnboarding();
    this.closed.emit();
  }

  skip(): void {
    this.profile.finishOnboarding();
    this.closed.emit();
  }
}
