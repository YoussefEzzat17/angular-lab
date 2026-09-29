import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flow-diagram',
  standalone: true,
  template: `
    <div class="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
      <span class="rounded-lg border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-gold-300">{{ from }}</span>
      <span class="relative h-[2px] w-10 flex-1 bg-gradient-to-r from-stone-700 via-gold-500/50 to-stone-700 sm:w-16">
        @if (direction !== 'left') {
          <span class="dot dot-right"></span>
        }
        @if (direction === 'both' || direction === 'left') {
          <span class="dot dot-left"></span>
        }
      </span>
      <span class="rounded-lg border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-gold-300">{{ to }}</span>
    </div>
  `,
  styles: [`
    .dot {
      position: absolute;
      top: 50%;
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: #dbb877;
      box-shadow: 0 0 6px 2px rgba(201, 162, 99, 0.7);
      transform: translateY(-50%);
    }
    .dot-right { animation: app-flow-right 1.8s ease-in-out infinite; }
    .dot-left { animation: app-flow-left 1.8s ease-in-out infinite; }
    @keyframes app-flow-right {
      0% { left: 0%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
    @keyframes app-flow-left {
      0% { left: 100%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { left: 0%; opacity: 0; }
    }
  `],
})
export class FlowDiagramComponent {
  @Input() from = '';
  @Input() to = '';
  @Input() direction: 'right' | 'left' | 'both' = 'right';
}
