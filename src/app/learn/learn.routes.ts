import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { TOPICS } from '../core/data/topics';
import type { TopicId } from '../core/models/learning.models';
import { completedGuard, quizUnlockedGuard } from './learn.guards';

// Map of topicId → lazy component loader.
// Pilot topics (binding, guards) are multi-section LessonPlayers. The other topics render their existing page
// under /learn/:topic/:section until Phase 3 splits them into sections.
export const TOPIC_LOADERS: Record<TopicId, () => Promise<Type<unknown>>> = {
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
  'getting-started':  () => import('../pages/getting-started/getting-started.component').then((m) => m.GettingStartedComponent),
  'components':       () => import('../pages/components/components.component').then((m) => m.ComponentsComponent),
  'lifecycle':        () => import('../pages/lifecycle/lifecycle.component').then((m) => m.LifecycleComponent),
  'template-tools':   () => import('../pages/template-tools/template-tools.component').then((m) => m.TemplateToolsComponent),
  'signal-forms':     () => import('../pages/signal-forms/signal-forms.component').then((m) => m.SignalFormsComponent),
  'testing':          () => import('../pages/testing/testing.component').then((m) => m.TestingComponent),
  'accessibility':    () => import('../pages/accessibility/accessibility.component').then((m) => m.AccessibilityComponent),
  'security':         () => import('../pages/security/security.component').then((m) => m.SecurityComponent),
  'error-handling':   () => import('../pages/error-handling/error-handling.component').then((m) => m.ErrorHandlingComponent),
  'animations':       () => import('../pages/animations/animations.component').then((m) => m.AnimationsComponent),
  'images':           () => import('../pages/images/images.component').then((m) => m.ImagesComponent),
  'dynamic-components': () => import('../pages/dynamic-components/dynamic-components.component').then((m) => m.DynamicComponentsComponent),
  'drag-drop':        () => import('../pages/drag-drop/drag-drop.component').then((m) => m.DragDropComponent),
  'i18n':             () => import('../pages/i18n/i18n.component').then((m) => m.I18nComponent),
  'ssr':              () => import('../pages/ssr/ssr.component').then((m) => m.SsrComponent),
  'devtools':         () => import('../pages/devtools/devtools.component').then((m) => m.DevtoolsComponent),
};

export const LEARN_ROUTES: Routes = [
  // /learn → redirect to first topic overview
  { path: '', redirectTo: TOPICS[0].id, pathMatch: 'full' },

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
      { path: 'complete', canActivate: [completedGuard], loadComponent: () => import('./quiz/topic-complete.component').then((m) => m.TopicCompleteComponent), title: 'Complete' },
      // /learn/:topic/:section → the topic page (pilots receive 'section' via withComponentInputBinding)
      {
        path: ':section',
        loadComponent: TOPIC_LOADERS[t.id as TopicId],
        title: t.title,
      },
    ],
  })),
];
