import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  standalone: true,
  imports: [NumbersOnlyDirective],
  template: `<input appNumbersOnly (blocked)="lastBlocked = $event" />`,
})
class HostComponent {
  lastBlocked = '';
}

function keydown(key: string, options: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, cancelable: true, ...options });
}

describe('NumbersOnlyDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('allows digit keys through', () => {
    const event = keydown('7');
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('blocks a letter key and emits it', () => {
    const event = keydown('a');
    input.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.lastBlocked).toBe('a');
  });

  it('allows navigation keys like Backspace and arrow keys', () => {
    for (const key of ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete']) {
      const event = keydown(key);
      input.dispatchEvent(event);
      expect(event.defaultPrevented).withContext(key).toBe(false);
    }
  });

  it('allows Ctrl/Cmd combinations (e.g. paste shortcuts) through', () => {
    const event = keydown('v', { ctrlKey: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('blocks a pasted value that contains non-digit characters', () => {
    const dataTransfer = { getData: () => 'abc123' } as unknown as DataTransfer;
    const event = new ClipboardEvent('paste', { cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: dataTransfer });

    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('allows a pasted value that is already all digits', () => {
    const dataTransfer = { getData: () => '12345' } as unknown as DataTransfer;
    const event = new ClipboardEvent('paste', { cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: dataTransfer });

    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
