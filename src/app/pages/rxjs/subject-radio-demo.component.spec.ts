import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRadioDemoComponent } from './subject-radio-demo.component';

describe('SubjectRadioDemoComponent', () => {
  let fixture: ComponentFixture<SubjectRadioDemoComponent>;
  let root: HTMLElement;

  const click = (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click();
    fixture.detectChanges();
  };
  const heard = (id: string) =>
    Array.from(root.querySelectorAll(`[data-testid="heard-${id}"] span`)).map((el) => el.textContent?.trim());

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRadioDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('delivers a broadcast to listeners who are subscribed, and only to them', () => {
    click('toggle-ali');
    click('broadcast');

    expect(heard('ali')).toEqual(['♪1']);
    expect(heard('mona')).toEqual(['nothing yet']);
  });

  it('gives a late listener nothing from a plain Subject', () => {
    click('broadcast');
    click('broadcast');
    click('toggle-sara');

    expect(heard('sara')).toEqual(['nothing yet']);
    expect(root.querySelector('[data-testid="note"]')?.textContent).toContain('subscribed late');
  });

  it('gives a late listener the latest value from a BehaviorSubject', () => {
    click('station-behavior');
    click('broadcast');
    click('broadcast');
    click('toggle-sara');

    expect(heard('sara')).toEqual(['♪2']);
  });

  it('replays the last two songs to a late listener of a ReplaySubject', () => {
    click('station-replay');
    click('broadcast');
    click('broadcast');
    click('broadcast');
    click('toggle-sara');

    expect(heard('sara')).toEqual(['♪2', '♪3']);
  });

  it('stops delivering after unsubscribe and clears everything on reset', () => {
    click('toggle-ali');
    click('toggle-ali');
    click('broadcast');
    expect(heard('ali')).toEqual(['nothing yet']);

    click('toggle-mona');
    click('broadcast');
    click('reset');

    expect(heard('mona')).toEqual(['nothing yet']);
    expect(root.querySelector('[data-testid="on-air"]')?.textContent).toContain('Nothing broadcast yet');
  });
});
