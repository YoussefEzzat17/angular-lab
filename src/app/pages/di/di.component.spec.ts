import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DiComponent } from './di.component';

describe('DiComponent', () => {
  function counters(root: HTMLElement, tag: string) {
    return Array.from(root.querySelectorAll(tag)).map((el) => ({
      id: el.querySelector('strong.text-gold-300')!.textContent!.trim(),
      count: () => el.querySelector('strong.text-2xl')!.textContent!.trim(),
      button: el.querySelector('button') as HTMLButtonElement,
    }));
  }

  it('shares one instance for root-provided counters and one per component for provided ones', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DiComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    const [sharedA, sharedB] = counters(root, 'app-di-shared-counter');
    expect(sharedA.id).toBe(sharedB.id);
    sharedA.button.click();
    fixture.detectChanges();
    expect(sharedB.count()).toBe('1');

    const [privA, privB] = counters(root, 'app-di-private-counter');
    expect(privA.id).not.toBe(privB.id);
    privA.button.click();
    fixture.detectChanges();
    expect(privA.count()).toBe('1');
    expect(privB.count()).toBe('0');
  });
});
