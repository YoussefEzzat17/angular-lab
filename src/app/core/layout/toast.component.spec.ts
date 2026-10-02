import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { TOAST_LEAVE_MS, ToastService } from '../services/toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(ToastComponent);
    const toast = TestBed.inject(ToastService);
    const root: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    return { fixture, toast, root, cards: () => Array.from(root.querySelectorAll<HTMLElement>('.toast')) };
  }

  it('renders nothing while there are no toasts', () => {
    const { cards } = setup();
    expect(cards().length).toBe(0);
  });

  it('shows the title, the optional description, and a matching icon', fakeAsync(() => {
    const { fixture, toast, cards } = setup();
    toast.success('Feedback sent', 'It landed in my inbox.');
    toast.info('Just so you know');
    fixture.detectChanges();

    const [withDescription, titleOnly] = cards();
    expect(withDescription.textContent).toContain('Feedback sent');
    expect(withDescription.textContent).toContain('It landed in my inbox.');
    expect(titleOnly.textContent).toContain('Just so you know');
    expect(titleOnly.querySelectorAll('p').length).toBe(1);
    expect(withDescription.querySelector('svg')).not.toBeNull();
    flush();
  }));

  it('announces errors assertively and everything else politely', fakeAsync(() => {
    const { fixture, toast, cards } = setup();
    toast.success('ok');
    toast.error('bad');
    toast.info('fyi');
    fixture.detectChanges();

    expect(cards().map((c) => c.getAttribute('role'))).toEqual(['status', 'alert', 'status']);
    flush();
  }));

  it('closes with the X button, after the exit animation', fakeAsync(() => {
    const { fixture, toast, cards } = setup();
    toast.error('Something broke');
    fixture.detectChanges();

    (cards()[0].querySelector('button[aria-label="Dismiss notification"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cards()[0].classList).toContain('toast-leave');

    tick(TOAST_LEAVE_MS);
    fixture.detectChanges();
    expect(cards().length).toBe(0);
    flush();
  }));

  it('pauses the progress bar while hovered and resumes when the pointer leaves', fakeAsync(() => {
    const { fixture, toast, cards } = setup();
    toast.success('Hover me');
    fixture.detectChanges();
    const bar = () => cards()[0].querySelector<HTMLElement>('.toast-bar')!;

    expect(bar().style.animationPlayState).toBe('running');

    cards()[0].dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(bar().style.animationPlayState).toBe('paused');

    cards()[0].dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(bar().style.animationPlayState).toBe('running');
    flush();
  }));
});
