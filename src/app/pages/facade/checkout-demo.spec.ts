import { fakeAsync, flush, TestBed } from '@angular/core/testing';

import { CheckoutFacade, DemoSettings, StockApi } from './checkout-demo';

describe('CheckoutFacade', () => {
  it('runs the four steps in order and reports success', fakeAsync(() => {
    const facade = TestBed.inject(CheckoutFacade);
    facade.placeOrder();
    expect(facade.status()).toBe('working');
    flush();

    expect(facade.status()).toBe('success');
    expect(facade.log().map((l) => l.service)).toEqual(['CartApi', 'StockApi', 'PaymentApi', 'ReceiptApi']);
    expect(facade.log().every((l) => l.status === 'ok')).toBeTrue();
    expect(facade.message()).toBe('Order placed!');
  }));

  it('rolls the stock reservation back when the card is declined', fakeAsync(() => {
    TestBed.inject(DemoSettings).declineCard.set(true);
    const release = spyOn(TestBed.inject(StockApi), 'release').and.callThrough();
    const facade = TestBed.inject(CheckoutFacade);
    facade.placeOrder();
    flush();

    expect(facade.status()).toBe('failed');
    expect(release).toHaveBeenCalledTimes(1);
    const statuses = facade.log().map((l) => l.status);
    expect(statuses).toEqual(['ok', 'ok', 'fail', 'undo']);
    expect(facade.log().some((l) => l.service === 'ReceiptApi')).toBeFalse();
    expect(facade.message()).toContain('nothing was charged');
  }));

  it('ignores a second click while an order is already being placed', fakeAsync(() => {
    const facade = TestBed.inject(CheckoutFacade);
    facade.placeOrder();
    facade.placeOrder();
    flush();
    expect(facade.log().length).toBe(4);
  }));

  it('reset() clears the log and goes back to idle', fakeAsync(() => {
    const facade = TestBed.inject(CheckoutFacade);
    facade.placeOrder();
    flush();
    facade.reset();
    expect(facade.status()).toBe('idle');
    expect(facade.log()).toEqual([]);
  }));
});
