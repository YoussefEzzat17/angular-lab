import { TestBed } from '@angular/core/testing';

import { ROUTES, RouteMatcherDemoComponent, matchRoute } from './route-matcher-demo.component';

describe('matchRoute', () => {
  it('matches the empty URL with the redirect', () => {
    const result = matchRoute('/', ROUTES);

    expect(result.route?.redirectTo).toBe('dashboard');
    expect(result.redirectedTo).toBe('/dashboard');
  });

  it('matches a static route', () => {
    expect(matchRoute('/dashboard', ROUTES).route?.component).toBe('DashboardComponent');
    expect(matchRoute('/products', ROUTES).route?.component).toBe('ProductsComponent');
  });

  it('captures a route parameter and does not let the shorter route swallow the longer URL', () => {
    const result = matchRoute('/products/42', ROUTES);

    expect(result.route?.component).toBe('ProductDetailComponent');
    expect(result.params).toEqual({ id: '42' });
  });

  it('reads query parameters and keeps them out of the route match', () => {
    const result = matchRoute('/products/42?tab=reviews&page=2', ROUTES);

    expect(result.query).toEqual({ tab: 'reviews', page: '2' });
    expect(result.route?.component).toBe('ProductDetailComponent');
  });

  it('falls through to the wildcard for an unknown URL', () => {
    const result = matchRoute('/settings', ROUTES);

    expect(result.route?.component).toBe('NotFoundComponent');
    expect(result.checks).toEqual(['skipped', 'skipped', 'skipped', 'skipped', 'matched']);
  });

  it('stops at the first match and never checks the rest', () => {
    const result = matchRoute('/dashboard', ROUTES);

    expect(result.checks).toEqual(['skipped', 'matched', 'not-reached', 'not-reached', 'not-reached']);
  });

  it('lets a wildcard placed first catch every URL', () => {
    const wildcard = ROUTES.find((r) => r.path === '**')!;
    const wrongOrder = [wildcard, ...ROUTES.filter((r) => r !== wildcard)];

    for (const url of ['/dashboard', '/products/42', '/']) {
      expect(matchRoute(url, wrongOrder).route?.component).withContext(url).toBe('NotFoundComponent');
    }
  });

  it('reports no match when there is no wildcard', () => {
    const result = matchRoute('/nope', ROUTES.filter((r) => r.path !== '**'));

    expect(result.route).toBeNull();
    expect(result.index).toBe(-1);
  });

  it('decodes encoded characters in a parameter', () => {
    expect(matchRoute('/products/a%20b', ROUTES).params).toEqual({ id: 'a b' });
  });
});

describe('RouteMatcherDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(RouteMatcherDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    const click = (id: string) => {
      root.querySelector<HTMLElement>(`[data-testid="${id}"]`)!.click();
      fixture.detectChanges();
    };
    const type = (value: string) => {
      const input = root.querySelector<HTMLInputElement>('[data-testid="matcher-url"]')!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { text, click, type };
  }

  it('starts with a product URL that captures an id and a query', () => {
    const { text } = setup();

    expect(text('matcher-result')).toContain('ProductDetailComponent');
    expect(text('matcher-params')).toBe('{"id":"42"}');
    expect(text('matcher-query')).toBe('{"tab":"reviews"}');
  });

  it('updates as the URL is typed', () => {
    const { text, type } = setup();

    type('/dashboard');

    expect(text('matcher-result')).toContain('DashboardComponent');
    expect(text('route-state-1')).toBe('✓ matches, the search stops');
    expect(text('route-state-2')).toBe('never checked');
  });

  it('jumps to an example URL', () => {
    const { text, click } = setup();

    click('example-/settings');

    expect(text('matcher-result')).toContain('NotFoundComponent');
  });

  it('shows the redirect for the empty URL', () => {
    const { text, click } = setup();

    click('example-/');

    expect(text('matcher-result')).toContain('redirects to /dashboard');
  });

  it('makes everything land on NotFound when the wildcard is moved first', () => {
    const { text, click } = setup();

    click('wildcard-first');

    expect(text('matcher-result')).toContain('NotFoundComponent');
    expect(text('route-state-0')).toBe('✓ matches, the search stops');
  });
});
