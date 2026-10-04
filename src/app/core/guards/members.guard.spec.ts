import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';

import { DemoAuthService } from '../services/demo-auth.service';
import { membersGuard } from './members.guard';

describe('membersGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  const run = () => TestBed.runInInjectionContext(() => membersGuard({} as never, {} as never));

  it('redirects to /guards?denied=1 while logged out', () => {
    const result = run();
    expect(result instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/guards?denied=1');
  });

  it('lets the user through once logged in', () => {
    TestBed.inject(DemoAuthService).toggle();
    expect(run()).toBeTrue();
  });
});
