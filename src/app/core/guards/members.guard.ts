import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { DemoAuthService } from '../services/demo-auth.service';

/** Lets the router open /guards/members only while the demo "logged in" switch is on. */
export const membersGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);

  // Returning a UrlTree redirects instead of just cancelling, so the user always lands somewhere useful.
  // Lands on the try-it section, where the login switch and the "Blocked" alert live.
  return auth.loggedIn() ? true : router.createUrlTree(['/learn', 'guards', 'try-it'], { queryParams: { denied: '1' } });
};
