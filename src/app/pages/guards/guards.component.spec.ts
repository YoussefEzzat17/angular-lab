import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DemoAuthService } from '../../core/services/demo-auth.service';
import { GuardsComponent } from './guards.component';

describe('GuardsComponent', () => {
  it('shows the login state and flips it with the switch', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(GuardsComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.textContent).toContain('logged out');

    (root.querySelector('button[role="switch"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(TestBed.inject(DemoAuthService).loggedIn()).toBeTrue();
    expect(root.textContent).toContain('logged in');
    expect(root.querySelector('[role="alert"]')).toBeNull();
  });
});
