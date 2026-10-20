import { TestBed } from '@angular/core/testing';

import { DI_TREE, DiTreeDemoComponent, ROOT, instanceNumbers, providerOf } from './di-tree-demo.component';

describe('dependency injection model', () => {
  it('gives every component the root instance when nothing is provided', () => {
    for (const node of DI_TREE) {
      expect(providerOf(node.id, new Set())).toBe(ROOT);
    }
  });

  it('shares a component-level provider with everything below it, but not with its siblings', () => {
    const providers = new Set(['list']);

    expect(providerOf('list', providers)).toBe('list');
    expect(providerOf('card1', providers)).toBe('list');
    expect(providerOf('card2', providers)).toBe('list');
    expect(providerOf('header', providers)).toBe(ROOT);
    expect(providerOf('app', providers)).toBe(ROOT);
  });

  it('uses the nearest provider when there are several', () => {
    const providers = new Set(['list', 'card2']);

    expect(providerOf('card2', providers)).toBe('card2');
    expect(providerOf('card1', providers)).toBe('list');
  });

  it('numbers the root as #1 and the others in tree order', () => {
    expect(instanceNumbers(new Set(['card2', 'list']))).toEqual({ [ROOT]: 1, list: 2, card2: 3 });
  });
});

describe('DiTreeDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(DiTreeDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    return { click, text };
  }

  it('starts with one shared instance and every count at 0', () => {
    const { text } = setup();

    expect(text('di-summary')).toBe('One instance is shared by all 5 components.');
    expect(text('di-source-card1')).toBe('Instance #1 · from the root injector');
    expect(text('di-count-header')).toBe('0');
  });

  it('shows the same count everywhere while the root instance is shared', () => {
    const { click, text } = setup();

    click('di-add-card1');
    click('di-add-header');

    expect(text('di-count-app')).toBe('2');
    expect(text('di-count-card2')).toBe('2');
  });

  it('gives a subtree its own cart when a component provides the service', () => {
    const { click, text } = setup();
    click('di-add-app');

    click('di-provide-list');
    click('di-add-card1');

    expect(text('di-count-card2')).toBe('1');
    expect(text('di-count-list')).toBe('1');
    expect(text('di-count-header')).toBe('1');
    expect(text('di-count-app')).toBe('1');
    expect(text('di-source-card1')).toBe('Instance #2 · shared from ProductListComponent');
    expect(text('di-source-list')).toBe('Instance #2 · its own copy');
    expect(text('di-summary')).toBe('2 instances exist. Components with the same number share one cart.');
  });

  it('keeps the root cart unchanged by what happens in the new subtree', () => {
    const { click, text } = setup();
    click('di-add-app');
    click('di-provide-list');

    click('di-add-card2');
    click('di-add-card2');

    expect(text('di-count-app')).toBe('1');
    expect(text('di-count-card1')).toBe('2');
  });

  it('throws away a component copy when it stops providing, and Reset restores the start', () => {
    const { click, text } = setup();
    click('di-provide-list');
    click('di-add-list');

    click('di-provide-list');
    expect(text('di-count-list')).toBe('0');
    expect(text('di-source-list')).toBe('Instance #1 · from the root injector');

    click('di-provide-card2');
    click('di-reset');
    expect(text('di-summary')).toBe('One instance is shared by all 5 components.');
  });
});
