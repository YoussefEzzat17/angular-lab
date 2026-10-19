import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { membersGuard } from './core/guards/members.guard';
import { SiteLayoutComponent } from './core/layout/site-layout.component';
import { TOPICS } from './core/data/topics';

export const routes: Routes = [
  // ── Legacy redirects: /binding → /learn/binding, etc. ───────────────────
  ...TOPICS.map((t) => ({
    path: t.legacyPath.slice(1),
    redirectTo: `learn/${t.id}`,
    pathMatch: 'full' as const,
  })),

  // ── Home landing page (navbar + footer, no sidebar) ─────────────────────
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Angular Lab' },
    ],
  },

  // ── Learn layout (sidebar) — all app pages ───────────────────────────────
  {
    path: '',
    loadComponent: () => import('./learn/layout/learn-layout.component').then((m) => m.LearnLayoutComponent),
    children: [
      { path: 'dashboard',    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),            title: 'Dashboard' },
      { path: 'journey',      loadComponent: () => import('./pages/journey/journey.component').then((m) => m.JourneyComponent),                  title: 'My Journey' },
      { path: 'history',      loadComponent: () => import('./pages/history/history.component').then((m) => m.HistoryComponent),                  title: 'History' },
      { path: 'bookmarks',    loadComponent: () => import('./pages/bookmarks/bookmarks.component').then((m) => m.BookmarksComponent),            title: 'My Bookmarks' },
      { path: 'learn',        loadChildren: () => import('./learn/learn.routes').then((m) => m.LEARN_ROUTES) },
      { path: 'products',     loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent),              title: 'Demo: Browse' },
      { path: 'products/:id', loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent), title: 'Product Details' },
      { path: 'favorites',    loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),           title: 'Demo: My List' },
      { path: 'watchlist',    loadComponent: () => import('./pages/watchlist/watchlist.component').then((m) => m.WatchlistComponent),           title: 'Demo: Watchlist' },
      { path: 'movies',       loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent),                   title: 'Fetch API & HTTP' },
      { path: 'feedback',     loadComponent: () => import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent),              title: 'Feedback' },
      { path: 'guards/members', canActivate: [membersGuard], loadComponent: () => import('./pages/guards/members.component').then((m) => m.MembersComponent), title: 'Members Area' },
    ],
  },

  // ── 404 — must be last ───────────────────────────────────────────────────
  {
    path: '**',
    component: SiteLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Not Found' },
    ],
  },
];
