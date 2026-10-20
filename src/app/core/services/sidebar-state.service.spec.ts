import { TestBed } from '@angular/core/testing';

import { SidebarStateService } from './sidebar-state.service';

describe('SidebarStateService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts expanded with the phone sheet closed', () => {
    const service = TestBed.inject(SidebarStateService);

    expect(service.collapsed()).toBeFalse();
    expect(service.drawerOpen()).toBeFalse();
  });

  it('opens and closes the phone sheet', () => {
    const service = TestBed.inject(SidebarStateService);

    service.openDrawer();
    expect(service.drawerOpen()).toBeTrue();

    service.closeDrawer();
    expect(service.drawerOpen()).toBeFalse();
  });

  it('toggles collapsed and remembers it after a reload', () => {
    const service = TestBed.inject(SidebarStateService);
    service.toggleCollapsed();
    TestBed.tick();

    expect(service.collapsed()).toBeTrue();
    expect(localStorage.getItem('angular-lab:sidebar-collapsed')).toBe('true');

    TestBed.resetTestingModule();
    expect(TestBed.inject(SidebarStateService).collapsed()).toBeTrue();
  });

  it('expands and collapses a group', () => {
    const service = TestBed.inject(SidebarStateService);

    service.toggleGroup('fundamentals');
    expect(service.expandedGroups().has('fundamentals')).toBeTrue();

    service.toggleGroup('fundamentals');
    expect(service.expandedGroups().has('fundamentals')).toBeFalse();
  });
});
