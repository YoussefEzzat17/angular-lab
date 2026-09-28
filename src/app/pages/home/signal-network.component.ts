import { Component } from '@angular/core';

@Component({
  selector: 'app-signal-network',
  standalone: true,
  template: `
    <svg viewBox="0 0 520 420" class="h-full w-full" role="img" aria-label="Diagram of an RxJS stream flowing through operators to subscribe">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#dbb877" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#dbb877" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- ambient decorative network -->
      <g stroke="#57534e" stroke-width="1" opacity="0.35">
        <line x1="60" y1="60" x2="130" y2="40" />
        <line x1="130" y1="40" x2="190" y2="70" />
        <line x1="330" y1="50" x2="400" y2="70" />
        <line x1="400" y1="70" x2="440" y2="40" />
        <line x1="70" y1="330" x2="130" y2="360" />
        <line x1="130" y1="360" x2="200" y2="340" />
        <line x1="300" y1="350" x2="370" y2="370" />
        <line x1="370" y1="370" x2="430" y2="340" />
      </g>
      <g fill="#78716c" opacity="0.6">
        <circle cx="60" cy="60" r="2.5" />
        <circle cx="130" cy="40" r="2" />
        <circle cx="190" cy="70" r="2.5" />
        <circle cx="330" cy="50" r="2" />
        <circle cx="400" cy="70" r="2.5" />
        <circle cx="440" cy="40" r="2" />
        <circle cx="70" cy="330" r="2.5" />
        <circle cx="130" cy="360" r="2" />
        <circle cx="200" cy="340" r="2.5" />
        <circle cx="300" cy="350" r="2" />
        <circle cx="370" cy="370" r="2.5" />
        <circle cx="430" cy="340" r="2" />
      </g>

      <!-- main pipeline path -->
      <path
        id="stream-path"
        d="M40,210 C90,150 120,120 170,150 S 250,290 300,250 S 390,160 440,190"
        fill="none"
        stroke="#5c4526"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- traveling data values -->
      <circle r="5" fill="#e8d3a6">
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
          <mpath href="#stream-path" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#c9a263">
        <animateMotion dur="4s" begin="1.3s" repeatCount="indefinite" rotate="auto">
          <mpath href="#stream-path" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="4s" begin="1.3s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#dbb877">
        <animateMotion dur="4s" begin="2.6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#stream-path" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="4s" begin="2.6s" repeatCount="indefinite" />
      </circle>

      <!-- pipeline nodes -->
      @for (node of nodes; track node.label) {
        <g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
          <circle r="22" fill="url(#nodeGlow)" />
          <circle [attr.r]="node.r" fill="#241a12" stroke="#c9a263" stroke-width="1.5" />
          <circle [attr.r]="node.r - 5" fill="#c9a263" opacity="0.9" />
          <text
            x="0"
            [attr.y]="node.r + 18"
            text-anchor="middle"
            fill="#dbb877"
            font-family="'JetBrains Mono', ui-monospace, monospace"
            font-size="13"
            font-weight="600"
          >{{ node.label }}</text>
        </g>
      }
    </svg>
  `,
})
export class SignalNetworkComponent {
  readonly nodes = [
    { x: 40, y: 210, r: 12, label: 'source$' },
    { x: 170, y: 150, r: 10, label: 'map()' },
    { x: 300, y: 250, r: 10, label: 'filter()' },
    { x: 380, y: 155, r: 10, label: 'switchMap()' },
    { x: 440, y: 190, r: 13, label: '.subscribe()' },
  ];
}
