import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';

import { NumbersOnlyDirective } from '../../directives/number-only.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { ControlStateDemoComponent } from './control-state-demo.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { RecapComponent } from '../../shared/recap.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, JsonPipe, RouterLink, ControlStateDemoComponent, OrderStepsComponent, PredictOutputComponent, ReactiveFormsModule, FormsModule, NumbersOnlyDirective, FlowDiagramComponent, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective, CodeBlockDirective],
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
    <app-lesson-player [topicId]="'forms'" [section]="section()">
      <ng-template appLessonSection="template-driven">
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Angular Forms" illustration="forms">
        Angular gives you two ways to build a form, and the difference is <strong class="text-stone-200">where the source of truth lives</strong>.
        Reactive forms define every field and validator in TypeScript first, then the template just binds to it — best for complex,
        dynamic, or heavily-tested forms. Template-driven forms let the HTML and <code class="text-gold-300">ngModel</code> drive
        everything, and Angular builds the model for you behind the scenes — best for a short, simple form like a contact box.
      </app-page-header>

      <app-lesson-card class="mt-8" variant="danger" label="THE PROBLEM" heading="A form is more than inputs">
        <p class="mt-2 text-sm text-stone-400">
          Behind every form there is state to keep track of: what was typed, which fields are valid, which ones the user already visited, and whether
          the whole thing can be submitted. Doing that by hand with a dozen <code class="text-gold-300">(input)</code> handlers gets messy fast.
          Angular's forms give every field a control object that tracks all of it for you.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" tone="amber" label="MENTAL MODEL" heading="A paper form and a clerk">
        <p class="mt-2 text-sm text-stone-400">
          Think of a paper form handled by a clerk. In a <strong class="text-stone-200">template-driven</strong> form the sheet itself carries the rules
          ("required", "email") and the clerk builds a record from it. In a <strong class="text-stone-200">reactive</strong> form the clerk already
          holds the full record and the rules in a binder (your TypeScript), and the sheet is just a view of it.
        </p>
      </app-lesson-card>

      <div class="mt-8 flex flex-col gap-8 lg:flex-row">
        <!-- Template-driven form -->
        <div class="min-w-0 flex-1">
          <form
            #contactForm="ngForm"
            (ngSubmit)="submitContact(contactForm)"
            class="rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-card sm:p-8"
          >
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300">TEMPLATE-DRIVEN FORM</span>
            </div>
            <h2 class="mt-3 text-2xl font-bold text-stone-100">Contact us</h2>
            <p class="mt-1 text-sm text-stone-400">Template-driven forms use directives like <code>ngModel</code> in the HTML.</p>
            <app-flow-diagram class="mt-4 block" from="[(ngModel)] (HTML)" to="NgForm model" direction="right" />
            <p class="mt-2 text-xs text-stone-500">The model is built for you here, from the template — Angular infers it from ngModel and #ngForm.</p>

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
      <app-recap class="mt-5" [items]="recapTemplate" />
      </section>
      </ng-template>

      <ng-template appLessonSection="reactive">
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-10 flex flex-col gap-8 lg:flex-row">
        <!-- Reactive form -->
        <div class="min-w-0 flex-1">
          <form
            [formGroup]="signupForm"
            (ngSubmit)="submit()"
            class="rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-card sm:p-8"
          >
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-300">REACTIVE FORM</span>
            </div>
            <h2 class="mt-3 text-2xl font-bold text-stone-100">Create a watch profile</h2>
            <p class="mt-1 text-sm text-stone-400">Tell us a bit about yourself to get personalized picks.</p>
            <app-flow-diagram class="mt-4 block" from="FormGroup (TS)" to="formControlName" direction="right" />
            <p class="mt-2 text-xs text-stone-500">The model is defined here, in the class — the template only reflects it.</p>

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
                  appNumbersOnly
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
              <button type="submit" class="w-full rounded-xl bg-gold-solid px-4 py-3.5 font-semibold text-white hover:bg-gold-solid-hover sm:flex-1">
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
      </div>
      <div class="mt-8">
        <app-lesson-card variant="highlight" label="DYNAMIC LISTS" heading="FormArray: a list the user can grow">
          <p class="mt-2 text-sm text-stone-400">
            When you do not know how many fields there will be, use a <code class="text-gold-300">FormArray</code>. It holds a list of controls that you add to and remove from in code.
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" (click)="addGenre()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add a genre</button>
          </div>
          <app-code-output class="mt-4 block" [code]="formArrayCode" caption="Each control is one row. The array's value is always a plain list.">
            <div class="space-y-2">
              @for (control of genres.controls; track control; let i = $index) {
                <div class="flex items-center gap-2">
                  <label class="sr-only" [for]="'genre-' + i">Genre {{ i + 1 }}</label>
                  <input [id]="'genre-' + i" [formControl]="control" class="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:border-gold-400 focus:outline-none" />
                  <button type="button" (click)="removeGenre(i)" [attr.aria-label]="'Remove genre ' + (i + 1)" class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-stone-600 text-stone-200 hover:bg-stone-800">✕</button>
                </div>
              }
              <div class="overflow-x-auto whitespace-pre rounded-lg bg-stone-950 p-3 font-mono text-xs text-gold-200" data-testid="genres-json">{{ genres.value | json }}</div>
            </div>
          </app-code-output>
        </app-lesson-card>
      </div>

      <app-recap class="mt-5" [items]="recapReactive" />
      </section>
      </ng-template>

      <ng-template appLessonSection="validation">
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="VALIDATION" heading="Rules first, messages second">
        <p class="mt-2 text-sm text-stone-400">
          Validators are plain functions attached to a control. Built-in ones include <code class="text-gold-300">Validators.required</code>,
          <code class="text-gold-300">Validators.email</code> and <code class="text-gold-300">Validators.minLength(n)</code>. Each failing rule adds a key to
          the control's <code class="text-gold-300">errors</code> object, and the template reads that key to show a message.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">email = new FormControl('', [Validators.required, Validators.email]);

