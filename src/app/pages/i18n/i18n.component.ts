import { CurrencyPipe, DatePipe, DecimalPipe, NgPlural, NgPluralCase, PercentPipe, registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeJa from '@angular/common/locales/ja';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

// Angular only knows American English until you register the data of another locale.
registerLocaleData(localeDe);
registerLocaleData(localeFr);
registerLocaleData(localeAr);
registerLocaleData(localeJa);

interface LocaleChoice {
  id: string;
  label: string;
  currency: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    NgPlural,
    NgPluralCase,
    OrderStepsComponent,
    PageHeaderComponent,
    PercentPipe,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'i18n'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Internationalization" illustration="i18n">
            <strong class="text-stone-200">Internationalization</strong> (often written i18n, because there are 18 letters between the i and the n) means building an app so it can speak to readers in many languages and styles.
            <strong class="text-stone-200">Localization</strong> is doing the work for one place: the translation, the date style, the direction of the text.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="1,234.50 is not written the same everywhere">
            <p class="mt-2 text-sm text-stone-400">
              Germany writes <code class="text-gold-300">1.234,50</code>, France writes <code class="text-gold-300">1&nbsp;234,50</code>. The date <code class="text-gold-300">03/04/2026</code>
              is March 4 in the United States and April 3 in most of the world. Some languages read right to left. If your app ignores this, readers misread prices and dates.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A locale is a style guide for one place">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">A locale</strong> is a short code such as <code class="text-gold-300">en-US</code>, <code class="text-gold-300">de</code> or <code class="text-gold-300">ar</code>: a language, and sometimes a country.</li>
              <li><strong class="text-stone-100">It decides</strong> number and date style, plural rules, currency symbols and writing direction.</li>
              <li><strong class="text-stone-100">Your values stay the same.</strong> Only how they are shown changes.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Does the stored value change?">
            <app-predict-output [challenge]="valueChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Formats ── -->
      <ng-template appLessonSection="formats">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="One value, four places">
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Locale">
              @for (l of locales; track l.id) {
                <button type="button" [attr.aria-pressed]="locale().id === l.id" (click)="locale.set(l)"
                        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                        [class]="locale().id === l.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ l.label }}</button>
              }
            </div>
            <app-code-output class="mt-4 block" [code]="formatCode" caption="The numbers and the date never change. Only the locale argument does.">
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between gap-3"><dt class="text-stone-400">Price</dt><dd class="font-semibold text-gold-300" data-testid="price">{{ price | currency: locale().currency : 'symbol' : '1.2-2' : locale().id }}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-stone-400">Big number</dt><dd class="font-semibold text-gold-300" data-testid="big">{{ big | number: '1.0-0' : locale().id }}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-stone-400">Share</dt><dd class="font-semibold text-gold-300">{{ share | percent: '1.0-1' : locale().id }}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-stone-400">Date</dt><dd class="font-semibold text-gold-300" data-testid="date">{{ day | date: 'fullDate' : undefined : locale().id }}</dd></div>
              </dl>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="SETUP" heading="Register a locale before you use it">
            <p class="mt-2 text-sm text-stone-400">
              Angular ships only American English. Other locales are separate files so your app stays small. Register each one you use, and pass its code to the pipe.
              To change the default for the whole app, provide <code class="text-gold-300">LOCALE_ID</code>.
            </p>
            <pre class="mt-3" [appCode]="registerCode"></pre>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Forgetting registerLocaleData" [wrong]="mistakeRegisterWrong" [right]="mistakeRegisterRight">
            If a locale is not registered, the pipe throws an error ("Missing locale data") instead of guessing. Register the locale first.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapFormats" />
        </section>
      </ng-template>

      <!-- ── Plurals ── -->
      <ng-template appLessonSection="plurals">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE PROBLEM" heading="'1 messages' looks careless">
            <p class="mt-2 text-sm text-stone-400">
              Words change with the count: "no messages", "1 message", "5 messages". In English there are two forms, but other languages have more: Arabic has six categories
              (zero, one, two, few, many, other). <code class="text-gold-300">ngPlural</code> picks the right text for a number.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Change the count">
            <div class="mt-3 flex items-center gap-3">
              <button type="button" aria-label="One less" (click)="count.update(n => Math.max(0, n - 1))" class="grid h-11 w-11 place-items-center rounded-xl border border-stone-600 text-stone-100 hover:bg-stone-800">−</button>
              <strong class="min-w-8 text-center text-stone-100">{{ count() }}</strong>
              <button type="button" aria-label="One more" (click)="count.update(n => n + 1)" class="grid h-11 w-11 place-items-center rounded-xl border border-stone-600 text-stone-100 hover:bg-stone-800">+</button>
            </div>
            <app-code-output class="mt-4 block" [code]="pluralCode" caption="=0 and =1 match an exact number. other catches everything else.">
              <p class="text-base text-stone-100" data-testid="plural" aria-live="polite">
                <span [ngPlural]="count()">
                  <ng-template ngPluralCase="=0">You have no messages.</ng-template>
                  <ng-template ngPluralCase="=1">You have one message.</ng-template>
                  <ng-template ngPluralCase="other">You have {{ count() }} messages.</ng-template>
                </span>
              </p>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="OTHER LANGUAGES" heading="The categories change with the language">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Language</th><th class="px-4 py-2 font-semibold">Plural categories</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of pluralRows; track row.language) {
                    <tr><td class="px-4 py-2 text-stone-200">{{ row.language }}</td><td class="px-4 py-2 font-mono text-xs">{{ row.categories }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapPlurals" />
        </section>
      </ng-template>

      <!-- ── Translate ── -->
      <ng-template appLessonSection="translate">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE BUILD-TIME WAY" heading="Mark the text, extract it, translate it, build once per language">
            <p class="mt-2 text-sm text-stone-400">
              Angular's built-in translation works at <em>build time</em>: you mark text, a tool collects it into a file, translators fill in the file, and the build produces one copy of the app per language.
              Each copy is fast because the text is already translated.
            </p>
            <pre class="mt-3" [appCode]="markCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="From marked text to translated apps">
            <app-order-steps
              [steps]="translateSteps"
              explanation="Mark the text first. Then extract it into a translation file, translate that file, list the locales in angular.json, and build. You get one folder per language."
            />
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="IN CODE" heading="$localize for text that is not in a template">
            <pre class="mt-3" [appCode]="localizeCode"></pre>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              <code class="text-gold-300">i18n</code> marks text in templates; <code class="text-gold-300">$localize</code> marks text in TypeScript. Add a short <em>meaning</em> and <em>description</em> so translators know the context.
              If you must switch language without rebuilding, a runtime library such as Transloco is a common alternative; the built-in way is simplest and fastest when a build per language is acceptable.
            </p>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Gluing translated pieces together" [wrong]="mistakeGlueWrong" [right]="mistakeGlueRight">
            Word order differs between languages, so a sentence built from pieces cannot be translated well. Keep the whole sentence in one message and use a placeholder for the changing part.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapTranslate" />
        </section>
      </ng-template>

      <!-- ── Direction ── -->
      <ng-template appLessonSection="direction">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Flip the direction of a card">
            <div class="mt-3 flex gap-2" role="group" aria-label="Direction">
              <button type="button" [attr.aria-pressed]="dir() === 'ltr'" (click)="dir.set('ltr')"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="dir() === 'ltr' ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">Left to right</button>
              <button type="button" [attr.aria-pressed]="dir() === 'rtl'" (click)="dir.set('rtl')"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="dir() === 'rtl' ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">Right to left</button>
            </div>
            <app-code-output class="mt-4 block" [code]="dirCode" caption="One layout, written with start and end instead of left and right, works in both directions.">
              <div [attr.dir]="dir()" lang="ar" class="flex items-center gap-3 rounded-xl border border-stone-700 bg-stone-900 p-3" data-testid="card">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400 text-lg font-bold text-stone-950" aria-hidden="true">A</span>
                <div class="min-w-0 flex-1 text-start">
                  <p class="font-bold text-stone-100">{{ dir() === 'rtl' ? 'مرحبًا بك في Angular Lab' : 'Welcome to Angular Lab' }}</p>
                  <p class="text-sm text-stone-400">{{ dir() === 'rtl' ? 'تعلّم خطوة بخطوة.' : 'Learn step by step.' }}</p>
                </div>
                <span class="ms-auto text-gold-300" aria-hidden="true">{{ dir() === 'rtl' ? '←' : '→' }}</span>
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="RULES" heading="Think start and end, not left and right">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Set <code class="text-gold-300">dir="rtl"</code> and <code class="text-gold-300">lang</code> on the page (or the part) that needs it.</li>
              <li>Use logical CSS: <code class="text-gold-300">margin-inline-start</code>, <code class="text-gold-300">padding-inline-end</code>, <code class="text-gold-300">text-align: start</code>. In Tailwind: <code class="text-gold-300">ms-*</code>, <code class="text-gold-300">pe-*</code>, <code class="text-gold-300">text-start</code>.</li>
              <li>Flip icons that show a direction (arrows), but not ones that do not (a clock, a logo).</li>
              <li>Numbers and code stay left to right inside an Arabic sentence; the browser handles it.</li>
            </ul>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapDirection" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class I18nComponent {
  readonly section = input<string>();
  protected readonly Math = Math;

  protected readonly locales: LocaleChoice[] = [
    { id: 'en-US', label: 'English (US)', currency: 'USD' },
    { id: 'de', label: 'Deutsch', currency: 'EUR' },
    { id: 'fr', label: 'Français', currency: 'EUR' },
    { id: 'ar', label: 'العربية', currency: 'EGP' },
    { id: 'ja', label: '日本語', currency: 'JPY' },
  ];
  protected readonly locale = signal(this.locales[0]);
  protected readonly price = 1234.5;
  protected readonly big = 9876543;
  protected readonly share = 0.425;
  protected readonly day = new Date(2026, 3, 3);

  protected readonly count = signal(1);
  protected readonly dir = signal<'ltr' | 'rtl'>('ltr');

  protected readonly valueChallenge: PredictChallenge = {
    question: 'You show a price with the currency pipe in German and then in French. What happens to the stored number?',
    options: [
      { id: 'a', text: 'It is converted to a different number' },
      { id: 'b', text: 'It is the same number, only written differently' },
      { id: 'c', text: 'It becomes a string' },
      { id: 'd', text: 'It is deleted' },
    ],
    correct: 'b',
    explanation: 'Pipes only change how a value is shown. The value in your component never changes, so your calculations stay correct.',
  };

  protected readonly formatCode = `price = 1234.5;

{{ price | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}
{{ big | number: '1.0-0' : 'de' }}
{{ share | percent: '1.0-1' : 'de' }}
{{ day | date: 'fullDate' : undefined : 'de' }}`;

  protected readonly registerCode = `import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

// optional: make German the default for the whole app
providers: [{ provide: LOCALE_ID, useValue: 'de' }]`;

  protected readonly mistakeRegisterWrong = `{{ price | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}     // locale not registered`;
  protected readonly mistakeRegisterRight = `registerLocaleData(localeDe);
{{ price | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}`;

  protected readonly pluralCode = `<span [ngPlural]="count()">
  <ng-template ngPluralCase="=0">You have no messages.</ng-template>
  <ng-template ngPluralCase="=1">You have one message.</ng-template>
  <ng-template ngPluralCase="other">You have {{ count() }} messages.</ng-template>
</span>`;

  protected readonly pluralRows = [
    { language: 'English', categories: 'one, other' },
    { language: 'French', categories: 'one, many, other' },
    { language: 'Arabic', categories: 'zero, one, two, few, many, other' },
    { language: 'Japanese', categories: 'other' },
  ];

  protected readonly markCode = `<h1 i18n="site title|Title of the home page@@homeTitle">Welcome to Angular Lab</h1>

<!-- then, in the terminal -->
ng extract-i18n --output-path src/locale

<!-- angular.json: list the languages -->
"i18n": { "sourceLocale": "en-US", "locales": { "ar": "src/locale/messages.ar.xlf" } }

<!-- build every language -->
ng build --localize`;

  protected readonly localizeCode = `const greeting = $localize\`:greeting shown after login:Hello, \${name}!\`;`;

  protected readonly mistakeGlueWrong = `<p><span i18n>You have</span> {{ n }} <span i18n>messages</span></p>`;
  protected readonly mistakeGlueRight = `<p i18n>You have {{ n }} messages</p>`;

  protected readonly dirCode = `<div dir="rtl" lang="ar" class="flex items-center gap-3">
  <div class="text-start">…</div>
  <span class="ms-auto">←</span>      <!-- ms = margin at the start side -->
</div>`;

  protected readonly translateSteps = [
    'Mark the text with the i18n attribute',
    'Run ng extract-i18n to collect it into a file',
    'Translators fill in the translation file for each language',
    'List the languages in angular.json',
    'Run ng build --localize to build one app per language',
  ];

  protected readonly recapWhy = [
    'A locale is a short code such as en-US, de or ar.',
    'It decides number, date and plural style, and the direction of the text.',
    'Only how a value is shown changes, never the value.',
  ];
  protected readonly recapFormats = [
    'Angular ships American English only; register other locales with registerLocaleData.',
    'Pipes take the locale as their last argument.',
    'LOCALE_ID sets the default for the whole app.',
  ];
  protected readonly recapPlurals = [
    'ngPlural shows the text that matches a number.',
    'Use =0 and =1 for exact numbers and other for the rest.',
    'Languages have different plural categories, so never glue sentences together.',
  ];
  protected readonly recapTranslate = [
    'Mark text with i18n in templates and $localize in code.',
    'ng extract-i18n collects it; ng build --localize builds one app per language.',
    'Keep whole sentences in one message, with placeholders.',
  ];
  protected readonly recapDirection = [
    'Set dir and lang for languages that read right to left.',
    'Write CSS with start and end, not left and right.',
    'Flip arrows, but not logos or clocks.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What is the difference between internationalization and localization?', answer: 'Internationalization prepares the app to support many places; localization does the work for one place: translation, formats and direction.' },
    { question: 'Why must you call registerLocaleData?', answer: 'Angular includes only American English. Other locales are separate files so the app stays small, and a pipe throws if the locale is missing.' },
    { question: 'Why use margin-inline-start instead of margin-left?', answer: 'Start flips automatically in right-to-left languages, so one layout works in both directions.' },
  ];
}
