import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LearnLayoutComponent } from './learn-layout.component';

describe('LearnLayoutComponent', () => {
  function setup() {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(LearnLayoutComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => localStorage.clear());

  it('has one mobile bottom bar with Home, Topics, Journey, Dashboard and Saved', () => {
    const root = setup();

    const bars = root.querySelectorAll('nav[aria-label="Main navigation"]');
    const labels = Array.from(bars[0].querySelectorAll('a, button')).map((el) => el.getAttribute('aria-label'));

    expect(bars.length).toBe(1);
    expect(labels).toEqual(['Home', 'Topics', 'Journey', 'Dashboard', 'Bookmarks']);
  });

  it('links Journey and Dashboard from the bottom bar, and no longer has a Demo tab', () => {
    const root = setup();
    const bar = root.querySelector('nav[aria-label="Main navigation"]')!;

    expect(bar.querySelector('a[href="/journey"]')).not.toBeNull();
    expect(bar.querySelector('a[href="/dashboard"]')).not.toBeNull();
    expect(bar.querySelector('a[href="/products"]')).toBeNull();
  });

  it('no longer lists the Demo App links in the sidebar', () => {
    const root = setup();

    expect(root.textContent).not.toContain('Browse titles');
    expect(root.textContent).not.toContain('My List');
  });
});
