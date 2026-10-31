import { ChangeDetectionStrategy, Component, ElementRef, inject, input, SecurityContext, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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

interface Payload {
  id: string;
  label: string;
  text: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'security'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Security Basics" illustration="security">
            The biggest web danger Angular helps with is <strong class="text-stone-200">cross-site scripting (XSS)</strong>: an attacker gets their own JavaScript to run inside your page, where it can read
            what your user can see and act as them.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Your page shows text that someone else wrote">
            <p class="mt-2 text-sm text-stone-400">
              A comment, a username, a search term in the URL: all of it comes from outside. If your page puts that text into the HTML as it is, a comment like
              <code class="text-gold-300">&lt;img src=x onerror="steal()"&gt;</code> becomes real code, and it runs for every visitor.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Treat outside text like a parcel from a stranger">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Escape it</strong>: show it as plain text, never as markup. Angular does this for <code ngNonBindable class="text-gold-300">{{ }}</code> automatically.</li>
              <li><strong class="text-stone-100">Sanitize it</strong>: if you must show some HTML, remove the dangerous parts first. Angular does this for <code class="text-gold-300">[innerHTML]</code>.</li>
              <li><strong class="text-stone-100">Never open the parcel by force</strong>: do not turn the checks off for text you did not write.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What does the page show?">
            <app-predict-output [challenge]="escapeChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Escaping ── -->
      <ng-template appLessonSection="escaping">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Feed the page some dangerous text">
            <p class="mt-2 text-sm text-stone-400">
              Pick a payload, or type your own. The same text is shown two ways. Nothing here can run a script: that is what the lesson is about.
            </p>
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Sample text">
              @for (p of payloads; track p.id) {
                <button type="button" [attr.aria-pressed]="text() === p.text" (click)="text.set(p.text)"
                        class="min-h-11 rounded-xl border px-3 text-sm font-semibold transition"
                        [class]="text() === p.text ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ p.label }}</button>
              }
            </div>
            <label class="mt-3 block text-xs text-stone-400" for="payload">Text from "a user"</label>
            <textarea id="payload" rows="2" [value]="text()" (input)="text.set($any($event.target).value)"
                      class="mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 font-mono text-xs text-stone-100 focus:border-gold-400 focus:outline-none"></textarea>
            <app-code-output class="mt-4 block" [code]="escapeCode" caption="Interpolation shows every character. [innerHTML] allows safe tags, such as bold, and removes scripts and event handlers.">
              <p ngNonBindable class="text-xs font-bold text-stone-500">{{ text }} (escaped)</p>
              <p class="mt-1 break-words rounded-lg bg-stone-950 p-2 font-mono text-xs text-stone-200" data-testid="escaped">{{ text() }}</p>
              <p class="mt-3 text-xs font-bold text-stone-500">[innerHTML]="text" (sanitized)</p>
              <div class="mt-1 rounded-lg bg-stone-950 p-2 text-sm text-stone-200" data-testid="sanitized" [innerHTML]="text()"></div>
              <p class="mt-3 text-xs font-bold text-stone-500">What Angular kept</p>
              <p class="mt-1 break-words rounded-lg bg-stone-950 p-2 font-mono text-xs text-emerald-300" data-testid="kept">{{ cleaned() || '(nothing)' }}</p>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="URLS" heading="Dangerous links are defused too">
            <p class="mt-2 text-sm text-stone-400">
              A link can run code if it starts with <code class="text-gold-300">javascript:</code>. Angular checks URLs bound to <code class="text-gold-300">[href]</code> and
              <code class="text-gold-300">[src]</code> and, if one looks unsafe, adds <code class="text-gold-300">unsafe:</code> in front so the browser will not run it.
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <a #link [href]="badUrl" (click)="$event.preventDefault()" class="text-sm font-semibold text-gold-300 underline">A suspicious link</a>
              <button type="button" (click)="readHref()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Read its href</button>
            </div>
            <p class="mt-2 break-words font-mono text-xs text-stone-300" data-testid="href">Bound value: {{ badUrl }}<br />Real href: {{ realHref() || '(press the button)' }}</p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapEscaping" />
        </section>
      </ng-template>

      <!-- ── Bypass ── -->
      <ng-template appLessonSection="bypass">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="danger" label="THE TRAP" heading="bypassSecurityTrust turns the alarm off">
            <p class="mt-2 text-sm text-stone-300">
              Sometimes Angular removes something you really wanted, such as an embedded video. <code class="text-gold-300">DomSanitizer</code> has methods named
              <code class="text-gold-300">bypassSecurityTrustHtml</code>, <code class="text-gold-300">...Url</code>, <code class="text-gold-300">...ResourceUrl</code> and more. They tell Angular
              "I promise this is safe" and skip every check. If the promise is wrong, the attacker's code runs.
            </p>
            <pre class="mt-3" [appCode]="bypassCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="WHEN IS IT OK?" heading="Only for text you wrote or have cleaned yourself">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>A string you wrote in your own code, with nothing from a user mixed in.</li>
              <li>HTML cleaned by a trusted library on your <em>server</em> with a strict allow-list.</li>
              <li>Never: a comment, a name, a URL parameter, or anything fetched from a place you do not control.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Bypassing to make a warning go away" [wrong]="mistakeBypassWrong" [right]="mistakeBypassRight">
            If Angular removes something, first ask why. Often the right fix is to stop using raw HTML (show text, or build the elements in the template), not to switch the protection off.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapBypass" />
        </section>
      </ng-template>

      <!-- ── Practices ── -->
      <ng-template appLessonSection="practices">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE LIMITS" heading="What Angular protects, and what it cannot">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Angular protects</th><th class="px-4 py-2 font-semibold">You must protect</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of limits; track row.mine) {
                    <tr><td class="px-4 py-2">{{ row.angular }}</td><td class="px-4 py-2">{{ row.mine }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="HABITS" heading="A short safety checklist">
            <ol class="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-300">
              <li>Show user text with <code ngNonBindable class="text-gold-300">{{ }}</code>. Use <code class="text-gold-300">[innerHTML]</code> only when you need markup.</li>
              <li>Do not use <code class="text-gold-300">bypassSecurityTrust*</code> on anything a user can influence.</li>
              <li>Validate and check permissions on the server. A guard only hides pages; it does not protect your API.</li>
              <li>Keep tokens out of URLs and out of <code class="text-gold-300">localStorage</code> when you can; prefer secure cookies set by the server.</li>
              <li>Send only the headers and tokens a request needs, and only to your own API.</li>
              <li>Keep Angular and your packages up to date.</li>
            </ol>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Is this safe?">
            <app-predict-output [challenge]="bypassChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapPractices" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class SecurityComponent {
  readonly section = input<string>();
  private readonly sanitizer = inject(DomSanitizer);
  private readonly link = viewChild<ElementRef<HTMLAnchorElement>>('link');

  protected readonly payloads: Payload[] = [
    { id: 'plain', label: 'Plain text', text: 'Hello, nice lesson!' },
    { id: 'bold', label: 'Safe tag', text: 'This is <b>bold</b> and <i>italic</i>.' },
    { id: 'script', label: 'Script tag', text: 'Hi <script>alert("hacked")</script> there' },
    { id: 'onerror', label: 'Event handler', text: '<img src="x" onerror="alert(\'hacked\')"> picture' },
  ];
  protected readonly text = signal(this.payloads[2].text);

  /** The text Angular keeps when it sanitizes the HTML. */
  protected cleaned(): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.text()) ?? '';
  }

  protected readonly badUrl = 'javascript:alert("hacked")';
  protected readonly realHref = signal('');

  protected readHref(): void {
    this.realHref.set(this.link()?.nativeElement.getAttribute('href') ?? '');
  }

  protected readonly escapeCode = `text = '<img src="x" onerror="steal()"> picture';

<p>{{ text }}</p>                 <!-- shows the characters, runs nothing -->
<div [innerHTML]="text"></div>    <!-- sanitized: onerror and script are removed -->`;

  protected readonly bypassCode = `private sanitizer = inject(DomSanitizer);

// DANGEROUS if comment comes from a user
safe = this.sanitizer.bypassSecurityTrustHtml(comment);

<div [innerHTML]="safe"></div>      <!-- now ANY script in comment will run -->`;

  protected readonly mistakeBypassWrong = `html = this.sanitizer.bypassSecurityTrustHtml(userComment);`;
  protected readonly mistakeBypassRight = `<p>{{ userComment }}</p>        <!-- plain text is always safe -->`;

  protected readonly escapeChallenge: PredictChallenge = {
    question: 'A user\'s name is <b>Ada</b>. You write <p>{{ name }}</p>. What does the page show?',
    options: [
      { id: 'a', text: 'Ada in bold' },
      { id: 'b', text: 'The characters <b>Ada</b> as plain text' },
      { id: 'c', text: 'Nothing' },
      { id: 'd', text: 'An error' },
    ],
    correct: 'b',
    explanation: 'Interpolation escapes the text, so the angle brackets are shown as characters and never become real HTML.',
  };

  protected readonly bypassChallenge: PredictChallenge = {
    question: 'Which line is the most dangerous?',
    options: [
      { id: 'a', text: '<p>{{ comment }}</p>' },
      { id: 'b', text: '<div [innerHTML]="comment"></div>' },
      { id: 'c', text: 'safe = sanitizer.bypassSecurityTrustHtml(comment);' },
      { id: 'd', text: '<input [value]="comment">' },
    ],
    correct: 'c',
    explanation: 'The bypass skips every check on text a user can control. The others are escaped or sanitized by Angular.',
  };

  protected readonly limits = [
    { angular: 'Escapes text in {{ }} and attributes', mine: 'Checking permissions on the server' },
    { angular: 'Sanitizes [innerHTML], [href] and [src]', mine: 'Validating every input on the server' },
    { angular: 'Blocks scripts inside bound HTML', mine: 'Keeping secrets out of the front end code' },
    { angular: 'Warns when it removes something', mine: 'Choosing where tokens are stored' },
    { angular: 'Gives you safe defaults', mine: 'Updating Angular and your packages' },
  ];

  protected readonly recapWhy = [
    'XSS lets an attacker run their own code in your page.',
    'Outside text must be escaped or sanitized before it reaches the HTML.',
    'Angular does both by default.',
  ];
  protected readonly recapEscaping = [
    '{{ }} shows text as characters, so markup never runs.',
    '[innerHTML] keeps safe tags and removes scripts and event handlers.',
    'Angular defuses javascript: links by adding unsafe: in front.',
  ];
  protected readonly recapBypass = [
    'bypassSecurityTrust* tells Angular to skip its checks.',
    'Use it only on text you wrote, never on anything a user can influence.',
    'If Angular removes something, change your approach before you switch the protection off.',
  ];
  protected readonly recapPractices = [
    'Angular guards the page; the server must guard the data.',
    'Check permissions and validate input on the server every time.',
    'Keep tokens, packages and headers under control.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What is cross-site scripting?', answer: 'An attacker gets their own JavaScript to run inside your page, so it can read data and act as the user.' },
    { question: 'Why is {{ comment }} safe but a bypass is not?', answer: 'Interpolation turns the text into characters, so it can never run. A bypass tells Angular to skip its checks, so any script in the text runs.' },
    { question: 'Does a route guard protect your API?', answer: 'No. A guard only hides pages in the browser. The server must check permissions on every request.' },
  ];
}
