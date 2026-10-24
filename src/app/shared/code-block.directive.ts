import { AfterViewInit, DestroyRef, Directive, ElementRef, effect, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type CodeLanguage = 'ts' | 'html' | 'css' | 'json' | 'shell';

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  shell: 'Terminal',
};

const KEYWORD_LIST =
  'import|export|const|let|var|function|return|class|interface|extends|implements|new|this|if|else|for|of|in|while|typeof|readonly|private|public|protected|static|async|await|from|type|enum|as|void|true|false|null|undefined|inject|constructor|catchError|throwError|finalize|retry';

// Each language is a single alternation, matched in one pass over the escaped text — critical so later
// alternatives (e.g. numbers) never re-scan markup this same replace() already injected.
// Quoted strings stop at a line end, so an apostrophe in prose ("don't") never swallows the lines after it.
const TS_TOKEN = new RegExp(`(\`[^\`]*\`|'[^'\\n]*'|"[^"\\n]*")|(//[^\\n]*)|(@[A-Za-z]+)|\\b(${KEYWORD_LIST})\\b|\\b(\\d+\\.?\\d*)\\b`, 'g');
const HTML_TOKEN =
  /(&lt;!--[\s\S]*?--&gt;)|(\{\{[\s\S]*?\}\})|("[^"\n]*"|'[^'\n]*')|(&lt;\/?)([A-Za-z][\w.-]*)|(@(?:if|else|for|switch|case|default|defer|placeholder|loading|error|empty|let)\b)|(\s)([[(*#@]{0,2}[\w.:-]+[\])]{0,2})(?==)/g;
