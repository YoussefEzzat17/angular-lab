import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { ProgressService } from '../core/services/progress.service';
import { TOPICS } from '../core/data/topics';
import type { TopicId } from '../core/models/learning.models';

export const quizUnlockedGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  // Topic id comes from the parent route's data (routes use literal topic segments, not a :topic param).
  const topicId = route.data['topicId'] as TopicId;
  const progress = inject(ProgressService);
  const router = inject(Router);

  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return router.createUrlTree(['/learn']);

  if (progress.allSectionsDone(topicId)) return true;

  const firstIncomplete = progress.firstIncompleteSection(topicId);
  const targetSection = firstIncomplete ?? topic.sections[0]?.id;
  return router.createUrlTree(['/learn', topicId, targetSection]);
};
