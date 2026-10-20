import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDemoComponent } from './track-demo.component';

describe('TrackDemoComponent', () => {
  let fixture: ComponentFixture<TrackDemoComponent>;
  let root: HTMLElement;

  const click = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click();
    fixture.detectChanges();
  };
  const num = (id: string) => Number(root.querySelector(`[data-testid="${id}"]`)!.textContent);
  const rows = () => Array.from(root.querySelectorAll('[data-testid="track-row"]'));
  const titles = () => rows().map((r) => r.querySelector('[data-testid="track-row-title"]')!.textContent?.trim());
  const typeNote = (position: number, text: string) => {
    const input = rows()[position - 1].querySelector<HTMLInputElement>('[data-testid="track-row-note"]')!;
    input.value = text;
    input.dispatchEvent(new Event('input'));
  };
  const noteAt = (position: number) => rows()[position - 1].querySelector<HTMLInputElement>('[data-testid="track-row-note"]')!.value;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('builds one row per film to start with', () => {
    expect(titles()).toEqual(['Castle in the Sky', 'Totoro', 'Spirited Away', 'Ponyo']);
    expect(num('track-created')).toBe(4);
    expect(num('track-destroyed')).toBe(0);
  });

  it('keeps a note with its film when tracking by id and the first film is removed', () => {
    typeNote(2, 'my favourite');

    click('track-remove');

    expect(titles()).toEqual(['Totoro', 'Spirited Away', 'Ponyo']);
    expect(noteAt(1)).toBe('my favourite');
    expect(num('track-destroyed')).toBe(1);
  });

  it('leaves the note in the same position when tracking by index, so it ends up on a different film', () => {
    click('track-index');
    typeNote(2, 'my favourite');

    click('track-remove');

    expect(titles()).toEqual(['Totoro', 'Spirited Away', 'Ponyo']);
    expect(noteAt(2)).toBe('my favourite');
    expect(noteAt(1)).toBe('');
  });

  it('does not rebuild anything when the same films come back as new objects, tracked by id', () => {
    click('track-reload');

    expect(num('track-created')).toBe(4);
    expect(num('track-destroyed')).toBe(0);
  });

  it('starts the counters again when the tracking mode changes', () => {
    click('track-remove');

    click('track-index');

    expect(num('track-created')).toBe(4);
    expect(num('track-destroyed')).toBe(0);
  });
});
