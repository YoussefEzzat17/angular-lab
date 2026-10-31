import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GROUPED_TOPICS, TOPICS } from '../data/topics';
import { LearningFacade } from './learning.facade';

describe('LearningFacade', () => {
  let facade: LearningFacade;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    facade = TestBed.inject(LearningFacade);
  });

  afterEach(() => localStorage.clear());

  describe('curriculum', () => {
    it('lists every group with its topics, all not started to begin with', () => {
      const groups = facade.groups();

      expect(groups.map((g) => g.id)).toEqual(GROUPED_TOPICS.map((g) => g.id));
      expect(groups.flatMap((g) => g.topics).length).toBe(TOPICS.length);
      expect(groups.flatMap((g) => g.topics).every((t) => t.status === 'not-started')).toBeTrue();
      expect(groups.every((g) => g.completedCount === 0)).toBeTrue();
    });

    it('marks a topic in progress after one section, and completed after a manual completion counts in its group', () => {
      facade.completeSection('binding', 'interpolation');
      const binding = facade.groups()[0].topics.find((t) => t.id === 'binding')!;
      expect(binding.status).toBe('in-progress');
      expect(binding.allSectionsDone).toBeFalse();
    });
  });

  describe('continue target', () => {
    it('starts at the first section of the first topic', () => {
      expect(facade.continueTarget()).toBe(`${TOPICS[0].path}/${TOPICS[0].sections[0].id}`);
    });

    it('returns to the last section the learner visited', () => {
      const first = TOPICS[0];
      facade.visitSection(first.id, first.sections[1].id);

      expect(facade.continueTarget()).toBe(`${first.path}/${first.sections[1].id}`);
    });
  });

  describe('actions', () => {
    it('remembers a visit and counts the day as active', () => {
      facade.visitSection('binding', 'interpolation');

      expect(facade.streak()).toBe(1);
    });

    it('records a finished section as activity, newest first', () => {
      facade.completeSection('binding', 'interpolation');
      facade.completeSection('binding', 'property-binding');

      const activity = facade.allActivity();

      expect(activity.length).toBe(2);
      expect(activity[0].sectionId).toBe('property-binding');
      expect(facade.recentActivity()[0].sectionId).toBe('property-binding');
    });

    it('saves and removes a bookmark', () => {
      facade.toggleBookmark('rxjs', 'subjects');
      expect(facade.bookmarkCount()).toBe(1);

      facade.toggleBookmark('rxjs', 'subjects');
      expect(facade.bookmarkCount()).toBe(0);
    });

    it('stores the name that was entered', () => {
      facade.setName('  Youssef  ');

      expect(facade.name()).toBe('Youssef');
      expect(facade.initials()).toBe('Y');
    });

    it('finishes the onboarding', () => {
      expect(facade.onboardingDone()).toBeFalse();

      facade.finishOnboarding();

      expect(facade.onboardingDone()).toBeTrue();
    });

    it('wipes progress and activity on reset', () => {
      facade.completeSection('binding', 'interpolation');

      facade.resetProgress();

      expect(facade.allActivity()).toEqual([]);
      expect(facade.groups()[0].topics[0].status).toBe('not-started');
    });
  });
});
