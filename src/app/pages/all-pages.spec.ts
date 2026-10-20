import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FIRE_CONFETTI } from '../core/services/gamification.service';
import { auditAccessibility } from '../testing/a11y-audit';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { JourneyComponent } from './journey/journey.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsComponent } from './products/products.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import type { Type } from '@angular/core';

const PAGES: [string, Type<unknown>][] = [
  ['home', HomeComponent],
  ['dashboard', DashboardComponent],
  ['journey', JourneyComponent],
  ['history', HistoryComponent],
  ['bookmarks', BookmarksComponent],
  ['watchlist', WatchlistComponent],
  ['favorites', FavoritesComponent],
  ['demo browse', ProductsComponent],
  ['feedback', FeedbackComponent],
  ['not found', NotFoundComponent],
];

/** The same quiet-mistake audit as the lessons, for the rest of the app, with and without saved progress. */
describe('every other page', () => {
  const states: [string, () => void][] = [
    ['a brand-new learner', () => localStorage.clear()],
    [
      'a learner with progress',
      () => {
        localStorage.clear();
        const day = new Date();
        const today = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        localStorage.setItem('angular-lab:profile', JSON.stringify({ version: 1, name: 'Youssef', createdAt: day.toISOString(), onboardingDone: true, tourDone: true, activeDays: [today] }));
        const done = (n: number) => ({ sectionsDone: Array.from({ length: n }, (_, i) => `s${i}`), attempts: [] });
        localStorage.setItem(
          'angular-lab:progress',
          JSON.stringify({
            version: 2,
            topics: { binding: done(4), pipes: done(2) },
            activity: [
              { at: day.toISOString(), kind: 'section-done', topicId: 'binding', sectionId: 'interpolation' },
              { at: day.toISOString(), kind: 'quiz-passed', topicId: 'pipes', score: 5 },
            ],
          }),
        );
        localStorage.setItem('angular-lab:bookmarks', JSON.stringify([{ topicId: 'rxjs', sectionId: 'subjects', at: day.toISOString() }]));
      },
    ],
  ];

  for (const [stateName, seed] of states) {
    for (const [name, component] of PAGES) {
      it(`${name} is accessible for ${stateName}`, () => {
        seed();
        TestBed.configureTestingModule({
          providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), { provide: FIRE_CONFETTI, useValue: () => undefined }],
        });
        const fixture = TestBed.createComponent(component);
        fixture.detectChanges();
        const root: HTMLElement = fixture.nativeElement;

        expect(root.textContent?.trim().length ?? 0).withContext('page has content').toBeGreaterThan(20);
        expect(auditAccessibility(root)).withContext('accessibility problems').toEqual([]);
      });
    }
  }

  afterEach(() => localStorage.clear());
});
