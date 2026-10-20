import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropDemoComponent } from './interop-demo.component';

describe('InteropDemoComponent', () => {
  let fixture: ComponentFixture<InteropDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(InteropDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('shows the initial value before the stream has emitted', () => {
    expect(text('stream-latest')).toBe('0');
  });

  it('keeps only the latest value of the stream', () => {
    click('stream-next');
    click('stream-next');

    expect(text('stream-latest')).toBe('2');
  });

  it('emits once for a single change', () => {
    click('signal-one');

    expect(text('signal-emissions')).toBe('1');
  });

  it('emits only the final value after a burst of changes', () => {
    click('signal-burst');

    expect(text('signal-value')).toBe('3');
    expect(text('signal-emissions')).toBe('3');
  });
});
