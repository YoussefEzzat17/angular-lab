import type { TopicId, LessonSection } from '../models/learning.models';

export type TopicGroup = 'fundamentals' | 'forms-navigation' | 'reactivity' | 'services-data' | 'performance' | 'quality' | 'advanced';

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
  { id: 'quality', title: 'Quality & Safety', blurb: 'Test, protect and polish your app' },
  { id: 'advanced', title: 'Going Further', blurb: 'Tools for bigger, real-world apps' },
];

/** Single source of truth for every topic page — order here is the recommended learning path. */
export const TOPICS: Topic[] = [
  {
    id: 'getting-started', group: 'fundamentals', legacyPath: '/getting-started', path: '/learn/getting-started',
    level: 'beginner', prerequisites: [],
    icon: '🚀', title: 'Getting Started', description: 'Install the CLI, create a project, run it, and read what Angular generates for you.',
    sections: [
      { id: 'what-is', title: 'What is Angular?', kind: 'concept', minutes: 4 },
      { id: 'cli', title: 'The Angular CLI', kind: 'concept', minutes: 6 },
      { id: 'project-tour', title: 'A tour of the project', kind: 'concept', minutes: 6 },
      { id: 'first-change', title: 'Your first change', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'components', group: 'fundamentals', legacyPath: '/components', path: '/learn/components',
    level: 'beginner', prerequisites: ['getting-started'],
    icon: '🧱', title: 'Component Essentials', description: 'The building block of every Angular app: a class, a template and styles, tied together by a selector.',
    sections: [
      { id: 'anatomy', title: 'Anatomy of a component', kind: 'concept', minutes: 5 },
      { id: 'selector', title: 'Selectors', kind: 'concept', minutes: 4 },
      { id: 'styling', title: 'Styles and encapsulation', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Build a card', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'binding', group: 'fundamentals', legacyPath: '/binding', path: '/learn/binding',
    level: 'beginner', prerequisites: [],
    icon: '🔗', title: 'Data Binding', description: 'Interpolation, property binding, event binding and two-way binding, side by side.',
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
    sections: [
      { id: 'structural', title: 'Structural Directives', kind: 'concept', minutes: 6 },
      { id: 'track', title: 'track — Keeping Rows Honest', kind: 'concept', minutes: 5 },
      { id: 'attribute', title: 'Attribute Directives', kind: 'concept', minutes: 5 },
      { id: 'built-in', title: 'Built-in Directives', kind: 'reference', minutes: 3 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'template-tools', group: 'fundamentals', legacyPath: '/template-tools', path: '/learn/template-tools',
    level: 'intermediate', prerequisites: ['binding', 'directives'],
    icon: '🧰', title: 'Template Tools', description: 'ng-container, ng-template, @let and ngTemplateOutlet: the small tools for tidy, reusable templates.',
    sections: [
      { id: 'container', title: 'ng-container', kind: 'concept', minutes: 4 },
      { id: 'template', title: 'ng-template', kind: 'concept', minutes: 5 },
      { id: 'let', title: '@let variables', kind: 'concept', minutes: 4 },
      { id: 'outlet', title: 'ngTemplateOutlet', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'communication', group: 'fundamentals', legacyPath: '/communication', path: '/learn/communication',
    level: 'beginner', prerequisites: ['binding'],
    icon: '↔️', title: 'Component Communication', description: 'input(), output() and model() — how a parent and child component talk to each other.',
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
    sections: [
      { id: 'ng-content', title: 'ng-content', kind: 'concept', minutes: 5 },
      { id: 'slots', title: 'Multiple slots', kind: 'concept', minutes: 5 },
      { id: 'queries', title: 'viewChild and contentChild', kind: 'concept', minutes: 7 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'lifecycle', group: 'fundamentals', legacyPath: '/lifecycle', path: '/learn/lifecycle',
    level: 'intermediate', prerequisites: ['components', 'communication'],
    icon: '⏱️', title: 'Component Lifecycle', description: 'When a component is created, shown, updated and destroyed, and where to put code for each moment.',
    sections: [
      { id: 'overview', title: 'The life of a component', kind: 'concept', minutes: 5 },
      { id: 'init-destroy', title: 'Start and clean up', kind: 'concept', minutes: 6 },
      { id: 'render', title: 'After the page renders', kind: 'concept', minutes: 5 },
      { id: 'changes', title: 'Reacting to changes', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Watch it live', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'forms', group: 'forms-navigation', legacyPath: '/forms', path: '/learn/forms',
    level: 'intermediate', prerequisites: ['binding'],
    icon: '📝', title: 'Angular Forms', description: 'Template-driven and reactive forms, with validation, side by side.',
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
    sections: [
      { id: 'basics', title: 'Routes & Router Outlet', kind: 'concept', minutes: 7 },
      { id: 'matching', title: 'How a URL is matched', kind: 'try-it', minutes: 6 },
      { id: 'navigation', title: 'Navigation', kind: 'concept', minutes: 5 },
      { id: 'params', title: 'Route Parameters', kind: 'concept', minutes: 5 },
      { id: 'nested', title: 'Nested routes and resolvers', kind: 'try-it', minutes: 7 },
      { id: 'guards-preview', title: 'Guards Preview', kind: 'reference', minutes: 3 },
    ],
  },
  {
    id: 'guards', group: 'forms-navigation', legacyPath: '/guards', path: '/learn/guards',
    level: 'intermediate', prerequisites: ['routing'],
    icon: '🚧', title: 'Route Guards', description: 'canActivate — decide whether a user may open a page, and where to send them if not.',
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
    sections: [
      { id: 'basics', title: 'signal() Basics', kind: 'concept', minutes: 5 },
      { id: 'computed', title: 'computed()', kind: 'concept', minutes: 6 },
      { id: 'effects', title: 'effect()', kind: 'concept', minutes: 6 },
      { id: 'linked', title: 'linkedSignal()', kind: 'try-it', minutes: 6 },
      { id: 'component-signals', title: 'input() and output()', kind: 'concept', minutes: 4 },
      { id: 'interop', title: 'toSignal() Interop', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'signal-forms', group: 'reactivity', legacyPath: '/signal-forms', path: '/learn/signal-forms',
    level: 'intermediate', prerequisites: ['forms', 'signals'],
    icon: '🧾', title: 'Signal Forms', description: 'Forms built on signals: one model, typed fields, rules in one place. Stable since Angular 22.',
    sections: [
      { id: 'why', title: 'Why Signal Forms?', kind: 'concept', minutes: 4 },
      { id: 'model', title: 'Model and fields', kind: 'concept', minutes: 6 },
      { id: 'validation', title: 'Validation rules', kind: 'concept', minutes: 7 },
      { id: 'submit', title: 'Errors and submit', kind: 'concept', minutes: 6 },
      { id: 'try-it', title: 'Sign-up form', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'rxjs', group: 'reactivity', legacyPath: '/rxjs', path: '/learn/rxjs',
    level: 'advanced', prerequisites: ['signals'],
    icon: '🌊', title: 'RxJS', description: 'Observables, operators like switchMap and debounceTime, and the async pipe.',
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
    sections: [
      { id: 'basics', title: 'inject() Basics', kind: 'concept', minutes: 6 },
      { id: 'service', title: 'Writing a service', kind: 'concept', minutes: 5 },
      { id: 'scope', title: 'Provider Scope', kind: 'concept', minutes: 6 },
      { id: 'providers', title: 'Custom Providers', kind: 'try-it', minutes: 8 },
      { id: 'lazy', title: 'Load a service later', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'movies', group: 'services-data', legacyPath: '/movies', path: '/learn/movies',
    level: 'intermediate', prerequisites: ['di', 'rxjs'],
    icon: '🌐', title: 'Fetch API & HTTP', description: 'HttpClient and services, fetching real data from a public API.',
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
    icon: '🔄', title: 'Change Detection', description: 'Eager vs OnPush — when Angular re-checks a component, and how to make it do less.',
    sections: [
      { id: 'default', title: 'How Angular decides', kind: 'concept', minutes: 6 },
      { id: 'onpush', title: 'OnPush Strategy', kind: 'try-it', minutes: 9 },
      { id: 'signals-cd', title: 'Signals & Change Detection', kind: 'concept', minutes: 4 },
      { id: 'zoneless', title: 'What wakes Angular up', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'lazy-loading', group: 'performance', legacyPath: '/lazy-loading', path: '/learn/lazy-loading',
    level: 'intermediate', prerequisites: ['routing'],
    icon: '📦', title: 'Lazy Loading', description: 'loadComponent and smaller initial bundles for a faster first load.',
    sections: [
      { id: 'basics', title: 'loadComponent', kind: 'concept', minutes: 5 },
      { id: 'bundles', title: 'Bundle Analysis', kind: 'try-it', minutes: 4 },
      { id: 'preloading', title: 'Preloading Strategies', kind: 'concept', minutes: 6 },
      { id: 'devtools', title: 'Measuring with DevTools', kind: 'reference', minutes: 4 },
    ],
  },
  {
    id: 'defer', group: 'performance', legacyPath: '/defer', path: '/learn/defer',
    level: 'intermediate', prerequisites: ['lazy-loading'],
    icon: '⏳', title: '@defer Blocks', description: 'Load parts of a template later: placeholders, triggers and prefetching.',
    sections: [
      { id: 'basics', title: '@defer basics', kind: 'concept', minutes: 5 },
      { id: 'triggers', title: 'Triggers', kind: 'concept', minutes: 6 },
      { id: 'prefetch', title: 'Prefetch and pitfalls', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'Try It', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'images', group: 'performance', legacyPath: '/images', path: '/learn/images',
    level: 'beginner', prerequisites: ['binding'],
    icon: '🖼️', title: 'Optimized Images', description: 'NgOptimizedImage: sharper pages, faster loads and no layout jumps.',
    sections: [
      { id: 'why', title: 'Why images are heavy', kind: 'concept', minutes: 4 },
      { id: 'ngsrc', title: 'ngSrc and size', kind: 'concept', minutes: 6 },
      { id: 'priority', title: 'priority, fill and sizes', kind: 'concept', minutes: 5 },
      { id: 'try-it', title: 'See what Angular adds', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'testing', group: 'quality', legacyPath: '/testing', path: '/learn/testing',
    level: 'intermediate', prerequisites: ['components', 'di'],
    icon: '🧪', title: 'Testing', description: 'Write small tests that check a component or a service, and learn to read a failing test.',
    sections: [
      { id: 'why', title: 'Why test?', kind: 'concept', minutes: 4 },
      { id: 'anatomy', title: 'Anatomy of a test', kind: 'concept', minutes: 6 },
      { id: 'component', title: 'Testing a component', kind: 'concept', minutes: 6 },
      { id: 'runner', title: 'Break it and read the failure', kind: 'try-it', minutes: 7 },
    ],
  },
  {
    id: 'accessibility', group: 'quality', legacyPath: '/accessibility', path: '/learn/accessibility',
    level: 'beginner', prerequisites: ['components'],
    icon: '♿', title: 'Accessibility', description: 'Build pages everyone can use: real elements, the keyboard, screen readers, and Angular Aria.',
    sections: [
      { id: 'why', title: 'Why accessibility?', kind: 'concept', minutes: 4 },
      { id: 'semantic', title: 'Use the right element', kind: 'concept', minutes: 6 },
      { id: 'keyboard', title: 'Keyboard and focus', kind: 'try-it', minutes: 6 },
      { id: 'aria', title: 'Announcing and Angular Aria', kind: 'try-it', minutes: 7 },
    ],
  },
  {
    id: 'security', group: 'quality', legacyPath: '/security', path: '/learn/security',
    level: 'intermediate', prerequisites: ['binding'],
    icon: '🔐', title: 'Security Basics', description: 'How Angular keeps injected scripts out, what it cannot protect, and why bypassing it is risky.',
    sections: [
      { id: 'why', title: 'What are we defending?', kind: 'concept', minutes: 4 },
      { id: 'escaping', title: 'Angular escapes for you', kind: 'try-it', minutes: 6 },
      { id: 'bypass', title: 'The bypass trap', kind: 'concept', minutes: 5 },
      { id: 'practices', title: 'What Angular cannot do', kind: 'concept', minutes: 5 },
    ],
  },
  {
    id: 'error-handling', group: 'quality', legacyPath: '/error-handling', path: '/learn/error-handling',
    level: 'intermediate', prerequisites: ['di', 'rxjs'],
    icon: '🚨', title: 'Error Handling', description: 'Catch errors where they happen, handle the rest in one place, and tell the user clearly.',
    sections: [
      { id: 'why', title: 'Errors will happen', kind: 'concept', minutes: 4 },
      { id: 'local', title: 'Catch it close by', kind: 'concept', minutes: 6 },
      { id: 'global', title: 'One place for the rest', kind: 'concept', minutes: 6 },
      { id: 'ui', title: 'Tell the user', kind: 'try-it', minutes: 6 },
    ],
  },
  {
    id: 'animations', group: 'quality', legacyPath: '/animations', path: '/learn/animations',
    level: 'beginner', prerequisites: ['directives'],
    icon: '✨', title: 'Animations', description: 'animate.enter and animate.leave: smooth arrivals and exits with plain CSS, and respect for reduced motion.',
    sections: [
      { id: 'why', title: 'Why animate?', kind: 'concept', minutes: 4 },
      { id: 'enter-leave', title: 'Enter and leave', kind: 'try-it', minutes: 6 },
      { id: 'css', title: 'The CSS behind it', kind: 'concept', minutes: 5 },
      { id: 'motion', title: 'Reduced motion', kind: 'concept', minutes: 4 },
    ],
  },
  {
    id: 'dynamic-components', group: 'advanced', legacyPath: '/dynamic-components', path: '/learn/dynamic-components',
    level: 'advanced', prerequisites: ['components', 'template-tools'],
    icon: '🧩', title: 'Dynamic Components', description: 'Choose which component to show at run time, with ngComponentOutlet or in code.',
    sections: [
      { id: 'why', title: 'Why dynamic?', kind: 'concept', minutes: 4 },
      { id: 'outlet', title: 'ngComponentOutlet', kind: 'try-it', minutes: 6 },
      { id: 'create', title: 'Create it in code', kind: 'try-it', minutes: 7 },
      { id: 'when', title: 'Which tool?', kind: 'concept', minutes: 4 },
    ],
  },
  {
    id: 'drag-drop', group: 'advanced', legacyPath: '/drag-drop', path: '/learn/drag-drop',
    level: 'intermediate', prerequisites: ['components', 'directives'],
    icon: '🧲', title: 'Drag and Drop', description: 'Reorder lists and move items between lists with the CDK, and keep it usable without a mouse.',
    sections: [
      { id: 'why', title: 'Why the CDK?', kind: 'concept', minutes: 4 },
      { id: 'list', title: 'Reorder a list', kind: 'try-it', minutes: 6 },
      { id: 'lists', title: 'Between lists', kind: 'try-it', minutes: 7 },
      { id: 'a11y', title: 'Without a mouse', kind: 'concept', minutes: 5 },
    ],
  },
  {
    id: 'i18n', group: 'advanced', legacyPath: '/i18n', path: '/learn/i18n',
    level: 'intermediate', prerequisites: ['binding', 'pipes'],
    icon: '🌍', title: 'Internationalization', description: 'Show dates, numbers and text the way each reader expects, and support right-to-left languages.',
    sections: [
      { id: 'why', title: 'What is a locale?', kind: 'concept', minutes: 4 },
      { id: 'formats', title: 'Dates, money and numbers', kind: 'try-it', minutes: 6 },
      { id: 'plurals', title: 'Plurals', kind: 'try-it', minutes: 5 },
      { id: 'translate', title: 'Translating text', kind: 'concept', minutes: 6 },
      { id: 'direction', title: 'Right to left', kind: 'try-it', minutes: 5 },
    ],
  },
  {
    id: 'ssr', group: 'advanced', legacyPath: '/ssr', path: '/learn/ssr',
    level: 'advanced', prerequisites: ['components', 'lifecycle', 'lazy-loading'],
    icon: '🖥️', title: 'SSR and Hydration', description: 'Send ready-made HTML first, then make it interactive: server rendering, prerendering and hydration.',
    sections: [
      { id: 'why', title: 'Why render on a server?', kind: 'concept', minutes: 5 },
      { id: 'modes', title: 'Three ways to render', kind: 'try-it', minutes: 6 },
      { id: 'browser-only', title: 'Browser-only code', kind: 'try-it', minutes: 6 },
      { id: 'routes', title: 'Modes per route', kind: 'concept', minutes: 5 },
    ],
  },
  {
    id: 'devtools', group: 'advanced', legacyPath: '/devtools', path: '/learn/devtools',
    level: 'intermediate', prerequisites: ['components', 'change-detection'],
    icon: '🛠️', title: 'DevTools and Style Guide', description: 'Inspect a running app, and write code the way the Angular style guide recommends.',
    sections: [
      { id: 'why', title: 'Tools of the trade', kind: 'concept', minutes: 4 },
      { id: 'devtools', title: 'Angular DevTools', kind: 'concept', minutes: 6 },
      { id: 'style', title: 'Review a component', kind: 'try-it', minutes: 7 },
      { id: 'naming', title: 'Naming and structure', kind: 'concept', minutes: 5 },
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
