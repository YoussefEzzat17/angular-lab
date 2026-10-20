import { ChangeDetectionStrategy, Component, model } from '@angular/core';

/** A child that edits a value its parent owns. model() is an input and an output in one. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-1" role="group" aria-label="Rating">
      @for (star of stars; track star) {
        <button
          type="button"
          [attr.data-testid]="'star-' + star"
          [attr.aria-label]="'Rate ' + star + (star === 1 ? ' star' : ' stars')"
          [attr.aria-pressed]="rating() >= star"
          (click)="rating.set(star)"
          class="grid h-11 w-11 place-items-center rounded-lg text-2xl transition hover:bg-stone-800"
          [class]="rating() >= star ? 'text-amber-300' : 'text-stone-600'"
        >
          ★
        </button>
      }
    </div>
  `,
})
export class StarRatingComponent {
  readonly rating = model(0);
  protected readonly stars = [1, 2, 3, 4, 5];
}
