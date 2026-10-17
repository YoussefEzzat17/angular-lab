import { Injectable, signal, effect } from '@angular/core';
import { readStored, writeStored } from './safe-storage';

const SIDEBAR_KEY = 'angular-lab:sidebar-collapsed';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly collapsed = signal<boolean>(readStored<boolean>(SIDEBAR_KEY, false));
  readonly drawerOpen = signal(false);
  readonly expandedGroups = signal<Set<string>>(new Set());

  constructor() {
    effect(() => writeStored(SIDEBAR_KEY, this.collapsed()));
  }

  toggleCollapsed(): void { this.collapsed.update((v) => !v); }
  openDrawer(): void { this.drawerOpen.set(true); }
  closeDrawer(): void { this.drawerOpen.set(false); }

  toggleGroup(groupId: string): void {
    this.expandedGroups.update((s) => {
      const next = new Set(s);
      if (next.has(groupId)) { next.delete(groupId); } else { next.add(groupId); }
      return next;
    });
  }
}
