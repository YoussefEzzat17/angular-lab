import { Component, inject } from '@angular/core';

import { IconComponent, IconName } from '../../shared/icon.component';
import { ToastKind, ToastService } from '../services/toast.service';

// Full class strings so Tailwind's scanner sees them. Colors come from the shared panel tokens, so
// every kind already has a readable light and dark variant.
const KINDS: Record<ToastKind, { card: string; badge: string; bar: string; icon: IconName; role: 'status' | 'alert' }> = {
  success: {
    card: 'border-emerald-500/30 bg-[rgb(var(--panel-success-bg))]',
    badge: 'bg-[rgb(var(--panel-success-heading))]/15 text-[rgb(var(--panel-success-heading))]',
    bar: 'bg-[rgb(var(--panel-success-heading))]',
    icon: 'check',
    role: 'status',
  },
  error: {
    card: 'border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))]',
    badge: 'bg-[rgb(var(--panel-danger-heading))]/15 text-[rgb(var(--panel-danger-heading))]',
    bar: 'bg-[rgb(var(--panel-danger-heading))]',
    icon: 'alert',
    role: 'alert',
  },
  info: {
    card: 'border-gold-400/30 bg-stone-900',
    badge: 'bg-gold-500/15 text-gold-300',
    bar: 'bg-gold-500',
    icon: 'info',
    role: 'status',
  },
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [IconComponent],
  styles: `
    .toast {
      --from: translate(1.5rem, 0);
      animation: toast-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .toast-leave {
      animation: toast-out 180ms ease-in forwards;
    }
    .toast-bar {
      animation-name: toast-countdown;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      transform-origin: left;
    }
    @media (max-width: 639px) {
      .toast {
        --from: translate(0, 1rem);
      }
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: var(--from) scale(0.97);
      }
    }
    @keyframes toast-out {
      to {
        opacity: 0;
        transform: var(--from) scale(0.97);
      }
    }
    @keyframes toast-countdown {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }
    @keyframes toast-fade {
      from {
        opacity: 0;
      }
    }
    @keyframes toast-fade-out {
      to {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: toast-fade 150ms ease-out both;
      }
      .toast-leave {
        animation: toast-fade-out 150ms ease-in forwards;
      }
    }
  `,
  template: `
    <div class="pointer-events-none fixed inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex flex-col gap-3 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:w-96">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="toast pointer-events-auto overflow-hidden rounded-2xl border shadow-xl shadow-black/20"
          [class]="kinds[t.kind].card"
          [class.toast-leave]="t.leaving"
          [attr.role]="kinds[t.kind].role"
          (mouseenter)="toast.pause(t.id)"
          (mouseleave)="toast.resume(t.id)"
          (focusin)="toast.pause(t.id)"
          (focusout)="toast.resume(t.id)"
        >
          <div class="flex items-start gap-3 p-4">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full" [class]="kinds[t.kind].badge">
              <app-icon [name]="kinds[t.kind].icon" class="h-5 w-5" />
            </span>
            <div class="min-w-0 flex-1 pt-0.5">
              <p class="font-semibold leading-snug text-stone-100">{{ t.title }}</p>
              @if (t.description) {
                <p class="mt-0.5 text-sm leading-snug text-stone-300">{{ t.description }}</p>
              }
            </div>
            <button
              type="button"
              (click)="toast.dismiss(t.id)"
              class="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-100/10 hover:text-stone-100"
              aria-label="Dismiss notification"
            >
              <app-icon name="close" class="h-4 w-4" />
            </button>
          </div>
          <div class="h-1 w-full bg-stone-100/10">
            <div
              class="toast-bar h-full"
              [class]="kinds[t.kind].bar"
              [style.animation-duration.ms]="t.duration"
              [style.animation-play-state]="t.paused ? 'paused' : 'running'"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
  protected readonly kinds = KINDS;
}
