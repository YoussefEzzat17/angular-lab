import { TestBed } from '@angular/core/testing';

import { ContentProjectionComponent } from './content-projection.component';

describe('ContentProjectionComponent', () => {
  function setup(section: string) {
    const fixture = TestBed.createComponent(ContentProjectionComponent);
    fixture.componentRef.setInput('section', section);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    const tabs = () => Array.from(root.querySelectorAll('[role="tab"]')).map((t) => t.textContent?.trim());
    return { fixture, root, click, text, tabs };
  }

  it('shows the parent\'s text inside the card, and swaps it for a list or a button', () => {
    const { root, click, text } = setup('ng-content');

    expect(text('fancy-card')).toBe('Just a sentence of text.');

    click('card-option-list');
    expect(root.querySelector('[data-testid="fancy-card"] ul')).not.toBeNull();

    click('card-option-button');
    expect(root.querySelector('[data-testid="fancy-card"] button')).not.toBeNull();
  });

  it('sends the title, body and footer to their own slots', () => {
    const { root } = setup('slots');

    const card = root.querySelector('[data-testid="slot-card"]')!;

    expect(card.querySelector('header')?.textContent).toContain('Order #1042');
    expect(card.querySelector('footer')?.textContent).toContain('Placed today');
    expect(card.querySelector('div')?.textContent).toContain('Two items are on their way');
    expect(card.querySelector('div')?.textContent).not.toContain('Order #1042');
  });

  it('builds one tab button for every projected panel, and follows when one is added or removed', () => {
    const { click, tabs } = setup('queries');
    expect(tabs()).toEqual(['Details', 'Shipping']);

    click('toggle-reviews');
    expect(tabs()).toEqual(['Details', 'Shipping', 'Reviews']);

    click('toggle-reviews');
    expect(tabs()).toEqual(['Details', 'Shipping']);
  });

  it('shows only the selected tab\'s content', () => {
    const { click, text } = setup('queries');
    expect(text('tab-body')).toContain('A sturdy backpack');
    expect(text('tab-body')).not.toContain('Ships in two days');

    click('tab-1');

    expect(text('tab-body')).toContain('Ships in two days');
    expect(text('tab-body')).not.toContain('A sturdy backpack');
  });

  it('lets the parent reset a child counter through viewChild', () => {
    const { click, text } = setup('queries');
    click('counter-add');
    click('counter-add');
    expect(text('counter-value')).toBe('2');

    click('reset-child');

    expect(text('counter-value')).toBe('0');
  });

  it('lets the parent focus an element of its own through viewChild', () => {
    const { fixture, click } = setup('queries');
    document.body.appendChild(fixture.nativeElement);

    click('focus-input');

    expect(document.activeElement?.getAttribute('aria-label')).toBe('Demo field');
    fixture.nativeElement.remove();
  });
});
