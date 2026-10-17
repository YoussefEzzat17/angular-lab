import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
      role="progressbar"
      [attr.aria-valuenow]="percent()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-valuetext]="ariaText()"
      class="block -rotate-90"
    >
      <!-- Track -->
      <circle
        [attr.cx]="size() / 2"
        [attr.cy]="size() / 2"
        [attr.r]="radius()"
        fill="none"
        class="stroke-stone-800"
        [attr.stroke-width]="strokeWidth()"
      />
      <!-- Progress -->
      <circle
        [attr.cx]="size() / 2"
        [attr.cy]="size() / 2"
        [attr.r]="radius()"
        fill="none"
        class="stroke-gold-500 transition-all duration-500"
        [attr.stroke-width]="strokeWidth()"
        stroke-linecap="round"
        [attr.stroke-dasharray]="circumference()"
        [attr.stroke-dashoffset]="dashOffset()"
      />
    </svg>
  `,
})
export class ProgressRingComponent {
  readonly percent = input.required<number>();
  readonly ariaText = input('');
  readonly size = input(64);
  readonly strokeWidth = input(6);

  protected readonly radius = computed(() => (this.size() - this.strokeWidth() * 2) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly dashOffset = computed(() => this.circumference() * (1 - this.percent() / 100));
}
