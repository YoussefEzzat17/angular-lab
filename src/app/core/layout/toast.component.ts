import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.message()) {
      <div class="fixed inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-3 rounded-xl border border-gold-400/30 bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-black/40 sm:inset-x-auto sm:right-5 sm:left-auto" role="status" aria-live="polite">
        <span class="grid h-6 w-6 place-items-center rounded-full bg-gold-500 text-white">✓</span>
        {{ toast.message() }}
      </div>
    }
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
