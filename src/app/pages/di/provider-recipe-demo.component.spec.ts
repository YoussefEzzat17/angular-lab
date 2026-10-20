import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRecipeDemoComponent, runRecipe } from './provider-recipe-demo.component';

describe('runRecipe', () => {
  it('builds one RealGreeter that can inject the language token', () => {
    const result = runRecipe('class', 'ar');

    expect(result.message).toBe('أهلاً يا Mona');
    expect(result.builds).toBe(1);
  });

  it('shares one instance when the token is requested twice', () => {
    expect(runRecipe('class', 'en').sameInstance).toBeTrue();
  });

  it('swaps the implementation without the caller changing', () => {
    expect(runRecipe('fake', 'en').message).toBe('[fake] Mona');
  });

  it('builds nothing for a ready-made value', () => {
    const result = runRecipe('value', 'en');

    expect(result.message).toBe('Hi Mona');
    expect(result.builds).toBe(0);
  });

  it('lets a factory read another token', () => {
    expect(runRecipe('factory', 'en').message).toBe('Welcome Mona');
    expect(runRecipe('factory', 'ar').message).toBe('مرحباً Mona');
    expect(runRecipe('factory', 'en').builds).toBe(1);
  });
});

describe('ProviderRecipeDemoComponent', () => {
  let fixture: ComponentFixture<ProviderRecipeDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)!.textContent?.trim();

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderRecipeDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('starts with the class recipe', () => {
    expect(text('recipe-message')).toBe('Hello, Mona');
    expect(text('recipe-code')).toContain('useClass: RealGreeter');
  });

  it('shows the fake after choosing the test recipe', () => {
    click('recipe-fake');

    expect(text('recipe-message')).toBe('[fake] Mona');
  });

  it('shows zero builds for useValue', () => {
    click('recipe-value');

    expect(text('recipe-builds')).toBe('0');
  });

  it('feeds the LANG token into the result', () => {
    click('lang-ar');

    expect(text('recipe-message')).toBe('أهلاً يا Mona');
  });
});
