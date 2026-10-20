import { FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlStateDemoComponent, noSpaces, snapshotOf } from './control-state-demo.component';

describe('noSpaces', () => {
  it('returns null when there are no spaces', () => {
    expect(noSpaces(new FormControl('abc'))).toBeNull();
  });

  it('returns an error object when the value has a space', () => {
    expect(noSpaces(new FormControl('a b'))).toEqual({ noSpaces: true });
  });
});

describe('snapshotOf', () => {
  it('lists the failing rules by key', () => {
    const control = new FormControl('a b', [noSpaces]);

    expect(snapshotOf(control).errorKeys).toEqual(['noSpaces']);
  });
});

describe('ControlStateDemoComponent', () => {
  let fixture: ComponentFixture<ControlStateDemoComponent>;
  let root: HTMLElement;

  const type = (value: string) => {
    const input = root.querySelector<HTMLInputElement>('[data-testid="state-input"]')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const flag = (name: string) => root.querySelector(`[data-testid="flag-${name}"]`)!.textContent?.trim();
  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStateDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('starts invalid but silent: pristine, untouched and no message', () => {
    expect(flag('valid')).toBe('false');
    expect(flag('touched')).toBe('false');
    expect(flag('pristine')).toBe('true');
    expect(root.querySelector('[data-testid="state-message"]')).toBeNull();
  });

  it('becomes dirty and shows the first error once the user types something wrong', () => {
    type('mona');

    expect(flag('dirty')).toBe('true');
    expect(root.querySelector('[data-testid="state-message"]')?.textContent).toContain('valid email');
  });

  it('becomes valid for a good email', () => {
    type('mona@example.com');

    expect(flag('valid')).toBe('true');
    expect(root.querySelector('[data-testid="state-message"]')).toBeNull();
  });

  it('reports the custom noSpaces rule', () => {
    type('mona @example.com');

    expect(root.querySelector('[data-testid="state-errors"]')?.textContent).toContain('noSpaces');
  });

  it('shows the required message after markAsTouched without typing', () => {
    click('state-touch');

    expect(flag('touched')).toBe('true');
    expect(root.querySelector('[data-testid="state-message"]')?.textContent).toContain('required');
  });

  it('goes back to the quiet start state on reset', () => {
    type('x');

    click('state-reset');

    expect(flag('dirty')).toBe('false');
    expect(root.querySelector('[data-testid="state-message"]')).toBeNull();
  });
});
