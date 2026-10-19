import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TOPICS, topicMinutes } from '../../core/data/topics';
import { ProgressService } from '../../core/services/progress.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  function setup(seed?: (progress: ProgressService) => void) {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    seed?.(TestBed.inject(ProgressService));
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => localStorage.clear());

  it('shows the level and time on every topic card', () => {
    const root = setup();

    expect(root.textContent).toContain(`Beginner · ${topicMinutes(TOPICS[0])} min`);
  });

  it('no longer shows a Start here card', () => {
    const root = setup();

    expect(root.querySelector('[data-testid="start-here"]')).toBeNull();
  });

  it('makes the two hero buttons full width on a phone', () => {
    const root = setup();

    const buttons = Array.from(root.querySelectorAll('section a')).filter((a) =>
      ['Start Learning →', 'View Dashboard'].includes(a.textContent?.trim() ?? ''),
    );

    expect(buttons.length).toBe(2);
    for (const button of buttons) {
      expect(button.className).toContain('w-full');
      expect(button.className).toContain('sm:w-auto');
    }
  });
});
