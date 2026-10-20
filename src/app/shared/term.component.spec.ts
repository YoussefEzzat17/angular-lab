import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GLOSSARY } from '../core/data/glossary';
import { TermComponent } from './term.component';

@Component({
  standalone: true,
  imports: [TermComponent],
  template: `<p>Use the <app-term [term]="key">injector</app-term> to get a service.</p>`,
})
class HostComponent {
  key = 'injector';
}

describe('TermComponent', () => {
  function setup(key = 'injector') {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.key = key;
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const button = () => root.querySelector<HTMLButtonElement>('[data-testid="term-button"]')!;
    const tooltip = () => root.querySelector('[data-testid="term-tooltip"]');
    const press = () => {
      button().click();
      fixture.detectChanges();
    };
    return { fixture, root, button, tooltip, press };
  }

  it('shows the word itself inline and no explanation at first', () => {
    const { button, tooltip } = setup();

    expect(button().textContent?.trim()).toBe('injector');
    expect(tooltip()).toBeNull();
  });

  it('explains the word in plain language when tapped, and hides it when tapped again', () => {
    const { button, tooltip, press } = setup();

    press();

    expect(tooltip()?.textContent).toContain(GLOSSARY['injector'].text);
    expect(tooltip()?.getAttribute('role')).toBe('tooltip');
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(button().getAttribute('aria-describedby')).toBe(tooltip()?.id ?? null);

    press();
    expect(tooltip()).toBeNull();
    expect(button().getAttribute('aria-describedby')).toBeNull();
  });

  it('closes with Escape', () => {
    const { fixture, tooltip, press } = setup();
    press();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(tooltip()).toBeNull();
  });

  it('opens on keyboard focus and closes on blur', () => {
    const { fixture, button, tooltip } = setup();

    button().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(tooltip()).not.toBeNull();

    button().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(tooltip()).toBeNull();
  });

  it('shows no explanation for a word that is not in the glossary', () => {
    const { tooltip, press } = setup('not-a-real-term');

    press();

    expect(tooltip()).toBeNull();
  });

  it('has a title and an explanation for every glossary entry', () => {
    for (const [key, entry] of Object.entries(GLOSSARY)) {
      expect(entry.title).withContext(key).toBeTruthy();
      expect(entry.text.length).withContext(key).toBeGreaterThan(20);
    }
  });
});
