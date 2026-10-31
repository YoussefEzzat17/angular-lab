import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';

/** A list that lets its caller decide how each item looks, by passing a template in. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-item-list-demo',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <ul class="space-y-2">
      @for (item of items(); track item) {
        <li>
          <ng-container [ngTemplateOutlet]="itemTemplate()" [ngTemplateOutletContext]="{ $implicit: item, index: $index }" />
        </li>
      }
    </ul>
  `,
})
export class ItemListDemoComponent {
  readonly items = input.required<string[]>();
  readonly itemTemplate = input.required<TemplateRef<{ $implicit: string; index: number }>>();
}
