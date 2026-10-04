import { Injectable, signal } from '@angular/core';

/** A pretend "logged in" switch for the Route Guards lesson — there is no real backend or account. */
@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  readonly loggedIn = signal(false);

  toggle(): void {
    this.loggedIn.update((value) => !value);
  }

  logOut(): void {
    this.loggedIn.set(false);
  }
}
