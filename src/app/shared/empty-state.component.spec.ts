import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EmptyStateComponent } from './empty-state.component';

@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `<app-empty-state heading="Nothing yet" message="Add something." [icon]="icon" [ctaLabel]="label" ctaLink="/learn" />`,
})
class HostComponent {
  icon: string | undefined = '🔖';
  label: string | undefined = 'Start';
}

describe('EmptyStateComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows the heading, message and a link to the call-to-action target', () => {
    const { root } = setup();

    expect(root.querySelector('h2')?.textContent).toContain('Nothing yet');
    expect(root.textContent).toContain('Add something.');
    expect(root.querySelector('a[data-testid="empty-state-cta"]')?.getAttribute('href')).toBe('/learn');
  });

  it('hides the icon and the link when they are not provided', () => {
    const { fixture, root } = setup();

    fixture.componentInstance.icon = undefined;
    fixture.componentInstance.label = undefined;
    fixture.detectChanges();

    expect(root.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(root.querySelector('a')).toBeNull();
  });
});
