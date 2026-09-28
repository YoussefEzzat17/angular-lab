import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';

import { NumbersOnlyDirective } from '../../directives/number-only.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NumbersOnlyDirective] ,
  styles: `
    .field {
      width: 100%;
      border-radius: 0.75rem;
      border: 1px solid #475569;
      background: #1e293b;
      padding: 0.875rem 1rem;
      color: white;
      outline: none;
    }
    .field.invalid {
      border-color: #fb7185;
    }
    .error {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #fda4af;
    }
  `,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-sm font-semibold tracking-wide text-gold-400">ANGULAR FORMS</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Reactive forms</h1>
      <p class="mt-3 max-w-3xl text-stone-400">Reactive forms define fields and validation rules in TypeScript, giving you full control over the form model.</p>

      <div class="mt-10 flex flex-col gap-8 lg:flex-row">

        <!-- Reactive form -->
        <div class="min-w-0 flex-1">
          <form
            [formGroup]="signupForm"
            (ngSubmit)="submit()"
            class="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
          >
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-300">REACTIVE FORM</span>
            </div>
            <h2 class="mt-3 text-2xl font-bold text-white">Create a watch profile</h2>
            <p class="mt-1 text-sm text-stone-400">Tell us a bit about yourself to get personalized picks.</p>

            <p class="mt-8 border-b border-stone-800 pb-2 text-xs font-bold tracking-wider text-stone-500">ACCOUNT</p>

            <div class="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label for="displayName" class="mb-2 block text-sm font-medium text-stone-200">Display name</label>
                <input
                  id="displayName"
                  formControlName="displayName"
                  placeholder="e.g. Alex Rivera"
                  class="field"
                  [class.invalid]="signupForm.get('displayName')?.invalid && signupForm.get('displayName')?.touched"
                />
                @if (signupForm.get('displayName')?.invalid && signupForm.get('displayName')?.touched) {
                  <small class="error">
                    @if (signupForm.get('displayName')?.errors?.['required']) { Name is required. }
                    @if (signupForm.get('displayName')?.errors?.['minlength']) { At least 3 characters. }
                  </small>
                }
              </div>

              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-stone-200">Email</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="you@example.com"
                  class="field"
                  [class.invalid]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
                />
                @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
                  <small class="error">
                    @if (signupForm.get('email')?.errors?.['required']) { Email is required. }
                    @if (signupForm.get('email')?.errors?.['email']) { Email is not valid. }
                  </small>
                }
              </div>

              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-stone-200">Password</label>
                <input
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="At least 8 characters"
                  class="field"
                  [class.invalid]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
                />
                @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
                  <small class="error">
                    @if (signupForm.get('password')?.errors?.['required']) { Password is required. }
                    @if (signupForm.get('password')?.errors?.['minlength']) { At least 8 characters. }
                  </small>
                }
              </div>

              <div>
                <label for="confirmPassword" class="mb-2 block text-sm font-medium text-stone-200">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  formControlName="confirmPassword"
                  placeholder="Repeat your password"
                  class="field"
                  [class.invalid]="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched"
                />
                @if (signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched) {
                  <small class="error">
                    @if (signupForm.get('confirmPassword')?.errors?.['required']) { Confirm password is required. }
                  </small>
                }
                @if (signupForm.get('confirmPassword')?.touched && signupForm.get('confirmPassword')?.value && signupForm.get('password')?.value !== signupForm.get('confirmPassword')?.value) {
                  <small class="error">Passwords do not match.</small>
                }
              </div>
            </div>

            <p class="mt-10 border-b border-stone-800 pb-2 text-xs font-bold tracking-wider text-stone-500">PREFERENCES</p>

            <div class="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label for="genre" class="mb-2 block text-sm font-medium text-stone-200">Favorite genre</label>
                <select
                  id="genre"
                  formControlName="genre"
                  class="field p-4"
                  [class.invalid]="signupForm.get('genre')?.invalid && signupForm.get('genre')?.touched"
                >
                  <option value="" disabled>Choose a genre</option>
                  <option>Drama</option>
                  <option>Comedy</option>
                  <option>Science fiction</option>
                  <option>Documentary</option>
                  <option>Thriller</option>
                </select>
                @if (signupForm.get('genre')?.invalid && signupForm.get('genre')?.touched) {
                  <small class="error">
                    @if (signupForm.get('genre')?.errors?.['required']) { Genre is required. }
                  </small>
                }
              </div>

              <div>
                <label for="country" class="mb-2 block text-sm font-medium text-stone-200">Country</label>
                <select
                  id="country"
                  formControlName="country"
                  class="field"
                  [class.invalid]="signupForm.get('country')?.invalid && signupForm.get('country')?.touched"
                >
                  <option value="" disabled>Select your country</option>
                  <option>Egypt</option>
                  <option>Germany</option>
                  <option>Japan</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
                @if (signupForm.get('country')?.invalid && signupForm.get('country')?.touched) {
                  <small class="error">
                    @if (signupForm.get('country')?.errors?.['required']) { Country is required. }
                  </small>
                }
              </div>

              <div>
                <label for="age" class="mb-2 block text-sm font-medium text-stone-200">Age</label>
                <input
                  id="age"
                  type="text"
                  inputmode="numeric"
                  RawanDirective
                  formControlName="age"
                  placeholder="18"
                  class="field"
                  [class.invalid]="signupForm.get('age')?.invalid && signupForm.get('age')?.touched"
                />
                @if (signupForm.get('age')?.invalid && signupForm.get('age')?.touched) {
                  <small class="error">
                    @if (signupForm.get('age')?.errors?.['required']) { Age is required. }
                    @if (signupForm.get('age')?.errors?.['min']) { Must be 13 or more. }
                    @if (signupForm.get('age')?.errors?.['max']) { Must be 120 or less. }
                  </small>
                }
              </div>

              <div>
                <label for="phone" class="mb-2 block text-sm font-medium text-stone-200">Phone</label>
                <input
                  id="phone"
                  appNumbersOnly
                  type="tel"
                  appNumberOnly
                  formControlName="phone"
                  placeholder="01012345678"
                  class="field"
                  [class.invalid]="signupForm.get('phone')?.invalid && signupForm.get('phone')?.touched"
                />
                @if (signupForm.get('phone')?.invalid && signupForm.get('phone')?.touched) {
                  <small class="error">
                    @if (signupForm.get('phone')?.errors?.['required']) { Phone is required. }
                    @if (signupForm.get('phone')?.errors?.['pattern']) { Use 10 to 15 numbers. }
                  </small>
                }
              </div>
            </div>

            <div class="mt-6">
              <label for="bio" class="mb-2 block text-sm font-medium text-stone-200">Short bio</label>
              <textarea
                id="bio"
                rows="3"
                formControlName="bio"
                placeholder="What do you love watching on a rainy night?"
                class="field"
                [class.invalid]="signupForm.get('bio')?.invalid && signupForm.get('bio')?.touched"
              ></textarea>
              @if (signupForm.get('bio')?.invalid && signupForm.get('bio')?.touched) {
                <small class="error">
                  @if (signupForm.get('bio')?.errors?.['required']) { Bio is required. }
                  @if (signupForm.get('bio')?.errors?.['minlength']) { At least 10 characters. }
                  @if (signupForm.get('bio')?.errors?.['maxlength']) { Max 160 characters. }
                </small>
              }
            </div>

            <label class="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-stone-700 bg-stone-800/60 p-4 text-sm">
              <input formControlName="terms" type="checkbox" class="mt-0.5 h-5 w-5" />
              <span class="text-stone-300">I accept the watchlist rules and community guidelines.</span>
            </label>
            @if (signupForm.get('terms')?.invalid && signupForm.get('terms')?.touched) {
              <small class="error">
                @if (signupForm.get('terms')?.errors?.['required']) { You must accept the terms. }
              </small>
            }

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="submit" class="w-full rounded-xl bg-gold-500 px-4 py-3.5 font-semibold text-white hover:bg-gold-400 sm:flex-1">
                Create profile
              </button>
              <button type="button" (click)="reset()" class="w-full rounded-xl border border-stone-700 px-4 py-3.5 font-semibold text-stone-300 sm:w-auto">
                Reset
              </button>
            </div>

            @if (success) {
              <p class="mt-5 text-sm font-medium text-emerald-300">Profile created successfully.</p>
            }
          </form>
        </div>





        <!-- Template-driven form -->
        <div class="min-w-0 flex-1">
          <form
            #contactForm="ngForm"
            (ngSubmit)="submitContact(contactForm)"
            class="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
          >
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300">TEMPLATE-DRIVEN FORM</span>
            </div>
            <h2 class="mt-3 text-2xl font-bold text-white">Contact us</h2>
            <p class="mt-1 text-sm text-stone-400">Template-driven forms use directives like <code>ngModel</code> in the HTML.</p>

            <div class="mt-6">
              <label for="contactName" class="mb-2 block text-sm font-medium text-stone-200">Name</label>
              <input
                id="contactName"
                name="name"
                [(ngModel)]="contact.name"
                required
                minlength="2"
                #name="ngModel"
                class="field"
                [class.invalid]="name.invalid && name.touched"
              />
              @if (name.invalid && name.touched) {
                <small class="error">
                  @if (name.errors?.['required']) { Name is required. }
                  @if (name.errors?.['minlength']) { At least 2 characters. }
                </small>
              }
            </div>

            <div class="mt-6">
              <label for="contactEmail" class="mb-2 block text-sm font-medium text-stone-200">Email</label>
              <input
                id="contactEmail"
                name="email"
                type="email"
                [(ngModel)]="contact.email"
                required
                email
                #email="ngModel"
                class="field"
                [class.invalid]="email.invalid && email.touched"
              />
              @if (email.invalid && email.touched) {
                <small class="error">
                  @if (email.errors?.['required']) { Email is required. }
                  @if (email.errors?.['email']) { Email is not valid. }
                </small>
              }
            </div>

            <div class="mt-6">
              <label for="contactMessage" class="mb-2 block text-sm font-medium text-stone-200">Message</label>
              <textarea
                id="contactMessage"
                name="message"
                rows="3"
                [(ngModel)]="contact.message"
                required
                minlength="10"
                #message="ngModel"
                class="field"
                [class.invalid]="message.invalid && message.touched"
              ></textarea>
              @if (message.invalid && message.touched) {
                <small class="error">
                  @if (message.errors?.['required']) { Message is required. }
                  @if (message.errors?.['minlength']) { At least 10 characters. }
                </small>
              }
            </div>

            <button type="submit" class="mt-8 w-full rounded-xl bg-emerald-500 px-4 py-3.5 font-semibold text-white hover:bg-emerald-400 sm:w-auto">
              Send message
            </button>

            @if (contactSuccess) {
              <p class="mt-5 text-sm font-medium text-emerald-300">Message sent!</p>
            }
          </form>
        </div>
      </div>
    </section>
  `,
})
export class FormsComponent {
  success = false;
  contactSuccess = false;

  contact = { name: '', email: '', message: '' };

  signupForm = new FormGroup({
    displayName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null, [Validators.required, Validators.min(13), Validators.max(120)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]),
    bio: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(160)]),
    terms: new FormControl(false, Validators.requiredTrue),
  });

  submit(): void {
    this.signupForm.markAllAsTouched();
    const passwordsMatch = this.signupForm.value.password === this.signupForm.value.confirmPassword;
    this.success = this.signupForm.valid && passwordsMatch;
  }

  reset(): void {
    this.signupForm.reset();
    this.success = false;
  }

  submitContact(form: NgForm): void {
    form.form.markAllAsTouched();
    this.contactSuccess = !!form.valid;
  }
}
