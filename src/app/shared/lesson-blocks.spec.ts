import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { auditAccessibility } from '../testing/a11y-audit';
import { CodeOutputComponent } from './code-output.component';
import { CommonMistakeComponent } from './common-mistake.component';
import { LessonFigureComponent } from './lesson-figure.component';
import { OutputFrameComponent } from './output-frame.component';
import { RecapComponent } from './recap.component';

@Component({
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, LessonFigureComponent, OutputFrameComponent, RecapComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-code-output [code]="code" caption="The price is formatted by the pipe." address="localhost:4200/shop">
      <p data-testid="live">$49.90</p>
    </app-code-output>
    <app-output-frame label="Plain frame"><span>inside</span></app-output-frame>
    <app-lesson-figure caption="Data flows down" description="An arrow from the parent box to the child box">
      <svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>
    </app-lesson-figure>
    <app-common-mistake title="Calling a method in the template" [wrong]="wrong" [right]="right">Methods run on every check.</app-common-mistake>
    <app-recap [items]="['One', 'Two', 'Three']" />
  `,
})
class HostComponent {
  code = '<p>{{ price | currency }}</p>';
  wrong = '{{ format(price) }}';
  right = '{{ price | currency }}';
}

describe('lesson building blocks', () => {
  function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the code and the live result in a framed browser window', () => {
    const root = render();
    expect(root.querySelector('app-code-output pre')).not.toBeNull();
    const frame = root.querySelector('app-code-output [role="group"]')!;
    expect(frame.querySelector('[data-testid="live"]')?.textContent).toBe('$49.90');
    expect(frame.textContent).toContain('localhost:4200/shop');
    expect(root.querySelector('app-code-output')!.textContent).toContain('The price is formatted by the pipe.');
  });

  it('names the plain frame for screen readers', () => {
    const frame = render().querySelector('app-output-frame:not(app-code-output app-output-frame) [role="group"]')!;
    expect(frame.getAttribute('aria-label')).toBe('Plain frame');
  });

  it('describes the figure for screen readers and shows its caption', () => {
    const root = render();
    expect(root.querySelector('figure [role="img"]')!.getAttribute('aria-label')).toBe('An arrow from the parent box to the child box');
    expect(root.querySelector('app-lesson-figure figcaption')!.textContent).toBe('Data flows down');
  });

  it('puts the wrong and right code side by side with the reason under them', () => {
    const section = render().querySelector('app-common-mistake section')!;
    expect(section.querySelectorAll('pre').length).toBe(2);
    expect(section.textContent).toContain('Avoid');
    expect(section.textContent).toContain('Do this');
    expect(section.textContent).toContain('Methods run on every check.');
  });

  it('lists the recap points', () => {
    const items = Array.from(render().querySelectorAll('app-recap li')).map((li) => li.textContent?.trim());
    expect(items).toEqual(['One', 'Two', 'Three']);
  });

  it('passes the accessibility audit', () => {
    expect(auditAccessibility(render())).toEqual([]);
  });
});
