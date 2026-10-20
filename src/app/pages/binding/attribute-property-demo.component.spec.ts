import { TestBed } from '@angular/core/testing';

import { AttributePropertyDemoComponent } from './attribute-property-demo.component';

describe('AttributePropertyDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(AttributePropertyDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('input')!;
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.trim();
    const read = () => {
      root.querySelector<HTMLButtonElement>('[data-testid="ap-read"]')!.click();
      fixture.detectChanges();
    };
    return { input, text, read };
  }

  it('shows nothing until the learner asks', () => {
    const { text } = setup();

    expect(text('ap-attribute')).toBe('Press the button');
    expect(text('ap-property')).toBe('Press the button');
  });

  it('shows the same starting value for the attribute and the property before anyone types', () => {
    const { text, read } = setup();

    read();

    expect(text('ap-attribute')).toBe('Castle in the Sky');
    expect(text('ap-property')).toBe('Castle in the Sky');
  });

  it('keeps the attribute at its starting value after typing, while the property follows', () => {
    const { input, text, read } = setup();

    input.value = 'Spirited Away';
    input.dispatchEvent(new Event('input'));
    read();

    expect(text('ap-attribute')).toBe('Castle in the Sky');
    expect(text('ap-property')).toBe('Spirited Away');
  });
});
