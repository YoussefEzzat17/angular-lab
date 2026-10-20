import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StarRatingComponent } from './star-rating-demo.component';

@Component({
  standalone: true,
  imports: [StarRatingComponent],
  template: `
    <app-star-rating [(rating)]="myRating" />
    <p data-testid="parent-value">{{ myRating() }}</p>
    <button type="button" data-testid="parent-reset" (click)="myRating.set(0)">Reset</button>
  `,
})
class HostComponent {
  readonly myRating = signal(0);
}

describe('StarRatingComponent (model)', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (id: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
      fixture.detectChanges();
    };
    const pressed = () => Array.from(root.querySelectorAll('[data-testid^="star-"]')).filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    return { fixture, root, click, pressed };
  }

  it('starts with no stars', () => {
    const { pressed } = setup();

    expect(pressed()).toBe(0);
  });

  it('writes the child choice back to the parent, because the binding goes both ways', () => {
    const { fixture, root, click, pressed } = setup();

    click('star-4');

    expect(fixture.componentInstance.myRating()).toBe(4);
    expect(root.querySelector('[data-testid="parent-value"]')?.textContent?.trim()).toBe('4');
    expect(pressed()).toBe(4);
  });

  it('shows what the parent sets, without any event from the child', () => {
    const { click, pressed } = setup();
    click('star-5');

    click('parent-reset');

    expect(pressed()).toBe(0);
  });

  it('gives every star an accessible name', () => {
    const { root } = setup();

    const names = Array.from(root.querySelectorAll('[data-testid^="star-"]')).map((b) => b.getAttribute('aria-label'));

    expect(names).toEqual(['Rate 1 star', 'Rate 2 stars', 'Rate 3 stars', 'Rate 4 stars', 'Rate 5 stars']);
  });
});
