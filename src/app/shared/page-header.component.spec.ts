import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header [title]="title()" [eyebrow]="eyebrow()" [pdf]="pdf()">
      Intro with <strong>markup</strong>.
    </app-page-header>
  `,
})
class HostComponent {
  title = signal('Data Binding');
  eyebrow = signal('HANDS-ON WORKSHOP');
  pdf = signal<string | undefined>('data-binding.pdf');
}

describe('PageHeaderComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, host: fixture.componentInstance };
  }

  it('renders the eyebrow, title and projected intro (with its markup)', () => {
    const { root } = render();
    expect(root.querySelector('h1')?.textContent).toBe('Data Binding');
    expect(root.querySelector('p')?.textContent).toBe('HANDS-ON WORKSHOP');
    expect(root.querySelector('p.mt-3 strong')?.textContent).toBe('markup');
  });

  it('shows a download link for the given pdf', () => {
    const { root } = render();
    const link = root.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/pdfs/data-binding.pdf');
    expect(link.getAttribute('download')).toBe('data-binding.pdf');
    expect(link.textContent).toContain('Download PDF Guide');
    expect(link.querySelector('svg')).not.toBeNull();
  });

  it('omits the download link when there is no pdf', () => {
    const { fixture, root, host } = render();
    host.pdf.set(undefined);
    fixture.detectChanges();
    expect(root.querySelector('a')).toBeNull();
  });

  it('lets the page override the eyebrow', () => {
    const { fixture, root, host } = render();
    host.eyebrow.set('GOT SOMETHING TO SAY?');
    fixture.detectChanges();
    expect(root.querySelector('p')?.textContent).toBe('GOT SOMETHING TO SAY?');
  });
});
