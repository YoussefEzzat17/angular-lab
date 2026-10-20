import { TestBed } from '@angular/core/testing';

import { BINDINGS, BindingDecoderDemoComponent } from './binding-decoder-demo.component';

describe('BINDINGS', () => {
  it('describes the four kinds, each with a different syntax', () => {
    expect(BINDINGS.map((b) => b.id)).toEqual(['interpolation', 'property', 'event', 'two-way']);
    expect(new Set(BINDINGS.map((b) => b.snippet)).size).toBe(4);
  });

  it('sends data down for interpolation and property binding, up for events, both ways for two-way', () => {
    const direction = (id: string) => BINDINGS.find((b) => b.id === id)!.direction;

    expect(direction('interpolation')).toBe('down');
    expect(direction('property')).toBe('down');
    expect(direction('event')).toBe('up');
    expect(direction('two-way')).toBe('both');
  });
});

describe('BindingDecoderDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(BindingDecoderDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    const pick = (id: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="binding-${id}"]`)!.click();
      fixture.detectChanges();
    };
    return { root, text, pick };
  }

  it('starts with interpolation, flowing from the class to the template', () => {
    const { text } = setup();

    expect(text('decoder-name')).toBe('Interpolation');
    expect(text('decoder-flow')).toContain('→');
    expect(text('decoder-direction')).toBe('class → template');
  });

  it('shows the arrow turning around for an event binding', () => {
    const { text, pick } = setup();

    pick('event');

    expect(text('decoder-name')).toBe('Event binding');
    expect(text('decoder-flow')).toContain('←');
    expect(text('decoder-direction')).toBe('template → class');
  });

  it('shows a two-headed arrow for two-way binding and explains it is two bindings in one', () => {
    const { text, pick } = setup();

    pick('two-way');

    expect(text('decoder-flow')).toContain('↔');
    expect(text('decoder-does')).toContain('property binding and an event binding in one');
  });

  it('marks only the chosen syntax as pressed', () => {
    const { root, pick } = setup();

    pick('property');

    const pressed = Array.from(root.querySelectorAll('[aria-pressed="true"]')).map((b) => b.getAttribute('data-testid'));
    expect(pressed).toEqual(['binding-property']);
  });
});
