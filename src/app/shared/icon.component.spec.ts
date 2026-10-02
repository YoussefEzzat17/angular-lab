import { TestBed } from '@angular/core/testing';

import { IconComponent, IconName } from './icon.component';

const ICONS: IconName[] = ['download', 'search', 'sun', 'moon', 'chevron-down', 'menu', 'close', 'check', 'alert', 'info'];

describe('IconComponent', () => {
  function render(name: IconName) {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return fixture;
  }

  it('renders exactly one svg for every icon name', () => {
    for (const name of ICONS) {
      const root: HTMLElement = render(name).nativeElement;
      expect(root.querySelectorAll('svg').length).withContext(name).toBe(1);
      expect(root.querySelector('svg path, svg polyline')).withContext(name).not.toBeNull();
    }
  });

  it('draws a different shape for each icon', () => {
    const shapes = ICONS.map((name) => (render(name).nativeElement as HTMLElement).querySelector('svg')!.innerHTML);
    expect(new Set(shapes).size).toBe(ICONS.length);
  });

  it('is decorative: hidden from assistive tech and painted with currentColor', () => {
    const root: HTMLElement = render('search').nativeElement;
    expect(root.getAttribute('aria-hidden')).toBe('true');
    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('fill') === 'currentColor' || svg.getAttribute('stroke') === 'currentColor').toBeTrue();
  });

  it('swaps the drawing when the name changes', () => {
    const fixture = render('sun');
    const sun = (fixture.nativeElement as HTMLElement).querySelector('svg')!.innerHTML;
    fixture.componentRef.setInput('name', 'moon');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('svg')!.innerHTML).not.toBe(sun);
  });
});
