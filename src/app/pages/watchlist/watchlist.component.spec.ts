import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { WatchlistComponent } from './watchlist.component';

describe('WatchlistComponent', () => {
  function setup(ids: number[] = []) {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const cart = TestBed.inject(CartService);
    const products = TestBed.inject(ProductService).products;
    ids.forEach((i) => cart.add(products[i]));
    const fixture = TestBed.createComponent(WatchlistComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, cart, products, articles: () => root.querySelectorAll('article') };
  }
  afterEach(() => localStorage.clear());

  it('shows an empty state with a way to browse', () => {
    const { root, articles } = setup();
    expect(articles().length).toBe(0);
    expect(root.textContent).toContain('Your watchlist is empty');
    expect(root.querySelector('a[href="/products"]')).not.toBeNull();
  });

  it('lists saved titles and removes one with its Remove button', () => {
    const { fixture, root, cart, products, articles } = setup([0, 1]);
    expect(articles().length).toBe(2);

    (root.querySelector('button[aria-label^="Remove"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(articles().length).toBe(1);
    expect(cart.has(products[0].id)).toBeFalse();
  });

  it('clears everything only after confirming', () => {
    const { fixture, root, cart } = setup([0, 1]);
    const click = (text: string) =>
      (Array.from(root.querySelectorAll('button')).find((b) => b.textContent!.includes(text)) as HTMLButtonElement).click();

    click('Clear all');
    fixture.detectChanges();
    expect(cart.count()).toBe(2);

    click('Cancel');
    fixture.detectChanges();
    expect(cart.count()).toBe(2);

    click('Clear all');
    fixture.detectChanges();
    click('Yes, clear');
    fixture.detectChanges();
    expect(cart.count()).toBe(0);
    expect(root.textContent).toContain('Your watchlist is empty');
  });
});
