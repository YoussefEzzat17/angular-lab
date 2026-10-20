import { EnvironmentInjector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterceptorChainDemoComponent, ORDER_A, ORDER_B, runChain } from './interceptor-chain-demo.component';

describe('runChain', () => {
  let parent: EnvironmentInjector;

  beforeEach(() => {
    parent = TestBed.inject(EnvironmentInjector);
  });

  it('lets the logger see the token when auth is registered first', () => {
    const run = runChain(ORDER_A, 'ok', parent);

    expect(run.trace).toContain('→ log: GET /api/users, Authorization seen: yes');
  });

  it('hides the token from the logger when it is registered first', () => {
    const run = runChain(ORDER_B, 'ok', parent);

    expect(run.trace).toContain('→ log: GET /api/users, Authorization seen: no');
  });

  it('still delivers the token to the server in both orders', () => {
    expect(runChain(ORDER_A, 'ok', parent).serverSawAuth).toBeTrue();
    expect(runChain(ORDER_B, 'ok', parent).serverSawAuth).toBeTrue();
  });

  it('runs the response back in reverse order', () => {
    const lines = runChain(ORDER_A, 'ok', parent).trace;

    const logBack = lines.indexOf('← log: status 200');
    const authBack = lines.indexOf('← auth: response passes back');
    expect(logBack).toBeGreaterThan(-1);
    expect(authBack).toBeGreaterThan(logBack);
  });

  it('turns a server failure into the friendly message from the errors interceptor', () => {
    const run = runChain(ORDER_A, 'error', parent);

    expect(run.outcome).toBe('Component receives an error: "Something went wrong, please try again."');
  });

  it('gives the component the data when the server answers 200', () => {
    expect(runChain(ORDER_A, 'ok', parent).outcome).toBe('Component receives: Mona, Ali');
  });
});

describe('InterceptorChainDemoComponent', () => {
  let fixture: ComponentFixture<InterceptorChainDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const trace = () => root.querySelector('[data-testid="chain-trace"]')!.textContent ?? '';

  beforeEach(() => {
    fixture = TestBed.createComponent(InterceptorChainDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('starts with the token visible to the logger', () => {
    expect(trace()).toContain('Authorization seen: yes');
  });

  it('shows the logger missing the token after switching the order', () => {
    click('order-b');

    expect(trace()).toContain('Authorization seen: no');
  });

  it('shows the friendly error when the server fails', () => {
    click('server-error');

    expect(root.querySelector('[data-testid="chain-outcome"]')?.textContent).toContain('Something went wrong');
  });
});
