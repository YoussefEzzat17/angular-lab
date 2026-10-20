import { Routes } from '@angular/router';
import { TOPICS } from '../core/data/topics';
import type { TopicId } from '../core/models/learning.models';
import { quizUnlockedGuard } from './learn.guards';

// Map of topicId → lazy component loader.
// Pilot topics (binding, guards) are multi-section LessonPlayers. The other topics render their existing page
// under /learn/:topic/:section until Phase 3 splits them into sections.
export const TOPIC_LOADERS: Record<TopicId, () => Promise<unknown>> = {
  'binding':          () => import('../pages/binding/binding.component').then((m) => m.BindingComponent),
  'pipes':            () => import('../pages/pipes/pipes.component').then((m) => m.PipesComponent),
  'directives':       () => import('../pages/directives/directives.component').then((m) => m.DirectivesComponent),
  'communication':    () => import('../pages/component-communication/component-communication.component').then((m) => m.ComponentCommunicationComponent),
  'forms':            () => import('../pages/forms/forms.component').then((m) => m.FormsComponent),
  'routing':          () => import('../pages/routing/routing.component').then((m) => m.RoutingComponent),
  'guards':           () => import('../pages/guards/guards.component').then((m) => m.GuardsComponent),
  'signals':          () => import('../pages/signals-playground/signals-playground.component').then((m) => m.SignalsPlaygroundComponent),
  'rxjs':             () => import('../pages/rxjs/rxjs.component').then((m) => m.RxjsComponent),
  'di':               () => import('../pages/di/di.component').then((m) => m.DiComponent),
  'movies':           () => import('../pages/movies/movies.component').then((m) => m.MoviesComponent),
  'interceptor':      () => import('../pages/interceptor/interceptor.component').then((m) => m.InterceptorComponent),
  'facade':           () => import('../pages/facade/facade.component').then((m) => m.FacadeComponent),
  'change-detection': () => import('../pages/change-detection/change-detection.component').then((m) => m.ChangeDetectionComponent),
  'lazy-loading':     () => import('../pages/lazy-loading/lazy-loading.component').then((m) => m.LazyLoadingComponent),
  'content-projection': () => import('../pages/content-projection/content-projection.component').then((m) => m.ContentProjectionComponent),
  'resource':         () => import('../pages/resource/resource.component').then((m) => m.ResourceComponent),
  'defer':            () => import('../pages/defer/defer.component').then((m) => m.DeferComponent),
};

export const LEARN_ROUTES: Routes = [
  // /learn → redirect to first topic overview
  { path: '', redirectTo: 'binding', pathMatch: 'full' },

  // Each topic gets its own literal path (e.g. 'binding'), so the topic id travels in route data.
  ...TOPICS.map((t) => ({
    path: t.id,
    data: { topicId: t.id },
    children: [
      {
        // /learn/:topic → Topic Overview page
        path: '',
        loadComponent: () => import('./player/topic-overview.component').then((m) => m.TopicOverviewComponent),
        title: t.title,
      },
      // Static child routes must stay BEFORE ':section', otherwise 'quiz' and 'complete' match as section ids.
      { path: 'quiz', canActivate: [quizUnlockedGuard], loadComponent: () => import('./quiz/quiz.component').then((m) => m.QuizComponent), title: 'Quiz' },
      { path: 'complete', loadComponent: () => import('./quiz/topic-complete.component').then((m) => m.TopicCompleteComponent), title: 'Complete' },
      // /learn/:topic/:section → the topic page (pilots receive 'section' via withComponentInputBinding)
      {
        path: ':section',
        loadComponent: TOPIC_LOADERS[t.id as TopicId] as () => Promise<any>,
        title: t.title,
      },
    ],
  })),
];
