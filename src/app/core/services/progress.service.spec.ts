import { TestBed } from '@angular/core/testing';

import { TOPICS } from '../data/topics';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);
  });

  it('starts with nothing visited or completed', () => {
    expect(service.visitedCount()).toBe(0);
    expect(service.completedCount()).toBe(0);
    expect(service.percent()).toBe(0);
  });

  it('knows the total number of topics', () => {
    expect(service.totalCount).toBe(TOPICS.length);
  });

  it('marks a topic as visited', () => {
    service.markVisited('/binding');

    expect(service.isVisited('/binding')).toBe(true);
    expect(service.isVisited('/pipes')).toBe(false);
    expect(service.visitedCount()).toBe(1);
  });

  it('does not double-count the same topic visited twice', () => {
    service.markVisited('/binding');
    service.markVisited('/binding');

    expect(service.visitedCount()).toBe(1);
  });

  it('visiting a topic does not mark it completed', () => {
    service.markVisited('/binding');

    expect(service.isCompleted('/binding')).toBe(false);
    expect(service.completedCount()).toBe(0);
  });

  it('toggleCompleted marks a topic complete, and toggling again un-marks it', () => {
    service.toggleCompleted('/binding');
    expect(service.isCompleted('/binding')).toBe(true);
    expect(service.completedCount()).toBe(1);

    service.toggleCompleted('/binding');
    expect(service.isCompleted('/binding')).toBe(false);
    expect(service.completedCount()).toBe(0);
  });

  it('percent is based on completed topics, not just visited ones', () => {
    service.markVisited(TOPICS[0].path);
    service.markVisited(TOPICS[1].path);
    expect(service.percent()).toBe(0);

    service.toggleCompleted(TOPICS[0].path);
    const expected = Math.round((1 / TOPICS.length) * 100);
    expect(service.percent()).toBe(expected);
  });

  it('persists visited and completed across a fresh service instance (simulating a reload)', () => {
    service.markVisited('/signals');
    service.toggleCompleted('/binding');

    const fresh = new ProgressService();

    expect(fresh.isVisited('/signals')).toBe(true);
    expect(fresh.isCompleted('/binding')).toBe(true);
  });

  it('reset() clears both visited and completed progress', () => {
    service.markVisited('/binding');
    service.toggleCompleted('/binding');
    service.markVisited('/pipes');

    service.reset();

    expect(service.visitedCount()).toBe(0);
    expect(service.completedCount()).toBe(0);
    expect(service.isVisited('/binding')).toBe(false);
    expect(service.isCompleted('/binding')).toBe(false);
  });
});
