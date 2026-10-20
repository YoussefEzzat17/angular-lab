import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleDemoComponent, parseMarble, runOperator } from './marble-demo.component';

const values = (marble: string, op: Parameters<typeof runOperator>[1]) => runOperator(marble, op).marbles.map((m) => m.value);

describe('parseMarble', () => {
  it('places each letter on its frame and finds the completion', () => {
    const t = parseMarble('a-b|');

    expect(t.marbles).toEqual([{ frame: 0, value: 1 }, { frame: 2, value: 2 }]);
    expect(t.complete).toBe(3);
  });
});

describe('runOperator', () => {
  const steady = 'a-b-c-d-e-|';

  it('map transforms each value at the same moment', () => {
    const out = runOperator(steady, 'map');

    expect(out.marbles.map((m) => m.value)).toEqual([10, 20, 30, 40, 50]);
    expect(out.marbles.map((m) => m.frame)).toEqual(parseMarble(steady).marbles.map((m) => m.frame));
  });

  it('filter keeps only the even values', () => {
    expect(values(steady, 'filter')).toEqual([2, 4]);
  });

  it('take completes right after the second value', () => {
    const out = runOperator(steady, 'take');

    expect(out.marbles.map((m) => m.value)).toEqual([1, 2]);
    expect(out.complete).toBe(out.marbles[1].frame);
  });

  it('scan emits the running total', () => {
    expect(values(steady, 'scan')).toEqual([1, 3, 6, 10, 15]);
  });

  it('debounceTime keeps only the value before a pause', () => {
    expect(values('a-b-c----d-e---|', 'debounce')).toEqual([3, 5]);
  });
});

describe('MarbleDemoComponent', () => {
  let fixture: ComponentFixture<MarbleDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const summary = () => root.querySelector('[data-testid="marble-summary"]')!.textContent?.replace(/\s+/g, ' ').trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(MarbleDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('starts with map on the steady stream', () => {
    expect(summary()).toBe('In: 1, 2, 3, 4, 5 · Out: 10, 20, 30, 40, 50');
  });

  it('shows what debounceTime drops after switching operator and input', () => {
    click('op-debounce');
    click('input-burst');

    expect(summary()).toBe('In: 1, 2, 3, 4, 5 · Out: 3, 5');
  });

  it('draws one marble per value on each timeline', () => {
    click('op-filter');

    expect(root.querySelectorAll('[data-testid="timeline-in"] span.rounded-full').length).toBe(5);
    expect(root.querySelectorAll('[data-testid="timeline-out"] span.rounded-full').length).toBe(2);
  });
});
