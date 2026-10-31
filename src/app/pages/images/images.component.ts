import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';

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
    NgOptimizedImage,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'images'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Optimized Images" illustration="images">
            Images are usually the heaviest part of a page. <code class="text-gold-300">NgOptimizedImage</code> is a directive that applies the best practices for you:
            the main image loads first, the others wait, and the page does not jump while pictures arrive.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Pictures slow the page and push the text around">
            <p class="mt-2 text-sm text-stone-400">
              A big picture near the top delays the moment the page looks ready. And if the browser does not know a picture's size until it has downloaded, it first leaves no room, then
              suddenly makes room, so the text the user was reading jumps down. That jump is called <strong class="text-stone-200">layout shift</strong>.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Reserve a seat, serve the guest of honour first">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Reserve the seat:</strong> give every image a width and a height, so the browser keeps room before it arrives.</li>
              <li><strong class="text-stone-100">Guest of honour first:</strong> the biggest picture people see first is marked <code class="text-gold-300">priority</code> and loads at once.</li>
              <li><strong class="text-stone-100">Others wait:</strong> pictures below the fold load only when the user scrolls near them.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What does the browser do?">
            <app-predict-output [challenge]="shiftChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── ngSrc ── -->
      <ng-template appLessonSection="ngsrc">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE CHANGE" heading="Use ngSrc instead of src, and give a width and a height">
            <pre class="mt-3" [appCode]="basicCode"></pre>
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Import <code class="text-gold-300">NgOptimizedImage</code> in the component.</li>
              <li><code class="text-gold-300">width</code> and <code class="text-gold-300">height</code> are the image's <em>real</em> pixel size. They are used to keep its shape, not to resize it. Size it with CSS.</li>
              <li>Angular sets <code class="text-gold-300">loading="lazy"</code> for you, so off-screen images do not slow the start.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Read what Angular put on the tag">
            <p class="mt-2 text-sm text-stone-400">The picture below is a normal <code class="text-gold-300">&lt;img ngSrc&gt;</code>. Press the button to read its real attributes from the page.</p>
            <div class="mt-3">
              <button type="button" (click)="readBasic()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Read the attributes</button>
            </div>
            <app-code-output class="mt-4 block" [code]="basicCode" caption="You wrote ngSrc, width and height. Angular added the rest.">
              <img #basic ngSrc="/icon-192.png" width="192" height="192" alt="The Angular Lab logo" class="h-24 w-24 rounded-xl" />
              <div class="mt-3 overflow-x-auto whitespace-pre rounded-lg bg-stone-950 p-3 font-mono text-xs text-gold-200" data-testid="basic-attrs">{{ basicAttrs() || 'Press the button.' }}</div>
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Leaving out the width and height" [wrong]="mistakeSizeWrong" [right]="mistakeSizeRight">
            Without sizes Angular cannot reserve room, so it reports an error in development. The fix is a one-time effort: write the picture's real width and height.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapNgsrc" />
        </section>
      </ng-template>

      <!-- ── Priority ── -->
      <ng-template appLessonSection="priority">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE MAIN IMAGE" heading="priority: load this one first">
            <p class="mt-2 text-sm text-stone-400">
              Mark the one image people see first (often the big picture at the top) with <code class="text-gold-300">priority</code>. Angular then loads it at once,
              tells the browser it is important, and adds a hint to connect to its server early. Use it on that one image only.
            </p>
            <pre class="mt-3" [appCode]="priorityCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="OPTIONS" heading="The ones you will meet">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Option</th><th class="px-4 py-2 font-semibold">Use it when</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of options; track row.name) {
                    <tr><td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.name }}</td><td class="px-4 py-2">{{ row.when }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="FILL" heading="When the size comes from the layout">
            <p class="mt-2 text-sm text-stone-400">
              For a picture that must cover a box whose size is set by CSS, use <code class="text-gold-300">fill</code> instead of width and height. The parent needs
              <code class="text-gold-300">position: relative</code> and a size, and you decide how the picture sits with <code class="text-gold-300">object-fit</code>.
            </p>
            <pre class="mt-3" [appCode]="fillCode"></pre>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Marking every image as priority" [wrong]="mistakeAllWrong" [right]="mistakeAllRight">
            If everything is urgent, nothing is. The browser downloads all of them at once and the picture that mattered is slowed down. Choose one.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapPriority" />
        </section>
      </ng-template>

      <!-- ── Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Turn priority on and off">
            <p class="mt-2 text-sm text-stone-400">The same picture is drawn two ways. Read the attributes and compare them.</p>
            <div class="mt-3 flex flex-wrap gap-4">
              <figure class="m-0 w-40 text-center">
                <img #normal ngSrc="/icon-192.png" width="192" height="192" alt="Logo, normal loading" class="h-24 w-24 rounded-xl" />
                <figcaption class="mt-1 text-xs text-stone-400">Normal</figcaption>
              </figure>
              <figure class="m-0 w-40 text-center">
                <img #main ngSrc="/icon-192.png" width="192" height="192" priority alt="Logo, high priority" class="h-24 w-24 rounded-xl" />
                <figcaption class="mt-1 text-xs text-stone-400">With priority</figcaption>
              </figure>
            </div>
            <div class="mt-3">
              <button type="button" (click)="readBoth()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Compare their attributes</button>
            </div>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <div class="overflow-x-auto whitespace-pre rounded-lg bg-stone-950 p-3 font-mono text-xs text-gold-200" data-testid="normal-attrs">{{ normalAttrs() || 'Normal: press the button.' }}</div>
              <div class="overflow-x-auto whitespace-pre rounded-lg bg-stone-950 p-3 font-mono text-xs text-gold-200" data-testid="main-attrs">{{ mainAttrs() || 'With priority: press the button.' }}</div>
            </div>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTry" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ImagesComponent {
  readonly section = input<string>();

  private readonly basic = viewChild<ElementRef<HTMLImageElement>>('basic');
  private readonly normal = viewChild<ElementRef<HTMLImageElement>>('normal');
  private readonly main = viewChild<ElementRef<HTMLImageElement>>('main');
  protected readonly basicAttrs = signal('');
  protected readonly normalAttrs = signal('');
  protected readonly mainAttrs = signal('');

  private describe(img: HTMLImageElement | undefined): string {
    if (!img) return '';
    return ['loading', 'fetchpriority', 'width', 'height', 'decoding']
      .map((name) => `${name}="${img.getAttribute(name) ?? '(not set)'}"`)
      .join('\n');
  }

  protected readBasic(): void {
    this.basicAttrs.set(this.describe(this.basic()?.nativeElement));
  }

  protected readBoth(): void {
    this.normalAttrs.set('Normal\n' + this.describe(this.normal()?.nativeElement));
    this.mainAttrs.set('With priority\n' + this.describe(this.main()?.nativeElement));
  }

  protected readonly basicCode = `import { NgOptimizedImage } from '@angular/common';

@Component({ imports: [NgOptimizedImage] })

<img ngSrc="/logo.png" width="192" height="192" alt="The logo">`;

  protected readonly priorityCode = `<!-- the big picture at the top -->
<img ngSrc="/hero.jpg" width="1200" height="600" priority alt="…">

<!-- everything else: no priority, loaded lazily -->
<img ngSrc="/card.jpg" width="400" height="300" alt="…">`;

  protected readonly fillCode = `<div class="relative h-64">
  <img ngSrc="/cover.jpg" fill alt="…" class="object-cover">
</div>`;

  protected readonly options = [
    { name: 'ngSrc', when: 'Always, instead of src.' },
    { name: 'width, height', when: 'Always, unless you use fill. Use the real pixel size.' },
    { name: 'priority', when: 'The one image people see first, such as a hero picture.' },
    { name: 'fill', when: 'The size comes from the CSS of the parent box.' },
    { name: 'ngSrcset, sizes', when: 'You want different file sizes for different screens.' },
    { name: 'placeholder', when: 'You want a blurred stand-in while the real image loads.' },
  ];

  protected readonly mistakeSizeWrong = '<img ngSrc="/logo.png" alt="The logo">';
  protected readonly mistakeSizeRight = '<img ngSrc="/logo.png" width="192" height="192" alt="The logo">';
  protected readonly mistakeAllWrong = `<img ngSrc="/a.jpg" width="400" height="300" priority alt="…">
<img ngSrc="/b.jpg" width="400" height="300" priority alt="…">
<img ngSrc="/c.jpg" width="400" height="300" priority alt="…">`;
  protected readonly mistakeAllRight = `<img ngSrc="/a.jpg" width="400" height="300" priority alt="…">     <!-- the main one -->
<img ngSrc="/b.jpg" width="400" height="300" alt="…">`;

  protected readonly shiftChallenge: PredictChallenge = {
    question: 'An image has no width or height. What happens when it finishes downloading?',
    options: [
      { id: 'a', text: 'Nothing, the page stays still' },
      { id: 'b', text: 'The text around it jumps to make room' },
      { id: 'c', text: 'The browser deletes the image' },
      { id: 'd', text: 'The image is resized to fit the page' },
    ],
    correct: 'b',
    explanation: 'Without a size the browser cannot reserve space in advance. When the picture arrives it needs room, so the content below it shifts.',
  };

  protected readonly recapWhy = [
    'Images are the heaviest part of most pages.',
    'Without a size, a picture makes the page jump when it arrives.',
    'NgOptimizedImage reserves space and loads the right images first.',
  ];
  protected readonly recapNgsrc = [
    'Use ngSrc instead of src, and import NgOptimizedImage.',
    'Give width and height as the real pixel size; style the display size with CSS.',
    'Angular makes off-screen images lazy by itself.',
  ];
  protected readonly recapPriority = [
    'Mark only the main image with priority.',
    'Use fill when the parent box controls the size.',
    'ngSrcset, sizes and placeholder help on different screens and slow networks.',
  ];
  protected readonly recapTry = [
    'priority switches loading to eager and fetchpriority to high.',
    'A normal image loads lazily, so it never delays the start.',
    'Always write meaningful alt text.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Why must an image have a width and a height?', answer: 'So the browser can reserve its space before it loads, which stops the page from jumping.' },
    { question: 'When do you use priority?', answer: 'On the one image users see first, so it loads straight away. Not on every image.' },
    { question: 'What does NgOptimizedImage do by default for a normal image?', answer: 'It loads it lazily, so pictures far down the page are fetched only when the user scrolls near them.' },
  ];
}
