import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { LOAD_MS, ResourceDemoComponent } from './resource-demo.component';

describe('ResourceDemoComponent', () => {
  let fixture: ComponentFixture<ResourceDemoComponent>;
  let root: HTMLElement;

  const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const settle = (ms = 0) => {
    fixture.detectChanges();
    tick(ms);
    fixture.detectChanges();
  };
  const click = (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
    settle();
  };
  const logLines = () => Array.from(root.querySelectorAll('[data-testid="res-log"] li')).map((li) => li.textContent?.trim());

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDemoComponent);
    root = fixture.nativeElement;
  });

  it('starts loading the first user straight away', fakeAsync(() => {
    settle();

    expect(text('res-status')).toBe('loading');
    expect(text('res-loading')).toBe('true');
    expect(text('res-has-value')).toBe('false');
    expect(text('res-wait')).toBe('Loading…');
    flush();
  }));

  it('resolves with the user once the server answers', fakeAsync(() => {
    settle();

    settle(LOAD_MS);

    expect(text('res-status')).toBe('resolved');
    expect(text('res-loading')).toBe('false');
    expect(text('res-name')).toBe('Mona');
    expect(text('res-role')).toBe('Designer');
    flush();
  }));

  it('cancels the running request when the params change, and only the last one answers', fakeAsync(() => {
    settle();

    click('user-2');
    settle(LOAD_MS);

    expect(logLines()).toContain('Request for user 1 was cancelled');
    expect(logLines()).not.toContain('User 1 arrived');
    expect(text('res-name')).toBe('Ali');
    flush();
  }));

  it('does not report a cancellation for a request that had already finished', fakeAsync(() => {
    settle(LOAD_MS);

    click('user-2');
    settle(LOAD_MS);

    expect(logLines()).toContain('User 1 arrived');
    expect(logLines()).not.toContain('Request for user 1 was cancelled');
    expect(text('res-name')).toBe('Ali');
    flush();
  }));

  it('shows the error and says there is no value when the request fails', fakeAsync(() => {
    settle(LOAD_MS);
    click('res-fail');

    click('res-reload');
    settle(LOAD_MS);

    expect(text('res-status')).toBe('error');
    expect(text('res-error')).toContain('The server said no');
    expect(text('res-has-value')).toBe('false');
    flush();
  }));

  it('goes to "reloading" while a reload runs on a value it already has', fakeAsync(() => {
    settle(LOAD_MS);

    click('res-reload');

    expect(text('res-status')).toBe('reloading');
    expect(text('res-has-value')).toBe('true');
    settle(LOAD_MS);
    expect(text('res-status')).toBe('resolved');
    flush();
  }));

  it('switches to "local" when the value is edited by hand', fakeAsync(() => {
    settle(LOAD_MS);

    click('res-edit');

    expect(text('res-status')).toBe('local');
    expect(text('res-role')).toBe('Edited by you');
    flush();
  }));
});
