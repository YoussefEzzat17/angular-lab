import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SignalFormsComponent } from './signal-forms.component';

describe('SignalFormsComponent', () => {
  function setup(section: string) {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SignalFormsComponent);
    fixture.componentRef.setInput('section', section);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const type = (el: HTMLInputElement, value: string) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    return { fixture, root, type };
  }

  afterEach(() => localStorage.clear());

  it('keeps the model and the bound input in step', () => {
    const { root, type } = setup('why');
    const input = root.querySelector<HTMLInputElement>('input[type="text"]')!;

    expect(input.value).toBe('Ada');
    type(input, 'Grace');
    expect(root.textContent).toContain('whyModel().name = Grace');
  });

  it('lists the broken rules for an empty or short value, and none when the value is fine', () => {
    const { root, type } = setup('validation');
    const [email, password] = Array.from(root.querySelectorAll<HTMLInputElement>('app-code-output input'));
    // The code sample also contains these messages, so read only the live lists.
    const live = () => Array.from(root.querySelectorAll('app-code-output ul[aria-live]')).map((ul) => ul.textContent ?? '').join(' ');

    expect(live()).toContain('Enter your email');
    type(email, 'not-an-email');
    expect(live()).toContain('That does not look like an email address');
    type(email, 'ada@example.com');
    type(password, 'short');
    expect(live()).toContain('Use at least 8 characters');
    type(password, 'long-enough-password');
    expect(live()).not.toContain('Use at least 8 characters');
    expect(live()).not.toContain('Enter your email');
  });

  it('does not send an invalid sign-up, shows every error, then sends a valid one', fakeAsync(() => {
    const { fixture, root, type } = setup('try-it');
    const form = root.querySelector('form')!;

    form.dispatchEvent(new Event('submit', { cancelable: true }));
    tick(1000);
    fixture.detectChanges();
    expect(root.textContent).toContain('Enter your email');
    expect(root.textContent).toContain('Enter a password');
    expect(root.textContent).toContain('You must accept the terms');
    expect(root.textContent).toContain('Nothing sent yet.');

    type(root.querySelector<HTMLInputElement>('#su-email')!, 'ada@example.com');
    type(root.querySelector<HTMLInputElement>('#su-password')!, 'long-enough-password');
    const terms = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    terms.click();
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit', { cancelable: true }));
    tick(1000);
    fixture.detectChanges();
    expect(root.textContent).toContain('Account created for ada@example.com.');
  }));
});
