import { TestBed } from '@angular/core/testing';

import { SignalNetworkComponent } from './signal-network.component';

describe('SignalNetworkComponent', () => {
  function render(reduceMotion: boolean) {
    spyOn(window, 'matchMedia').and.callFake(((query: string) => ({ matches: reduceMotion && query.includes('reduce'), media: query }) as MediaQueryList) as typeof window.matchMedia);
    const fixture = TestBed.createComponent(SignalNetworkComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the moving data values by default', () => {
    const root = render(false);

    expect(root.querySelectorAll('animateMotion').length).toBe(3);
  });

  it('leaves out the moving values for people who prefer reduced motion', () => {
    const root = render(true);

    expect(root.querySelectorAll('animateMotion').length).toBe(0);
    expect(root.querySelector('svg')?.getAttribute('role')).toBe('img');
    expect(root.textContent).toContain('.subscribe()');
  });
});
