import { TestBed } from '@angular/core/testing';

import { PredictOutputComponent } from './predict-output.component';

describe('PredictOutputComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(PredictOutputComponent);
    fixture.componentRef.setInput('challenge', {
      question: 'What does this log?',
      code: 'console.log(1 + 1);',
      options: [
        { id: 'a', text: '2' },
        { id: 'b', text: '11' },
      ],
      correct: 'a',
      explanation: 'Both are numbers, so + adds them.',
    });
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const click = (testId: string) => {
      root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
      fixture.detectChanges();
    };
    const text = (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
    return { root, click, text };
  }

  it('shows the question, the code and every option, and reveals nothing at first', () => {
    const { root, text } = setup();

    expect(text('predict-question')).toBe('What does this log?');
    expect(root.querySelector('pre')?.textContent).toContain('console.log(1 + 1);');
    expect(root.querySelectorAll('[role="radio"]').length).toBe(2);
    expect(root.querySelector('[data-testid="predict-result"]')).toBeNull();
  });

  it('asks for an answer before checking and reveals nothing', () => {
    const { root, click, text } = setup();

    click('predict-check');

    expect(text('predict-error')).toBe('Pick an answer first.');
    expect(root.querySelector('[data-testid="predict-result"]')).toBeNull();
  });

  it('says Correct for the right answer and explains why', () => {
    const { click, text } = setup();

    click('predict-option-a');
    click('predict-check');

    expect(text('predict-result')).toContain('Correct.');
    expect(text('predict-result')).toContain('Both are numbers');
  });

  it('says Not quite for a wrong answer, still explains, and marks the right option', () => {
    const { root, click, text } = setup();

    click('predict-option-b');
    click('predict-check');

    expect(text('predict-result')).toContain('Not quite.');
    expect(text('predict-result')).toContain('Both are numbers');
    expect(root.querySelector('[data-testid="predict-option-a"]')?.className).toContain('border-emerald-400');
    expect(root.querySelector('[data-testid="predict-option-b"]')?.className).toContain('border-rose-400');
  });

  it('locks the answer after checking and lets the learner try again', () => {
    const { root, click } = setup();
    click('predict-option-b');
    click('predict-check');

    click('predict-option-a');
    expect(root.querySelector('[data-testid="predict-option-b"]')?.getAttribute('aria-checked')).toBe('true');

    click('predict-retry');
    expect(root.querySelector('[data-testid="predict-result"]')).toBeNull();
    expect(root.querySelector('[data-testid="predict-option-b"]')?.getAttribute('aria-checked')).toBe('false');
  });

  it('clears the "pick an answer" message once something is chosen', () => {
    const { root, click } = setup();
    click('predict-check');

    click('predict-option-a');

    expect(root.querySelector('[data-testid="predict-error"]')).toBeNull();
  });

  it('shows no code block for a question that has no code', () => {
    const fixture = TestBed.createComponent(PredictOutputComponent);
    fixture.componentRef.setInput('challenge', {
      question: 'Which tool fits?',
      options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
      correct: 'b',
      explanation: 'Because B.',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('pre')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('[role="radio"]').length).toBe(2);
  });
});
