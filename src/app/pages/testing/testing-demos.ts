export interface CartLine {
  price: number;
  qty: number;
}

/** The code under test. The "buggy" version forgets to multiply by the quantity. */
export function totalOf(lines: CartLine[], buggy: boolean): number {
  return lines.reduce((sum, line) => sum + (buggy ? line.price : line.price * line.qty), 0);
}

/** A tiny stand-in for expect(): it throws a readable message, just as a real test runner shows. */
export function expectValue(actual: unknown) {
  return {
    toBe(expected: unknown): void {
      if (actual !== expected) throw new Error(`Expected ${String(actual)} to be ${String(expected)}.`);
    },
  };
}

export interface DemoTest {
  name: string;
  run: (total: (lines: CartLine[]) => number) => void;
}

export const DEMO_TESTS: DemoTest[] = [
  { name: 'an empty cart costs nothing', run: (total) => expectValue(total([])).toBe(0) },
  { name: 'one item with quantity 1 costs its price', run: (total) => expectValue(total([{ price: 10, qty: 1 }])).toBe(10) },
  { name: 'quantity multiplies the price', run: (total) => expectValue(total([{ price: 10, qty: 3 }])).toBe(30) },
  {
    name: 'several lines are added together',
    run: (total) =>
      expectValue(
        total([
          { price: 5, qty: 2 },
          { price: 8, qty: 1 },
        ]),
      ).toBe(18),
  },
];
