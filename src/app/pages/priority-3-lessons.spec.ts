import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DevtoolsComponent } from './devtools/devtools.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DynamicComponentsComponent } from './dynamic-components/dynamic-components.component';
import { I18nComponent } from './i18n/i18n.component';

function render<T>(component: new () => T, section: string) {
  localStorage.clear();
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(component);
  (fixture.componentRef as { setInput: (n: string, v: unknown) => void }).setInput('section', section);
  fixture.detectChanges();
  return { fixture, root: fixture.nativeElement as HTMLElement };
}

const press = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim() === text)?.click();

describe('priority 3 lessons', () => {
  afterEach(() => localStorage.clear());

  it('i18n shows the same price in the style of each locale', () => {
    const { fixture, root } = render(I18nComponent, 'formats');
    const price = () => root.querySelector('[data-testid="price"]')!.textContent!.trim();
    expect(price()).toBe('$1,234.50');
    press(root, 'Deutsch');
    fixture.detectChanges();
    expect(price()).toContain('1.234,50');
  });

  it('i18n picks the plural text for the count', () => {
    const { fixture, root } = render(I18nComponent, 'plurals');
    const text = () => root.querySelector('[data-testid="plural"]')!.textContent!.trim();
    expect(text()).toContain('one message');
    root.querySelector<HTMLButtonElement>('[aria-label="One more"]')!.click();
    fixture.detectChanges();
    expect(text()).toContain('2 messages');
  });

  it('dynamic components adds and removes widgets created in code', () => {
    const { fixture, root } = render(DynamicComponentsComponent, 'create');
    press(root, 'Add a chart');
    press(root, 'Add a note');
    fixture.detectChanges();
    expect(root.querySelectorAll('app-chart-widget, app-note-widget').length).toBe(2);
    press(root, 'Remove the last');
    fixture.detectChanges();
    expect(root.querySelectorAll('app-chart-widget, app-note-widget').length).toBe(1);
  });

  it('drag and drop offers buttons that make the same move', () => {
    const { fixture, root } = render(DragDropComponent, 'a11y');
    root.querySelector<HTMLButtonElement>('[aria-label="Move Components down"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[data-testid="announced"]')!.textContent).toContain('Components moved to position 2 of 4');
  });

  it('the style review counts real problems and false alarms', () => {
    const { fixture, root } = render(DevtoolsComponent, 'style');
    const boxes = Array.from(root.querySelectorAll<HTMLInputElement>('fieldset input[type="checkbox"]'));
    [0, 1, 6].forEach((i) => boxes[i].click());
    fixture.detectChanges();
    press(root, 'Check my review');
    fixture.detectChanges();
    const feedback = root.querySelector('[data-testid="feedback"]')!.textContent!;
    expect(feedback).toContain('You found 2 of 6 real problems');
    expect(feedback).toContain('1 of your ticks were not problems');
  });
});
