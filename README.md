# Angular Lab

## Real Movies: Services, HttpClient, Observables, and Signals

The `/movies` route adds a small, independent teaching feature without replacing the existing products, routes, or binding practice. It uses the public [Studio Ghibli API](https://ghibliapi.vercel.app/films), so it makes a real HTTP request and requires no API key or secret.

### Files to explore

- `src/app/core/models/movie.model.ts` defines `Movie`; the important API fields are `title`, `image` (poster), `release_date`, `rt_score`, `director`, and `description`.
- `src/app/core/services/movie.service.ts` is responsible for API communication. `getMovies()` returns all films and `getMovieById(id)` returns one film. Components do not contain URL or `HttpClient` code.
- `src/app/pages/movies/movies.component.ts` subscribes to the HTTP Observable and owns the UI state.
- `src/app/app.config.ts` calls `provideHttpClient()` once at application level, making `HttpClient` available to injected services throughout the app.

### Data flow

`Movie page → MovieService → HttpClient → public API → Observable → subscribe() → Signal.set() → computed() → UI`

`HttpClient` returns an **Observable**, a value that arrives later. Calling `subscribe()` starts listening: `next` receives the successful response, `error` handles a failed request, and `complete` runs after the Observable finishes. The component puts the response in `movies.set(...)`.

Each signal is state that can change: `movies`, `isLoading`, `error`, and `searchTerm`. `movies` is the signal object; `movies()` reads its current value in TypeScript or the template. `set()` replaces a signal value; `update()` is useful when the next value depends on the current one (see the existing cart/favorites services). `filteredMovies` is a `computed()` signal, so Angular derives it from `movies()` and `searchTerm()` instead of manually synchronizing another array.

The Movies page connects familiar bindings to reactive state: `{{ movie.title }}` is interpolation, `[src]="movie.image"` is property binding, and `(input)="updateSearch($event)"` is event binding. When a signal read by the template changes, Angular knows that section depends on it and refreshes the displayed cards. `effect()` is not needed here: it is for side effects outside derived UI state (for example, logging or browser storage), while `computed()` is the right tool for filtering.

### Using TMDB later

TMDB needs a key. If you switch APIs, put a locally supplied key in an Angular environment/configuration file that is excluded from Git (for example `environment.local.ts` plus a checked-in example file); never commit it or place it directly in the service. The included Ghibli API avoids that setup while still demonstrating a live API request.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
