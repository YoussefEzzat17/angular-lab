import { Injectable, inject, signal } from '@angular/core';

/** One line of the live log the Facade lesson shows while an order is being placed. */
export interface LogLine {
  service: 'CartApi' | 'StockApi' | 'PaymentApi' | 'ReceiptApi';
  text: string;
  status: 'ok' | 'fail' | 'undo';
}

export interface CartItem {
  name: string;
  price: number;
}

/** Delay used by the fake services so the steps are visible. The tests replace it with a fakeAsync clock. */
export const STEP_MS = 450;
const wait = (ms = STEP_MS) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Lets the lesson flip "the card is declined" on and off. */
@Injectable({ providedIn: 'root' })
export class DemoSettings {
  readonly declineCard = signal(false);
}

// ---- The four "subsystems": each one does one job and knows nothing about the others. ----

@Injectable({ providedIn: 'root' })
export class CartApi {
  async getItems(): Promise<CartItem[]> {
    await wait();
    return [
      { name: 'Angular Handbook', price: 29 },
      { name: 'Signals Poster', price: 12 },
    ];
  }
}

@Injectable({ providedIn: 'root' })
export class StockApi {
  async reserve(items: CartItem[]): Promise<string> {
    await wait();
    return 'RSV-' + items.length * 101;
  }

  async release(_reservationId: string): Promise<void> {
    await wait(STEP_MS / 2);
  }
}

@Injectable({ providedIn: 'root' })
export class PaymentApi {
  private readonly settings = inject(DemoSettings);

  async charge(amount: number): Promise<string> {
    await wait();
    if (this.settings.declineCard()) {
      throw new Error('Card declined');
    }
    return 'PAY-' + amount;
  }
}

@Injectable({ providedIn: 'root' })
export class ReceiptApi {
  async send(orderRef: string): Promise<void> {
    await wait();
    void orderRef;
  }
}

export type CheckoutStatus = 'idle' | 'working' | 'success' | 'failed';

/**
 * THE FACADE. Components talk to this one class; it knows the order in which the four services must be
 * called, what to do when a step fails, and what the UI needs to show — so none of that leaks into components.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  private readonly cart = inject(CartApi);
  private readonly stock = inject(StockApi);
  private readonly payment = inject(PaymentApi);
  private readonly receipt = inject(ReceiptApi);

  // What the UI needs — nothing more.
  readonly status = signal<CheckoutStatus>('idle');
  readonly log = signal<LogLine[]>([]);
  readonly message = signal('');

  reset(): void {
    this.status.set('idle');
    this.log.set([]);
    this.message.set('');
  }

  /** The one method a component calls. */
  async placeOrder(): Promise<void> {
    if (this.status() === 'working') return;
    this.reset();
    this.status.set('working');

    let reservationId: string | undefined;
    let step: LogLine['service'] = 'CartApi';
    try {
      step = 'CartApi';
      const items = await this.cart.getItems();
      this.add('CartApi', `Loaded ${items.length} items`, 'ok');

      step = 'StockApi';
      reservationId = await this.stock.reserve(items);
      this.add('StockApi', `Reserved stock (${reservationId})`, 'ok');

      const total = items.reduce((sum, item) => sum + item.price, 0);
      step = 'PaymentApi';
      const paymentRef = await this.payment.charge(total);
      this.add('PaymentApi', `Charged $${total} (${paymentRef})`, 'ok');

      step = 'ReceiptApi';
      await this.receipt.send(paymentRef);
      this.add('ReceiptApi', 'Receipt emailed', 'ok');

      this.message.set('Order placed!');
      this.status.set('success');
    } catch (error) {
      this.add(step, (error as Error).message, 'fail');
      if (reservationId) {
        await this.stock.release(reservationId);
        this.add('StockApi', `Released stock (${reservationId}) — rolled back`, 'undo');
      }
      this.message.set(step === 'PaymentApi' ? 'Order failed — nothing was charged.' : 'Order failed.');
      this.status.set('failed');
    }
  }

  private add(service: LogLine['service'], text: string, status: LogLine['status']): void {
    this.log.update((lines) => [...lines, { service, text, status }]);
  }
}
