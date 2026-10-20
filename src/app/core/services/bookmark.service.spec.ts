import { TestBed } from '@angular/core/testing';

import { BookmarkService } from './bookmark.service';

describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(BookmarkService);
  });

  afterEach(() => localStorage.clear());

  it('starts empty', () => {
    expect(service.count()).toBe(0);
    expect(service.all()).toEqual([]);
    expect(service.isBookmarked('binding', 'interpolation')).toBeFalse();
  });

  it('saves a section on the first toggle and removes it on the second', () => {
    service.toggle('binding', 'interpolation');
    expect(service.isBookmarked('binding', 'interpolation')).toBeTrue();
    expect(service.count()).toBe(1);

    service.toggle('binding', 'interpolation');
    expect(service.isBookmarked('binding', 'interpolation')).toBeFalse();
    expect(service.count()).toBe(0);
  });

  it('tells the same section id in two different topics apart', () => {
    service.toggle('binding', 'try-it');

    expect(service.isBookmarked('binding', 'try-it')).toBeTrue();
    expect(service.isBookmarked('pipes', 'try-it')).toBeFalse();
  });

  it('records when a section was saved', () => {
    service.toggle('rxjs', 'subjects');

    expect(new Date(service.all()[0].at).getTime()).not.toBeNaN();
  });

  it('removes only the section asked for', () => {
    service.toggle('binding', 'interpolation');
    service.toggle('binding', 'two-way');

    service.remove('binding', 'interpolation');

    expect(service.all().map((b) => b.sectionId)).toEqual(['two-way']);
  });

  it('ignores removing something that was never saved', () => {
    service.toggle('binding', 'interpolation');

    service.remove('pipes', 'builtin');

    expect(service.count()).toBe(1);
  });

  it('keeps the saved sections across a reload', () => {
    service.toggle('binding', 'interpolation');

    TestBed.resetTestingModule();
    const reloaded = TestBed.inject(BookmarkService);

    expect(reloaded.isBookmarked('binding', 'interpolation')).toBeTrue();
  });

  it('starts empty if the stored data is damaged', () => {
    localStorage.setItem('angular-lab:bookmarks', '{not json');

    TestBed.resetTestingModule();

    expect(TestBed.inject(BookmarkService).count()).toBe(0);
  });
});
