import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LessonCardComponent, LessonCardTone, LessonCardVariant } from './lesson-card.component';

@Component({
  standalone: true,
  imports: [LessonCardComponent],
  template: `
    <app-lesson-card [label]="label()" [heading]="heading()" [variant]="variant()" [tone]="tone()" [headingSize]="size()">
      <span class="body">projected body</span>
    </app-lesson-card>
  `,
})
class HostComponent {
  label = signal('1 · The problem');
  heading = signal<string | undefined>('Why it matters');
  variant = signal<LessonCardVariant>('default');
  tone = signal<LessonCardTone | undefined>(undefined);
  size = signal<'xl' | 'lg'>('xl');
}

describe('LessonCardComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      card: () => root.querySelector('article') as HTMLElement,
      label: () => root.querySelector('article > p') as HTMLElement,
      heading: () => root.querySelector('h2') as HTMLElement | null,
      root,
    };
  }

  it('renders the label, heading and projected body inside one article', () => {
    const { card, label, heading, root } = render();
    expect(label().textContent).toBe('1 · The problem');
    expect(heading()?.textContent).toBe('Why it matters');
    expect(card().querySelector('.body')?.textContent).toBe('projected body');
    expect(root.querySelectorAll('article').length).toBe(1);
  });

  it('uses the plain surface and a gold label by default', () => {
    const { card, label } = render();
    expect(card().className).toContain('border-stone-800');
    expect(card().className).toContain('bg-stone-900');
    expect(label().className).toContain('text-gold-300');
  });

  it('switches surface and label color with the variant', () => {
    const { fixture, host, card, label } = render();

    host.variant.set('highlight');
    fixture.detectChanges();
    expect(card().className).toContain('bg-gold-950/20');
    expect(label().className).toContain('text-gold-300');

    host.variant.set('danger');
    fixture.detectChanges();
    expect(card().className).toContain('--panel-danger-bg');
    expect(label().className).toContain('text-rose-300');

    host.variant.set('success');
    fixture.detectChanges();
    expect(card().className).toContain('--panel-success-bg');
    expect(label().className).toContain('text-emerald-300');
  });

  it('lets an explicit tone override the variant default', () => {
    const { fixture, host, label } = render();
    host.tone.set('amber');
    fixture.detectChanges();
    expect(label().className).toContain('text-amber-300');
    expect(label().className).not.toContain('text-gold-300');
  });

  it('renders no heading element when none is given', () => {
    const { fixture, host, heading } = render();
    host.heading.set(undefined);
    fixture.detectChanges();
    expect(heading()).toBeNull();
  });

  it('supports the smaller heading size', () => {
    const { fixture, host, heading } = render();
    expect(heading()?.className).toContain('text-xl');
    host.size.set('lg');
    fixture.detectChanges();
    expect(heading()?.className).toContain('text-lg');
    expect(heading()?.className).not.toContain('text-xl');
  });
});
