import { TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('credits the author with a safe external link to the portfolio', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.textContent).toContain('Youssef Ezzat');
    expect(link.href).toBe('https://youssef-ezzat.vercel.app/');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });
});
