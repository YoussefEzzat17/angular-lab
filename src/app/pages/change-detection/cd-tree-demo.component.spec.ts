import { TestBed } from '@angular/core/testing';

import { CD_TREE, CdStrategy, CdTreeDemoComponent, checkedNodes, dirtyNodesFor } from './cd-tree-demo.component';

const allDefault = (): Record<string, CdStrategy> => Object.fromEntries(CD_TREE.map((n) => [n.id, 'default' as CdStrategy]));

describe('change detection model', () => {
  it('checks every component when all of them are Default', () => {
    const checked = checkedNodes(allDefault(), dirtyNodesFor('timer'));

    expect(checked.size).toBe(CD_TREE.length);
  });

  it('skips the whole tree when the root is OnPush and nothing is dirty', () => {
    const checked = checkedNodes({ ...allDefault(), app: 'onpush' }, dirtyNodesFor('timer'));

    expect(checked.size).toBe(0);
  });

  it('checks only the dirty path for an event inside a card when everything is OnPush', () => {
    const everyOnPush = Object.fromEntries(CD_TREE.map((n) => [n.id, 'onpush' as CdStrategy]));

    const checked = checkedNodes(everyOnPush, dirtyNodesFor('click-card'));

    expect([...checked].sort()).toEqual(['app', 'card2', 'list']);
  });

  it('skips an OnPush child that is not dirty even when its parent is checked', () => {
    const strategies = { ...allDefault(), card1: 'onpush' as CdStrategy };

    const checked = checkedNodes(strategies, dirtyNodesFor('new-input'));

    expect(checked.has('card1')).toBeFalse();
    expect(checked.has('card2')).toBeTrue();
  });
});

describe('CdTreeDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(CdTreeDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    const status = (id: string) => root.querySelector(`[data-testid="status-${id}"]`)?.textContent?.trim();
    return { root, click, status };
  }

  it('shows no status until an event is fired', () => {
    const { status } = setup();

    expect(status('app')).toBe('—');
  });

  it('marks every component as checked for an event when all are Default', () => {
    const { click, status } = setup();

    click('event-click-card');

    expect(status('header')).toBe('✓ checked');
    expect(status('card1')).toBe('✓ checked');
  });

  it('skips components switched to OnPush and updates the summary count', () => {
    const { root, click, status } = setup();

    click('strategy-header');
    click('strategy-card1');
    click('event-new-input');

    expect(status('header')).toBe('⊘ skipped');
    expect(status('card1')).toBe('⊘ skipped');
    expect(root.querySelector('[data-testid="cd-summary"]')?.textContent).toContain('3 of 5');
  });

  it('goes back to the starting state on reset', () => {
    const { click, status } = setup();

    click('strategy-app');
    click('event-timer');
    click('cd-reset');

    expect(status('app')).toBe('—');
  });
});