const CSS_TOKEN =
  /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(@[\w-]+)|(^[ \t]*)([^\s{}][^{}\n;]*?)(?=\s*\{)|([\w-]+)(?=\s*:\s)|(#[0-9a-fA-F]{3,8}\b|\b\d+\.?\d*(?:px|rem|em|%|ms|s|vh|vw|deg|fr)?)/gm;
const SHELL_TOKEN = /(#[^\n]*)|("[^"\n]*"|'[^'\n]*')|(^[ \t]*(?:\$ )?)([\w.-]+)/gm;

const span = (cls: string, text: string) => `<span class="${cls}">${text}</span>`;

/** Strips the template's leading newline, trailing blank space and any indentation shared by every line. */
export function normalizeCode(raw: string): string {
  const text = raw.replace(/\r\n?/g, '\n').replace(/^\n/, '').replace(/\s+$/, '');
  const lines = text.split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)![0].length);
  const shared = indents.length ? Math.min(...indents) : 0;
  return shared ? lines.map((l) => l.slice(shared)).join('\n') : text;
}

/** ASCII diagrams (box-drawing lines, ▶ and ↓ arrows) are shown as they are: no colors, no Copy. */
export function isDiagram(code: string): boolean {
  return /[\u2500-\u257f\u25b6\u2193]/.test(code);
}

export function detectLanguage(code: string): CodeLanguage {
  const start = code.trimStart();
  if (/^(?:\$ |npm |npx |ng |git |cd )/.test(start)) return 'shell';
  if (/^[{[]/.test(start)) {
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      /* not JSON: fall through */
    }
  }
  if (start.startsWith('<') || /^@(?:if|for|switch|defer)\b/.test(start)) return 'html';
  const firstLine = start.split('\n')[0];
  if (/^[^{};=()]+\{\s*$/.test(firstLine) && /^\s*[\w-]+\s*:\s*[^;\n]+;\s*$/m.test(code) && !/=>|\b(?:const|import|class|function)\b/.test(code)) {
    return 'css';
  }
  return 'ts';
}

export function highlight(code: string, lang: CodeLanguage): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  switch (lang) {
    case 'html':
      return escaped.replace(HTML_TOKEN, (match, comment, interp, str, open, tag, control, space, attr) => {
        if (comment) return span('tok-com', comment);
        if (interp) return span('tok-kw', interp);
        if (str) return span('tok-str', str);
        if (tag) return open + span('tok-tag', tag);
        if (control) return span('tok-kw', control);
        if (attr) return space + span('tok-attr', attr);
        return match;
      });
    case 'css':
      return escaped.replace(CSS_TOKEN, (match, comment, str, atRule, indent, selector, prop, num) => {
        if (comment) return span('tok-com', comment);
        if (str) return span('tok-str', str);
        if (atRule) return span('tok-dec', atRule);
        if (selector) return indent + span('tok-tag', selector);
        if (prop) return span('tok-attr', prop);
        if (num) return span('tok-num', num);
        return match;
      });
    case 'shell':
      return escaped.replace(SHELL_TOKEN, (match, comment, str, prompt, command) => {
        if (comment) return span('tok-com', comment);
        if (str) return span('tok-str', str);
        if (command) return prompt + span('tok-kw', command);
        return match;
      });
    default:
      return escaped.replace(TS_TOKEN, (match, str, comment, decorator, keyword, num) => {
        if (str) return span('tok-str', str);
        if (comment) return span('tok-com', comment);
        if (decorator) return span('tok-dec', decorator);
        if (keyword) return span('tok-kw', keyword);
        if (num) return span('tok-num', num);
        return match;
      });
  }
}

const COPY_ICON =
  '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
const CHECK_ICON =
  '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

/** Spacing classes move from the <pre> to the panel that now sits where the <pre> was. */
const MARGIN_CLASS = /^(?:[a-z]+:)?-?m[trblxy]?-/;
/** A text color on the <pre> (e.g. rose for a "don't do this" example) stays as the code's base color. */
const COLOR_CLASS = /^text-(?:gold|stone|rose|emerald|amber)-\d+$/;
/** A height cap moves to the body, so line numbers and code scroll down together. */
const HEIGHT_CLASS = /^max-h-/;

/**
 * Every <pre> in a component that imports this directive becomes a code example: a header with the language
 * (or `data-file="app.component.ts"`), a Copy button that copies the exact code, line numbers, and syntax colors
 * for TypeScript, HTML, CSS, JSON and terminal commands (`data-lang` overrides the guess).
 *
 * ASCII diagrams stay plain; `data-plain` / `data-code` force either way.
 * The <pre>'s text is read once when it appears. When the code changes while the <pre> stays on screen
 * (a quiz moving to its next question), bind it instead: `<pre [appCode]="question().code"></pre>`.
 */
@Directive({
  selector: 'pre',
  standalone: true,
})
export class CodeBlockDirective implements AfterViewInit {
  readonly appCode = input<string | null | undefined>(undefined);

  private readonly pre: HTMLPreElement = inject(ElementRef<HTMLPreElement>).nativeElement;
  private readonly document = inject(DOCUMENT);

  private panel?: HTMLElement;
  private label?: HTMLElement;
  private copyButton?: HTMLButtonElement;
  private status?: HTMLElement;
  private gutter?: HTMLElement;
  private code = '';
  private languageLabel = '';
  private ready = false;
  private resetTimer?: ReturnType<typeof setTimeout>;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const code = this.appCode();
      if (this.ready && code !== undefined) this.render(code ?? '');
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.resetTimer);
      this.resizeObserver?.disconnect();
      // Angular removes the <pre> itself; the panel wrapped around it would otherwise stay behind.
      this.panel?.remove();
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    const bound = this.appCode();
    this.render(bound !== undefined ? (bound ?? '') : (this.pre.textContent ?? ''));
  }

  private render(raw: string): void {
    const code = normalizeCode(raw);
    const data = this.pre.dataset;
    const plain = data['plain'] !== undefined || (data['code'] === undefined && isDiagram(code));

    if (!code.trim() || plain) {
      this.pre.textContent = code;
      if (this.panel) this.panel.hidden = !code.trim();
      return;
    }

    const lang = (data['lang'] as CodeLanguage | undefined) ?? detectLanguage(code);
    this.code = code;
    this.languageLabel = data['file'] ?? LANGUAGE_LABELS[lang] ?? LANGUAGE_LABELS.ts;
    this.pre.innerHTML = highlight(code, lang);

    this.ensurePanel();
    this.panel!.hidden = false;
    this.label!.textContent = this.languageLabel;
    this.setCopyState('idle');

    const lines = code.split('\n').length;
    this.gutter!.hidden = lines < 3;
    this.gutter!.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    this.updateScrollable();
  }

  /** Wraps the <pre> once: figure > (header: label + Copy) + (body: line numbers + <pre>). */
  private ensurePanel(): void {
    if (this.panel) return;
    const doc = this.document;
    const pre = this.pre;
    const classes = [...pre.classList];

    const panel = doc.createElement('figure');
    panel.className = ['code-panel', ...classes.filter((c) => MARGIN_CLASS.test(c))].join(' ');

    const head = doc.createElement('figcaption');
    head.className = 'code-head';
    const label = doc.createElement('span');
    label.className = 'code-label';
    const copy = doc.createElement('button');
    copy.type = 'button';
    copy.className = 'code-copy';
    copy.addEventListener('click', () => this.copy());
    const status = doc.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    head.append(label, copy, status);

    const body = doc.createElement('div');
    body.className = ['code-body', ...classes.filter((c) => HEIGHT_CLASS.test(c)), classes.some((c) => HEIGHT_CLASS.test(c)) ? 'overflow-y-auto' : '']
      .filter(Boolean)
      .join(' ');
    const gutter = doc.createElement('div');
    gutter.className = 'code-gutter';
    gutter.setAttribute('aria-hidden', 'true');

    pre.parentNode?.insertBefore(panel, pre);
    body.append(gutter, pre);
    panel.append(head, body);
    pre.className = ['code-pre', ...classes.filter((c) => COLOR_CLASS.test(c))].join(' ');

    this.panel = panel;
    this.label = label;
    this.copyButton = copy;
    this.status = status;
    this.gutter = gutter;

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateScrollable());
      this.resizeObserver.observe(pre);
    }
  }

  /** Code wider than its panel scrolls sideways, so keyboard users must be able to focus it and use the arrows. */
  private updateScrollable(): void {
    const scrolls = this.pre.scrollWidth > this.pre.clientWidth + 1;
    if (scrolls) {
      this.pre.tabIndex = 0;
      this.pre.setAttribute('role', 'region');
      this.pre.setAttribute('aria-label', `${this.languageLabel} code, scrolls sideways`);
    } else {
      this.pre.removeAttribute('tabindex');
      this.pre.removeAttribute('role');
      this.pre.removeAttribute('aria-label');
    }
  }

  private async copy(): Promise<void> {
    const ok = await this.writeClipboard(this.code);
    if (ok) {
      this.setCopyState('copied');
    } else {
      // Nothing reached the clipboard: select the code so one keyboard shortcut finishes the job.
      const range = this.document.createRange();
      range.selectNodeContents(this.pre);
      const selection = this.document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      this.setCopyState('failed');
    }
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.setCopyState('idle'), 2000);
  }

  private async writeClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // No Clipboard API (insecure context, older browser) or permission refused: try the legacy path.
      const area = this.document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      this.document.body.append(area);
      area.select();
      let ok = false;
      try {
        ok = this.document.execCommand('copy');
      } catch {
        ok = false;
      }
      area.remove();
      return ok;
    }
  }

  private setCopyState(state: 'idle' | 'copied' | 'failed'): void {
    const button = this.copyButton!;
    const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘C' : 'Ctrl+C';
    button.dataset['state'] = state;
    if (state === 'copied') {
      button.innerHTML = `${CHECK_ICON}<span>Copied</span>`;
      button.setAttribute('aria-label', 'Copied');
      this.status!.textContent = 'Code copied to clipboard';
    } else if (state === 'failed') {
      button.innerHTML = `${COPY_ICON}<span>Press ${shortcut}</span>`;
      button.setAttribute('aria-label', `Copy failed. The code is selected: press ${shortcut}`);
      this.status!.textContent = `Could not copy automatically. The code is selected: press ${shortcut} to copy it.`;
    } else {
      button.innerHTML = `${COPY_ICON}<span>Copy</span>`;
      button.setAttribute('aria-label', `Copy ${this.languageLabel} code`);
      this.status!.textContent = '';
    }
  }
}
