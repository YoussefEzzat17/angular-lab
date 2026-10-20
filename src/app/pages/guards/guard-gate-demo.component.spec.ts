import { TestBed } from '@angular/core/testing';

import { DESTINATIONS, GuardGateDemoComponent, VISITORS, openGate } from './guard-gate-demo.component';

describe('openGate', () => {
  it('lets everyone into a page with no guard', () => {
    for (const v of VISITORS) {
      const result = openGate(v.id, 'home');
      expect(result.outcome).withContext(v.id).toBe('allow');
      expect(result.guard).toBeNull();
    }
  });

  it('redirects a guest from the members page with a UrlTree', () => {
    const result = openGate('guest', 'members');

    expect(result.outcome).toBe('redirect');
    expect(result.returned).toContain('createUrlTree');
    expect(result.guard).toBe('membersGuard');
  });

  it('lets a member and an admin into the members page', () => {
    expect(openGate('member', 'members').outcome).toBe('allow');
    expect(openGate('admin', 'members').outcome).toBe('allow');
  });

  it('redirects a guest from the admin page, but only cancels for a member', () => {
    expect(openGate('guest', 'admin').outcome).toBe('redirect');

    const member = openGate('member', 'admin');
    expect(member.outcome).toBe('cancel');
    expect(member.returned).toBe('false');
  });

  it('lets an admin into the admin page', () => {
    expect(openGate('admin', 'admin')).toEqual(jasmine.objectContaining({ outcome: 'allow', returned: 'true' }));
  });

  it('always starts by matching the route and names the guard it runs', () => {
    for (const d of DESTINATIONS) {
      const result = openGate('guest', d.id);
      expect(result.steps[0]).toBe(`The router matches ${d.path}`);
    }
    expect(openGate('guest', 'admin').steps.join(' ')).toContain('adminGuard()');
  });
});

describe('GuardGateDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(GuardGateDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (id: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)?.click();
      fixture.detectChanges();
    };
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    return { root, click, text };
  }

  it('starts with a guest opening the members page, which is redirected', () => {
    const { text } = setup();

    expect(text('gate-outcome')).toBe('↪ Redirected');
    expect(text('gate-message')).toContain('/login');
  });

  it('shows a member being cancelled on the admin page', () => {
    const { click, text } = setup();

    click('visitor-member');
    click('dest-admin');

    expect(text('gate-outcome')).toBe('✕ Cancelled');
    expect(text('gate-returned')).toBe('false');
  });

  it('shows an admin getting in, and lists the steps the router took', () => {
    const { root, click, text } = setup();

    click('visitor-admin');
    click('dest-admin');

    expect(text('gate-outcome')).toBe('✓ Allowed');
    expect(root.querySelectorAll('[data-testid="gate-steps"] li').length).toBe(4);
  });

  it('shows the code of the guard that ran for the chosen page', () => {
    const { root, click } = setup();

    click('dest-admin');

    expect(root.querySelector('pre')?.textContent).toContain('adminGuard');
  });
});
