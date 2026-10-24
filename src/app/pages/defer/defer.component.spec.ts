import { DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DeferStatsService } from './defer-stats.service';
import { DeferComponent } from './defer.component';

describe('DeferComponent', () => {
  async function setup(section = 'basics') {
    const fixture = TestBed.createComponent(DeferComponent);
    fixture.componentRef.setInput('section', section);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, stats: TestBed.inject(DeferStatsService) };
  }

  beforeEach(() => {
    // Let @defer blocks really load when their trigger fires, the way they do in the browser.
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Playthrough, providers: [provideRouter([])] });
    TestBed.inject(DeferStatsService).created.set(0);
  });

  it('shows the placeholder and has created no widget before the condition is true', async () => {
    const { root, stats } = await setup();

    expect(root.querySelector('[data-testid="defer-placeholder"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="defer-widget"]')).toBeNull();
    expect(stats.created()).toBe(0);
  });

  it('loads the widget once the button flips the condition', async () => {
    const { fixture, root, stats } = await setup();

    root.querySelector<HTMLButtonElement>('[data-testid="defer-load"]')!.click();
    fixture.detectChanges();
    // The @loading block has "minimum 500ms", so the widget shows up a little after the code arrives.
    for (let i = 0; i < 40 && !root.querySelector('[data-testid="defer-widget"]'); i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      fixture.detectChanges();
    }

    expect(root.querySelector('[data-testid="defer-widget"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="defer-placeholder"]')).toBeNull();
    expect(stats.created()).toBe(1);
    expect(root.querySelector('[data-testid="defer-count"]')?.textContent?.trim()).toBe('1');
  });

  it('has a trigger table that lists the main triggers', async () => {
    const { root } = await setup('triggers');

    const triggers = Array.from(root.querySelectorAll('tbody td:first-child')).map((td) => td.textContent?.trim());

    expect(triggers).toEqual(jasmine.arrayContaining(['on idle', 'on viewport', 'on interaction', 'on hover', 'when condition']));
  });

  it('asks which trigger loads on scroll, with the right answer not first', async () => {
    const { root } = await setup('try-it');

    const options = Array.from(root.querySelectorAll('[role="radio"]')).map((o) => o.textContent?.trim());

    expect(options.length).toBe(4);
    expect(options[0]).not.toBe('on viewport');
    expect(options).toContain('on viewport');
  });
});