&lt;!-- template --&gt;
&#64;if (email.touched &amp;&amp; email.hasError('email')) &#123;
  &lt;p&gt;Enter a valid email.&lt;/p&gt;
&#125;</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Watch the control state change" headingSize="lg">
        <p class="mt-2 text-sm text-stone-400">
          This is one real <code class="text-gold-300">FormControl</code>. Click in and out of the field without typing, then type a wrong email,
          then a good one. Notice that the message waits until the field is touched or dirty.
        </p>
        <app-control-state-demo />
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="CUSTOM VALIDATOR" heading="A validator is just a function">
        <p class="mt-2 text-sm text-stone-400">
          When the built-in rules are not enough, write a function that takes the control and returns <code class="text-gold-300">null</code> if it is fine,
          or an object whose key names the problem. The demo above uses exactly this for "no spaces".
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ validatorCode }}</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Touched or dirty?">
        <app-predict-output [challenge]="touchedChallenge" />
      </app-lesson-card>

      <app-common-mistake class="mt-5" title="Showing errors before the user has typed" [wrong]="mistakeEarlyWrong" [right]="mistakeEarlyRight">
        A fresh form is always empty, so every required field is "invalid" at the start. Wait for <code class="text-gold-300">touched</code> or <code class="text-gold-300">dirty</code> before showing a message.
      </app-common-mistake>

      <app-lesson-card class="mt-5" variant="danger" label="TWO MORE" heading="Other validation mistakes to avoid">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">No name on an ngModel inside a form.</strong> Angular needs <code class="text-gold-300">name="email"</code> on every <code class="text-gold-300">ngModel</code> inside a form so it can register the control.</li>
          <li><strong class="text-stone-100">Trusting client-side validation alone.</strong> Anyone can bypass the browser, so the server must validate again.</li>
        </ul>
      </app-lesson-card>

      <app-recap class="mt-5" [items]="recapValidation" />
      </section>
      </ng-template>

      <ng-template appLessonSection="comparison">
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="COMPARISON" heading="Template-driven or reactive?">
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-800 text-stone-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Question</th>
                <th class="px-4 py-2 font-semibold">Template-driven</th>
                <th class="px-4 py-2 font-semibold">Reactive</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-400">
              <tr><td class="px-4 py-2">Where does the form model live?</td><td class="px-4 py-2">In the template (ngModel)</td><td class="px-4 py-2">In the class (FormGroup)</td></tr>
              <tr><td class="px-4 py-2">How do you test it?</td><td class="px-4 py-2">Needs the template and a fixture</td><td class="px-4 py-2">Unit-test the class directly</td></tr>
              <tr><td class="px-4 py-2">How is validation written?</td><td class="px-4 py-2">Directives such as required and email</td><td class="px-4 py-2">Validator functions passed to the control</td></tr>
              <tr><td class="px-4 py-2">Best for</td><td class="px-4 py-2">Small, simple forms</td><td class="px-4 py-2">Complex, dynamic or large forms</td></tr>
            </tbody>
          </table>
        </div>
      </app-lesson-card>
      <app-lesson-card class="mt-5" variant="highlight" label="THE NEW OPTION" heading="Signal Forms are a third choice">
        <p class="mt-2 text-sm text-stone-400">
          Angular 22 added <strong class="text-stone-200">Signal Forms</strong>, which keep your data in a signal and add the rules in one place. Reactive and template-driven forms are not going away.
          Learn this lesson first, then see the new approach in <a routerLink="/learn/signal-forms" class="font-semibold text-gold-300 underline-offset-4 hover:underline">Signal Forms</a>.
        </p>
      </app-lesson-card>

      <app-recap class="mt-5" [items]="recapCompare" />
      </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Break the forms on purpose">
        <p class="mt-2 text-sm text-stone-400">
          Submit both forms above with empty or invalid fields and watch which errors appear. Then add one new field to the reactive form,
          give it a validator, and show its error message.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What happens when the user submits">
        <p class="mt-2 text-sm text-stone-400">Put the steps of a safe submit in order.</p>
        <app-order-steps
          [steps]="submitSteps"
          explanation="Marking everything touched first makes every hidden error appear, so the user sees what is wrong. Only a valid form is sent, and the server validates once more because the browser cannot be trusted."
        />
      </app-lesson-card>

      <app-recap class="mt-5" [items]="recapTry" />
      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class FormsComponent {
  readonly section = input<string>();

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'In Template-Driven forms, what does #nameField="ngModel" give you access to?',
      answer: 'The control\'s validation state (valid, invalid, touched, dirty) directly in the template, without touching the component class.',
    },
    {
      question: 'Why check control.invalid && control.touched instead of just control.invalid?',
      answer: "So the error doesn't show the instant the form loads — only after the user has actually interacted with that field.",
    },
    {
      question: "What's the main reason to choose Reactive forms over Template-Driven for a complex form?",
      answer: 'The whole form is a plain object in the TypeScript class, which makes it much easier to unit test and to change validation rules dynamically.',
    },
  ];

  genres = new FormArray([new FormControl('Drama', { nonNullable: true })]);

  addGenre(): void {
    this.genres.push(new FormControl('', { nonNullable: true }));
  }

  removeGenre(index: number): void {
    this.genres.removeAt(index);
  }

  readonly formArrayCode = `genres = new FormArray([new FormControl('Drama')]);

addGenre() { this.genres.push(new FormControl('')); }
removeGenre(i: number) { this.genres.removeAt(i); }

@for (control of genres.controls; track control) {
  <input [formControl]="control" />
}`;

  readonly mistakeEarlyWrong = `@if (email.invalid) {
  <small>Enter a valid email.</small>      <!-- shows on a fresh form -->
}`;
  readonly mistakeEarlyRight = `@if (email.invalid && (email.touched || email.dirty)) {
  <small>Enter a valid email.</small>
}`;

  readonly recapTemplate = [
    'Template-driven forms keep the model in the template with ngModel.',
    'Every ngModel inside a form needs a name attribute.',
    'Good for small, simple forms.',
  ];
  readonly recapReactive = [
    'Reactive forms build the model in the class with FormGroup and FormControl.',
    'The template only reflects the model with formGroup and formControlName.',
    'FormArray holds a list you add to and remove from in code.',
  ];
  readonly recapValidation = [
    'A validator is a function; a control is valid when none of them return an error.',
    'Show messages only after touched or dirty.',
    'Always validate again on the server.',
  ];
  readonly recapCompare = [
    'Template-driven: simple. Reactive: testable and flexible.',
    'Signal Forms are the newest option, built on signals.',
    'All three still work in Angular 22.',
  ];
  readonly recapTry = [
    'markAllAsTouched() makes every hidden error appear on submit.',
    'Only a valid form should send data.',
    'Next stop: routing, moving between pages.',
  ];

  readonly validatorCode = `export const noSpaces: ValidatorFn = (control) =>
  /\\s/.test(control.value ?? '') ? { noSpaces: true } : null;

email = new FormControl('', [Validators.required, Validators.email, noSpaces]);`;

  readonly touchedChallenge: PredictChallenge = {
    question: 'A user clicks into an empty required field and then clicks away without typing anything. Which flags are true now?',
    options: [
      { id: 'touched', text: 'touched is true, dirty is false' },
      { id: 'dirty', text: 'dirty is true, touched is false' },
      { id: 'both', text: 'both are true' },
      { id: 'none', text: 'both are false' },
    ],
    correct: 'touched',
    explanation: 'touched means the user visited the field (it lost focus). dirty means the value was changed by the user. Leaving without typing changes nothing, so only touched is true. That is why error messages usually check touched or dirty.',
  };

  readonly submitSteps = [
    'The user presses Submit',
    'markAllAsTouched() makes every hidden error visible',
    'The code checks form.valid',
    'If valid, the value is sent to the server, which validates again',
  ];

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
