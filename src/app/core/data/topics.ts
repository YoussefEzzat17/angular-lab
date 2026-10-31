import type { TopicId, LessonSection, TopicObjective } from '../models/learning.models';

export type TopicGroup = 'fundamentals' | 'forms-navigation' | 'reactivity' | 'services-data' | 'performance' | 'quality';

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
  { id: 'quality', title: 'Quality & Safety', blurb: 'Test, protect and polish your app' },
];

/** Single source of truth for every topic page — order here is the recommended learning path. */
export const TOPICS: Topic[] = [
  {
    id: 'getting-started', group: 'fundamentals', legacyPath: '/getting-started', path: '/learn/getting-started',
    level: 'beginner', prerequisites: [],
    icon: '🚀', title: 'Getting Started', description: 'Install the CLI, create a project, run it, and read what Angular generates for you.',
    objectives: [
      { text: 'Say what Angular is and what it gives you', sectionId: 'what-is' },
      { text: 'Create, run and build a project with the Angular CLI', sectionId: 'cli' },
      { text: "Find your way around a new project's files", sectionId: 'project-tour' },
      { text: 'Change the app and see it update in the browser', sectionId: 'first-change' },
    ],
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
    objectives: [
      { text: 'Name the three parts of a component and what each does', sectionId: 'anatomy' },
      { text: 'Choose a selector and use a component in another template', sectionId: 'selector' },
      { text: 'Style a component without leaking into the rest of the page', sectionId: 'styling' },
      { text: 'Build a small reusable component from scratch', sectionId: 'try-it' },
    ],
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
    id: 'template-tools', group: 'fundamentals', legacyPath: '/template-tools', path: '/learn/template-tools',
    level: 'intermediate', prerequisites: ['binding', 'directives'],
    icon: '🧰', title: 'Template Tools', description: 'ng-container, ng-template, @let and ngTemplateOutlet: the small tools for tidy, reusable templates.',
    objectives: [
      { text: 'Group elements without adding extra HTML using ng-container', sectionId: 'container' },
      { text: 'Define a template fragment with ng-template and reuse it', sectionId: 'template' },
      { text: 'Save a value in the template with @let', sectionId: 'let' },
      { text: 'Render a template where you choose with ngTemplateOutlet', sectionId: 'outlet' },
      { text: 'Combine them in a real list', sectionId: 'try-it' },
    ],
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
    id: 'lifecycle', group: 'fundamentals', legacyPath: '/lifecycle', path: '/learn/lifecycle',
    level: 'intermediate', prerequisites: ['components', 'communication'],
    icon: '⏱️', title: 'Component Lifecycle', description: 'When a component is created, shown, updated and destroyed, and where to put code for each moment.',
    objectives: [
      { text: 'Put the lifecycle moments in order', sectionId: 'overview' },
      { text: 'Start work in ngOnInit and clean up in ngOnDestroy or DestroyRef', sectionId: 'init-destroy' },
      { text: 'Touch the DOM safely with afterNextRender', sectionId: 'render' },
      { text: 'React to input changes with ngOnChanges, computed() or effect()', sectionId: 'changes' },
      { text: 'Watch a real component being created and destroyed', sectionId: 'try-it' },
    ],
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
      { text: 'Nest routes inside a layout, and load data before a page opens with a resolver', sectionId: 'nested' },
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
      { id: 'nested', title: 'Nested routes and resolvers', kind: 'try-it', minutes: 7 },
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
      { text: 'Use linkedSignal() for a value that follows another signal but can also be set by hand', sectionId: 'linked' },
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
    objectives: [
      { text: 'Explain how Signal Forms differ from reactive and template-driven forms', sectionId: 'why' },
      { text: 'Create a form from a signal model and bind it with [formField]', sectionId: 'model' },
      { text: 'Add rules such as required, email and minLength', sectionId: 'validation' },
      { text: 'Show errors, and submit only when the form is valid', sectionId: 'submit' },
      { text: 'Build a working sign-up form', sectionId: 'try-it' },
    ],
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
      { text: 'Write a service with @Service(), and load a heavy one only when needed with injectAsync()', sectionId: 'service' },
      { text: 'Inject a service into a component with inject()', sectionId: 'basics' },
      { text: 'Understand root vs component scope', sectionId: 'scope' },
      { text: 'Provide an alternative implementation for testing', sectionId: 'providers' },
      { text: 'Create an InjectionToken and choose between useClass, useValue and useFactory', sectionId: 'providers' },
    ],
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
    icon: '🔄', title: 'Change Detection', description: 'Eager vs OnPush — when Angular re-checks a component, and how to make it do less.',
    objectives: [
      { text: 'Explain how Angular decides which components to re-check', sectionId: 'default' },
      { text: 'Switch a component to OnPush and know when it re-renders', sectionId: 'onpush' },
      { text: 'Use Signals as an alternative to manual change detection', sectionId: 'signals-cd' },
      { text: 'Name what schedules a check, with or without zone.js', sectionId: 'zoneless' },
    ],
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
    objectives: [
      { text: 'Configure a route with loadComponent for lazy loading', sectionId: 'basics' },
      { text: 'Understand how lazy loading affects bundle size', sectionId: 'bundles' },
      { text: 'Compare preloading strategies by waiting time and background data', sectionId: 'preloading' },
      { text: 'Measure the impact with DevTools', sectionId: 'devtools' },
    ],
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
  {
    id: 'images', group: 'performance', legacyPath: '/images', path: '/learn/images',
    level: 'beginner', prerequisites: ['binding'],
    icon: '🖼️', title: 'Optimized Images', description: 'NgOptimizedImage: sharper pages, faster loads and no layout jumps.',
    objectives: [
      { text: 'Explain why plain images hurt speed and layout', sectionId: 'why' },
      { text: 'Use ngSrc with a width and a height', sectionId: 'ngsrc' },
      { text: 'Mark the main image with priority, and use fill and sizes', sectionId: 'priority' },
      { text: 'Read what Angular adds to an image tag', sectionId: 'try-it' },
    ],
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
    objectives: [
      { text: 'Say why tests save time, and name the three parts of a test', sectionId: 'why' },
      { text: 'Read a test written as arrange, act, assert', sectionId: 'anatomy' },
      { text: 'Test a component with TestBed and a fixture', sectionId: 'component' },
      { text: 'Run tests, break the code on purpose, and read the failure', sectionId: 'runner' },
    ],
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
    objectives: [
      { text: 'Explain who accessibility helps and why', sectionId: 'why' },
      { text: 'Pick the right HTML element instead of a styled div', sectionId: 'semantic' },
      { text: 'Make a page usable with the keyboard alone', sectionId: 'keyboard' },
      { text: 'Announce changes and use an Angular Aria component', sectionId: 'aria' },
    ],
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
    objectives: [
      { text: 'Explain what cross-site scripting is', sectionId: 'why' },
      { text: 'See how Angular escapes and cleans untrusted text', sectionId: 'escaping' },
      { text: 'Know why bypassSecurityTrust is dangerous', sectionId: 'bypass' },
      { text: 'List what Angular does not protect', sectionId: 'practices' },
    ],
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
    objectives: [
      { text: 'Choose between try/catch and catchError', sectionId: 'local' },
      { text: 'Describe what an ErrorHandler does', sectionId: 'global' },
      { text: 'Show a clear error state with a way to retry', sectionId: 'ui' },
      { text: 'Say why swallowing errors hides bugs', sectionId: 'why' },
    ],
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
    objectives: [
      { text: 'Say when an animation helps and when it hurts', sectionId: 'why' },
      { text: 'Animate an element in and out with animate.enter and animate.leave', sectionId: 'enter-leave' },
      { text: 'Write the CSS for a transition and for keyframes', sectionId: 'css' },
      { text: 'Turn motion off for people who ask for it', sectionId: 'motion' },
    ],
    sections: [
      { id: 'why', title: 'Why animate?', kind: 'concept', minutes: 4 },
      { id: 'enter-leave', title: 'Enter and leave', kind: 'try-it', minutes: 6 },
      { id: 'css', title: 'The CSS behind it', kind: 'concept', minutes: 5 },
      { id: 'motion', title: 'Reduced motion', kind: 'concept', minutes: 4 },
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
