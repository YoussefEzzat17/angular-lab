import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LAZY_ROUTES, PreloadingDemoComponent, backgroundKb, isPreloaded, waitFor } from './preloading-demo.component';

const [products, , admin] = LAZY_ROUTES;

describe('preloading helpers', () => {
  it('preloads nothing without a strategy', () => {
    expect(isPreloaded('none', products)).toBeFalse();
    expect(backgroundKb('none')).toBe(0);
  });

  it('preloads every route with PreloadAllModules', () => {
    expect(backgroundKb('all')).toBe(120);
  });

  it('preloads only the flagged routes with the selective strategy', () => {
    expect(isPreloaded('selective', products)).toBeTrue();
    expect(isPreloaded('selective', admin)).toBeFalse();
    expect(backgroundKb('selective')).toBe(60);
  });

  it('makes the user wait for a chunk that was not preloaded', () => {
    expect(waitFor('none', admin, false)).toBe(600);
  });

  it('does not make the user wait for a chunk that was already downloaded', () => {
    expect(waitFor('all', admin, false)).toBe(0);
    expect(waitFor('none', admin, true)).toBe(0);
  });
});

describe('PreloadingDemoComponent', () => {
  let fixture: ComponentFixture<PreloadingDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)!.textContent?.trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadingDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('makes the first visit wait when nothing is preloaded, and the second visit instant', () => {
    click('visit-admin');
    expect(text('visit-result')).toContain('wait about 600 ms');

    click('visit-admin');
    expect(text('visit-result')).toContain('instantly');
  });

  it('opens every page instantly with PreloadAllModules, at the cost of 120 KB in the background', () => {
    click('strategy-all');
    click('visit-admin');

    expect(text('visit-result')).toContain('instantly');
    expect(text('background-kb')).toBe('120 KB');
  });

  it('keeps the admin page slow but the products page instant with the selective strategy', () => {
    click('strategy-selective');

    click('visit-products');
    expect(text('visit-result')).toContain('instantly');

    click('visit-admin');
    expect(text('visit-result')).toContain('wait about 600 ms');
  });

  it('forgets earlier visits when the strategy changes', () => {
    click('visit-admin');

    click('strategy-selective');

    expect(text('state-admin')).toBe('not downloaded yet');
  });
});
