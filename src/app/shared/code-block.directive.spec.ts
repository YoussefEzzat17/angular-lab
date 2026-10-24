import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CodeBlockDirective, detectLanguage, highlight, isDiagram, normalizeCode } from './code-block.directive';

const TS_SAMPLE = `@Component({
  selector: 'app-root',
  template: '<h1>Hello</h1>',
})
export class AppComponent {}`;

@Component({
  standalone: true,
  imports: [CodeBlockDirective],
  template: `
    @if (showStatic()) {
      <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200" data-testid="static">{{ tsSample }}</pre>
    }
    <pre data-testid="file" data-file="app.component.ts">const a = 1;</pre>
    <pre data-testid="diagram">price ───┐
         ├──→ total</pre>
    <pre data-testid="bound" [appCode]="code()"></pre>
  `,
})
class HostComponent {
  readonly tsSample = TS_SAMPLE;
  readonly showStatic = signal(true);
  readonly code = signal<string | null>('first();\nsecond();\nthird();');
}

/** Text a <pre> shows, with the highlight markup stripped: what a learner sees and selects. */
const visibleText = (el: Element | null) => el?.textContent ?? '';

describe('code helpers', () => {
  it('removes shared indentation and template padding, and keeps relative indentation', () => {
    expect(normalizeCode('\n    if (a) {\n      b();\n    }\n  ')).toBe('if (a) {\n  b();\n}');
  });

  it('guesses the language from the code itself', () => {
    expect(detectLanguage(TS_SAMPLE)).toBe('ts');
    expect(detectLanguage('<p [ngClass]="{ late: isLate }">Due</p>')).toBe('html');
    expect(detectLanguage('@if (user) {\n  <p>Hi</p>\n}')).toBe('html');
    expect(detectLanguage('.card {\n  color: red;\n  padding: 4px;\n}')).toBe('css');
    expect(detectLanguage('{ "name": "angular-lab" }')).toBe('json');
    expect(detectLanguage('ng generate component hero')).toBe('shell');
  });

  it('treats box-drawing and arrow diagrams as diagrams, not code', () => {
    expect(isDiagram('a ──▶ b')).toBeTrue();
    expect(isDiagram('quantity\n   ↓\ntotal')).toBeTrue();
    expect(isDiagram(TS_SAMPLE)).toBeFalse();
  });

  it('only adds markup: stripping the highlight gives back the exact code, in every language', () => {
    const samples: [string, Parameters<typeof highlight>[1]][] = [
      [TS_SAMPLE, 'ts'],
      ['<button (click)="save()" [disabled]="busy">Save & close</button>\n<!-- note -->', 'html'],
      ['.card:hover {\n  color: #fff;\n  margin: 4px 0;\n}', 'css'],
      ['npm install # deps', 'shell'],
    ];
    for (const [code, lang] of samples) {
      const div = document.createElement('div');
      div.innerHTML = highlight(code, lang);
      expect(div.textContent).withContext(lang).toBe(code);
      expect(div.querySelector('span')).withContext(lang).not.toBeNull();
    }
  });

  it('colors HTML tags, attributes, strings and comments with their own roles', () => {
    const html = highlight('<p class="x">{{ name }}</p><!-- c -->', 'html');
    expect(html).toContain('<span class="tok-tag">p</span>');
    expect(html).toContain('<span class="tok-attr">class</span>');
    expect(html).toContain('<span class="tok-str">"x"</span>');
    expect(html).toContain('<span class="tok-kw">{{ name }}</span>');
    expect(html).toContain('<span class="tok-com">&lt;!-- c --&gt;</span>');
  });
});

