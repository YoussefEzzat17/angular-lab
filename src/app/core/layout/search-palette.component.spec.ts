import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SearchPaletteService } from '../services/search-palette.service';
import { SearchPaletteComponent } from './search-palette.component';

describe('SearchPaletteComponent', () => {
  let fixture: ComponentFixture<SearchPaletteComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(SearchPaletteService).open.set(true);
    fixture = TestBed.createComponent(SearchPaletteComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  afterEach(() => localStorage.clear());

  const type = (value: string) => {
    const input = root.querySelector<HTMLInputElement>('input')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const titles = () => Array.from(root.querySelectorAll('button .font-semibold, button .truncate')).map((e) => e.textContent?.trim());

  it('narrows the results as the user types', () => {
    const all = root.querySelectorAll('button').length;

    type('signals');

    const filtered = root.querySelectorAll('button').length;
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(all);
    expect(root.textContent).toContain('Signals');
  });

  it('resets the highlighted result to the first one on a new query', () => {
    fixture.componentInstance.activeIndex.set(3);

    type('rx');

    expect(fixture.componentInstance.activeIndex()).toBe(0);
    expect(titles().length).toBeGreaterThan(0);
  });

  describe('keyboard', () => {
    const press = (key: string, init: KeyboardEventInit = {}) => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key, ...init }));
      fixture.detectChanges();
    };

    it('opens and closes with Ctrl+K', () => {
      const palette = TestBed.inject(SearchPaletteService);
      palette.close();

      press('k', { ctrlKey: true });
      expect(palette.open()).toBeTrue();

      press('k', { ctrlKey: true });
      expect(palette.open()).toBeFalse();
    });

    it('closes with Escape', () => {
      press('Escape');

      expect(TestBed.inject(SearchPaletteService).open()).toBeFalse();
    });

    it('moves the highlight with the arrow keys and stops at both ends', () => {
      const palette = fixture.componentInstance;
      const last = palette.results().length - 1;

      press('ArrowUp');
      expect(palette.activeIndex()).toBe(0);

      press('ArrowDown');
      expect(palette.activeIndex()).toBe(1);

      for (let i = 0; i < last + 3; i++) {
        press('ArrowDown');
      }
      expect(palette.activeIndex()).toBe(last);
    });

    it('opens the highlighted result with Enter and closes', () => {
      const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
      type('subjects');

      press('Enter');

      expect(navigate).toHaveBeenCalledWith('/learn/rxjs/subjects');
      expect(TestBed.inject(SearchPaletteService).open()).toBeFalse();
    });

    it('does nothing on Enter when nothing matches', () => {
      const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
      type('zzzzzz');

      press('Enter');

      expect(navigate).not.toHaveBeenCalled();
    });

    it('ignores the arrow keys while it is closed', () => {
      TestBed.inject(SearchPaletteService).close();
      fixture.componentInstance.activeIndex.set(2);

      press('ArrowDown');

      expect(fixture.componentInstance.activeIndex()).toBe(2);
    });
  });
});
