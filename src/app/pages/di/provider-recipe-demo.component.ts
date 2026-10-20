import { ChangeDetectionStrategy, Component, InjectionToken, Injector, computed, inject, signal } from '@angular/core';

export type RecipeId = 'class' | 'fake' | 'value' | 'factory';
export type Lang = 'en' | 'ar';

export interface Greeter {
  greet(name: string): string;
}

/** A token is the name you ask for. The provider decides what you actually get. */
export const GREETER = new InjectionToken<Greeter>('GREETER');
export const LANG = new InjectionToken<Lang>('LANG');

export interface RecipeResult {
  /** What `greet('Mona')` returned. */
  message: string;
  /** How many times the recipe built a Greeter while we asked for it twice. */
  builds: number;
  /** Whether the two `inject(GREETER)` calls returned the very same object. */
  sameInstance: boolean;
}

export interface Recipe {
  id: RecipeId;
  label: string;
  code: string;
  blurb: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'class',
    label: 'useClass: RealGreeter',
    code: '{ provide: GREETER, useClass: RealGreeter }',
    blurb: 'Angular calls new RealGreeter() for you, and RealGreeter can inject() its own dependencies.',
  },
  {
    id: 'fake',
    label: 'useClass: FakeGreeter',
    code: '{ provide: GREETER, useClass: FakeGreeter }',
    blurb: 'Same token, different class. Callers do not change at all. This is how a test swaps in a fake.',
  },
  {
    id: 'value',
    label: 'useValue',
    code: "{ provide: GREETER, useValue: { greet: (n) => 'Hi ' + n } }",
    blurb: 'You hand Angular a ready-made object. Nothing is constructed, so builds stays at 0.',
  },
  {
    id: 'factory',
    label: 'useFactory',
    code: '{ provide: GREETER, useFactory: () => makeGreeter(inject(LANG)) }',
    blurb: 'A function decides what to build, and it can read other tokens (here the language) while doing it.',
  },
];

let builds = 0;

class RealGreeter implements Greeter {
  private readonly lang = inject(LANG);
  constructor() {
    builds++;
  }
  greet(name: string): string {
    return this.lang === 'ar' ? `أهلاً يا ${name}` : `Hello, ${name}`;
  }
}

class FakeGreeter implements Greeter {
  constructor() {
    builds++;
  }
  greet(name: string): string {
    return `[fake] ${name}`;
  }
}

function providersFor(id: RecipeId, lang: Lang) {
  const language = { provide: LANG, useValue: lang };
  switch (id) {
    case 'class':
      return [language, { provide: GREETER, useClass: RealGreeter }];
    case 'fake':
      return [language, { provide: GREETER, useClass: FakeGreeter }];
    case 'value':
      return [language, { provide: GREETER, useValue: { greet: (n: string) => `Hi ${n}` } }];
    case 'factory':
      return [
        language,
        {
          provide: GREETER,
          useFactory: (): Greeter => {
            builds++;
            const l = inject(LANG);
            return { greet: (n: string) => (l === 'ar' ? `مرحباً ${n}` : `Welcome ${n}`) };
          },
        },
      ];
  }
}

/** Builds a real injector with the chosen provider, then asks it for the token twice. */
export function runRecipe(id: RecipeId, lang: Lang): RecipeResult {
  builds = 0;
  const injector = Injector.create({ providers: providersFor(id, lang) });
  const first = injector.get(GREETER);
  const second = injector.get(GREETER);
  return { message: first.greet('Mona'), builds, sameInstance: first === second };
}

/**
 * Pick a provider recipe for one token and see what a caller gets. It runs a real Angular injector,
 * so "builds" and "same instance" are measured, not made up.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-provider-recipe-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Provider recipe">
      @for (r of recipes; track r.id) {
        <button
          type="button"
          [attr.data-testid]="'recipe-' + r.id"
          [attr.aria-pressed]="recipe() === r.id"
          (click)="recipe.set(r.id)"
          class="min-h-11 rounded-xl border px-4 font-mono text-sm transition"
          [class]="recipe() === r.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ r.label }}
        </button>
      }
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-400" role="group" aria-label="Language token">
      <span>LANG token:</span>
      @for (l of langs; track l) {
        <button
          type="button"
          [attr.data-testid]="'lang-' + l"
          [attr.aria-pressed]="lang() === l"
          (click)="lang.set(l)"
          class="min-h-11 rounded-lg border px-3 font-mono text-xs"
          [class]="lang() === l ? 'border-gold-400 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ l }}
        </button>
      }
    </div>

    <p class="mt-3 text-sm text-stone-400" data-testid="recipe-blurb">{{ current().blurb }}</p>
    <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-3 text-xs text-gold-200" data-testid="recipe-code">providers: [ {{ current().code }} ]</pre>

    <div class="mt-3 rounded-xl bg-stone-950 p-4 text-sm text-stone-300" aria-live="polite">
      <p>inject(GREETER).greet('Mona') → <strong class="text-gold-300" data-testid="recipe-message">{{ result().message }}</strong></p>
      <p class="mt-1">Objects built: <strong class="text-gold-300" data-testid="recipe-builds">{{ result().builds }}</strong></p>
      <p class="mt-1">Asked twice, same object: <strong [class]="result().sameInstance ? 'text-emerald-300' : 'text-rose-300'" data-testid="recipe-same">{{ result().sameInstance ? 'yes' : 'no' }}</strong></p>
    </div>
  `,
})
export class ProviderRecipeDemoComponent {
  readonly recipes = RECIPES;
  readonly langs: Lang[] = ['en', 'ar'];
  readonly recipe = signal<RecipeId>('class');
  readonly lang = signal<Lang>('en');

  readonly current = computed<Recipe>(() => RECIPES.find((r) => r.id === this.recipe()) ?? RECIPES[0]);
  readonly result = computed<RecipeResult>(() => runRecipe(this.recipe(), this.lang()));
}
