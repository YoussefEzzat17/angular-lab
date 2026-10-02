import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TOPICS } from '../../core/data/topics';
import { FeedbackService } from '../../core/services/feedback.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { PageHeaderComponent } from '../../shared/page-header.component';

const COOLDOWN_SECONDS = 10;

@Component({
  standalone: true,
  imports: [IconComponent, PageHeaderComponent, ReactiveFormsModule],
  styles: `
    .field {
      width: 100%;
      border-radius: 0.75rem;
      border: 1px solid rgb(var(--card-ring-strong));
      background: rgb(var(--card-surface));
      padding: 0.875rem 1rem;
      color: rgb(var(--stone-100));
      outline: none;
    }
    .field::placeholder {
      color: rgb(var(--stone-500));
    }
    select.field {
      appearance: none;
      padding-right: 2.75rem;
    }
    .field.invalid {
      border-color: rgb(var(--status-rose-strong));
    }
    .error {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: rgb(var(--status-rose-strong));
    }
  `,
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header eyebrow="GOT SOMETHING TO SAY?" title="Feedback">
        Found something confusing, spotted a bug, or think a topic is missing? Tell me directly — every message
        lands straight in my inbox.
      </app-page-header>

      <form
        [formGroup]="feedbackForm"
        (ngSubmit)="submit()"
        class="mt-8 rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-2xl shadow-black/20 sm:p-8"
      >
        <div class="grid gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="mb-2 block text-sm font-medium text-stone-200">Name (optional)</label>
            <input id="name" formControlName="name" placeholder="Your name" class="field" />
          </div>
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-stone-200">Email (optional)</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              class="field"
              [class.invalid]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <small class="error">Please enter a valid email address.</small>
            }
          </div>
        </div>

        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label for="topic" class="mb-2 block text-sm font-medium text-stone-200">Which topic?</label>
            <div class="relative">
              <select id="topic" formControlName="topic" class="field">
                <option value="General">General / the whole site</option>
                @for (topic of topics; track topic.path) {
                  <option [value]="topic.title">{{ topic.title }}</option>
                }
              </select>
              <app-icon name="chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
          <div>
            <label for="type" class="mb-2 block text-sm font-medium text-stone-200">What kind of feedback?</label>
            <div class="relative">
              <select id="type" formControlName="feedbackType" class="field">
                <option value="Suggestion">Suggestion / idea</option>
                <option value="Bug or missing content">Something's wrong or missing</option>
                <option value="General comment">Just a comment</option>
              </select>
              <app-icon name="chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <label for="message" class="mb-2 block text-sm font-medium text-stone-200">Message</label>
          <textarea
            id="message"
            rows="5"
            formControlName="message"
            placeholder="Tell me what's on your mind..."
            class="field"
            [class.invalid]="isFieldInvalid('message')"
          ></textarea>
          @if (isFieldInvalid('message')) {
            <small class="error">
              @if (feedbackForm.get('message')?.errors?.['required']) {
                Message is required.
              }
              @if (feedbackForm.get('message')?.errors?.['minlength']) {
                At least 10 characters.
              }
            </small>
          }
        </div>

        <button
          type="submit"
          [disabled]="isSubmitting() || feedbackForm.invalid || isCooldown()"
          class="mt-8 w-full rounded-xl bg-gold-500 px-4 py-3.5 font-semibold text-white transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          @if (isSubmitting()) {
            Sending...
          } @else if (isCooldown()) {
            Wait {{ cooldownRemaining() }}s
          } @else {
            Send Feedback
          }
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-stone-500">
        Your message goes straight to
        <a href="https://youssef-ezzat.vercel.app/" target="_blank" rel="noopener noreferrer" class="font-semibold text-gold-300 underline-offset-4 hover:underline">Youssef</a>,
        who reads every one.
      </p>
    </section>
  `,
})
export class FeedbackComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly feedback = inject(FeedbackService);
  private readonly toast = inject(ToastService);

  readonly topics = TOPICS;

  readonly feedbackForm = this.fb.group({
    name: [''],
    email: ['', [Validators.email]],
    topic: ['General'],
    feedbackType: ['Suggestion'],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly isSubmitting = signal(false);
  readonly isCooldown = signal(false);
  readonly cooldownRemaining = signal(0);

  private cooldownInterval?: ReturnType<typeof setInterval>;

  isFieldInvalid(field: string): boolean {
    const control = this.feedbackForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async submit(): Promise<void> {
    if (this.isCooldown()) return;

    if (this.feedbackForm.invalid) {
      Object.values(this.feedbackForm.controls).forEach((control) => control.markAsTouched());
      return;
    }

    this.isSubmitting.set(true);

    const value = this.feedbackForm.getRawValue();

    try {
      await this.feedback.sendFeedback({
        from_name: value.name?.trim() || 'Anonymous student',
        from_email: value.email?.trim() || 'not provided',
        topic: value.topic ?? 'General',
        feedback_type: value.feedbackType ?? 'General comment',
        message: value.message ?? '',
      });
      this.toast.success('Feedback sent', 'Thank you! It landed straight in my inbox.');
      this.feedbackForm.reset({ topic: 'General', feedbackType: 'Suggestion' });
      this.startCooldown();
    } catch (err) {
      console.error('Failed to send feedback:', err);
      this.toast.error("Couldn't send your feedback", 'Please check your connection and try again in a moment.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private startCooldown(): void {
    this.isCooldown.set(true);
    this.cooldownRemaining.set(COOLDOWN_SECONDS);

    this.cooldownInterval = setInterval(() => {
      this.cooldownRemaining.update((value) => value - 1);
      if (this.cooldownRemaining() <= 0) {
        this.clearCooldown();
      }
    }, 1000);
  }

  private clearCooldown(): void {
    clearInterval(this.cooldownInterval);
    this.isCooldown.set(false);
    this.cooldownRemaining.set(0);
  }

  ngOnDestroy(): void {
    clearInterval(this.cooldownInterval);
  }
}
