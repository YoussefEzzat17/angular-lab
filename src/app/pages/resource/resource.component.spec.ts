import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ResourceComponent } from './resource.component';

describe('ResourceComponent', () => {
  // The lesson player links its breadcrumbs and section tabs, so it needs a router.
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  function setup(section: string) {
    const fixture = TestBed.createComponent(ResourceComponent);
    fixture.componentRef.setInput('section', section);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lists the six statuses in the states section', () => {
    const root = setup('states');

    const statuses = Array.from(root.querySelectorAll('tbody td:first-child')).map((td) => td.textContent?.trim());

    expect(statuses).toEqual(['idle', 'loading', 'reloading', 'resolved', 'error', 'local']);
  });

  it('compares the three ways to create a resource', () => {
    const root = setup('http-rx');

    const functions = Array.from(root.querySelectorAll('tbody td:first-child')).map((td) => td.textContent?.trim());

    expect(functions).toEqual(['resource()', 'rxResource()', 'httpResource()']);
  });

  it('puts the live demo in the basics section', () => {
    expect(setup('basics').querySelector('app-resource-demo')).not.toBeNull();
  });

  it('asks about reload with the right answer not first', () => {
    const options = Array.from(setup('try-it').querySelectorAll('[role="radio"]')).map((o) => o.textContent?.trim());

    expect(options).toContain("'reloading'");
    expect(options[0]).not.toBe("'reloading'");
  });
});
