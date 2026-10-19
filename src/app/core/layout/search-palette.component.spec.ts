import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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
});
