import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileService } from '../services/profile.service';
import { TOUR_STEPS, TourComponent } from './tour.component';

describe('TourComponent', () => {
  let fixture: ComponentFixture<TourComponent>;
  let root: HTMLElement;
  let profile: ProfileService;

  function setup(state: { onboardingDone: boolean; tourDone?: boolean }) {
    localStorage.clear();
    localStorage.setItem(
      'angular-lab:profile',
      JSON.stringify({ version: 1, name: '', createdAt: new Date().toISOString(), onboardingDone: state.onboardingDone, tourDone: !!state.tourDone, activeDays: [] }),
    );
    fixture = TestBed.createComponent(TourComponent);
    profile = TestBed.inject(ProfileService);
    fixture.detectChanges();
    root = fixture.nativeElement;
  }

  const click = (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
    fixture.detectChanges();
  };
  const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();

  afterEach(() => localStorage.clear());

  it('waits until the name prompt is finished', () => {
    setup({ onboardingDone: false });

    expect(root.querySelector('[data-testid="tour"]')).toBeNull();
  });

  it('does not show again once it has been done', () => {
    setup({ onboardingDone: true, tourDone: true });

    expect(root.querySelector('[data-testid="tour"]')).toBeNull();
  });

  it('starts at step 1 and walks forward and back', () => {
    setup({ onboardingDone: true });

    expect(text('tour-progress')).toBe(`Quick tour · 1 of ${TOUR_STEPS.length}`);
    expect(root.querySelector('[data-testid="tour-back"]')).toBeNull();

    click('tour-next');
    expect(text('tour-title')).toContain(TOUR_STEPS[1].title);

    click('tour-back');
    expect(text('tour-title')).toContain(TOUR_STEPS[0].title);
  });

  it('marks the tour done and closes after the last step', () => {
    setup({ onboardingDone: true });

    for (let i = 0; i < TOUR_STEPS.length - 1; i++) {
      click('tour-next');
    }
    expect(text('tour-next')).toBe('Got it');
    click('tour-next');

    expect(profile.tourDone()).toBeTrue();
    expect(root.querySelector('[data-testid="tour"]')).toBeNull();
  });

  it('can be skipped at any step, with the button or Escape', () => {
    setup({ onboardingDone: true });
    click('tour-skip');
    expect(profile.tourDone()).toBeTrue();

    TestBed.resetTestingModule();
    setup({ onboardingDone: true });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(profile.tourDone()).toBeTrue();
  });
});
