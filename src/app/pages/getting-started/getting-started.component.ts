import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { LessonFigureComponent } from '../../shared/lesson-figure.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { OutputFrameComponent } from '../../shared/output-frame.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

interface CliCommand {
  id: string;
  command: string;
  what: string;
  output: string[];
}

interface ProjectFile {
  id: string;
  path: string;
  role: string;
  code?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonFigureComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    OrderStepsComponent,
    OutputFrameComponent,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'getting-started'" [section]="section()">
      <!-- ── What is Angular ── -->
      <ng-template appLessonSection="what-is">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Getting Started" illustration="getting-started">
            Angular is a framework for building web apps out of small, reusable pieces called <strong class="text-stone-200">components</strong>.
            It comes with the tools most apps need already built in, so you spend your time on your app and not on choosing libraries.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="A web app is more than one page of HTML">
            <p class="mt-2 text-sm text-stone-400">
              Real apps have many screens, forms, data from a server, and users who expect everything to update instantly. Writing that with plain JavaScript means
              deciding how to organise the code, how to update the page, and how to test it, all on your own. Angular makes those decisions once so your team can follow one pattern.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A set of building blocks with instructions">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">A component</strong> is one block: a piece of screen with its own data and behaviour.</li>
              <li><strong class="text-stone-100">Your app</strong> is blocks inside blocks. The page is one big block that holds smaller ones.</li>
              <li><strong class="text-stone-100">Angular</strong> is the box of tools that joins them: routing, forms, HTTP and more.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-figure
            class="mt-5"
            caption="An Angular app is a tree of components."
            description="A box called App at the top holds three boxes: Header, Lesson list and Footer. The Lesson list holds two smaller boxes called Card."
          >
            <svg viewBox="0 0 400 190" role="presentation" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g stroke="rgb(var(--stone-600))" stroke-width="1.5" stroke-linecap="round">
                <path d="M200 40 V56 M70 56 H330 M70 56 V72 M200 56 V72 M330 56 V72 M200 112 V126 M150 126 H250 M150 126 V140 M250 126 V140" />
              </g>
              <g font-family="ui-monospace, monospace" font-size="12" font-weight="600" text-anchor="middle">
                <rect x="150" y="10" width="100" height="30" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--gold-400))" stroke-width="1.5" />
                <text x="200" y="30" fill="rgb(var(--gold-300))">App</text>
                <rect x="20" y="72" width="100" height="30" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-600))" stroke-width="1.5" />
                <text x="70" y="92" fill="rgb(var(--stone-300))">Header</text>
                <rect x="150" y="72" width="100" height="40" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-600))" stroke-width="1.5" />
                <text x="200" y="97" fill="rgb(var(--stone-300))">Lesson list</text>
                <rect x="280" y="72" width="100" height="30" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-600))" stroke-width="1.5" />
                <text x="330" y="92" fill="rgb(var(--stone-300))">Footer</text>
                <rect x="110" y="140" width="80" height="30" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-600))" stroke-width="1.5" />
                <text x="150" y="160" fill="rgb(var(--stone-300))">Card</text>
                <rect x="210" y="140" width="80" height="30" rx="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-600))" stroke-width="1.5" />
                <text x="250" y="160" fill="rgb(var(--stone-300))">Card</text>
              </g>
            </svg>
          </app-lesson-figure>

          <app-lesson-card class="mt-5" label="3 · WHAT IS INCLUDED" heading="Tools you do not have to go and find">
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Need</th><th class="px-4 py-2 font-semibold">Angular gives you</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of included; track row.need) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 text-stone-200">{{ row.need }}</td>
                      <td class="px-4 py-2">{{ row.tool }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhat" />
        </section>
      </ng-template>

      <!-- ── CLI ── -->
      <ng-template appLessonSection="cli">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE TOOL" heading="The Angular CLI creates and runs your app">
            <p class="mt-2 text-sm text-stone-400">
              The CLI (command line interface) is a program called <code class="text-gold-300">ng</code>. You type commands in a terminal and it creates files, starts a test server and builds your app for release.
              You need Node.js installed first, because the CLI is installed with <code class="text-gold-300">npm</code>.
            </p>
            <pre class="mt-4" [appCode]="installCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Run the commands, one by one">
            <p class="mt-2 text-sm text-stone-400">Press a command to see roughly what it prints. These are examples, not a real terminal.</p>
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="CLI commands">
              @for (cmd of commands; track cmd.id) {
                <button
                  type="button"
                  [attr.aria-pressed]="selectedCommand().id === cmd.id"
                  (click)="selectedCommand.set(cmd)"
                  class="min-h-11 rounded-xl border px-3 font-mono text-xs font-semibold transition"
                  [class]="selectedCommand().id === cmd.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
                >
                  {{ cmd.command }}
                </button>
              }
            </div>
            <p class="mt-4 text-sm text-stone-300" aria-live="polite">{{ selectedCommand().what }}</p>
            <app-output-frame class="mt-3 block" address="terminal" label="Terminal output">
              <div class="overflow-x-auto font-mono text-xs leading-6 text-stone-300" data-testid="terminal">
                @for (line of selectedCommand().output; track $index) {
                  <div class="whitespace-pre">{{ line || ' ' }}</div>
                }
              </div>
            </app-output-frame>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Running ng commands in the wrong folder" [wrong]="mistakeFolderWrong" [right]="mistakeFolderRight">
            Most commands, such as <code class="text-gold-300">ng serve</code>, only work inside an Angular project, the folder that holds <code class="text-gold-300">angular.json</code>.
            If you see "not inside a workspace", move into the project folder first.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapCli" />
        </section>
      </ng-template>

      <!-- ── Project tour ── -->
      <ng-template appLessonSection="project-tour">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE FILES" heading="What each file in a new project does">
            <p class="mt-2 text-sm text-stone-400">Choose a file to see its job. Names can differ slightly between versions, but the roles stay the same.</p>
            <div class="mt-4 grid min-w-0 gap-4 md:grid-cols-[14rem_1fr]">
              <ul class="space-y-1" aria-label="Project files">
                @for (file of files; track file.id) {
                  <li>
                    <button
                      type="button"
                      [attr.aria-pressed]="selectedFile().id === file.id"
                      (click)="selectedFile.set(file)"
                      class="min-h-11 w-full rounded-lg border px-3 text-left font-mono text-xs font-semibold transition"
                      [class]="selectedFile().id === file.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-800 text-stone-300 hover:bg-stone-800'"
                    >
                      {{ file.path }}
                    </button>
                  </li>
                }
              </ul>
              <div class="min-w-0">
                <p class="text-sm text-stone-300" aria-live="polite">{{ selectedFile().role }}</p>
                @if (selectedFile().code; as code) {
                  <pre class="mt-3" [appCode]="code"></pre>
                }
              </div>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE FLOW" heading="How the browser reaches your first component">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">index.html</code> has one empty tag, <code class="text-gold-300">&lt;app-root&gt;</code>. <code class="text-gold-300">main.ts</code> tells Angular to start with the
              <code class="text-gold-300">App</code> component, and Angular fills that tag with its template. Every other component is inside that one.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Where would you edit this?">
            <app-predict-output [challenge]="tourChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTour" />
        </section>
      </ng-template>

      <!-- ── First change ── -->
      <ng-template appLessonSection="first-change">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Change the title and watch the page follow">
            <p class="mt-2 text-sm text-stone-400">
              In a real project you would edit <code class="text-gold-300">title</code> in <code class="text-gold-300">app.ts</code> and save. Here, type a new name and see the same result.
            </p>
            <label class="mt-4 block text-xs text-stone-400" for="gs-title">Value of title in app.ts</label>
            <input
              id="gs-title"
              type="text"
              [value]="title()"
              (input)="title.set($any($event.target).value)"
              class="mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none sm:max-w-sm"
            />
            <app-code-output class="mt-4 block" [code]="firstChangeCode" address="localhost:4200" caption="The template reads the title with double curly braces, so the page always shows the current value.">
              <h3 class="text-lg font-bold text-stone-100">Hello, {{ title() || '…' }}!</h3>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What happens when you save a file?">
            <app-order-steps
              [steps]="saveSteps"
              explanation="ng serve watches your files. When one changes it rebuilds only what is needed and tells the browser, so you see the result within a second or two without pressing refresh."
            />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapFirst" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class GettingStartedComponent {
  readonly section = input<string>();

  protected readonly title = signal('Angular Lab');

  protected readonly included = [
    { need: 'Show data on the page', tool: 'Templates with data binding' },
    { need: 'Several pages and links', tool: 'The Router' },
    { need: 'Forms and validation', tool: 'Reactive, template-driven and Signal Forms' },
    { need: 'Talk to a server', tool: 'HttpClient' },
    { need: 'Share logic between components', tool: 'Dependency injection' },
    { need: 'Keep the screen in step with data', tool: 'Signals and change detection' },
    { need: 'Test your code', tool: 'A test runner set up for you' },
  ];

  protected readonly installCode = `npm install -g @angular/cli
ng version`;

  protected readonly commands: CliCommand[] = [
    {
      id: 'new',
      command: 'ng new my-app',
      what: 'Creates a new project in a folder called my-app, installs its packages and sets everything up.',
      output: ['CREATE my-app/angular.json', 'CREATE my-app/package.json', 'CREATE my-app/src/main.ts', 'CREATE my-app/src/app/app.ts', '…', 'Packages installed successfully.'],
    },
    {
      id: 'serve',
      command: 'ng serve',
      what: 'Builds the app and starts a local test server. It rebuilds on every save.',
      output: ['Application bundle generation complete.', '', '  Local:   http://localhost:4200/', '  press h + enter to show help'],
    },
    {
      id: 'generate',
      command: 'ng generate component card',
      what: 'Creates a new component in its own files, named for you, so you do not write the boilerplate by hand.',
      output: ['CREATE src/app/card/card.ts', 'CREATE src/app/card/card.html', 'CREATE src/app/card/card.css', 'CREATE src/app/card/card.spec.ts'],
    },
    {
      id: 'test',
      command: 'ng test',
      what: 'Runs your unit tests and tells you which pass and which fail.',
      output: ['Executed 4 of 4 SUCCESS'],
    },
    {
      id: 'build',
      command: 'ng build',
      what: 'Builds a small, fast version of the app for release into the dist folder.',
      output: ['Application bundle generation complete.', 'Output location: dist/my-app'],
    },
  ];
  protected readonly selectedCommand = signal<CliCommand>(this.commands[0]);

  protected readonly mistakeFolderWrong = `$ ng serve
Error: This command is not available when running the Angular CLI outside a workspace.`;
  protected readonly mistakeFolderRight = `$ cd my-app
$ ng serve`;

  protected readonly files: ProjectFile[] = [
    {
      id: 'main',
      path: 'src/main.ts',
      role: 'The starting line. It tells Angular which component to begin with and which settings to use.',
      code: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));`,
    },
    {
      id: 'index',
      path: 'src/index.html',
      role: 'The only HTML page. It holds one empty tag, <app-root>, where your app appears.',
      code: `<body>
  <app-root></app-root>
</body>`,
    },
    {
      id: 'app',
      path: 'src/app/app.ts',
      role: 'The first component. Its class holds data, its selector is app-root, and it points to its template and styles.',
      code: `@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-app');
}`,
    },
    {
      id: 'html',
      path: 'src/app/app.html',
      role: 'The template of App. This is the HTML you edit to change what the user sees.',
    },
    {
      id: 'config',
      path: 'src/app/app.config.ts',
      role: 'App-wide settings: the router, HTTP and similar. You add a line here when you turn a feature on.',
      code: `export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};`,
    },
    {
      id: 'routes',
      path: 'src/app/app.routes.ts',
      role: 'The list of pages: which URL shows which component. It starts empty.',
      code: `export const routes: Routes = [];`,
    },
    {
      id: 'angularjson',
      path: 'angular.json',
      role: 'The CLI settings for your project: build options, test options and the output folder.',
    },
    {
      id: 'packagejson',
      path: 'package.json',
      role: 'The list of packages the project needs, and shortcuts such as npm start, which runs ng serve.',
    },
  ];
  protected readonly selectedFile = signal<ProjectFile>(this.files[0]);

  protected readonly tourChallenge: PredictChallenge = {
    question: 'You want to change the text the user sees on the first screen. Which file do you open?',
    options: [
      { id: 'main', text: 'src/main.ts' },
      { id: 'html', text: 'src/app/app.html' },
      { id: 'angularjson', text: 'angular.json' },
      { id: 'packagejson', text: 'package.json' },
    ],
    correct: 'html',
    explanation: 'app.html is the template of the first component, so it holds the HTML the user sees. main.ts only starts the app, and the other two are settings for tools.',
  };

  protected readonly firstChangeCode = `// app.ts
