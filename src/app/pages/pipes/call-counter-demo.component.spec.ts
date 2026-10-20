import { TestBed } from '@angular/core/testing';

import { CallCounterDemoComponent } from './call-counter-demo.component';

describe('CallCounterDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(CallCounterDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (id: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
      fixture.detectChanges();
    };
    const num = (id: string) => Number(root.querySelector(`[data-testid="${id}"]`)!.textContent);
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.trim();
    /** Zero the counters after the first render, so each test measures only what it did. */
    const baseline = () => click('reset-counts');
    return { click, num, text, baseline };
  }

  it('shows the same text from the method and from the pipe', () => {
    const { text } = setup();

    expect(text('by-method')).toBe('CASTLE IN THE SKY!');
    expect(text('by-pipe')).toBe('CASTLE IN THE SKY!');
  });

  it('runs the method again on every re-render but not the pure pipe', () => {
    const { click, num, baseline } = setup();
    baseline();

    for (let i = 0; i < 5; i++) {
      click('rerender');
    }
    click('show-counts');

    expect(num('count-method')).toBeGreaterThanOrEqual(5);
    expect(num('count-pipe')).toBe(0);
  });

  it('runs the pipe again when its input really changes', () => {
    const { click, num, text, baseline } = setup();
    baseline();

    click('rename');
    click('show-counts');

    expect(num('count-pipe')).toBe(1);
    expect(text('by-pipe')).toBe('MY NEIGHBOR TOTORO!');
  });

  it('starts counting from zero again after Reset', () => {
    const { click, num } = setup();
    click('rerender');

    click('reset-counts');

    expect(num('count-method')).toBe(0);
    expect(num('count-pipe')).toBe(0);
  });
});
