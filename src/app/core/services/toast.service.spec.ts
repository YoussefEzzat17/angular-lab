import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { TOAST_LEAVE_MS, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = TestBed.inject(ToastService);
  });

  it('show() keeps working as a quick success message and clears itself after its duration', fakeAsync(() => {
    service.show('Added to your watchlist');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toEqual(
      jasmine.objectContaining({ kind: 'success', title: 'Added to your watchlist', duration: 3000, leaving: false }),
    );

    tick(2999);
    expect(service.toasts()[0].leaving).toBeFalse();
    tick(1);
    expect(service.toasts()[0].leaving).toBeTrue();
    tick(TOAST_LEAVE_MS);
    expect(service.toasts().length).toBe(0);
  }));

  it('success / error / info set the kind and description, and errors linger longer', fakeAsync(() => {
    service.success('Saved', 'All good');
    service.error('Failed', 'Try again');
    service.info('FYI');

    const [success, error, info] = service.toasts();
    expect(success).toEqual(jasmine.objectContaining({ kind: 'success', title: 'Saved', description: 'All good' }));
    expect(error).toEqual(jasmine.objectContaining({ kind: 'error', title: 'Failed', description: 'Try again' }));
    expect(info).toEqual(jasmine.objectContaining({ kind: 'info', title: 'FYI', description: undefined }));
    expect(error.duration).toBeGreaterThan(success.duration);
    flush();
  }));

  it('stacks toasts but never shows more than three at once', fakeAsync(() => {
    ['a', 'b', 'c', 'd'].forEach((title) => service.info(title));

    expect(service.toasts().filter((t) => !t.leaving).map((t) => t.title)).toEqual(['b', 'c', 'd']);
    tick(TOAST_LEAVE_MS);
    expect(service.toasts().map((t) => t.title)).toEqual(['b', 'c', 'd']);
    flush();
  }));

  it('replaces an identical toast instead of stacking a copy', fakeAsync(() => {
    service.show('Added');
    service.show('Added');
    expect(service.toasts().length).toBe(1);
    flush();
  }));

  it('dismiss() plays the exit animation, then removes it and cancels the countdown', fakeAsync(() => {
    service.success('Hello');
    const { id } = service.toasts()[0];

    service.dismiss(id);
    expect(service.toasts()[0].leaving).toBeTrue();
    tick(TOAST_LEAVE_MS);
    expect(service.toasts().length).toBe(0);

    // nothing left over to fire later
    expect(() => flush()).not.toThrow();
    expect(service.toasts().length).toBe(0);
  }));

  it('pause() freezes the countdown and resume() carries on with the time that was left', fakeAsync(() => {
    service.success('Hover me', undefined, 1000);
    const { id } = service.toasts()[0];

    tick(400);
    service.pause(id);
    expect(service.toasts()[0].paused).toBeTrue();

    tick(5000);
    expect(service.toasts()[0].leaving).toBeFalse();

    service.resume(id);
    expect(service.toasts()[0].paused).toBeFalse();
    tick(599);
    expect(service.toasts()[0].leaving).toBeFalse();
    tick(1);
    expect(service.toasts()[0].leaving).toBeTrue();
    flush();
  }));
});
