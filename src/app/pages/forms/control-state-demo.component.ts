import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';

export interface ControlSnapshot {
  value: string;
  status: string;
  touched: boolean;
  dirty: boolean;
  errorKeys: string[];
}

/** A custom validator is just a function: return null when fine, or an object whose key names the problem. */
export const noSpaces: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  /\s/.test(control.value ?? '') ? { noSpaces: true } : null;

export const ERROR_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  noSpaces: 'Spaces are not allowed.',
};

export function snapshotOf(control: AbstractControl): ControlSnapshot {
  return {
    value: String(control.value ?? ''),
    status: control.status,
    touched: control.touched,
    dirty: control.dirty,
    errorKeys: Object.keys(control.errors ?? {}),
  };
}

/** One real FormControl with live flags, so the learner sees touched, dirty and errors change as they type. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-control-state-demo',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label for="state-email" class="mt-4 block text-sm font-medium text-stone-200">Email (required, valid email, no spaces)</label>
    <input
      id="state-email"
      type="text"
      data-testid="state-input"
      [formControl]="control"
      class="mt-2 w-full rounded-xl border bg-stone-900 px-4 py-3 text-stone-100 focus:outline-none"
      [class]="showError() ? 'border-rose-500' : 'border-stone-700 focus:border-gold-400'"
    />
    @if (showError()) {
      <p class="mt-2 text-sm text-rose-300" data-testid="state-message" role="alert">{{ message() }}</p>
    }

    <dl class="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4" data-testid="state-flags">
      @for (flag of flags(); track flag.name) {
        <div class="rounded-xl bg-stone-950 p-3">
          <dt class="font-mono text-xs text-stone-500">{{ flag.name }}</dt>
          <dd class="mt-1 font-semibold" [class]="flag.on ? 'text-emerald-300' : 'text-stone-500'" [attr.data-testid]="'flag-' + flag.name">{{ flag.text }}</dd>
        </div>
      }
    </dl>
    <p class="mt-3 rounded-xl bg-stone-950 p-3 font-mono text-xs text-stone-300" data-testid="state-errors">
      errors: {{ snapshot().errorKeys.length ? '{ ' + snapshot().errorKeys.join(', ') + ' }' : 'null' }}
    </p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" data-testid="state-touch" (click)="control.markAsTouched()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">markAsTouched()</button>
      <button type="button" data-testid="state-reset" (click)="control.reset('')" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">reset()</button>
    </div>
  `,
})
export class ControlStateDemoComponent {
  readonly control = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, noSpaces] });

  readonly snapshot = toSignal(
    this.control.events.pipe(
      startWith(null),
      map(() => snapshotOf(this.control)),
    ),
    { requireSync: true },
  );

  flags() {
    const s = this.snapshot();
    return [
      { name: 'valid', on: s.status === 'VALID', text: s.status === 'VALID' ? 'true' : 'false' },
      { name: 'touched', on: s.touched, text: String(s.touched) },
      { name: 'dirty', on: s.dirty, text: String(s.dirty) },
      { name: 'pristine', on: !s.dirty, text: String(!s.dirty) },
    ];
  }

  /** Show the message only after the user has been in the field, never on page load. */
  showError(): boolean {
    const s = this.snapshot();
    return s.errorKeys.length > 0 && (s.touched || s.dirty);
  }

  message(): string {
    const first = this.snapshot().errorKeys[0];
    return ERROR_MESSAGES[first] ?? 'This value is not valid.';
  }
}
