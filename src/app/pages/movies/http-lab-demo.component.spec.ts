import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { HttpLabDemoComponent, SCENARIOS, SERVER_MS, serve } from './http-lab-demo.component';

describe('serve (the pretend server)', () => {
  const request = (id: string) => SCENARIOS.find((s) => s.id === id)!.request;

  it('answers a list and a single film with 200', () => {
    expect(serve(request('list')).status).toBe(200);
    expect(serve(request('one'))).toEqual(jasmine.objectContaining({ status: 200, body: { id: 2, title: 'Grave of the Fireflies' } }));
  });

  it('answers a POST with 201 and the new film', () => {
    expect(serve(request('create'))).toEqual(jasmine.objectContaining({ status: 201, body: { id: 4, title: 'Spirited Away' } }));
  });

  it('answers an unknown film with 404 and a crash with 500', () => {
    expect(serve(request('missing')).status).toBe(404);
    expect(serve(request('crash')).status).toBe(500);
  });
});

describe('HttpLabDemoComponent', () => {
  let fixture: ComponentFixture<HttpLabDemoComponent>;
  let root: HTMLElement;
  const text = (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const send = (id: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="send-${id}"]`)!.click();
    fixture.detectChanges();
  };
  const answer = () => {
    tick(SERVER_MS);
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpLabDemoComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('asks for a request before anything is sent', () => {
    expect(text('http-idle')).toBe('Press a button to send a request.');
    expect(text('http-request-line')).toBe('GET /api/films');
  });

  it('waits for the server and then hands next() the body for a 200', fakeAsync(() => {
    send('list');
    expect(text('http-waiting')).toBe('Waiting for the server…');

    answer();

    expect(text('http-status')).toBe('200 OK');
    expect(text('http-callback')).toBe('next(body)');
    expect(text('http-body')).toContain('Castle in the Sky');
    flush();
  }));

  it('shows the body that was sent with a POST', fakeAsync(() => {
    send('create');
    expect(text('http-request-line')).toBe('POST /api/films');
    expect(text('http-request-body')).toContain('Spirited Away');

    answer();

    expect(text('http-status')).toBe('201 Created');
    flush();
  }));

  it('turns a 404 into error(HttpErrorResponse) with a readable message', fakeAsync(() => {
    send('missing');

    answer();

    expect(text('http-status')).toBe('404 Not Found');
    expect(text('http-callback')).toBe('error(HttpErrorResponse)');
    expect(text('http-explanation')).toContain('404');
    flush();
  }));

  it('does the same for a 500', fakeAsync(() => {
    send('crash');

    answer();

    expect(text('http-callback')).toBe('error(HttpErrorResponse)');
    expect(text('http-status')).toBe('500 Internal Server Error');
    flush();
  }));

  it('forgets the previous answer when a new request is sent', fakeAsync(() => {
    send('missing');
    answer();

    send('list');

    expect(text('http-waiting')).toBe('Waiting for the server…');
    answer();
    expect(text('http-callback')).toBe('next(body)');
    flush();
  }));
});
