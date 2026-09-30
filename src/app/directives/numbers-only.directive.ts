import { Directive, HostListener, output } from '@angular/core';

const ALLOWED_KEYS = new Set(['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

@Directive({
  selector: '[appNumbersOnly]',
})
export class NumbersOnlyDirective {
  readonly blocked = output<string>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (ALLOWED_KEYS.has(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      this.blocked.emit(event.key);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (/[^0-9]/.test(pasted)) {
      event.preventDefault();
      this.blocked.emit(pasted);
    }
  }
}
