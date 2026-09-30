export interface Topic {
  path: string;
  icon: string;
  title: string;
  description: string;
}

/** Single source of truth for every topic page — order here is the recommended learning path. */
export const TOPICS: Topic[] = [
  { path: '/binding', icon: '🔗', title: 'Data Binding', description: 'Interpolation, property binding, event binding and two-way binding, side by side.' },
  { path: '/pipes', icon: '🧪', title: 'Pipes', description: 'Format dates, prices and text right in the template with | pipeName.' },
  { path: '/directives', icon: '⚙️', title: 'Directives', description: 'Give plain HTML extra behavior with structural and attribute directives.' },
  { path: '/forms', icon: '📝', title: 'Angular Forms', description: 'Template-driven and reactive forms, with validation, side by side.' },
  { path: '/communication', icon: '↔️', title: 'Component Communication', description: '@Input() and @Output() — how a parent and child component talk to each other.' },
  { path: '/routing', icon: '🧭', title: 'Routing', description: 'Routes, router-outlet, routerLink and reading route parameters.' },
  { path: '/signals', icon: '📡', title: 'Signals', description: "signal(), computed() and effect() — Angular's modern reactive state." },
  { path: '/movies', icon: '🌐', title: 'Fetch API & HTTP', description: 'HttpClient and services, fetching real data from a public API.' },
  { path: '/rxjs', icon: '🌊', title: 'RxJS', description: 'Observables, operators like switchMap and debounceTime, and the async pipe.' },
  { path: '/lazy-loading', icon: '📦', title: 'Lazy Loading', description: 'loadComponent and smaller initial bundles for a faster first load.' },
  { path: '/interceptor', icon: '🛡️', title: 'HttpInterceptor', description: 'One checkpoint that every outgoing request and incoming response passes through.' },
];

export interface DemoLink {
  path: string;
  label: string;
}

export const DEMO_LINKS: DemoLink[] = [
  { path: '/products', label: 'Browse titles' },
  { path: '/favorites', label: 'My List' },
];
