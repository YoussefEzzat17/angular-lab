import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GROUPED_TOPICS, TOPIC_GROUPS } from '../../core/data/topics';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

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
    expect(labels).toEqual(['Home', 'Topics', 'Journey', 'Dashboard', 'Saved']);
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

  it('collapses to one clear entry per curriculum group, each opening the sidebar on that group', () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const state = TestBed.inject(SidebarStateService);
    state.collapsed.set(true);
    const fixture = TestBed.createComponent(LearnLayoutComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    const rail = root.querySelector('nav[aria-label="Collapsed sidebar"]')!;
    const groups = Array.from(rail.querySelectorAll<HTMLButtonElement>('ul button'));
    expect(groups.length).toBe(TOPIC_GROUPS.length);
    expect(groups[0].getAttribute('aria-label')).toBe(`${TOPIC_GROUPS[0].title}: 0 of ${GROUPED_TOPICS[0].topics.length} topics completed. Opens the sidebar.`);
    expect(rail.querySelectorAll('a').length).toBe(0);

    groups[2].click();
    fixture.detectChanges();
    expect(state.collapsed()).toBeFalse();
    expect(state.expandedGroups().has(TOPIC_GROUPS[2].id)).toBeTrue();
  });

  it('offers a skip link as the first stop, which moves focus to the main content', () => {
    const root = setup();

    const skip = root.querySelector<HTMLAnchorElement>('[data-testid="skip-link"]')!;
    // First in the page shell (the first-visit dialog, when shown, sits outside it and traps focus on its own).
    expect(root.querySelector('.h-screen')!.querySelector('a, button')).toBe(skip);
    skip.click();
    expect(document.activeElement).toBe(root.querySelector('#learn-main'));
  });
});
