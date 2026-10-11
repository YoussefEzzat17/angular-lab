export type TopicGroup = 'fundamentals' | 'forms-navigation' | 'reactivity' | 'services-data' | 'performance';

export interface Topic {
  path: string;
  icon: string;
  title: string;
  description: string;
  group: TopicGroup;
}

export interface TopicGroupInfo {
  id: TopicGroup;
  title: string;
  blurb: string;
}

/** Display order of the groups. TOPICS below must stay sorted by this order so Next/Previous follow the same path. */
export const TOPIC_GROUPS: TopicGroupInfo[] = [
  { id: 'fundamentals', title: 'Fundamentals', blurb: 'How templates and components work' },
  { id: 'forms-navigation', title: 'Forms & Navigation', blurb: 'Collect input and move between pages' },
  { id: 'reactivity', title: 'Reactivity', blurb: 'State that updates itself' },
  { id: 'services-data', title: 'Services & Data', blurb: 'Share logic and talk to a server' },
  { id: 'performance', title: 'Performance', blurb: 'Faster, leaner apps' },
];

/** Single source of truth for every topic page — order here is the recommended learning path. */
export const TOPICS: Topic[] = [
  { group: 'fundamentals', path: '/binding', icon: '🔗', title: 'Data Binding', description: 'Interpolation, property binding, event binding and two-way binding, side by side.' },
  { group: 'fundamentals', path: '/pipes', icon: '🧪', title: 'Pipes', description: 'Format dates, prices and text right in the template with | pipeName.' },
  { group: 'fundamentals', path: '/directives', icon: '⚙️', title: 'Directives', description: 'Give plain HTML extra behavior with structural and attribute directives.' },
  { group: 'fundamentals', path: '/communication', icon: '↔️', title: 'Component Communication', description: '@Input() and @Output() — how a parent and child component talk to each other.' },
  { group: 'forms-navigation', path: '/forms', icon: '📝', title: 'Angular Forms', description: 'Template-driven and reactive forms, with validation, side by side.' },
  { group: 'forms-navigation', path: '/routing', icon: '🧭', title: 'Routing', description: 'Routes, router-outlet, routerLink and reading route parameters.' },
  { group: 'forms-navigation', path: '/guards', icon: '🚧', title: 'Route Guards', description: 'canActivate — decide whether a user may open a page, and where to send them if not.' },
  { group: 'reactivity', path: '/signals', icon: '📡', title: 'Signals', description: "signal(), computed() and effect() — Angular's modern reactive state." },
  { group: 'reactivity', path: '/rxjs', icon: '🌊', title: 'RxJS', description: 'Observables, operators like switchMap and debounceTime, and the async pipe.' },
  { group: 'services-data', path: '/di', icon: '💉', title: 'Dependency Injection', description: 'inject(), providers and scope — who creates a service, and who shares it.' },
  { group: 'services-data', path: '/movies', icon: '🌐', title: 'Fetch API & HTTP', description: 'HttpClient and services, fetching real data from a public API.' },
  { group: 'services-data', path: '/interceptor', icon: '🛡️', title: 'HttpInterceptor', description: 'One checkpoint that every outgoing request and incoming response passes through.' },
  { group: 'services-data', path: '/facade', icon: '🏛️', title: 'Facade Pattern', description: 'One simple front door over several services — how to keep components small and logic in one place.' },
  { group: 'performance', path: '/change-detection', icon: '🔄', title: 'Change Detection', description: 'Default vs OnPush — when Angular re-checks a component, and how to make it do less.' },
  { group: 'performance', path: '/lazy-loading', icon: '📦', title: 'Lazy Loading', description: 'loadComponent and smaller initial bundles for a faster first load.' },
];

/** Topics bucketed by group, in display order — what the navbar and home page render. */
export const GROUPED_TOPICS = TOPIC_GROUPS.map((group) => ({
  ...group,
  topics: TOPICS.filter((topic) => topic.group === group.id),
}));

export interface DemoLink {
  path: string;
  label: string;
}

export const DEMO_LINKS: DemoLink[] = [
  { path: '/products', label: 'Browse titles' },
  { path: '/favorites', label: 'My List' },
];
