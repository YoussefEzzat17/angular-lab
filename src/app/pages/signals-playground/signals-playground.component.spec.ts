import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SignalsPlaygroundComponent } from './signals-playground.component';

describe('SignalsPlaygroundComponent effects section', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SignalsPlaygroundComponent);
    fixture.componentRef.setInput('section', 'effects');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const lines = () =>
      Array.from(root.querySelectorAll('[data-testid="effect-log"] li')).map((li) => li.textContent?.trim());
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    return { root, lines, click };
  }

  it('logs the first effect run as soon as the page loads', () => {
    const { lines } = setup();

    expect(lines()).toEqual(['Effect ran → final price is $50']);
  });

  it('adds a line each time a signal the effect reads changes', () => {
    const { lines, click } = setup();

    click('effect-qty-up');
    click('effect-qty-up');

    expect(lines()).toEqual([
      'Effect ran → final price is $50',
      'Effect ran → final price is $100',
      'Effect ran → final price is $150',
    ]);
  });

  it('applies the discount from quantity 5 and lets the log be cleared', () => {
    const { root, lines, click } = setup();

    for (let i = 0; i < 4; i++) {
      click('effect-qty-up');
    }
    expect(root.querySelector('[data-testid="effect-qty"]')?.textContent).toBe('5');
    expect(lines().at(-1)).toBe('Effect ran → final price is $240');

    click('effect-clear');
    expect(lines()).toEqual(['Log cleared — change the quantity to see the effect run again.']);
  });
});
