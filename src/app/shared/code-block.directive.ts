import { AfterViewInit, Directive, ElementRef, Renderer2, inject } from '@angular/core';

const KEYWORD_LIST =
  'import|export|const|let|var|function|return|class|interface|extends|implements|new|this|if|else|for|of|in|while|typeof|readonly|private|public|protected|static|async|await|from|type|enum|as|void|true|false|null|undefined|inject|constructor|catchError|throwError|finalize|retry';

// A single alternation, matched in one pass over the original text — critical so later
// alternatives (e.g. numbers) never re-scan HTML this same replace() already injected
// (every highlight color class below contains digits, e.g. "gold-300", so a second pass
// over already-wrapped spans would wrongly re-match those digits and corrupt the markup).
const TOKEN = new RegExp(`(\`[^\`]*\`|'[^']*'|"[^"]*")|(//[^\\n]*)|(@[A-Za-z]+)|\\b(${KEYWORD_LIST})\\b|\\b(\\d+\\.?\\d*)\\b`, 'g');

/** Lightweight TS/HTML syntax highlighter + copy-to-clipboard button for every <pre> code block on a page. */
@Directive({
  selector: 'pre',
  standalone: true,
})
export class CodeBlockDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLPreElement>);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    const pre = this.el.nativeElement;
    const rawText = pre.textContent ?? '';
    if (!rawText.trim()) {
      return;
    }

    pre.innerHTML = this.highlight(rawText);
    this.addCopyButton(pre, rawText);
  }

  private highlight(code: string): string {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return escaped.replace(TOKEN, (match, str, comment, decorator, keyword, num) => {
      if (str) return `<span class="text-emerald-300">${str}</span>`;
      if (comment) return `<span class="text-stone-500 italic">${comment}</span>`;
      if (decorator) return `<span class="text-rose-300">${decorator}</span>`;
      if (keyword) return `<span class="text-gold-300 font-semibold">${keyword}</span>`;
      if (num) return `<span class="text-amber-200">${num}</span>`;
      return match;
    });
  }

  private addCopyButton(pre: HTMLPreElement, rawText: string): void {
    const parent = pre.parentElement;
    if (!parent) {
      return;
    }

    const wrapper = this.renderer.createElement('div') as HTMLDivElement;
    this.renderer.setAttribute(wrapper, 'class', 'group/code relative');
    this.renderer.insertBefore(parent, wrapper, pre);
    this.renderer.appendChild(wrapper, pre);

    const button = this.renderer.createElement('button') as HTMLButtonElement;
    this.renderer.setAttribute(button, 'type', 'button');
    this.renderer.setAttribute(
      button,
      'class',
      'absolute right-2 top-2 rounded-md border border-stone-700 bg-stone-900/90 px-2 py-1 text-[10px] font-semibold text-stone-400 opacity-0 transition hover:border-gold-400/50 hover:text-gold-300 focus:opacity-100 group-hover/code:opacity-100',
    );
    this.renderer.setProperty(button, 'textContent', 'Copy');

    this.renderer.listen(button, 'click', () => {
      navigator.clipboard?.writeText(rawText).then(() => {
        this.renderer.setProperty(button, 'textContent', 'Copied!');
        setTimeout(() => this.renderer.setProperty(button, 'textContent', 'Copy'), 1500);
      });
    });

    this.renderer.appendChild(wrapper, button);
  }
}
