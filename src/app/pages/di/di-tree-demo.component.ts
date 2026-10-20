import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface DiNode {
  id: string;
  name: string;
  parent: string | null;
  depth: number;
}

export const DI_TREE: DiNode[] = [
  { id: 'app', name: 'AppComponent', parent: null, depth: 0 },
  { id: 'header', name: 'HeaderComponent', parent: 'app', depth: 1 },
  { id: 'list', name: 'ProductListComponent', parent: 'app', depth: 1 },
  { id: 'card1', name: 'ProductCard #1', parent: 'list', depth: 2 },
  { id: 'card2', name: 'ProductCard #2', parent: 'list', depth: 2 },
];

export const ROOT = 'root';

/** Angular looks for the service in this component, then each parent, and finally in the root injector. */
export function providerOf(nodeId: string, providers: ReadonlySet<string>): string {
  let current: DiNode | undefined = DI_TREE.find((n) => n.id === nodeId);
  while (current) {
    if (providers.has(current.id)) {
      return current.id;
    }
    const parentId: string | null = current.parent;
    current = parentId ? DI_TREE.find((n) => n.id === parentId) : undefined;
  }
  return ROOT;
}

/** The root instance is #1; instances created by components are numbered in tree order after it. */
export function instanceNumbers(providers: ReadonlySet<string>): Record<string, number> {
  const numbers: Record<string, number> = { [ROOT]: 1 };
  let next = 2;
  for (const node of DI_TREE) {
    if (providers.has(node.id)) {
      numbers[node.id] = next++;
    }
  }
  return numbers;
}

// Full class strings (not built up from fragments) so Tailwind's scanner can see every one.
const INSTANCE_STYLES = [
  'border-gold-400/60 text-gold-300',
  'border-emerald-400/60 text-emerald-300',
  'border-sky-400/60 text-sky-300',
  'border-rose-400/60 text-rose-300',
  'border-violet-400/60 text-violet-300',
];

/** A component tree where you decide which components provide a CartService, and see who shares which instance. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-di-tree-demo',
  standalone: true,
  template: `
    <p class="mt-3 rounded-lg bg-stone-950 px-3 py-2 text-xs text-stone-400">
      Every component asks for a <code class="text-gold-300">CartService</code>. Switch on "Provide here" to give a component (and everything below it) its own copy.
    </p>

    <div class="mt-4 space-y-2" role="list" aria-label="Component tree">
      @for (row of rows(); track row.node.id) {
        <div
          role="listitem"
          class="flex flex-wrap items-center gap-2 rounded-xl border bg-stone-900 px-3 py-2"
          [class]="row.style"
          [style.margin-left.rem]="row.node.depth * 1.5"
          [attr.data-testid]="'di-node-' + row.node.id"
        >
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-semibold text-stone-100">{{ row.node.name }}</span>
            <span class="block text-xs text-stone-400" [attr.data-testid]="'di-source-' + row.node.id">
              Instance #{{ row.number }} · {{ row.source }}
            </span>
          </span>
          <button
            type="button"
            [attr.data-testid]="'di-provide-' + row.node.id"
            [attr.aria-pressed]="row.provides"
            (click)="toggleProvider(row.node.id)"
            class="min-h-11 rounded-lg border px-3 text-xs font-bold transition"
            [class]="row.provides ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
          >
            Provide here
          </button>
          <button
            type="button"
            [attr.data-testid]="'di-add-' + row.node.id"
            (click)="add(row.node.id)"
            class="min-h-11 rounded-lg border border-stone-600 px-3 text-xs font-bold text-stone-200 hover:bg-stone-800"
          >
            +1 item
          </button>
          <span class="w-14 text-right text-sm font-bold text-stone-100" [attr.data-testid]="'di-count-' + row.node.id" [attr.aria-label]="row.count + ' items in this cart'">
            {{ row.count }}
          </span>
        </div>
      }
    </div>

    <div class="mt-4 flex items-center gap-3">
      <button
        type="button"
        data-testid="di-reset"
        (click)="reset()"
        class="min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-stone-200"
      >
        Reset
      </button>
      <p class="text-sm text-stone-300" role="status" aria-live="polite" data-testid="di-summary">{{ summary() }}</p>
    </div>
  `,
})
export class DiTreeDemoComponent {
  private readonly providers = signal<ReadonlySet<string>>(new Set());
  private readonly counts = signal<Record<string, number>>({});

  readonly rows = computed(() => {
    const providers = this.providers();
    const numbers = instanceNumbers(providers);
    return DI_TREE.map((node) => {
      const source = providerOf(node.id, providers);
      const number = numbers[source];
      return {
        node,
        number,
        source: source === ROOT ? 'from the root injector' : source === node.id ? 'its own copy' : `shared from ${DI_TREE.find((n) => n.id === source)?.name}`,
        provides: providers.has(node.id),
        count: this.counts()[source] ?? 0,
        style: INSTANCE_STYLES[(number - 1) % INSTANCE_STYLES.length],
      };
    });
  });

  readonly summary = computed(() => {
    const instances = new Set(this.rows().map((r) => r.number)).size;
    return instances === 1 ? 'One instance is shared by all 5 components.' : `${instances} instances exist. Components with the same number share one cart.`;
  });

  toggleProvider(nodeId: string): void {
    const next = new Set(this.providers());
    if (next.has(nodeId)) {
      next.delete(nodeId);
      // The instance created for this component is gone, so its items go with it.
      this.counts.update(({ [nodeId]: _removed, ...rest }) => rest);
    } else {
      next.add(nodeId);
    }
    this.providers.set(next);
  }

  add(nodeId: string): void {
    const source = providerOf(nodeId, this.providers());
    this.counts.update((counts) => ({ ...counts, [source]: (counts[source] ?? 0) + 1 }));
  }

  reset(): void {
    this.providers.set(new Set());
    this.counts.set({});
  }
}
