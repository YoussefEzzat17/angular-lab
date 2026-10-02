import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FlowArrowComponent } from './flow-arrow.component';

@Component({
  standalone: true,
  imports: [FlowArrowComponent],
  template: `<app-flow-arrow label="@Input() x" caption="parent → child" turn tone="burgundy" [active]="active" />`,
})
class HostComponent {
  active = false;
}

describe('FlowArrowComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, arrow: () => root.querySelector('.arrow') as HTMLElement };
  }

  it('shows the label and caption and is hidden from assistive tech', () => {
    const { root } = setup();
    expect(root.querySelector('.label')?.textContent).toContain('@Input() x');
    expect(root.querySelector('.caption')?.textContent).toContain('parent → child');
    expect(root.querySelector('app-flow-arrow')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('accepts `turn` as a bare attribute and applies the tone', () => {
    const { arrow } = setup();
    expect(arrow().classList).toContain('turn');
    expect(arrow().classList).toContain('burgundy');
    expect(arrow().classList).not.toContain('horizontal');
  });

  it('adds the active class only while data is flowing', () => {
    const { fixture, arrow } = setup();
    expect(arrow().classList).not.toContain('active');
    fixture.componentInstance.active = true;
    fixture.detectChanges();
    expect(arrow().classList).toContain('active');
  });
});
