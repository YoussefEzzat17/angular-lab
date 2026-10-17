import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { membersGuard } from './core/guards/members.guard';
import { SiteLayoutComponent } from './core/layout/site-layout.component';
import { TOPICS } from './core/data/topics';

export const routes: Routes = [
  // ── Legacy redirects: /binding → /learn/binding, etc. ───────────────────
  ...TOPICS.map((t) => ({
    path: t.legacyPath.slice(1),   // e.g. 'binding'
    redirectTo: `learn/${t.id}`,
    pathMatch: 'full' as const,
  })),

  // ── Learn layout (sidebar) ───────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./learn/layout/learn-layout.component').then((m) => m.LearnLayoutComponent),
    children: [
      { path: 'learn', loadChildren: () => import('./learn/learn.routes').then((m) => m.LEARN_ROUTES) },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent), title: 'Dashboard' },
      { path: 'bookmarks', loadComponent: () => import('./pages/bookmarks/bookmarks.component').then((m) => m.BookmarksComponent), title: 'My Bookmarks' },
    ],
  },

  // ── Site layout (navbar + footer) ────────────────────────────────────────
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Angular Lab' },
      { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent), title: 'Demo: Browse' },
      { path: 'products/:id', loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent), title: 'Product Details' },
      { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent), title: 'Demo: My List' },
      { path: 'watchlist', loadComponent: () => import('./pages/watchlist/watchlist.component').then((m) => m.WatchlistComponent), title: 'Demo: Watchlist' },
      { path: 'movies', loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent), title: 'Fetch API & HTTP' },
      { path: 'guards/members', canActivate: [membersGuard], loadComponent: () => import('./pages/guards/members.component').then((m) => m.MembersComponent), title: 'Members Area' },
      { path: 'feedback', loadComponent: () => import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent), title: 'Feedback' },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Not Found' },
    ],
  },
];
