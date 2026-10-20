import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TOPICS } from '../core/data/topics';
import { TOPIC_LOADERS } from '../learn/learn.routes';
import { auditAccessibility } from '../testing/a11y-audit';
import type { Type } from '@angular/core';

/**
 * Renders every section of every lesson and checks the things that go wrong quietly:
 * a page that throws, a dead button, controls a screen reader cannot name, duplicate ids.
 */
describe('every lesson section', () => {
  for (const topic of TOPICS) {
    for (const section of topic.sections) {
      it(`${topic.id} / ${section.id} renders cleanly`, async () => {
        localStorage.clear();
        TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
        const component = (await TOPIC_LOADERS[topic.id]()) as Type<unknown>;
        const fixture = TestBed.createComponent(component);
        fixture.componentRef.setInput('section', section.id);
        fixture.detectChanges();
        const root: HTMLElement = fixture.nativeElement;

        expect(root.textContent?.trim().length ?? 0).withContext('page has content').toBeGreaterThan(40);

        // The lesson player and the quiz own completion now: no leftover manual "Mark as Complete".
        expect(root.textContent).withContext('dead complete button').not.toContain('Mark as Complete');

        // The knowledge check closes a section, so it must be the last thing in it.
        const check = root.querySelector('app-knowledge-check');
        if (check) {
          const container = check.parentElement!;
          expect(container.lastElementChild).withContext('knowledge check is last').toBe(check);
        }

        expect(auditAccessibility(root)).withContext('accessibility problems').toEqual([]);
      });
    }
  }
});
