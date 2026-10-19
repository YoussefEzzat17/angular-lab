import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type CdStrategy = 'default' | 'onpush';
export type CdEvent = 'click-card' | 'new-input' | 'timer';

export interface CdTreeNode {
  id: string;
  name: string;
  parent: string | null;
  depth: number;
}

export const CD_TREE: CdTreeNode[] = [
  { id: 'app', name: 'AppComponent', parent: null, depth: 0 },
  { id: 'header', name: 'HeaderComponent', parent: 'app', depth: 1 },
  { id: 'list', name: 'ProductListComponent', parent: 'app', depth: 1 },
  { id: 'card1', name: 'ProductCard #1', parent: 'list', depth: 2 },
  { id: 'card2', name: 'ProductCard #2', parent: 'list', depth: 2 },
];

export const CD_EVENTS: { id: CdEvent; label: string; story: string }[] = [
  {
    id: 'click-card',
    label: 'Click inside Card #2',
    story: 'An event fired inside Card #2. Angular marks that card AND every parent above it as "dirty", so the path from the root down to the card is checked.',
  },
  {
    id: 'new-input',
    label: 'App sends a new object to the List',
    story: 'ProductList received a new reference through its input(), so it is dirty. Its children are only checked if they are Default (or dirty themselves).',
  },
  {
    id: 'timer',
    label: 'A timer fires in AppComponent',
    story: 'A timer ran and changed a plain field. Nothing was marked dirty, so only Default components get re-checked — an OnPush root skips the whole tree.',
  },
];

/** The components Angular marks dirty for each kind of event. */
export function dirtyNodesFor(event: CdEvent): Set<string> {
  switch (event) {
    case 'click-card':
      return new Set(['card2', 'list', 'app']);
    case 'new-input':
      return new Set(['list']);
    default:
      return new Set();
  }
}

/**
 * Simplified model of Angular's rules: a Default component is always checked when its parent is;
 * an OnPush component is checked only when it is dirty, and skipping it skips its whole subtree.
 */
export function checkedNodes(strategies: Record<string, CdStrategy>, dirty: Set<string>): Set<string> {
  const checked = new Set<string>();
  const visit = (id: string): void => {
    if (strategies[id] === 'onpush' && !dirty.has(id)) {
      return;
    }
    checked.add(id);
    CD_TREE.filter((n) => n.parent === id).forEach((child) => visit(child.id));
  };
  visit('app');
  return checked;
}

const ALL_DEFAULT: Record<string, CdStrategy> = Object.fromEntries(CD_TREE.map((n) => [n.id, 'default' as CdStrategy]));

/** Interactive component tree: pick a strategy per component, fire an event, see who gets re-checked. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cd-tree-demo',
  standalone: true,
  template: `
    <p class="mt-3 rounded-lg bg-stone-950 px-3 py-2 text-xs text-stone-400">
      A simplified model of Angular's rules — it shows <em>which</em> components get re-checked, not real timings.
    </p>

    <div class="mt-4 space-y-2" role="list" aria-label="Component tree">
      @for (node of tree; track node.id) {
        <div
          role="listitem"
          class="flex flex-wrap items-center gap-2 rounded-xl border bg-stone-900 px-3 py-2"
          [class]="isChecked(node.id) ? 'border-emerald-500/50' : 'border-stone-800'"
          [style.margin-left.rem]="node.depth * 1.5"
          [attr.data-testid]="'node-' + node.id"
        >
          <span class="min-w-0 flex-1 text-sm font-semibold text-stone-100">{{ node.name }}</span>
          <button
            type="button"
            [attr.data-testid]="'strategy-' + node.id"
            [attr.aria-label]="node.name + ' change detection strategy: ' + strategies()[node.id]"
            (click)="toggle(node.id)"
            class="min-h-11 rounded-lg border px-3 text-xs font-bold transition"
            [class]="
              strategies()[node.id] === 'onpush'
                ? 'border-gold-400 bg-gold-500/15 text-gold-300'
                : 'border-stone-700 text-stone-300 hover:bg-stone-800'
            "
          >
            {{ strategies()[node.id] === 'onpush' ? 'OnPush' : 'Default' }}
          </button>
          <span class="w-24 text-right text-xs font-bold" [attr.data-testid]="'status-' + node.id" [class]="statusClass(node.id)">
            {{ statusText(node.id) }}
          </span>
        </div>
      }
    </div>

    <p class="mt-4 text-xs font-bold tracking-wider text-stone-500">NOW FIRE AN EVENT</p>
    <div class="mt-2 flex flex-wrap gap-2">
      @for (event of events; track event.id) {
        <button
          type="button"
          [attr.data-testid]="'event-' + event.id"
          (click)="fire(event.id)"
          class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold hover:bg-stone-800"
          [class.border-gold-400]="lastEvent() === event.id"
        >
          {{ event.label }}
        </button>
      }
      <button
        type="button"
        data-testid="cd-reset"
        (click)="reset()"
        class="min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-stone-200"
      >
        Reset
      </button>
    </div>

    <p class="mt-4 rounded-xl bg-gold-500/10 p-4 text-sm text-stone-200" role="status" aria-live="polite" data-testid="cd-summary">{{ summary() }}</p>
  `,
})
export class CdTreeDemoComponent {
  readonly tree = CD_TREE;
  readonly events = CD_EVENTS;

  readonly strategies = signal<Record<string, CdStrategy>>({ ...ALL_DEFAULT });
  readonly lastEvent = signal<CdEvent | null>(null);

  private readonly checked = computed(() => {
    const event = this.lastEvent();
    return event ? checkedNodes(this.strategies(), dirtyNodesFor(event)) : new Set<string>();
  });

  readonly summary = computed(() => {
    const event = this.lastEvent();
    if (!event) {
      return 'Everything starts as Default. Fire an event, then switch some components to OnPush and fire it again.';
    }
    const story = CD_EVENTS.find((e) => e.id === event)?.story ?? '';
    return `${story} Result: ${this.checked().size} of ${CD_TREE.length} components were checked.`;
  });

  isChecked(id: string): boolean {
    return this.checked().has(id);
  }

  statusText(id: string): string {
    if (!this.lastEvent()) {
      return '—';
    }
    return this.isChecked(id) ? '✓ checked' : '⊘ skipped';
  }

  statusClass(id: string): string {
    if (!this.lastEvent()) {
      return 'text-stone-600';
    }
    return this.isChecked(id) ? 'text-emerald-300' : 'text-stone-500';
  }

  toggle(id: string): void {
    this.strategies.update((s) => ({ ...s, [id]: s[id] === 'onpush' ? 'default' : 'onpush' }));
  }

  fire(event: CdEvent): void {
    this.lastEvent.set(event);
  }

  reset(): void {
    this.strategies.set({ ...ALL_DEFAULT });
    this.lastEvent.set(null);
  }
}
