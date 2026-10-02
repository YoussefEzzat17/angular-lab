import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';
import { TopicIllustrationComponent } from './topic-illustration.component';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  template: `<app-page-header title="Routing" [illustration]="art">intro</app-page-header>`,
})
class HostComponent {
  art: 'routing' | undefined = 'routing';
}

describe('PageHeaderComponent illustration', () => {
  it('renders the diagram (decorative) when asked, and nothing when not', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('app-topic-illustration').length).toBeGreaterThan(0);
    expect(root.querySelector('app-topic-illustration')?.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('svg text')?.textContent).toBeTruthy();

    fixture.componentInstance.art = undefined;
    fixture.detectChanges();
    expect(root.querySelector('app-topic-illustration')).toBeNull();
  });

  it('can draw every illustration without errors', () => {
    const names = ['directives', 'binding', 'routing', 'signals', 'pipes', 'forms', 'rxjs', 'lazy', 'interceptor', 'http', 'communication'] as const;
    for (const name of names) {
      const fixture = TestBed.createComponent(TopicIllustrationComponent);
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('svg *').length).withContext(name).toBeGreaterThan(3);
    }
  });
});
