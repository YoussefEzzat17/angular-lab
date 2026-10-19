import { TestBed } from '@angular/core/testing';

import { ProfileService } from '../services/profile.service';
import { OnboardingDialogComponent } from './onboarding-dialog.component';

describe('OnboardingDialogComponent', () => {
  function setup() {
    localStorage.clear();
    const fixture = TestBed.createComponent(OnboardingDialogComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('#onboarding-name')!;
    const type = (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const button = (label: string) =>
      Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.includes(label)) as HTMLButtonElement;
    return { fixture, input, type, button, profile: TestBed.inject(ProfileService) };
  }

  afterEach(() => localStorage.clear());

  it('saves the typed name and finishes onboarding when the user starts', () => {
    const { type, button, profile, fixture } = setup();
    let closed = 0;
    fixture.componentInstance.closed.subscribe(() => closed++);

    type('Youssef Ezzat');
    button('Start Learning').click();

    expect(profile.name()).toBe('Youssef Ezzat');
    expect(profile.onboardingDone()).toBeTrue();
    expect(closed).toBe(1);
  });

  it('keeps the name empty when the user skips', () => {
    const { type, button, profile } = setup();

    type('Someone');
    button('Skip for now').click();

    expect(profile.name()).toBe('');
    expect(profile.onboardingDone()).toBeTrue();
  });

  it('ignores a name that is only spaces', () => {
    const { type, button, profile } = setup();

    type('   ');
    button('Start Learning').click();

    expect(profile.name()).toBe('');
  });
});
