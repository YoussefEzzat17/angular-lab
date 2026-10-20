import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { ColdObservableDemoComponent, REQUEST_MS, createFilmsSource } from './cold-observable-demo.component';

describe('createFilmsSource', () => {
  it('does nothing until it is subscribed to', () => {
    let calls = 0;

    createFilmsSource(() => calls++, false);

    expect(calls).toBe(0);
  });

  it('starts a new request for every subscriber when it is not shared', fakeAsync(() => {
    let calls = 0;
    const source = createFilmsSource(() => calls++, false);

    source.subscribe();
    source.subscribe();
    tick(REQUEST_MS);

    expect(calls).toBe(2);
    flush();
  }));

  it('makes one request for any number of subscribers when it is shared', fakeAsync(() => {
    let calls = 0;
    const source = createFilmsSource(() => calls++, true);

    source.subscribe();
    source.subscribe();
    tick(REQUEST_MS);
    source.subscribe();

    expect(calls).toBe(1);
    flush();
  }));

  it('replays the answer to a subscriber that arrives after it came back', fakeAsync(() => {
    const source = createFilmsSource(() => undefined, true);
    source.subscribe();
    tick(REQUEST_MS);
    let late: string[] | undefined;

    source.subscribe((films) => (late = films));

    expect(late?.length).toBe(3);
    flush();
  }));
});

describe('ColdObservableDemoComponent', () => {
  let fixture: ComponentFixture<ColdObservableDemoComponent>;
  let root: HTMLElement;
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const settle = () => {
    tick(REQUEST_MS);
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdObservableDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('starts with no network calls', () => {
    expect(text('network-calls')).toBe('0');
    expect(text('got-A')).toBe('Nothing yet');
  });

  it('makes one network call per subscriber with a plain request', fakeAsync(() => {
    click('subscribe-A');
    click('subscribe-B');
    settle();

    expect(text('network-calls')).toBe('2');
    expect(text('got-A')).toBe('Got 3 films');
    expect(text('got-B')).toBe('Got 3 films');
    flush();
  }));

  it('makes a single network call for both subscribers once the result is shared', fakeAsync(() => {
    click('mode-shared');

    click('subscribe-A');
    click('subscribe-B');
    settle();

    expect(text('network-calls')).toBe('1');
    expect(text('got-B')).toBe('Got 3 films');
    expect(text('cold-note')).toContain('reused the first request');
    flush();
  }));

  it('starts over when the mode changes or on Reset', fakeAsync(() => {
    click('subscribe-A');
    settle();

    click('cold-reset');

    expect(text('network-calls')).toBe('0');
    expect(text('got-A')).toBe('Nothing yet');
    flush();
  }));
});
