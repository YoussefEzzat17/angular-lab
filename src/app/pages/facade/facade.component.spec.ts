import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DemoSettings } from './checkout-demo';
import { FacadeComponent } from './facade.component';

describe('FacadeComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(FacadeComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const button = (text: string) => Array.from(root.querySelectorAll('button')).find((b) => b.textContent!.includes(text)) as HTMLButtonElement;
    return { fixture, root, button };
  }

  it('shows the long component code without a facade and the tiny one with it', () => {
    const { fixture, root, button } = setup();
    expect(root.textContent).toContain('Services it knows: 4');

    button('With a facade').click();
    fixture.detectChanges();
    expect(root.textContent).toContain('Services it knows: 1');
    expect(root.textContent).toContain('this.checkout.placeOrder()');
  });

  for (const mode of ['Without a facade', 'With a facade']) {
    it(`places an order successfully (${mode})`, fakeAsync(() => {
      const { fixture, root, button } = setup();
      button(mode).click();
      button('Place order').click();
      flush();
      fixture.detectChanges();

      expect(root.textContent).toContain('Order placed!');
      expect(root.querySelectorAll('ol[aria-live] li').length).toBe(4);
    }));

    it(`shows the rollback when the card is declined (${mode})`, fakeAsync(() => {
      const { fixture, root, button } = setup();
      TestBed.inject(DemoSettings).declineCard.set(true);
      button(mode).click();
      button('Place order').click();
      flush();
      fixture.detectChanges();

      expect(root.textContent).toContain('rolled back');
      expect(root.textContent).toContain('nothing was charged');
    }));
  }
});
