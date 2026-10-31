import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CdTimerDemoComponent } from './change-detection.component';

describe('CdTimerDemoComponent', () => {
  it('shows a signal set by a timer, but keeps a plain field stale until an event inside the box', fakeAsync(() => {
    const fixture = TestBed.createComponent(CdTimerDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)!.textContent!.trim();
    const [plainButton, signalButton, nudge] = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));

    plainButton.click();
    fixture.detectChanges();
    tick(1100);
    fixture.detectChanges();
    expect(text('timer-plain')).toBe('not changed');

    nudge.click();
    fixture.detectChanges();
    expect(text('timer-plain')).toBe('changed!');

    signalButton.click();
    fixture.detectChanges();
    tick(1100);
    fixture.detectChanges();
    expect(text('timer-signal')).toBe('changed!');
  }));
});
