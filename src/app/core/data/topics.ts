import type { TopicId, LessonSection, TopicObjective } from '../models/learning.models';

export type TopicGroup = 'fundamentals' | 'forms-navigation' | 'reactivity' | 'services-data' | 'performance';

export type TopicLevel = 'beginner' | 'intermediate' | 'advanced';

export const LEVEL_LABEL: Record<TopicLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export interface Topic {
  id: TopicId;
  /** Current route, e.g. '/learn/binding'. */
  path: string;
  /** Old route, e.g. '/binding'. Kept for progress migration and navbar matching until Phase 2 ships. */
  legacyPath: string;
  icon: string;
  title: string;
  description: string;
  group: TopicGroup;
  /** How much Angular you should already know. */
  level: TopicLevel;
  /** Topics worth finishing first. Every entry comes earlier in the learning path. */
  prerequisites: TopicId[];
  sections: LessonSection[];
  objectives: TopicObjective[];
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
  {
    id: 'binding', group: 'fundamentals', legacyPath: '/binding', path: '/learn/binding',
    level: 'beginner', prerequisites: [],
    icon: '🔗', title: 'Data Binding', description: 'Interpolation, property binding, event binding and two-way binding, side by side.',
    objectives: [
      { text: 'Explain which way data flows for each of the four kinds of binding', sectionId: 'overview' },
      { text: 'Use {{ }} to display component data in the template', sectionId: 'interpolation' },
      { text: 'Bind element properties with [property]="value", and know why it is a property and not an attribute', sectionId: 'property-binding' },
      { text: 'Listen to DOM events with (event)="handler($event)"', sectionId: 'event-binding' },
      { text: 'Use [(ngModel)] for two-way binding on form inputs', sectionId: 'two-way' },
      { text: 'Pick the right binding for a job', sectionId: 'practice' },
    ],
    sections: [
      { id: 'overview', title: 'The big picture', kind: 'concept', minutes: 5 },
      { id: 'interpolation', title: 'Interpolation', kind: 'concept', minutes: 4 },
      { id: 'property-binding', title: 'Property Binding', kind: 'concept', minutes: 6 },
      { id: 'event-binding', title: 'Event Binding', kind: 'concept', minutes: 5 },
      { id: 'two-way', title: 'Two-Way Binding', kind: 'try-it', minutes: 5 },
      { id: 'practice', title: 'Practice', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'pipes', group: 'fundamentals', legacyPath: '/pipes', path: '/learn/pipes',
    level: 'beginner', prerequisites: ['binding'],
    icon: '🧪', title: 'Pipes', description: 'Format dates, prices and text right in the template with | pipeName.',
    objectives: [
      { text: 'Format values in templates using built-in pipes and their arguments', sectionId: 'builtin' },
      { text: 'Chain multiple pipes together, and predict how the order changes the result', sectionId: 'chain' },
      { text: 'Create a custom pipe with @Pipe', sectionId: 'custom' },
      { text: 'Explain why a pure pipe is cheaper than a method call, and when a pipe is impure', sectionId: 'pure-impure' },
    ],
    sections: [
      { id: 'builtin', title: 'Built-in Pipes', kind: 'concept', minutes: 6 },
      { id: 'chain', title: 'Chaining Pipes', kind: 'try-it', minutes: 5 },
      { id: 'custom', title: 'Custom Pipes', kind: 'concept', minutes: 5 },
      { id: 'pure-impure', title: 'Pure vs Impure', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'directives', group: 'fundamentals', legacyPath: '/directives', path: '/learn/directives',
    level: 'beginner', prerequisites: ['binding'],
    icon: '⚙️', title: 'Directives', description: 'Give plain HTML extra behavior with structural and attribute directives.',
    objectives: [
      { text: 'Use @if, @else and @for in templates', sectionId: 'structural' },
      { text: 'Choose a track expression that keeps rows tied to the right item', sectionId: 'track' },
      { text: 'Build an attribute directive that changes host element behavior', sectionId: 'attribute' },
      { text: 'Apply multiple directives to one element', sectionId: 'try-it' },
    ],
    sections: [
      { id: 'structural', title: 'Structural Directives', kind: 'concept', minutes: 6 },
      { id: 'track', title: 'track — Keeping Rows Honest', kind: 'concept', minutes: 5 },
      { id: 'attribute', title: 'Attribute Directives', kind: 'concept', minutes: 5 },
      { id: 'built-in', title: 'Built-in Directives', kind: 'reference', minutes: 3 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'communication', group: 'fundamentals', legacyPath: '/communication', path: '/learn/communication',
    level: 'beginner', prerequisites: ['binding'],
    icon: '↔️', title: 'Component Communication', description: 'input(), output() and model() — how a parent and child component talk to each other.',
    objectives: [
      { text: 'Pass data from parent to child with input() and input.required()', sectionId: 'input' },
      { text: 'Emit events from child to parent with output(), and name them well', sectionId: 'output' },
      { text: 'Let a child edit a value the parent owns with model()', sectionId: 'model' },
      { text: 'Choose between input, output, model, a service and ng-content', sectionId: 'when-service' },
    ],
    sections: [
      { id: 'input', title: 'input() — Parent to Child', kind: 'concept', minutes: 6 },
      { id: 'output', title: 'output() — Child to Parent', kind: 'concept', minutes: 5 },
      { id: 'model', title: 'model() — Two-way', kind: 'try-it', minutes: 5 },
      { id: 'when-service', title: 'Which tool?', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'content-projection', group: 'fundamentals', legacyPath: '/content-projection', path: '/learn/content-projection',
    level: 'intermediate', prerequisites: ['communication'],
    icon: '🧩', title: 'Content Projection & Queries', description: 'ng-content slots for reusable wrappers, and viewChild / contentChild to reach what is inside.',
    objectives: [
      { text: 'Build a wrapper component that shows whatever markup its parent puts inside it', sectionId: 'ng-content' },
      { text: 'Use select to create named slots such as a title and a footer', sectionId: 'slots' },
      { text: 'Read child components and elements with viewChild, contentChild and contentChildren', sectionId: 'queries' },
    ],
    sections: [
      { id: 'ng-content', title: 'ng-content', kind: 'concept', minutes: 5 },
      { id: 'slots', title: 'Multiple slots', kind: 'concept', minutes: 5 },
      { id: 'queries', title: 'viewChild and contentChild', kind: 'concept', minutes: 7 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'forms', group: 'forms-navigation', legacyPath: '/forms', path: '/learn/forms',
    level: 'intermediate', prerequisites: ['binding'],
    icon: '📝', title: 'Angular Forms', description: 'Template-driven and reactive forms, with validation, side by side.',
    objectives: [
      { text: 'Build a form with template-driven approach using ngModel', sectionId: 'template-driven' },
      { text: 'Build a form with reactive approach using FormGroup', sectionId: 'reactive' },
      { text: 'Add validation, write a custom validator and show error messages', sectionId: 'validation' },
      { text: 'Read touched, dirty and errors from a control', sectionId: 'validation' },
      { text: 'Choose between template-driven and reactive forms', sectionId: 'comparison' },
    ],
    sections: [
      { id: 'template-driven', title: 'Template-Driven Forms', kind: 'concept', minutes: 7 },
      { id: 'reactive', title: 'Reactive Forms', kind: 'concept', minutes: 6 },
      { id: 'validation', title: 'Validation', kind: 'concept', minutes: 8 },
      { id: 'comparison', title: 'Side-by-Side Comparison', kind: 'reference', minutes: 4 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'routing', group: 'forms-navigation', legacyPath: '/routing', path: '/learn/routing',
    level: 'intermediate', prerequisites: ['binding'],
    icon: '🧭', title: 'Routing', description: 'Routes, router-outlet, routerLink and reading route parameters.',
    objectives: [
      { text: 'Define routes and render them with router-outlet', sectionId: 'basics' },
      { text: 'Predict which route a URL matches, and why order and ** matter', sectionId: 'matching' },
      { text: 'Navigate with routerLink and the Router service', sectionId: 'navigation' },
      { text: 'Read route parameters and query params, preferably as inputs', sectionId: 'params' },
      { text: 'Know what a guard does before the next topic', sectionId: 'guards-preview' },
    ],
    sections: [
      { id: 'basics', title: 'Routes & Router Outlet', kind: 'concept', minutes: 7 },
      { id: 'matching', title: 'How a URL is matched', kind: 'try-it', minutes: 6 },
      { id: 'navigation', title: 'Navigation', kind: 'concept', minutes: 5 },
      { id: 'params', title: 'Route Parameters', kind: 'concept', minutes: 5 },
      { id: 'guards-preview', title: 'Guards Preview', kind: 'reference', minutes: 3 },
    ],
  },
  {
    id: 'guards', group: 'forms-navigation', legacyPath: '/guards', path: '/learn/guards',
    level: 'intermediate', prerequisites: ['routing'],
    icon: '🚧', title: 'Route Guards', description: 'canActivate — decide whether a user may open a page, and where to send them if not.',
    objectives: [
      { text: 'Explain why a router needs guards, and why a guard is not real security', sectionId: 'why' },
      { text: 'Write a canActivate guard function with inject()', sectionId: 'can-activate' },
      { text: 'Return true, false or a UrlTree, and know what each one does', sectionId: 'can-activate' },
      { text: 'Know when to use each of the 5 guard types', sectionId: 'five-kinds' },
    ],
    sections: [
      { id: 'why', title: 'Why guards', kind: 'concept', minutes: 4 },
      { id: 'can-activate', title: 'canActivate', kind: 'concept', minutes: 6 },
      { id: 'simulator', title: 'Guard simulator', kind: 'try-it', minutes: 5 },
      { id: 'try-it', title: 'Try It for real', kind: 'try-it', minutes: 5 },
      { id: 'five-kinds', title: 'The Five Guard Types', kind: 'reference', minutes: 5 },
    ],
  },
  {
    id: 'signals', group: 'reactivity', legacyPath: '/signals', path: '/learn/signals',
    level: 'intermediate', prerequisites: ['binding'],
    icon: '📡', title: 'Signals', description: "signal(), computed() and effect() — Angular's modern reactive state.",
    objectives: [
      { text: 'Create and update a signal with signal() and .set()/.update()', sectionId: 'basics' },
      { text: 'Derive values automatically with computed(), and explain why it is lazy and cached', sectionId: 'computed' },
      { text: 'Run side effects when signals change with effect()', sectionId: 'effects' },
      { text: 'Use input() and output() in components', sectionId: 'component-signals' },
      { text: 'Convert between Observables and signals with toSignal() and toObservable()', sectionId: 'interop' },
    ],
    sections: [
      { id: 'basics', title: 'signal() Basics', kind: 'concept', minutes: 5 },
      { id: 'computed', title: 'computed()', kind: 'concept', minutes: 6 },
      { id: 'effects', title: 'effect()', kind: 'concept', minutes: 6 },
      { id: 'component-signals', title: 'input() and output()', kind: 'concept', minutes: 4 },
      { id: 'interop', title: 'toSignal() Interop', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'rxjs', group: 'reactivity', legacyPath: '/rxjs', path: '/learn/rxjs',
    level: 'advanced', prerequisites: ['signals'],
    icon: '🌊', title: 'RxJS', description: 'Observables, operators like switchMap and debounceTime, and the async pipe.',
    objectives: [
      { text: 'Understand what an Observable is and how to subscribe', sectionId: 'observables' },
      { text: 'Read a marble diagram and use map, filter, debounceTime, take and scan', sectionId: 'operators' },
      { text: 'Choose between switchMap, mergeMap and concatMap', sectionId: 'operators' },
      { text: 'Use the async pipe to handle subscriptions in templates', sectionId: 'async-pipe' },
      { text: 'Share values between components with Subject, BehaviorSubject and ReplaySubject', sectionId: 'subjects' },
      { text: 'Avoid memory leaks with takeUntilDestroyed', sectionId: 'memory-leaks' },
    ],
    sections: [
      { id: 'observables', title: 'Observables', kind: 'concept', minutes: 5 },
      { id: 'operators', title: 'Operators', kind: 'concept', minutes: 11 },
      { id: 'async-pipe', title: 'async Pipe', kind: 'concept', minutes: 4 },
      { id: 'subjects', title: 'Subjects', kind: 'concept', minutes: 8 },
      { id: 'memory-leaks', title: 'Memory Leaks', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'di', group: 'services-data', legacyPath: '/di', path: '/learn/di',
    level: 'intermediate', prerequisites: ['communication'],
    icon: '💉', title: 'Dependency Injection', description: 'inject(), providers and scope — who creates a service, and who shares it.',
    objectives: [
      { text: 'Inject a service into a component with inject()', sectionId: 'basics' },
      { text: 'Understand root vs component scope', sectionId: 'scope' },
      { text: 'Provide an alternative implementation for testing', sectionId: 'providers' },
      { text: 'Create an InjectionToken and choose between useClass, useValue and useFactory', sectionId: 'providers' },
    ],
    sections: [
      { id: 'basics', title: 'inject() Basics', kind: 'concept', minutes: 6 },
      { id: 'scope', title: 'Provider Scope', kind: 'concept', minutes: 6 },
      { id: 'providers', title: 'Custom Providers', kind: 'try-it', minutes: 8 },
    ],
  },
  {
    id: 'movies', group: 'services-data', legacyPath: '/movies', path: '/learn/movies',
    level: 'intermediate', prerequisites: ['di', 'rxjs'],
    icon: '🌐', title: 'Fetch API & HTTP', description: 'HttpClient and services, fetching real data from a public API.',
    objectives: [
      { text: 'Provide and inject HttpClient, and explain why the data arrives later', sectionId: 'httpclient' },
      { text: 'Read a request and a status code, and know when your code gets next() or error()', sectionId: 'request-anatomy' },
      { text: 'Wrap HTTP calls in a typed service', sectionId: 'service-pattern' },
      { text: 'Explain why every subscriber starts its own request, and how to share one', sectionId: 'cold' },
      { text: 'Handle loading, empty and error states', sectionId: 'states' },
    ],
    sections: [
      { id: 'httpclient', title: 'HttpClient', kind: 'concept', minutes: 7 },
      { id: 'request-anatomy', title: 'Requests and status codes', kind: 'try-it', minutes: 6 },
      { id: 'service-pattern', title: 'Service Pattern', kind: 'concept', minutes: 5 },
      { id: 'cold', title: 'Cold Observables', kind: 'try-it', minutes: 5 },
      { id: 'states', title: 'Loading & Error States', kind: 'concept', minutes: 4 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 7 },
    ],
  },
  {
    id: 'resource', group: 'services-data', legacyPath: '/resource', path: '/learn/resource',
    level: 'advanced', prerequisites: ['signals', 'movies'],
    icon: '📦', title: 'Resource API', description: 'resource(), rxResource() and httpResource(): async data with loading and error state built in.',
    objectives: [
      { text: 'Load async data with resource() and read its value, status and error as signals', sectionId: 'basics' },
      { text: 'Tell the six resource statuses apart and know when each one happens', sectionId: 'states' },
      { text: 'Choose between resource, rxResource and httpResource', sectionId: 'http-rx' },
    ],
    sections: [
      { id: 'basics', title: 'resource() basics', kind: 'concept', minutes: 7 },
      { id: 'states', title: 'Statuses', kind: 'concept', minutes: 5 },
      { id: 'http-rx', title: 'httpResource and rxResource', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'interceptor', group: 'services-data', legacyPath: '/interceptor', path: '/learn/interceptor',
    level: 'advanced', prerequisites: ['movies'],
    icon: '🛡️', title: 'HttpInterceptor', description: 'One checkpoint that every outgoing request and incoming response passes through.',
    objectives: [
      { text: 'Write a functional interceptor', sectionId: 'basics' },
      { text: 'Add auth headers to every request', sectionId: 'auth-header' },
      { text: 'Handle errors globally in an interceptor', sectionId: 'error-handling' },
      { text: 'Chain multiple interceptors and predict what each one sees', sectionId: 'chaining' },
    ],
    sections: [
      { id: 'basics', title: 'What is an Interceptor?', kind: 'concept', minutes: 5 },
      { id: 'auth-header', title: 'Adding Auth Headers', kind: 'concept', minutes: 5 },
      { id: 'error-handling', title: 'Error Handling', kind: 'concept', minutes: 5 },
      { id: 'chaining', title: 'Chaining Interceptors', kind: 'concept', minutes: 7 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'facade', group: 'services-data', legacyPath: '/facade', path: '/learn/facade',
    level: 'advanced', prerequisites: ['di'],
    icon: '🏛️', title: 'Facade Pattern', description: 'One simple front door over several services — how to keep components small and logic in one place.',
    objectives: [
      { text: 'Explain the problem the Facade pattern solves', sectionId: 'problem' },
      { text: 'Build a Facade service that wraps multiple services', sectionId: 'building' },
      { text: 'Wire a component to use only the Facade', sectionId: 'wiring' },
    ],
    sections: [
      { id: 'problem', title: 'The Problem', kind: 'concept', minutes: 4 },
      { id: 'services-overview', title: 'The Underlying Services', kind: 'concept', minutes: 5 },
      { id: 'building', title: 'Building the Facade', kind: 'concept', minutes: 6 },
      { id: 'wiring', title: 'Wiring to the Component', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
      { id: 'patterns', title: 'Patterns & Pitfalls', kind: 'reference', minutes: 4 },
      { id: 'knowledge-check', title: 'Knowledge Check', kind: 'reference', minutes: 5 },
    ],
  },
  {
    id: 'change-detection', group: 'performance', legacyPath: '/change-detection', path: '/learn/change-detection',
    level: 'advanced', prerequisites: ['signals', 'communication'],
    icon: '🔄', title: 'Change Detection', description: 'Default vs OnPush — when Angular re-checks a component, and how to make it do less.',
    objectives: [
      { text: "Explain how Angular's Default change detection works", sectionId: 'default' },
      { text: 'Switch a component to OnPush and know when it re-renders', sectionId: 'onpush' },
      { text: 'Use Signals as an alternative to manual change detection', sectionId: 'signals-cd' },
    ],
    sections: [
      { id: 'default', title: 'Default Change Detection', kind: 'concept', minutes: 6 },
      { id: 'onpush', title: 'OnPush Strategy', kind: 'concept', minutes: 9 },
      { id: 'signals-cd', title: 'Signals & Change Detection', kind: 'concept', minutes: 4 },
    ],
  },
  {
    id: 'lazy-loading', group: 'performance', legacyPath: '/lazy-loading', path: '/learn/lazy-loading',
    level: 'intermediate', prerequisites: ['routing'],
    icon: '📦', title: 'Lazy Loading', description: 'loadComponent and smaller initial bundles for a faster first load.',
    objectives: [
      { text: 'Configure a route with loadComponent for lazy loading', sectionId: 'basics' },
      { text: 'Understand how lazy loading affects bundle size', sectionId: 'bundles' },
      { text: 'Compare preloading strategies by waiting time and background data', sectionId: 'preloading' },
      { text: 'Measure the impact with DevTools', sectionId: 'devtools' },
    ],
    sections: [
      { id: 'basics', title: 'loadComponent', kind: 'concept', minutes: 5 },
      { id: 'bundles', title: 'Bundle Analysis', kind: 'concept', minutes: 4 },
      { id: 'preloading', title: 'Preloading Strategies', kind: 'concept', minutes: 6 },
      { id: 'devtools', title: 'Measuring with DevTools', kind: 'reference', minutes: 4 },
    ],
  },
  {
    id: 'defer', group: 'performance', legacyPath: '/defer', path: '/learn/defer',
    level: 'intermediate', prerequisites: ['lazy-loading'],
    icon: '⏳', title: '@defer Blocks', description: 'Load parts of a template later: placeholders, triggers and prefetching.',
    objectives: [
      { text: 'Wrap heavy content in @defer with @placeholder, @loading and @error', sectionId: 'basics' },
      { text: 'Pick the right trigger: viewport, interaction, timer or a condition', sectionId: 'triggers' },
      { text: 'Prefetch content early, and know when not to defer', sectionId: 'prefetch' },
    ],
    sections: [
      { id: 'basics', title: '@defer basics', kind: 'concept', minutes: 5 },
      { id: 'triggers', title: 'Triggers', kind: 'concept', minutes: 6 },
      { id: 'prefetch', title: 'Prefetch and pitfalls', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
];

/** Topics bucketed by group, in display order — what the navbar and home page render. */
/** Total reading and practice time of a topic, in minutes. */
export function topicMinutes(topic: Topic): number {
  return topic.sections.reduce((sum, section) => sum + section.minutes, 0);
}

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
