import { TestBed } from '@angular/core/testing';

import { TitlePreviewComponent } from './title-preview.component';

describe('TitlePreviewComponent', () => {
  function setup(title = 'Spirited Away') {
    const fixture = TestBed.createComponent(TitlePreviewComponent);
    fixture.componentRef.setInput('title', title);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows the title it received from its parent', () => {
    const { root } = setup('Spirited Away');

    expect(root.querySelector('[data-testid="title-preview-title"]')?.textContent?.trim()).toBe('Spirited Away');
  });

  it('follows the parent when the title changes', () => {
    const { fixture, root } = setup('First');

    fixture.componentRef.setInput('title', 'Second');
    fixture.detectChanges();

    expect(root.querySelector('[data-testid="title-preview-title"]')?.textContent?.trim()).toBe('Second');
  });

  it('tells its parent which title was added when the button is pressed', () => {
    const { fixture, root } = setup('Totoro');
    const received: string[] = [];
    fixture.componentInstance.addToWatchlist.subscribe((value) => received.push(value));

    root.querySelector<HTMLButtonElement>('[data-testid="title-preview-add"]')!.click();

    expect(received).toEqual(['Totoro']);
  });
});
