import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';

/**
 * An HTML attribute is the starting value written in the markup. A DOM property is the live value.
 * Type in the field and compare: the attribute never moves, the property follows you.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-attribute-property-demo',
  standalone: true,
  template: `
    <label class="mt-4 block text-sm font-semibold text-stone-200" for="ap-field">A field that starts as "Castle in the Sky"</label>
    <input
      #field
      id="ap-field"
      type="text"
      value="Castle in the Sky"
      class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-3 py-2.5 text-stone-100 focus:border-gold-400 focus:outline-none"
    />
    <button
      type="button"
      data-testid="ap-read"
      (click)="read()"
      class="mt-3 min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800"
    >
      Read both
    </button>

    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">HTML ATTRIBUTE</p>
        <code class="mt-1 block text-xs text-stone-400">getAttribute('value')</code>
        <p class="mt-2 text-sm font-semibold text-gold-300" data-testid="ap-attribute">{{ attribute() ?? 'Press the button' }}</p>
      </div>
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">DOM PROPERTY</p>
        <code class="mt-1 block text-xs text-stone-400">input.value</code>
        <p class="mt-2 text-sm font-semibold text-emerald-300" data-testid="ap-property">{{ property() ?? 'Press the button' }}</p>
      </div>
    </div>
  `,
})
export class AttributePropertyDemoComponent {
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  protected readonly attribute = signal<string | null | undefined>(undefined);
  protected readonly property = signal<string | undefined>(undefined);

  protected read(): void {
    const input = this.field().nativeElement;
    this.attribute.set(input.getAttribute('value'));
    this.property.set(input.value);
  }
}
