import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

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
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDropListGroup,
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
    .cdk-drag-preview { box-sizing: border-box; border-radius: 0.75rem; box-shadow: 0 8px 24px rgb(0 0 0 / 0.5); }
    .cdk-drag-placeholder { opacity: 0.35; }
    .cdk-drag-animating { transition: transform 200ms cubic-bezier(0, 0, 0.2, 1); }
    .list.cdk-drop-list-dragging .item:not(.cdk-drag-placeholder) { transition: transform 200ms cubic-bezier(0, 0, 0.2, 1); }
    @media (prefers-reduced-motion: reduce) {
      .cdk-drag-animating, .list.cdk-drop-list-dragging .item:not(.cdk-drag-placeholder) { transition-duration: 1ms; }
    }
  `,
  template: `
    <app-lesson-player [topicId]="'drag-drop'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Drag and Drop" illustration="drag-drop">
            Lists the user can reorder, boards where cards move between columns: drag and drop makes these feel natural.
            The Angular CDK (Component Dev Kit, already in this project) does the hard part, and you keep your own data.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Dragging is harder than it looks">
            <p class="mt-2 text-sm text-stone-400">
              Moving an element with the mouse sounds simple. Then you need touch screens, scrolling while you drag, a ghost copy that follows the pointer, a gap that opens where the item will land,
              and the right result in your data when it drops. Doing that yourself takes a lot of code.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="The CDK moves the picture, you move the data">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">cdkDropList</strong> marks a container where items can land.</li>
              <li><strong class="text-stone-100">cdkDrag</strong> marks an item that can be picked up.</li>
              <li><strong class="text-stone-100">The drop event</strong> tells you the old and new position. You update your array, and the page follows.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="After the drop, who updates the data?">
            <app-predict-output [challenge]="dataChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Reorder ── -->
      <ng-template appLessonSection="list">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Reorder the lessons">
            <p class="mt-2 text-sm text-stone-400">Grab an item by its handle and drag it. The array below always matches what you see.</p>
            <app-code-output class="mt-4 block" [code]="reorderCode" caption="moveItemInArray changes the array, and @for redraws it in the new order.">
              <ul cdkDropList class="list space-y-2" (cdkDropListDropped)="reorder($event)" aria-label="Lessons in order">
                @for (item of order(); track item) {
                  <li cdkDrag class="item flex items-center gap-3 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100">
                    <span cdkDragHandle class="cursor-grab select-none px-1 text-lg leading-none text-stone-400" aria-hidden="true">⠿</span>
                    {{ item }}
                  </li>
                }
              </ul>
              <p class="mt-3 font-mono text-xs text-gold-300" data-testid="order">{{ order().join(' › ') }}</p>
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Changing only the page, not the array" [wrong]="mistakeDataWrong" [right]="mistakeDataRight">
            The CDK shows the item where it lands, but your list still holds the old order, so the next redraw puts it back. Always update the array in the drop handler.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapList" />
        </section>
      </ng-template>

      <!-- ── Lists ── -->
      <ng-template appLessonSection="lists">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="A tiny board with three columns">
            <p class="mt-2 text-sm text-stone-400">Drag a card from one column to another. Wrapping the columns in <code class="text-gold-300">cdkDropListGroup</code> connects them all.</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-3" cdkDropListGroup>
              @for (col of columns; track col.id) {
                <div class="rounded-xl border border-stone-700 bg-stone-900 p-3">
                  <h3 class="text-xs font-bold tracking-wider text-gold-300">{{ col.label }} · {{ boardOf(col.id).length }}</h3>
                  <ul cdkDropList [cdkDropListData]="boardOf(col.id)" (cdkDropListDropped)="move($event, col.id)" class="list mt-2 min-h-24 space-y-2" [attr.aria-label]="col.label">
                    @for (card of boardOf(col.id); track card) {
                      <li cdkDrag class="item rounded-lg bg-stone-800 px-3 py-2 text-sm text-stone-100">{{ card }}</li>
                    }
                  </ul>
                </div>
              }
            </div>
            <pre class="mt-4" [appCode]="boardCode"></pre>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapLists" />
        </section>
      </ng-template>

      <!-- ── Accessibility ── -->
      <ng-template appLessonSection="a11y">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE CATCH" heading="Dragging needs a pointer, and not everyone has one">
            <p class="mt-2 text-sm text-stone-400">
              Drag and drop is hard or impossible with a keyboard, a screen reader or a switch device. Never make it the <em>only</em> way to reorder.
              Offer buttons that do the same thing, and announce the result.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="The same list, with buttons">
            <ul class="mt-3 space-y-2" aria-label="Lessons with buttons">
              @for (item of order(); track item; let i = $index; let first = $first; let last = $last) {
                <li class="flex items-center justify-between gap-2 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100">
                  {{ item }}
                  <span class="flex gap-1">
                    <button type="button" [disabled]="first" (click)="nudge(i, -1)" [attr.aria-label]="'Move ' + item + ' up'" class="grid h-11 w-11 place-items-center rounded-lg border border-stone-600 hover:bg-stone-700 disabled:opacity-40">↑</button>
                    <button type="button" [disabled]="last" (click)="nudge(i, 1)" [attr.aria-label]="'Move ' + item + ' down'" class="grid h-11 w-11 place-items-center rounded-lg border border-stone-600 hover:bg-stone-700 disabled:opacity-40">↓</button>
                  </span>
                </li>
              }
            </ul>
            <p class="mt-3 text-sm text-stone-300" data-testid="announced">Announced: <strong class="text-gold-300">{{ announced() || 'nothing yet' }}</strong></p>
            <pre class="mt-3" [appCode]="nudgeCode"></pre>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapA11y" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DragDropComponent {
  readonly section = input<string>();
  private readonly announcer = inject(LiveAnnouncer);

  protected readonly order = signal(['Components', 'Binding', 'Signals', 'Routing']);
  protected readonly announced = signal('');

  protected reorder(event: CdkDragDrop<string[]>): void {
    this.order.update((list) => {
      const copy = [...list];
      moveItemInArray(copy, event.previousIndex, event.currentIndex);
      return copy;
    });
  }

  /** The button version of the same move, for people who cannot drag. */
  protected nudge(index: number, by: -1 | 1): void {
    const target = index + by;
    const list = this.order();
    if (target < 0 || target >= list.length) return;
    const item = list[index];
    this.order.update((l) => {
      const copy = [...l];
      moveItemInArray(copy, index, target);
      return copy;
    });
    const message = `${item} moved to position ${target + 1} of ${list.length}`;
    this.announced.set(message);
    void this.announcer.announce(message, 'polite');
  }

  protected readonly columns = [
    { id: 'todo', label: 'To do' },
    { id: 'doing', label: 'Doing' },
    { id: 'done', label: 'Done' },
  ] as const;
  private readonly board: Record<string, string[]> = {
    todo: ['Write tests', 'Add dark mode'],
    doing: ['Fix the header'],
    done: ['Set up the project'],
  };
  private readonly boardState = signal(this.board);

  protected boardOf(id: string): string[] {
    return this.boardState()[id];
  }

  protected move(event: CdkDragDrop<string[]>, columnId: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    // The arrays are changed in place by the CDK helpers, so hand the signal a new object to redraw the columns.
    this.boardState.set({ ...this.board });
    void columnId;
  }

  protected readonly dataChallenge: PredictChallenge = {
    question: 'The user drops an item in a new place. Who changes your array?',
    options: [
      { id: 'a', text: 'The CDK, automatically' },
      { id: 'b', text: 'Your drop handler, with moveItemInArray' },
      { id: 'c', text: 'Angular, when it detects the page changed' },
      { id: 'd', text: 'The browser' },
    ],
    correct: 'b',
    explanation: 'The CDK moves the picture and reports where the item landed. You change your own data in the handler, so the data stays the single source of truth.',
  };

  protected readonly reorderCode = `<ul cdkDropList (cdkDropListDropped)="reorder($event)">
  @for (item of order(); track item) {
    <li cdkDrag><span cdkDragHandle>⠿</span> {{ item }}</li>
  }
</ul>

reorder(event: CdkDragDrop<string[]>) {
  const copy = [...this.order()];
  moveItemInArray(copy, event.previousIndex, event.currentIndex);
  this.order.set(copy);
}`;

  protected readonly boardCode = `<div cdkDropListGroup>
  <ul cdkDropList [cdkDropListData]="todo" (cdkDropListDropped)="move($event)">…</ul>
  <ul cdkDropList [cdkDropListData]="done" (cdkDropListDropped)="move($event)">…</ul>
</div>

move(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data, event.container.data,
                      event.previousIndex, event.currentIndex);
  }
}`;

  protected readonly nudgeCode = `moveUp(i: number) {
  moveItemInArray(this.items, i, i - 1);
  this.announcer.announce(\`\${this.items[i - 1]} moved up\`);
}`;

  protected readonly mistakeDataWrong = `<ul cdkDropList>
  @for (item of items; track item) { <li cdkDrag>{{ item }}</li> }
</ul>
<!-- no (cdkDropListDropped): the array never changes -->`;
  protected readonly mistakeDataRight = `<ul cdkDropList (cdkDropListDropped)="drop($event)">…</ul>
drop(e: CdkDragDrop<string[]>) { moveItemInArray(this.items, e.previousIndex, e.currentIndex); }`;

  protected readonly recapWhy = [
    'The CDK handles the pointer, the preview and the gap; you handle the data.',
    'cdkDropList is the container, cdkDrag is the item.',
    'The drop event gives the old and new positions.',
  ];
  protected readonly recapList = [
    'Update your array in (cdkDropListDropped) with moveItemInArray.',
    'cdkDragHandle limits dragging to a small grip.',
    'Style cdk-drag-preview and cdk-drag-placeholder to match your design.',
  ];
  protected readonly recapLists = [
    'cdkDropListGroup connects the lists inside it.',
    'Use transferArrayItem to move an item to another list.',
    'Give each list its own data with cdkDropListData.',
  ];
  protected readonly recapA11y = [
    'Dragging needs a pointer, so never make it the only option.',
    'Offer buttons that make the same change.',
    'Announce the result for screen readers.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What do cdkDropList and cdkDrag mark?', answer: 'cdkDropList marks a container where items can land, and cdkDrag marks an item that can be picked up.' },
    { question: 'Which helper moves an item inside one array, and which between two?', answer: 'moveItemInArray inside one array, and transferArrayItem from one array to another.' },
    { question: 'Why add buttons beside drag and drop?', answer: 'Not everyone can drag. Buttons let keyboard and screen reader users reorder too, and you can announce the result.' },
  ];
}
