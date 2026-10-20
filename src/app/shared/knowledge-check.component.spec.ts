import { TestBed } from '@angular/core/testing';

import { KnowledgeCheckComponent } from './knowledge-check.component';

describe('KnowledgeCheckComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(KnowledgeCheckComponent);
    fixture.componentRef.setInput('items', [
      { question: 'First question?', answer: 'First answer.' },
      { question: 'Second question?', answer: 'Second answer.' },
    ]);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const questions = () => Array.from(root.querySelectorAll<HTMLButtonElement>('button[aria-expanded]'));
    const click = (index: number) => {
      questions()[index].click();
      fixture.detectChanges();
    };
    return { root, questions, click };
  }

  it('lists every question with its answer hidden', () => {
    const { root, questions } = setup();

    expect(questions().length).toBe(2);
    expect(questions().every((q) => q.getAttribute('aria-expanded') === 'false')).toBeTrue();
    expect(root.textContent).not.toContain('First answer.');
  });

  it('reveals an answer when its question is pressed and links them for screen readers', () => {
    const { root, questions, click } = setup();

    click(0);

    expect(root.textContent).toContain('First answer.');
    expect(questions()[0].getAttribute('aria-expanded')).toBe('true');
    const panel = root.querySelector('[role="region"]')!;
    expect(questions()[0].getAttribute('aria-controls')).toBe(panel.id);
  });

  it('hides the answer again on a second press', () => {
    const { root, click } = setup();

    click(0);
    click(0);

    expect(root.textContent).not.toContain('First answer.');
  });

  it('keeps the questions independent of each other', () => {
    const { root, click } = setup();

    click(0);
    click(1);

    expect(root.textContent).toContain('First answer.');
    expect(root.textContent).toContain('Second answer.');
  });
});
