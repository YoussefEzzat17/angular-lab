import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { FlattenDemoComponent, REQUEST_MS } from './flatten-demo.component';

describe('FlattenDemoComponent', () => {
  let fixture: ComponentFixture<FlattenDemoComponent>;
  let root: HTMLElement;

  const click = (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
    fixture.detectChanges();
  };
  const status = (id: number) => root.querySelector(`[data-testid="lane-status-${id}"]`)?.textContent?.trim();
  const answers = () => root.querySelector('[data-testid="flatten-results"] strong')?.textContent?.trim();
  const wait = (ms: number) => {
    tick(ms);
    fixture.detectChanges();
  };
  const sendThree = () => {
    click('send-request');
    click('send-request');
    click('send-request');
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(FlattenDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('switchMap cancels earlier requests and only answers the latest one', fakeAsync(() => {
    sendThree();

    expect(status(1)).toBe('✕ cancelled');
    expect(status(2)).toBe('✕ cancelled');
    expect(status(3)).toBe('running…');

    wait(REQUEST_MS);

    expect(status(3)).toBe('✓ answered');
    expect(answers()).toBe('#3');
    flush();
  }));

  it('mergeMap runs every request at once and answers all of them', fakeAsync(() => {
    click('mode-mergeMap');
    sendThree();

    expect(status(1)).toBe('running…');
    expect(status(2)).toBe('running…');
    expect(status(3)).toBe('running…');

    wait(REQUEST_MS);

    expect(answers()).toBe('#1, #2, #3');
    flush();
  }));

  it('concatMap queues requests and answers them one after another, in order', fakeAsync(() => {
    click('mode-concatMap');
    sendThree();

    expect(status(1)).toBe('running…');
    expect(status(2)).toBe('waiting in line');

    wait(REQUEST_MS);
    expect(answers()).toBe('#1');
    expect(status(2)).toBe('running…');

    wait(REQUEST_MS * 2);
    expect(answers()).toBe('#1, #2, #3');
    flush();
  }));

  it('clears the lanes and the answers when the operator changes', fakeAsync(() => {
    sendThree();
    wait(REQUEST_MS);

    click('mode-mergeMap');

    expect(root.querySelectorAll('[data-testid^="lane-status-"]').length).toBe(0);
    expect(answers()).toBe('—');
    flush();
  }));
});
