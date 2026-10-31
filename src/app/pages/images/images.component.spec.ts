import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImagesComponent } from './images.component';

describe('ImagesComponent', () => {
  it('shows what NgOptimizedImage put on a normal image and on a priority image', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ImagesComponent);
    fixture.componentRef.setInput('section', 'try-it');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    root.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.textContent?.includes('Compare') && b.click());
    fixture.detectChanges();

    const normal = root.querySelector('[data-testid="normal-attrs"]')!.textContent!;
    const main = root.querySelector('[data-testid="main-attrs"]')!.textContent!;
    expect(normal).toContain('loading="lazy"');
    expect(main).toContain('loading="eager"');
    expect(main).toContain('fetchpriority="high"');
  });
});
