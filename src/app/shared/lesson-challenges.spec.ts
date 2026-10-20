import { BindingComponent } from '../pages/binding/binding.component';
import { RoutingComponent } from '../pages/routing/routing.component';
import { RxjsComponent } from '../pages/rxjs/rxjs.component';
import { SignalsPlaygroundComponent } from '../pages/signals-playground/signals-playground.component';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { PredictChallenge } from './predict-output.component';

/** The right answer must exist, and must not always sit in the same place, or learners just guess "the first one". */
describe('predict-the-output challenges in the lessons', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  const challenges = (): Record<string, PredictChallenge> => ({
    binding: TestBed.createComponent(BindingComponent).componentInstance.interpolationChallenge,
    signals: TestBed.createComponent(SignalsPlaygroundComponent).componentInstance.computedChallenge,
    rxjs: TestBed.createComponent(RxjsComponent).componentInstance.behaviorChallenge,
    routing: TestBed.createComponent(RoutingComponent).componentInstance.navigateChallenge,
  });

  it('has the correct option listed among the options, with unique ids', () => {
    for (const [name, challenge] of Object.entries(challenges())) {
      const ids = challenge.options.map((o) => o.id);
      expect(ids).withContext(name).toContain(challenge.correct);
      expect(new Set(ids).size).withContext(name).toBe(ids.length);
    }
  });

  it('never puts the right answer first', () => {
    for (const [name, challenge] of Object.entries(challenges())) {
      expect(challenge.options[0].id).withContext(name).not.toBe(challenge.correct);
    }
  });

  it('does not put the right answer in the same place every time', () => {
    const positions = Object.values(challenges()).map((c) => c.options.findIndex((o) => o.id === c.correct));

    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});
