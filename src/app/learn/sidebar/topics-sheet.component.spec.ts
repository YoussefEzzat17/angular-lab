import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { TopicsSheetComponent } from './topics-sheet.component';

describe('TopicsSheetComponent', () => {
  async function setup() {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
    const fixture = TestBed.createComponent(TopicsSheetComponent);
    fixture.detectChanges();
    const state = TestBed.inject(SidebarStateService);
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, state, root, router: TestBed.inject(Router) };
  }

  afterEach(() => localStorage.clear());

  it('renders nothing while the drawer is closed', async () => {
    const { root } = await setup();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows the drawer variant (no duplicate "Topics" heading) when opened', async () => {
    const { fixture, state, root } = await setup();
    state.openDrawer();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    expect(root.textContent).toContain('Course Topics');
    expect(root.querySelector('[aria-label="Collapse sidebar"]')).toBeNull();
  });

  it('closes on the close button, on Escape and after navigating', async () => {
    const { fixture, state, root, router } = await setup();

    state.openDrawer();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('[aria-label="Close topics"]')!.click();
    expect(state.drawerOpen()).toBeFalse();

    state.openDrawer();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(state.drawerOpen()).toBeFalse();

    state.openDrawer();
    await router.navigateByUrl('/learn/signals');
    expect(state.drawerOpen()).toBeFalse();
  });

  describe('pulling the grip down', () => {
    function drag(root: HTMLElement, fromY: number, toY: number): void {
      const zone = root.querySelector<HTMLElement>('.touch-none')!;
      spyOn(zone, 'setPointerCapture');
      const fire = (type: string, clientY: number) =>
        zone.dispatchEvent(new PointerEvent(type, { clientY, bubbles: true, pointerId: 1 }));
      fire('pointerdown', fromY);
      fire('pointermove', toY);
      fire('pointerup', toY);
    }

    it('dismisses the sheet after a long pull', async () => {
      const { fixture, state, root } = await setup();
      state.openDrawer();
      fixture.detectChanges();
      drag(root, 300, 460);
      expect(state.drawerOpen()).toBeFalse();
    });

    it('springs back after a short, slow pull', async () => {
      const { fixture, state, root } = await setup();
      state.openDrawer();
      fixture.detectChanges();
      drag(root, 300, 330);
      fixture.detectChanges();
      expect(state.drawerOpen()).toBeTrue();
      expect(root.querySelector<HTMLElement>('[role="dialog"]')!.style.transform).toBe('');
    });

    it('does not start a drag from the close button', async () => {
      const { fixture, state, root } = await setup();
      state.openDrawer();
      fixture.detectChanges();
      const zone = root.querySelector<HTMLElement>('.touch-none')!;
      const capture = spyOn(zone, 'setPointerCapture');
      root.querySelector('[aria-label="Close topics"]')!.dispatchEvent(new PointerEvent('pointerdown', { clientY: 300, bubbles: true, pointerId: 1 }));
      expect(capture).not.toHaveBeenCalled();
    });
  });
});
