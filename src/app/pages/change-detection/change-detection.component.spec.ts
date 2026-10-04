import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ChangeDetectionComponent } from './change-detection.component';

describe('ChangeDetectionComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChangeDetectionComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const name = (tag: string) => root.querySelector(`${tag} p.text-lg`)!.textContent!.trim();
    const click = (text: string) => {
      (Array.from(root.querySelectorAll('button')).find((b) => b.textContent!.includes(text)) as HTMLButtonElement).click();
      fixture.detectChanges();
    };
    return { name, click };
  }

  it('mutating the object updates only the Default card; replacing it updates both', () => {
    const { name, click } = setup();
    expect(name('app-cd-default-card')).toBe('Ada');

    click('Mutate name');
    expect(name('app-cd-default-card')).toBe('Grace');
    expect(name('app-cd-onpush-card')).toBe('Ada');

    click('Replace user');
    expect(name('app-cd-default-card')).toBe('Linus');
    expect(name('app-cd-onpush-card')).toBe('Linus');
  });

  it('an OnPush component that reads a signal updates when the signal changes', () => {
    setup();
    const fixture = TestBed.createComponent(ChangeDetectionComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const value = () => el.querySelector('app-cd-signal-reader p.text-2xl')!.textContent!.trim();
    expect(value()).toBe('0');
    (Array.from(el.querySelectorAll('button')).find((b) => b.textContent!.includes('Increment')) as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(value()).toBe('1');
  });
});
