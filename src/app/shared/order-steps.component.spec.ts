import { TestBed } from '@angular/core/testing';

import { OrderStepsComponent, startingOrder } from './order-steps.component';

const STEPS = ['First', 'Second', 'Third', 'Fourth'];

describe('startingOrder', () => {
  it('is never already solved', () => {
    for (let n = 2; n <= 8; n++) {
      expect(startingOrder(n)).not.toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('is a permutation of every step', () => {
    expect([...startingOrder(5)].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it('handles zero and one step', () => {
    expect(startingOrder(0)).toEqual([]);
    expect(startingOrder(1)).toEqual([0]);
  });
});

describe('OrderStepsComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(OrderStepsComponent);
    fixture.componentRef.setInput('steps', STEPS);
    fixture.componentRef.setInput('explanation', 'Because that is how it flows.');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    const shown = () => Array.from(root.querySelectorAll('[data-testid="order-text"]')).map((e) => e.textContent?.trim());
    const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    /** Moves steps with the real buttons until the list matches `target`. */
    const arrange = (target: string[]) => {
      for (let position = 0; position < target.length; position++) {
        let at = shown().indexOf(target[position]);
        while (at > position) {
          click(`order-up-${at}`);
          at--;
        }
      }
    };
    return { root, click, shown, text, arrange };
  }

  it('starts with all the steps shuffled and no result', () => {
    const { root, shown } = setup();

    expect([...shown()].sort()).toEqual([...STEPS].sort());
    expect(shown()).not.toEqual(STEPS);
    expect(root.querySelector('[data-testid="order-result"]')).toBeNull();
  });

  it('moves a step up and down with the arrow buttons', () => {
    const { click, shown } = setup();
    const before = shown();

    click('order-down-0');
    expect(shown()).toEqual([before[1], before[0], before[2], before[3]]);

    click('order-up-1');
    expect(shown()).toEqual(before);
  });

  it('ignores a move off either end of the list', () => {
    const { click, shown } = setup();
    const before = shown();

    click('order-up-0');
    click('order-down-3');

    expect(shown()).toEqual(before);
  });

  it('says how many steps are in the right place without giving the answer away', () => {
    const { click, text, shown } = setup();

    click('order-check');

    expect(text('order-result')).toMatch(/^\d of 4 steps are in the right place\./);
    expect(text('order-result')).not.toContain('Because that is how it flows.');
    expect(shown()).not.toEqual(STEPS);
  });

  it('confirms and explains once the order is right', () => {
    const { click, text, arrange, shown } = setup();

    arrange(STEPS);
    click('order-check');

    expect(shown()).toEqual(STEPS);
    expect(text('order-result')).toContain('That is the right order.');
    expect(text('order-result')).toContain('Because that is how it flows.');
  });

  it('clears the result when a step is moved after checking', () => {
    const { root, click } = setup();
    click('order-check');

    click('order-down-0');

    expect(root.querySelector('[data-testid="order-result"]')).toBeNull();
  });

  it('goes back to the starting order on Start over', () => {
    const { click, shown } = setup();
    const start = shown();
    click('order-down-0');
    click('order-down-1');

    click('order-reset');

    expect(shown()).toEqual(start);
  });
});
