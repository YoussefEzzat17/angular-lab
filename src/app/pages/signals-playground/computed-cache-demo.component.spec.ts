import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedCacheDemoComponent } from './computed-cache-demo.component';

describe('ComputedCacheDemoComponent', () => {
  let fixture: ComponentFixture<ComputedCacheDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputedCacheDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('runs once on the first read', () => {
    expect(text('cache-total')).toBe('10');
    expect(text('cache-runs')).toBe('1');
  });

  it('runs again when a signal it read changes', () => {
    click('cache-qty-up');

    expect(text('cache-total')).toBe('20');
    expect(text('cache-runs')).toBe('2');
  });

  it('does not run again when an unrelated signal changes', () => {
    click('cache-note-change');

    expect(text('cache-note')).toBe('note number 2');
    expect(text('cache-runs')).toBe('1');
  });

  it('does not run while nothing reads it', () => {
    click('cache-show');

    click('cache-price-up');
    click('cache-price-up');

    expect(text('cache-runs')).toBe('1');
  });

  it('catches up with a single run when it is read again after several changes', () => {
    click('cache-show');
    click('cache-price-up');
    click('cache-qty-up');

    click('cache-show');

    expect(text('cache-total')).toBe('22');
    expect(text('cache-runs')).toBe('2');
  });
});