describe('CodeBlockDirective', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const pre = (id: string) => root.querySelector<HTMLPreElement>(`[data-testid="${id}"]`);
    const panelOf = (id: string) => pre(id)?.closest('figure') ?? null;
    const copyOf = (id: string) => panelOf(id)!.querySelector<HTMLButtonElement>('.code-copy')!;
    return { fixture, root, pre, panelOf, copyOf };
  }

  it('wraps code in a panel with its language, line numbers and a visible Copy button', () => {
    const { pre, panelOf, copyOf } = setup();

    const panel = panelOf('static')!;
    expect(panel.querySelector('.code-label')?.textContent).toBe('TypeScript');
    expect(copyOf('static').textContent?.trim()).toBe('Copy');
    expect(copyOf('static').getAttribute('aria-label')).toBe('Copy TypeScript code');
    const gutter = panel.querySelector('.code-gutter')!;
    expect(gutter.getAttribute('aria-hidden')).toBe('true');
    expect(gutter.textContent).toBe('1\n2\n3\n4\n5');
    expect(visibleText(pre('static'))).toBe(TS_SAMPLE);
  });

  it('moves the margin to the panel and drops the old inline surface from the <pre>', () => {
    const { pre, panelOf } = setup();

    expect(panelOf('static')!.classList).toContain('mt-4');
    expect(pre('static')!.classList).toContain('code-pre');
    expect(pre('static')!.classList).not.toContain('bg-stone-950');
  });

  it('shows the file name when the example names one', () => {
    const { panelOf, copyOf } = setup();

    expect(panelOf('file')!.querySelector('.code-label')?.textContent).toBe('app.component.ts');
    expect(copyOf('file').getAttribute('aria-label')).toBe('Copy app.component.ts code');
  });

  it('copies the exact code: plain text, indentation and newlines intact, no markup or line numbers', async () => {
    const write = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    const { panelOf, copyOf } = setup();

    copyOf('static').click();
    await Promise.resolve();
    await Promise.resolve();

    expect(write).toHaveBeenCalledOnceWith(TS_SAMPLE);
    expect(copyOf('static').textContent?.trim()).toBe('Copied');
    expect(copyOf('static').dataset['state']).toBe('copied');
    expect(panelOf('static')!.querySelector('[aria-live="polite"]')?.textContent).toBe('Code copied to clipboard');
  });

  it('falls back to the legacy copy command when the Clipboard API refuses', async () => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith(new Error('denied'));
    const exec = spyOn(document, 'execCommand').and.returnValue(true);
    const { copyOf } = setup();

    copyOf('static').click();
    await new Promise((r) => setTimeout(r));

    expect(exec).toHaveBeenCalledWith('copy');
    expect(copyOf('static').dataset['state']).toBe('copied');
  });

  it('selects the code and says which keys to press when nothing can copy', async () => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith(new Error('denied'));
    spyOn(document, 'execCommand').and.returnValue(false);
    const { pre, copyOf } = setup();

    copyOf('static').click();
    await new Promise((r) => setTimeout(r));

    expect(copyOf('static').dataset['state']).toBe('failed');
    expect(copyOf('static').textContent).toMatch(/Press (⌘C|Ctrl\+C)/);
    expect(document.getSelection()?.toString()).toBe(visibleText(pre('static')));
  });

  it('leaves ASCII diagrams plain: no panel, no colors, no Copy', () => {
    const { pre, panelOf } = setup();

    expect(panelOf('diagram')).toBeNull();
    expect(pre('diagram')!.querySelector('span')).toBeNull();
  });

  it('re-renders bound code when it changes while the <pre> stays (the next quiz question)', () => {
    const { fixture, pre, panelOf } = setup();
    expect(visibleText(pre('bound'))).toBe('first();\nsecond();\nthird();');

    fixture.componentInstance.code.set('const next = 2;');
    fixture.detectChanges();

    expect(visibleText(pre('bound'))).toBe('const next = 2;');
    expect(panelOf('bound')!.querySelector<HTMLElement>('.code-gutter')!.hidden).toBeTrue();

    fixture.componentInstance.code.set(null);
    fixture.detectChanges();
    expect(panelOf('bound')!.hidden).toBeTrue();
  });

  it('removes the panel with its <pre>, leaving no stray header behind', () => {
    const { fixture, root } = setup();
    const before = root.querySelectorAll('figure.code-panel').length;

    fixture.componentInstance.showStatic.set(false);
    fixture.detectChanges();

    expect(root.querySelectorAll('figure.code-panel').length).toBe(before - 1);
    expect(root.querySelector('[data-testid="static"]')).toBeNull();
  });
});
