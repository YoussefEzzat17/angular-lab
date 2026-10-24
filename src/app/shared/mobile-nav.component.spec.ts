import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SidebarStateService } from '../core/services/sidebar-state.service';
import { MobileNavComponent } from './mobile-nav.component';

describe('MobileNavComponent', () => {
  async function setup(url: string) {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
    await TestBed.inject(Router).navigateByUrl(url);
    const fixture = TestBed.createComponent(MobileNavComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const tab = (label: string) => root.querySelector(`[aria-label="${label}"]`) as HTMLElement;
    const active = () =>
      Array.from(root.querySelectorAll('a, button'))
        .filter((el) => el.className.includes('text-gold-400'))
        .map((el) => el.getAttribute('aria-label'));
    return { fixture, root, tab, active };
  }

  afterEach(() => localStorage.clear());

  it('shows Home, Topics, Journey, Dashboard and Saved in that order', async () => {
    const { root } = await setup('/');

    const labels = Array.from(root.querySelectorAll('a, button')).map((el) => el.getAttribute('aria-label'));

    expect(labels).toEqual(['Home', 'Topics', 'Journey', 'Dashboard', 'Saved']);
  });

  it('highlights only Home on the home page', async () => {
    expect((await setup('/')).active()).toEqual(['Home']);
  });

  it('highlights Journey on /journey', async () => {
    expect((await setup('/journey')).active()).toEqual(['Journey']);
  });

  it('highlights Dashboard on /dashboard, ignoring a query string', async () => {
    expect((await setup('/dashboard?tab=1')).active()).toEqual(['Dashboard']);
  });

  it('highlights nothing for a page that has no tab, such as a lesson', async () => {
    expect((await setup('/learn/binding/interpolation')).active()).toEqual([]);
  });

  it('opens the topics sheet and highlights Topics while it is open', async () => {
    const { fixture, tab, active } = await setup('/learn/binding');

    tab('Topics').click();
    fixture.detectChanges();

    expect(TestBed.inject(SidebarStateService).drawerOpen()).toBeTrue();
    expect(active()).toEqual(['Topics']);
  });
});
