import { booleanAttribute, Component, input } from '@angular/core';

/**
 * A labelled arrow showing data moving between two things on the page (parent → child, child → parent).
 * A dot travels along it; set `active` to make it glow and speed up while data is actually flowing.
 *
 *  - `direction="down"`   always vertical
 *  - `direction="right"`  always horizontal
 *  - `turn`               vertical on small screens, horizontal from `md` up (for cards that stack on mobile)
 */
@Component({
  selector: 'app-flow-arrow',
  standalone: true,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="arrow" [class.horizontal]="direction() === 'right'" [class.turn]="turn()" [class.active]="active()" [class.burgundy]="tone() === 'burgundy'">
      <span class="text">
        <span class="label">{{ label() }}</span>
        @if (caption()) {
          <span class="caption">{{ caption() }}</span>
        }
      </span>
      <span class="track">
        <span class="line"><span class="dot"></span></span>
        <span class="head"></span>
      </span>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
      .arrow {
        --c: var(--gold-400);
        --label: var(--gold-300);
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }
      .arrow.burgundy {
        --c: var(--panel-danger-heading);
        --label: var(--panel-danger-heading);
      }
      .text {
        display: flex;
        flex-direction: column;
        line-height: 1.25;
      }
      .label {
        font: 600 11px/1.25 ui-monospace, SFMono-Regular, Menlo, monospace;
        color: rgb(var(--label));
        transition: color 200ms;
      }
      .caption {
        font-size: 11px;
        color: rgb(var(--stone-400));
      }
      .track {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: rgb(var(--c));
        transition: filter 200ms;
      }
      .line {
        position: relative;
        width: 2px;
        height: 2.5rem;
        border-radius: 1px;
        background: linear-gradient(to bottom, rgb(var(--c) / 0.15), rgb(var(--c) / 0.7));
      }
      .head {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 9px solid rgb(var(--c));
        margin-top: -1px;
      }
      .dot {
        position: absolute;
        left: 50%;
        top: 0;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        border-radius: 9999px;
        background: rgb(var(--c));
        box-shadow: 0 0 6px 2px rgb(var(--c) / 0.6);
        animation: arrow-down 2.4s ease-in-out infinite;
      }
      .arrow.active .track {
        filter: drop-shadow(0 0 6px rgb(var(--c) / 0.85));
      }
      .arrow.active .label {
        color: rgb(var(--stone-100));
      }
      .arrow.active .dot {
        animation-duration: 0.8s;
      }
      @keyframes arrow-down {
        0% {
          top: 0;
          opacity: 0;
        }
        15%,
        85% {
          opacity: 1;
        }
        100% {
          top: calc(100% - 6px);
          opacity: 0;
        }
      }
      @keyframes arrow-right {
        0% {
          left: 0;
          opacity: 0;
        }
        15%,
        85% {
          opacity: 1;
        }
        100% {
          left: calc(100% - 6px);
          opacity: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .dot {
          animation: none;
          opacity: 0;
        }
      }
    `,
    horizontalRules('.arrow.horizontal'),
    `@media (min-width: 768px) { ${horizontalRules('.arrow.turn')} }`,
  ],
})
export class FlowArrowComponent {
  readonly direction = input<'down' | 'right'>('down');
  /** Vertical on small screens, horizontal from `md` up. */
  readonly turn = input(false, { transform: booleanAttribute });
  readonly label = input.required<string>();
  readonly caption = input<string>();
  readonly tone = input<'gold' | 'burgundy'>('gold');
  readonly active = input(false);
}

// Same shapes as the vertical defaults, rotated a quarter turn; written once for both triggers.
function horizontalRules(root: string): string {
  return `
    ${root} { flex-direction: column; gap: 0.4rem; }
    ${root} .text { align-items: center; text-align: center; }
    ${root} .track { flex-direction: row; }
    ${root} .line { width: 3.5rem; height: 2px; background: linear-gradient(to right, rgb(var(--c) / 0.15), rgb(var(--c) / 0.7)); }
    ${root} .head { border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 0; border-left: 9px solid rgb(var(--c)); margin-top: 0; margin-left: -1px; }
    ${root} .dot { left: 0; top: 50%; margin: -3px 0 0 0; animation-name: arrow-right; }
  `;
}
