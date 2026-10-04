import { Routes } from '@angular/router';

// The landing page stays in the main bundle (it is what every visitor sees first); every other page is
// fetched the first time it is opened, then preloaded in the background once the app is idle.
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Angular Lab' },
  { path: 'movies', loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent), title: 'Fetch API & HTTP' },
  { path: 'binding', loadComponent: () => import('./pages/binding/binding.component').then((m) => m.BindingComponent), title: 'Data Binding' },
  { path: 'communication', loadComponent: () => import('./pages/component-communication/component-communication.component').then((m) => m.ComponentCommunicationComponent), title: 'Component Communication' },
  { path: 'directives', loadComponent: () => import('./pages/directives/directives.component').then((m) => m.DirectivesComponent), title: 'Directives' },
  { path: 'forms', loadComponent: () => import('./pages/forms/forms.component').then((m) => m.FormsComponent), title: 'Angular Forms' },
  { path: 'signals', loadComponent: () => import('./pages/signals-playground/signals-playground.component').then((m) => m.SignalsPlaygroundComponent), title: 'Signals' },
  { path: 'pipes', loadComponent: () => import('./pages/pipes/pipes.component').then((m) => m.PipesComponent), title: 'Pipes' },
  { path: 'routing', loadComponent: () => import('./pages/routing/routing.component').then((m) => m.RoutingComponent), title: 'Routing' },
  { path: 'rxjs', loadComponent: () => import('./pages/rxjs/rxjs.component').then((m) => m.RxjsComponent), title: 'RxJS' },
  { path: 'lazy-loading', loadComponent: () => import('./pages/lazy-loading/lazy-loading.component').then((m) => m.LazyLoadingComponent), title: 'Lazy Loading' },
  { path: 'interceptor', loadComponent: () => import('./pages/interceptor/interceptor.component').then((m) => m.InterceptorComponent), title: 'HttpInterceptor' },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent), title: 'Demo: Browse' },
  { path: 'products/:id', loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent), title: 'Title Details' },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent), title: 'Demo: My List' },
  { path: 'watchlist', loadComponent: () => import('./pages/watchlist/watchlist.component').then((m) => m.WatchlistComponent), title: 'Demo: Watchlist' },
  { path: 'feedback', loadComponent: () => import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent), title: 'Feedback' },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Not Found' },
];
