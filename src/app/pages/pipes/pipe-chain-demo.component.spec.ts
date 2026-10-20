import { TestBed } from '@angular/core/testing';

import { PipeChainDemoComponent, chainTemplate, runChain } from './pipe-chain-demo.component';

describe('runChain', () => {
  it('returns just the starting value when no pipe is chosen', () => {
    expect(runChain('hello', [])).toEqual([{ syntax: null, value: 'hello' }]);
  });

  it('keeps a stage for every pipe, in order', () => {
    const stages = runChain('castle in the sky', ['titlecase', 'slice']);

    expect(stages.map((s) => s.value)).toEqual(['castle in the sky', 'Castle In The Sky', 'Castle I']);
    expect(stages.map((s) => s.syntax)).toEqual([null, 'titlecase', 'slice:0:8']);
  });

  it('gives a different result when the same pipes run in a different order', () => {
    const last = (ids: Parameters<typeof runChain>[1]) => runChain('Castle', ids).at(-1)!.value;

    expect(last(['uppercase', 'lowercase'])).toBe('castle');
    expect(last(['lowercase', 'uppercase'])).toBe('CASTLE');
  });

  it('truncates with dots only when the text is longer than the limit', () => {
    expect(runChain('short', ['truncate']).at(-1)!.value).toBe('short');
    expect(runChain('a very long title', ['truncate']).at(-1)!.value).toBe('a very l...');
  });
});

describe('chainTemplate', () => {
  it('writes the template the chain stands for', () => {
    expect(chainTemplate([])).toBe('{{ title }}');
    expect(chainTemplate(['uppercase', 'slice'])).toBe('{{ title | uppercase | slice:0:8 }}');
  });
});

describe('PipeChainDemoComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(PipeChainDemoComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (id: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
      fixture.detectChanges();
    };
    const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    return { fixture, root, click, text };
  }

  it('starts with the raw value and no pipes', () => {
    const { text } = setup();

    expect(text('chain-template')).toBe('{{ title }}');
    expect(text('stage-0')).toBe('castle in the sky');
  });

  it('adds a stage for each pipe and numbers them in click order', () => {
    const { root, click, text } = setup();

    click('step-titlecase');
    click('step-slice');

    expect(text('chain-template')).toBe('{{ title | titlecase | slice:0:8 }}');
    expect(text('stage-2')).toBe('Castle I');
    expect(Array.from(root.querySelectorAll('[data-testid="step-position"]')).map((e) => e.textContent?.trim())).toEqual(['1.', '2.']);
  });

  it('takes a pipe out of the chain when it is clicked again, and Clear removes them all', () => {
    const { click, text } = setup();
    click('step-uppercase');
    click('step-slice');

    click('step-uppercase');
    expect(text('chain-template')).toBe('{{ title | slice:0:8 }}');

    click('chain-clear');
    expect(text('chain-template')).toBe('{{ title }}');
  });

  it('runs the chain on whatever is typed', () => {
    const { root, fixture, click, text } = setup();
    click('step-uppercase');

    const input = root.querySelector<HTMLInputElement>('[data-testid="chain-input"]')!;
    input.value = 'totoro';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(text('stage-1')).toBe('TOTORO');
  });
});
