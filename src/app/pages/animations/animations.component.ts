import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

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

interface Row {
  id: number;
  title: string;
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
  styles: `
    .row-enter { animation: row-in 320ms ease-out; }
    .row-leave { animation: row-out 260ms ease-in forwards; }
    .fade { transition: opacity 400ms ease, transform 400ms ease; }
    .fade-off { opacity: 0.25; transform: translateY(6px); }
    @keyframes row-in { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
    @keyframes row-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(16px); } }
    @media (prefers-reduced-motion: reduce) {
      .row-enter, .row-leave { animation-duration: 1ms; }
      .fade { transition-duration: 1ms; }
    }
  `,
  template: `
    <app-lesson-player [topicId]="'animations'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Animations" illustration="animations">
            A good animation explains what just happened: "this was added", "that went away", "look here". A bad one is just decoration that slows people down.
            Angular lets you animate elements entering and leaving the page with plain CSS and two small attributes.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Elements appear and vanish with no hint">
            <p class="mt-2 text-sm text-stone-400">
              When an item is added to a list it just pops in, and the rest of the list jumps. When one is removed it disappears and the user may not notice what changed.
              A short movement makes the change visible and feels calmer.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Entrances and exits on a stage">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Enter:</strong> when Angular adds the element, it adds your CSS class so it can play its entrance.</li>
              <li><strong class="text-stone-100">Leave:</strong> when Angular is about to remove it, it adds a class and <em>waits</em> for the exit to finish before removing it.</li>
              <li><strong class="text-stone-100">In between:</strong> nothing moves. Keep animations short, 150 to 400 milliseconds.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · WHEN TO ANIMATE" heading="Animate to explain, not to show off">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Good: items added or removed, a panel opening, a message appearing.</li>
              <li>Careful: anything that loops, flashes, or moves a lot. It can cause discomfort or make text hard to read.</li>
              <li>Always: give people who ask for less motion a calmer version.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="When is the element removed?">
            <app-predict-output [challenge]="leaveChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Enter and leave ── -->
      <ng-template appLessonSection="enter-leave">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Add and remove rows">
            <p class="mt-2 text-sm text-stone-400">
              Each row has <code class="text-gold-300">animate.enter="row-enter"</code> and <code class="text-gold-300">animate.leave="row-leave"</code>.
              Remove a row and watch it slide away <em>before</em> it leaves the page.
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button type="button" (click)="addRow()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add a row</button>
              <button type="button" (click)="rows.set([])" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Clear all</button>
            </div>
            <app-code-output class="mt-4 block" [code]="enterLeaveCode" caption="No animation library and no extra module: two attributes and your own CSS.">
              <ul class="min-h-24 space-y-2" aria-live="polite">
                @for (row of rows(); track row.id) {
                  <li animate.enter="row-enter" animate.leave="row-leave" class="flex items-center justify-between rounded-xl bg-stone-800 px-3 py-2 text-sm text-stone-100" data-testid="row">
                    {{ row.title }}
                    <button type="button" (click)="removeRow(row.id)" [attr.aria-label]="'Remove ' + row.title" class="grid h-11 w-11 place-items-center rounded-lg text-stone-300 hover:bg-stone-700">✕</button>
                  </li>
                } @empty {
                  <li class="text-sm text-stone-500">No rows. Add one.</li>
                }
              </ul>
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Using display: none in the leave class" [wrong]="mistakeLeaveWrong" [right]="mistakeLeaveRight">
            Angular waits for the leave animation to finish. If the class hides the element at once, there is nothing to see. Animate opacity or position, and let Angular remove the element at the end.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapEnter" />
        </section>
      </ng-template>

      <!-- ── CSS ── -->
      <ng-template appLessonSection="css">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="TWO TOOLS" heading="Transitions for A to B, keyframes for a path">
            <div class="mt-3 grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-stone-800 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">transition</p>
                <p class="mt-1 text-sm text-stone-300">Changes smoothly between two states, for example when a class is added. Good for hover and toggles.</p>
              </div>
              <div class="rounded-xl bg-stone-800 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">&#64;keyframes</p>
                <p class="mt-1 text-sm text-stone-300">Describes steps along the way, even from nothing. Good for entrances and exits, because the element has no "before".</p>
              </div>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="A transition between two states">
            <div class="mt-3">
              <button type="button" [attr.aria-pressed]="dimmed()" (click)="dimmed.update(v => !v)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Toggle the card</button>
            </div>
            <app-code-output class="mt-4 block" [code]="transitionCode" caption="Adding and removing one class is all it takes. The browser fills in the steps.">
              <div class="fade rounded-xl bg-stone-800 p-4 text-sm text-stone-100" [class.fade-off]="dimmed()">I fade and drop when the class is on.</div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="GOOD PROPERTIES" heading="Animate opacity and transform">
            <p class="mt-2 max-w-[60ch] text-sm text-stone-400">
              <code class="text-gold-300">opacity</code> and <code class="text-gold-300">transform</code> are cheap for the browser. Animating <code class="text-gold-300">height</code>, <code class="text-gold-300">width</code>
              or <code class="text-gold-300">top</code> forces it to re-do the page layout on every frame and can feel choppy on phones.
            </p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapCss" />
        </section>
      </ng-template>

      <!-- ── Motion ── -->
      <ng-template appLessonSection="motion">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE SETTING" heading="Some people ask their system for less motion">
            <p class="mt-2 text-sm text-stone-400">
              Moving content can make some people dizzy or sick. Operating systems have a "reduce motion" setting, and the browser tells your CSS about it through
              <code class="text-gold-300">prefers-reduced-motion</code>. Respect it.
            </p>
            <pre class="mt-3" [appCode]="motionCode"></pre>
            <p class="mt-3 text-sm text-stone-300">Your system asks for reduced motion: <strong class="text-gold-300" data-testid="reduced">{{ reduced ? 'yes' : 'no' }}</strong></p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="HOW" heading="Keep the change, drop the movement">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Do not remove the feedback. A row should still appear and disappear, just without sliding.</li>
              <li>Make animations nearly instant (<code class="text-gold-300">1ms</code>) rather than deleting them, so Angular still has an animation to wait for.</li>
              <li>This lesson's own animations follow the setting. Turn on "reduce motion" in your system to see rows change without sliding.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="An endless looping animation" [wrong]="mistakeLoopWrong" [right]="mistakeLoopRight">
            Anything that moves forever steals attention and cannot be stopped. Play it once, or give the user a pause control.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapMotion" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class AnimationsComponent {
  readonly section = input<string>();

  protected readonly rows = signal<Row[]>([{ id: 1, title: 'Learn Angular' }]);
  private nextId = 2;
  protected readonly dimmed = signal(false);
  protected readonly reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected addRow(): void {
    this.rows.update((list) => [...list, { id: this.nextId, title: `Task number ${this.nextId++}` }]);
  }

  protected removeRow(id: number): void {
    this.rows.update((list) => list.filter((r) => r.id !== id));
  }

  protected readonly leaveChallenge: PredictChallenge = {
    question: 'An element has animate.leave="slide-out" and you remove it with @if. When does Angular take it out of the page?',
    options: [
      { id: 'a', text: 'Immediately' },
      { id: 'b', text: 'After the slide-out animation finishes' },
      { id: 'c', text: 'Never' },
      { id: 'd', text: 'Only after a page reload' },
    ],
    correct: 'b',
    explanation: 'Angular adds the leave class and waits for the animation to end, so the user sees the exit, and then it removes the element.',
  };

  protected readonly enterLeaveCode = `@for (row of rows(); track row.id) {
  <li animate.enter="row-enter" animate.leave="row-leave">{{ row.title }}</li>
}

.row-enter { animation: row-in 320ms ease-out; }
.row-leave { animation: row-out 260ms ease-in forwards; }

@keyframes row-in  { from { opacity: 0; transform: translateX(-16px); } }
@keyframes row-out { to   { opacity: 0; transform: translateX(16px); } }`;

  protected readonly transitionCode = `.fade     { transition: opacity 400ms ease, transform 400ms ease; }
.fade-off { opacity: 0.25; transform: translateY(6px); }

<div class="fade" [class.fade-off]="dimmed()">…</div>`;

  protected readonly motionCode = `@media (prefers-reduced-motion: reduce) {
  .row-enter, .row-leave { animation-duration: 1ms; }
}`;

  protected readonly mistakeLeaveWrong = `.row-leave { display: none; }     /* gone at once, nothing to watch */`;
  protected readonly mistakeLeaveRight = `.row-leave { animation: row-out 260ms ease-in forwards; }`;
  protected readonly mistakeLoopWrong = `.badge { animation: pulse 1s infinite; }`;
  protected readonly mistakeLoopRight = `.badge { animation: pulse 1s 3; }     /* a few times, then rest */`;

  protected readonly recapWhy = [
    'Animate to explain a change, not to decorate.',
    'animate.enter plays when an element is added; animate.leave plays before it is removed.',
    'Keep animations short and calm.',
  ];
  protected readonly recapEnter = [
    'Put animate.enter and animate.leave on the element, with the names of your CSS classes.',
    'Angular waits for the leave animation to finish before it removes the element.',
    'No extra module or library is needed.',
  ];
  protected readonly recapCss = [
    'Use transition for A to B, keyframes for entrances and exits.',
    'Animate opacity and transform, not height or width.',
    'Toggle one class and let the browser do the steps.',
  ];
  protected readonly recapMotion = [
    'prefers-reduced-motion tells you someone wants less movement.',
    'Make animations nearly instant rather than removing them.',
    'Avoid endless loops.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What does animate.leave do?', answer: 'It adds your class to an element that is about to be removed, and Angular waits for that animation to finish before taking the element out of the page.' },
    { question: 'Why animate opacity and transform?', answer: 'The browser can do them cheaply without re-doing the page layout, so they stay smooth, even on phones.' },
    { question: 'How do you respect people who want less motion?', answer: 'Use the prefers-reduced-motion media query to shorten or remove the movement, while keeping the change itself visible.' },
  ];
}
