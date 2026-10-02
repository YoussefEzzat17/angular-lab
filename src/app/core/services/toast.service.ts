import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  /** Auto-dismiss time in ms; also drives the progress bar. */
  duration: number;
  /** True while the exit animation plays, just before removal. */
  leaving: boolean;
  /** True while the pointer or keyboard focus is on it — the countdown stands still. */
  paused: boolean;
}

interface Countdown {
  handle?: ReturnType<typeof setTimeout>;
  startedAt: number;
  remaining: number;
}

/** Keep in step with the `toast-out` animation in ToastComponent. */
export const TOAST_LEAVE_MS = 180;
const MAX_VISIBLE = 3;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;
  private readonly countdowns = new Map<number, Countdown>();

  /** Quick success message — kept so existing callers (`toast.show('…')`) keep working. */
  show(message: string, duration = 3000): void {
    this.push('success', message, undefined, duration);
  }

  success(title: string, description?: string, duration = 4500): void {
    this.push('success', title, description, duration);
  }

  error(title: string, description?: string, duration = 7000): void {
    this.push('error', title, description, duration);
  }

  info(title: string, description?: string, duration = 4500): void {
    this.push('info', title, description, duration);
  }

  dismiss(id: number): void {
    const countdown = this.countdowns.get(id);
    if (countdown) {
      clearTimeout(countdown.handle);
      this.countdowns.delete(id);
    }
    if (!this.toasts().some((t) => t.id === id && !t.leaving)) return;

    this.patch(id, { leaving: true });
    setTimeout(() => this.toasts.update((list) => list.filter((t) => t.id !== id)), TOAST_LEAVE_MS);
  }

  pause(id: number): void {
    const countdown = this.countdowns.get(id);
    if (!countdown?.handle) return;
    clearTimeout(countdown.handle);
    countdown.handle = undefined;
    countdown.remaining -= Date.now() - countdown.startedAt;
    this.patch(id, { paused: true });
  }

  resume(id: number): void {
    const countdown = this.countdowns.get(id);
    if (!countdown || countdown.handle) return;
    this.startCountdown(id, countdown);
    this.patch(id, { paused: false });
  }

  private push(kind: ToastKind, title: string, description: string | undefined, duration: number): void {
    // Hammering the same button shouldn't stack identical cards: replace the old one instead.
    const twin = this.toasts().find((t) => !t.leaving && t.kind === kind && t.title === title && t.description === description);
    if (twin) {
      clearTimeout(this.countdowns.get(twin.id)?.handle);
      this.countdowns.delete(twin.id);
      this.toasts.update((list) => list.filter((t) => t.id !== twin.id));
    }

    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, kind, title, description, duration, leaving: false, paused: false }]);
    const countdown: Countdown = { startedAt: Date.now(), remaining: duration };
    this.countdowns.set(id, countdown);
    this.startCountdown(id, countdown);

    const active = this.toasts().filter((t) => !t.leaving);
    if (active.length > MAX_VISIBLE) this.dismiss(active[0].id);
  }

  private startCountdown(id: number, countdown: Countdown): void {
    countdown.startedAt = Date.now();
    countdown.handle = setTimeout(() => this.dismiss(id), countdown.remaining);
  }

  private patch(id: number, changes: Partial<Toast>): void {
    this.toasts.update((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }
}