protected readonly title = signal('Angular Lab');

<!-- app.html -->
<h3>Hello, {{ title() }}!</h3>`;

  protected readonly saveSteps = [
    'You edit app.html and press save',
    'ng serve notices that the file changed',
    'It rebuilds the parts that changed',
    'It tells the browser there is a new version',
    'The page updates, with no manual refresh',
  ];

  protected readonly recapWhat = [
    'Angular builds an app out of components, small pieces that nest inside each other.',
    'It includes routing, forms, HTTP and testing, so you choose fewer libraries.',
    'You write TypeScript, HTML and CSS.',
  ];
  protected readonly recapCli = [
    'ng is the Angular CLI. Install it once with npm.',
    'ng new creates a project, ng serve runs it, ng generate adds pieces, ng build prepares a release.',
    'Run project commands from inside the project folder.',
  ];
  protected readonly recapTour = [
    'main.ts starts the app, and index.html holds the empty app-root tag.',
    'app.ts and app.html are the first component: its code and its template.',
    'app.config.ts and app.routes.ts hold app-wide settings and the list of pages.',
  ];
  protected readonly recapFirst = [
    'Save a file and ng serve updates the browser for you.',
    'The template shows data from the component class, so changing the data changes the page.',
    'Next stop: components, the block you will build with all the time.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What does ng serve do?', answer: 'It builds your app, starts a local server on port 4200 and rebuilds whenever you save a file.' },
    { question: 'Which file starts your app, and which file holds the empty tag it fills?', answer: 'main.ts starts it. index.html holds the empty app-root tag that the first component fills.' },
    { question: 'Why does a new project include so many tools?', answer: 'So the whole team follows one pattern for routing, forms, HTTP and tests, and you spend your time on the app.' },
  ];
}
