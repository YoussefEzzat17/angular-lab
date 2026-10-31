import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

const INPUT =
  'mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:border-gold-400 focus:outline-none';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    FormField,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'signal-forms'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Signal Forms" illustration="signal-forms">
            Signal Forms are the newest way to build forms in Angular. You keep your data in a <strong class="text-stone-200">signal</strong>, wrap it with
            <code class="text-gold-300">form()</code>, and bind each field to an input. They became stable in Angular 22.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Forms mean keeping three things in step">
            <p class="mt-2 text-sm text-stone-400">
              A form has the data the user typed, the rules that data must follow, and the state of each field (touched, valid, changed). Older approaches keep these in separate objects
              that you wire together. Signal Forms keep them all in one tree built straight from your data, and everything is a signal, so the page updates by itself.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Your data, wearing a form coat">
            <p class="mt-2 text-sm text-stone-400">
              You already have an object with a name and an email. <code class="text-gold-300">form()</code> wraps it, adding the checks and the field state. The object stays the single source of truth:
              type in an input and your object changes, change your object and the input follows.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="3 · SEE IT" heading="One field, two views of the same value">
            <app-code-output class="mt-4 block" [code]="whyCode" caption="Type in the box. The model and the field's own value are the same thing.">
              <label class="block text-xs text-stone-400">Name
                <input type="text" [formField]="whyForm.name" class="${INPUT}" />
              </label>
              <p class="mt-3 text-sm text-stone-400">whyModel().name = <strong class="text-gold-300">{{ whyModel().name || '—' }}</strong></p>
              <p class="text-sm text-stone-400">whyForm.name().value() = <strong class="text-gold-300">{{ whyForm.name().value() || '—' }}</strong></p>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="4 · COMPARE" heading="Three ways to build a form">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Kind</th><th class="px-4 py-2 font-semibold">Data lives in</th><th class="px-4 py-2 font-semibold">Good for</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of compareRows; track row.kind) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 text-stone-200">{{ row.kind }}</td>
                      <td class="px-4 py-2">{{ row.data }}</td>
                      <td class="px-4 py-2">{{ row.good }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              Reactive and template-driven forms are not going away. Signal Forms are the best choice for new apps built on signals.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Where is the truth?">
            <app-predict-output [challenge]="truthChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Model ── -->
      <ng-template appLessonSection="model">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE STEPS" heading="Model, form, binding">
            <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-300">
              <li>Make a <strong class="text-stone-100">signal</strong> that holds the shape of your data.</li>
              <li>Call <code class="text-gold-300">form(model)</code>. You get a field for every property.</li>
              <li>Import <code class="text-gold-300">FormField</code> and bind each input with <code class="text-gold-300">[formField]</code>.</li>
            </ol>
            <pre class="mt-4" [appCode]="modelSteps"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Change the model from code">
            <p class="mt-2 text-sm text-stone-400">The buttons write into the form's fields. The inputs follow, because the model is the one source of truth.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button type="button" (click)="fillProfile()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Fill the form</button>
              <button type="button" (click)="clearProfile()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Clear it</button>
            </div>
            <app-code-output class="mt-4 block" [code]="profileCode" caption="Fields can be nested, text or checkbox. The model shows every change straight away.">
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="block text-xs text-stone-400">First name
                  <input type="text" [formField]="profileForm.first" class="${INPUT}" />
                </label>
                <label class="block text-xs text-stone-400">City
                  <input type="text" [formField]="profileForm.address.city" class="${INPUT}" />
                </label>
              </div>
              <label class="mt-3 flex items-center gap-2 text-sm text-stone-200">
                <input type="checkbox" [formField]="profileForm.newsletter" class="h-4 w-4 accent-[rgb(var(--gold-400))]" />
                Send me the newsletter
              </label>
              <div class="mt-3 overflow-x-auto whitespace-pre rounded-lg bg-stone-950 p-3 font-mono text-xs text-gold-200" role="group" aria-label="The model" data-testid="model-json">{{ profileJson() }}</div>
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Forgetting to import FormField" [wrong]="mistakeImportWrong" [right]="mistakeImportRight">
            The template attribute <code class="text-gold-300">[formField]</code> only works when the <code class="text-gold-300">FormField</code> directive is in the component's <code class="text-gold-300">imports</code>.
            Without it Angular reports that it cannot bind to <code class="text-gold-300">formField</code>.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapModel" />
        </section>
      </ng-template>

      <!-- ── Validation ── -->
      <ng-template appLessonSection="validation">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE RULES" heading="Declare every rule in one place">
            <p class="mt-2 text-sm text-stone-400">
              The second argument to <code class="text-gold-300">form()</code> is a function. It receives the <em>paths</em> of your fields, and you attach rules to them.
              Every rule takes an optional message.
            </p>
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Rule</th><th class="px-4 py-2 font-semibold">Means</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of ruleRows; track row.rule) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.rule }}</td>
                      <td class="px-4 py-2">{{ row.means }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Break the rules and read the errors">
            <app-code-output class="mt-4 block" [code]="validationCode" caption="Each rule adds an error while it is broken. Fix the value and the error disappears.">
              <label class="block text-xs text-stone-400">Email
                <input type="text" [formField]="ruleForm.email" class="${INPUT}" />
              </label>
              <ul class="mt-2 space-y-1 text-sm" aria-live="polite">
                @for (error of ruleForm.email().errors(); track error.kind) {
                  <li class="text-rose-300">✕ {{ error.message }}</li>
                } @empty {
                  <li class="text-emerald-300">✓ Looks good</li>
                }
              </ul>
              <label class="mt-3 block text-xs text-stone-400">Password
                <input type="password" [formField]="ruleForm.password" class="${INPUT}" />
              </label>
              <ul class="mt-2 space-y-1 text-sm" aria-live="polite">
                @for (error of ruleForm.password().errors(); track error.kind) {
                  <li class="text-rose-300">✕ {{ error.message }}</li>
                } @empty {
                  <li class="text-emerald-300">✓ Looks good</li>
                }
              </ul>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="YOUR OWN RULE" heading="validate() for anything else">
            <p class="mt-2 text-sm text-stone-400">
              When no ready-made rule fits, <code class="text-gold-300">validate()</code> takes a function. Return an error object when the value is wrong, or nothing when it is fine.
            </p>
            <pre class="mt-3" [appCode]="customRuleCode"></pre>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapValidation" />
        </section>
      </ng-template>

      <!-- ── Submit ── -->
      <ng-template appLessonSection="submit">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="FIELD STATE" heading="Every field tells you how it is doing">
            <ul class="mt-3 grid gap-2 text-sm text-stone-300 sm:grid-cols-2">
              <li><code class="text-gold-300">touched()</code> the user has been in the field and left it</li>
              <li><code class="text-gold-300">dirty()</code> the user changed the value</li>
              <li><code class="text-gold-300">valid()</code> and <code class="text-gold-300">invalid()</code> whether the rules pass</li>
              <li><code class="text-gold-300">errors()</code> the list of broken rules, with messages</li>
              <li><code class="text-gold-300">submitting()</code> whether a submit is in progress</li>
              <li><code class="text-gold-300">disabled()</code> and <code class="text-gold-300">required()</code> what the rules say about the field</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Show errors after the user leaves the field">
            <p class="mt-2 text-sm text-stone-400">
              Leave the box empty, click into it, then click away. The state changes live. Showing errors only when <code class="text-gold-300">touched()</code> is true
              keeps a fresh form from shouting at the user.
            </p>
            <app-code-output class="mt-4 block" [code]="stateCode" caption="touched() turns true after the first blur, so the message waits until then.">
              <label class="block text-xs text-stone-400">Email
                <input type="text" [formField]="stateForm.email" class="${INPUT}" />
              </label>
              <p class="mt-2 text-sm text-rose-300" aria-live="polite">
                @if (stateForm.email().touched() && stateForm.email().invalid()) {
                  {{ stateForm.email().errors()[0]?.message }}
                }
              </p>
              <p class="mt-2 font-mono text-xs text-stone-400">
                touched: {{ stateForm.email().touched() }} · dirty: {{ stateForm.email().dirty() }} · valid: {{ stateForm.email().valid() }}
              </p>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="SENDING IT" heading="submit() checks first, then runs your action">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">submit(form, action)</code> runs your async action only when the form is valid, and keeps <code class="text-gold-300">submitting()</code> true while it works.
              Return nothing for success, or errors to show on the fields.
            </p>
            <pre class="mt-3" [appCode]="submitCode"></pre>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Reading the value before the user is done" [wrong]="mistakeSubmitWrong" [right]="mistakeSubmitRight">
            Do not send data by hand-checking fields. <code class="text-gold-300">submit()</code> already refuses to run when a rule is broken, so your action only ever sees valid data.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapSubmit" />
        </section>
      </ng-template>

      <!-- ── Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="A sign-up form">
            <p class="mt-2 text-sm text-stone-400">Press Create account with the form empty, then fix each field. The pretend server takes a moment to answer.</p>
            <form class="mt-4 space-y-4" (submit)="onSignUp($event)" novalidate>
              <div>
                <label class="block text-xs text-stone-400" for="su-email">Email</label>
                <input id="su-email" type="text" autocomplete="email" [formField]="signUp.email" class="${INPUT}" />
                @if (signUp.email().touched()) {
                  @for (error of signUp.email().errors(); track error.kind) {
                    <p class="mt-1 text-sm text-rose-300">{{ error.message }}</p>
                  }
                }
              </div>
              <div>
                <label class="block text-xs text-stone-400" for="su-password">Password</label>
                <input id="su-password" type="password" autocomplete="new-password" [formField]="signUp.password" class="${INPUT}" />
                @if (signUp.password().touched()) {
                  @for (error of signUp.password().errors(); track error.kind) {
                    <p class="mt-1 text-sm text-rose-300">{{ error.message }}</p>
                  }
                }
              </div>
              <div>
                <label class="flex items-center gap-2 text-sm text-stone-200">
                  <input type="checkbox" [formField]="signUp.terms" class="h-4 w-4 accent-[rgb(var(--gold-400))]" />
                  I accept the terms
                </label>
                @if (signUp.terms().touched()) {
                  @for (error of signUp.terms().errors(); track error.kind) {
                    <p class="mt-1 text-sm text-rose-300">{{ error.message }}</p>
                  }
                }
              </div>
              <button type="submit" [disabled]="signUp().submitting()" class="min-h-11 rounded-xl bg-gold-solid px-5 text-sm font-semibold text-white hover:bg-gold-solid-hover disabled:cursor-not-allowed disabled:opacity-50">
                {{ signUp().submitting() ? 'Creating…' : 'Create account' }}
              </button>
              <p class="text-sm" aria-live="polite" [class]="done() ? 'text-emerald-300' : 'text-stone-400'">
                {{ done() ? 'Account created for ' + signUp.email().value() + '.' : 'Nothing sent yet.' }}
              </p>
            </form>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTry" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class SignalFormsComponent {
  readonly section = input<string>();

  // ── why ──
  protected readonly whyModel = signal({ name: 'Ada' });
  protected readonly whyForm = form(this.whyModel);

  // ── model ──
  protected readonly profile = signal({ first: 'Grace', address: { city: 'Cairo' }, newsletter: false });
  protected readonly profileForm = form(this.profile);
  protected readonly profileJson = () => JSON.stringify(this.profile(), null, 2);

  protected fillProfile(): void {
    this.profile.set({ first: 'Ada', address: { city: 'London' }, newsletter: true });
  }

  protected clearProfile(): void {
    this.profile.set({ first: '', address: { city: '' }, newsletter: false });
  }

  // ── validation ──
  protected readonly ruleModel = signal({ email: '', password: '' });
  protected readonly ruleForm = form(this.ruleModel, (path) => {
    required(path.email, { message: 'Enter your email' });
    email(path.email, { message: 'That does not look like an email address' });
    required(path.password, { message: 'Enter a password' });
    minLength(path.password, 8, { message: 'Use at least 8 characters' });
  });

  // ── state ──
  protected readonly stateModel = signal({ email: '' });
  protected readonly stateForm = form(this.stateModel, (path) => {
    required(path.email, { message: 'Enter your email' });
    email(path.email, { message: 'That does not look like an email address' });
  });

  // ── try it ──
  protected readonly signUpModel = signal({ email: '', password: '', terms: false });
  protected readonly signUp = form(this.signUpModel, (path) => {
    required(path.email, { message: 'Enter your email' });
    email(path.email, { message: 'That does not look like an email address' });
    required(path.password, { message: 'Enter a password' });
    minLength(path.password, 8, { message: 'Use at least 8 characters' });
    validate(path.terms, ({ value }) => (value() ? undefined : { kind: 'terms', message: 'You must accept the terms' }));
  });
  protected readonly done = signal(false);

  protected onSignUp(event: Event): void {
    event.preventDefault();
    this.done.set(false);
    void submit(this.signUp, async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      this.done.set(true);
      return undefined;
    });
  }

  protected readonly compareRows = [
    { kind: 'Template-driven', data: 'Fields in the template, bound with ngModel', good: 'Very small forms' },
    { kind: 'Reactive', data: 'FormGroup and FormControl objects', good: 'Existing apps and complex forms' },
    { kind: 'Signal Forms', data: 'Your own signal, wrapped by form()', good: 'New apps built on signals' },
  ];

  protected readonly ruleRows = [
    { rule: 'required(path)', means: 'The value must not be empty.' },
    { rule: 'email(path)', means: 'The value must look like an email address.' },
    { rule: 'minLength(path, n)', means: 'At least n characters.' },
    { rule: 'maxLength(path, n)', means: 'At most n characters.' },
    { rule: 'min(path, n) / max(path, n)', means: 'A number within a range.' },
    { rule: 'pattern(path, regex)', means: 'The value must match the pattern.' },
    { rule: 'validate(path, fn)', means: 'Your own rule.' },
  ];

  protected readonly truthChallenge: PredictChallenge = {
    question: 'You call form(model) and the user types "Ada" in a bound input. What changes?',
    options: [
      { id: 'a', text: 'Only the field, not the model' },
      { id: 'b', text: 'The field and the model, because the model is the source of truth' },
      { id: 'c', text: 'Nothing until you press submit' },
      { id: 'd', text: 'Only the input element' },
    ],
    correct: 'b',
    explanation: 'form() does not keep its own copy. Typing writes into your model signal, and the field state is just a view of it.',
  };

  protected readonly whyCode = `model = signal({ name: 'Ada' });
form = form(this.model);

<input [formField]="form.name" />
<p>{{ model().name }}</p>
<p>{{ form.name().value() }}</p>`;

  protected readonly modelSteps = `import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: '<input [formField]="profileForm.first" />',
})
export class Profile {
  profile = signal({ first: '', address: { city: '' }, newsletter: false });
  profileForm = form(this.profile);
}`;

  protected readonly profileCode = `profile = signal({ first: 'Grace', address: { city: 'Cairo' }, newsletter: false });
profileForm = form(this.profile);

<input [formField]="profileForm.first" />
<input [formField]="profileForm.address.city" />
<input type="checkbox" [formField]="profileForm.newsletter" />`;

  protected readonly mistakeImportWrong = `@Component({
  template: '<input [formField]="f.name" />',
})`;
  protected readonly mistakeImportRight = `@Component({
  imports: [FormField],
  template: '<input [formField]="f.name" />',
})`;

  protected readonly validationCode = `ruleForm = form(this.ruleModel, (path) => {
  required(path.email, { message: 'Enter your email' });
  email(path.email, { message: 'That does not look like an email address' });
  required(path.password, { message: 'Enter a password' });
  minLength(path.password, 8, { message: 'Use at least 8 characters' });
});

@for (error of ruleForm.email().errors(); track error.kind) {
  <li>{{ error.message }}</li>
}`;

  protected readonly customRuleCode = `validate(path.terms, ({ value }) =>
  value() ? undefined : { kind: 'terms', message: 'You must accept the terms' });`;

  protected readonly stateCode = `@if (form.email().touched() && form.email().invalid()) {
  <p>{{ form.email().errors()[0]?.message }}</p>
}`;

  protected readonly submitCode = `onSubmit(event: Event) {
  event.preventDefault();
  submit(this.signUp, async () => {
    await this.api.createAccount(this.signUpModel());
    return undefined;            // nothing to report, so it worked
  });
}`;

  protected readonly mistakeSubmitWrong = `onSubmit() {
  if (this.signUp.email().value() && this.signUp.password().value()) {
    this.api.createAccount(this.signUpModel());   // checks only some rules
  }
}`;
  protected readonly mistakeSubmitRight = `onSubmit() {
  submit(this.signUp, async () => {
    await this.api.createAccount(this.signUpModel());
    return undefined;
  });
}`;

  protected readonly recapWhy = [
    'Signal Forms keep your data in a signal and wrap it with form().',
    'The model is the single source of truth for values.',
    'Reactive and template-driven forms still work; Signal Forms suit new apps.',
  ];
  protected readonly recapModel = [
    'Make a signal, call form(model), bind each input with [formField].',
    'Nested objects become nested fields.',
    'Import FormField, or the binding will not work.',
  ];
  protected readonly recapValidation = [
    'Rules go in a function passed to form(): required, email, minLength and more.',
    'Each rule can carry a message for the user.',
    'validate() writes any rule of your own.',
  ];
  protected readonly recapSubmit = [
    'Field state is signals: touched, dirty, valid, errors, submitting.',
    'Show errors after touched() so a fresh form is not noisy.',
    'submit(form, action) runs your action only when the form is valid.',
  ];
  protected readonly recapTry = [
    'One model, one list of rules, one submit.',
    'The page follows the state automatically, so there is no manual update code.',
    'Next stop: RxJS.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Where do the values of a Signal Form live?', answer: 'In the signal you pass to form(). Typing writes into it, and changing it updates the inputs.' },
    { question: 'How do you attach a rule such as required?', answer: 'In a function passed as the second argument to form(), for example required(path.email, { message: "Enter your email" }).' },
    { question: 'Why use submit() and not just read the values?', answer: 'submit() runs your action only when the form is valid and tracks submitting(), so you never send data that breaks a rule.' },
  ];
}
