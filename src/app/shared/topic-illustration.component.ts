import { Component, input } from '@angular/core';

export type IllustrationName =
  | 'directives'
  | 'binding'
  | 'routing'
  | 'signals'
  | 'pipes'
  | 'forms'
  | 'rxjs'
  | 'lazy'
  | 'interceptor'
  | 'http'
  | 'communication';

/**
 * Small animated diagram that sits beside a topic's intro. Drawn with the theme tokens, so it follows
 * light/dark mode, and decorative only (the page text already explains the idea).
 */
@Component({
  selector: 'app-topic-illustration',
  standalone: true,
  host: { 'aria-hidden': 'true', class: 'block' },
  template: `
    <svg viewBox="0 0 240 170" class="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      @switch (name()) {
        @case ('directives') {
          <!-- a tiny DOM tree: one branch is added/removed by *ngIf -->
          <rect class="node" x="85" y="14" width="70" height="28" rx="8" />
          <text class="mono" x="120" y="32" text-anchor="middle">&lt;div&gt;</text>
          <path class="edge" d="M105 42 L60 82 M135 42 L180 82" />
          <rect class="node" x="22" y="82" width="76" height="28" rx="8" />
          <text class="mono" x="60" y="100" text-anchor="middle">&lt;p&gt;</text>
          <g class="toggle">
            <rect class="node gold" x="142" y="82" width="76" height="28" rx="8" />
            <text class="mono gold-text" x="180" y="100" text-anchor="middle">&lt;tips&gt;</text>
          </g>
          <rect class="ghost" x="142" y="82" width="76" height="28" rx="8" />
          <rect class="chip" x="76" y="132" width="88" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="148" text-anchor="middle">*ngIf="show"</text>
        }
        @case ('binding') {
          <!-- typing in the input updates the text on the right, and back -->
          <rect class="node" x="10" y="26" width="92" height="34" rx="9" />
          <text class="mono dim" x="18" y="16">[(ngModel)]</text>
          <g class="typed"><text class="mono bright" x="20" y="48">Ada</text></g>
          <rect class="caret" x="52" y="37" width="2" height="14" />
          <rect class="node" x="138" y="26" width="92" height="34" rx="9" />
          <text class="mono dim" x="146" y="16">{{ '{{ name }}' }}</text>
          <g class="typed"><text class="mono bright" x="148" y="48">Hi Ada</text></g>
          <path class="edge" d="M104 36 H136 M104 50 H136" />
          <path class="head" d="M130 31 L137 36 L130 41 M110 45 L103 50 L110 55" />
          <circle class="packet right" cx="104" cy="36" r="3" />
          <circle class="packet left" cx="136" cy="50" r="3" />
          <rect class="chip" x="62" y="104" width="116" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="120" text-anchor="middle">two-way binding</text>
        }
        @case ('routing') {
          <!-- the URL changes, the matching page lights up -->
          <rect class="node" x="14" y="14" width="212" height="30" rx="9" />
          <circle class="dot" cx="30" cy="29" r="3" />
          <circle class="dot" cx="42" cy="29" r="3" />
          <text class="mono gold-text url u1" x="60" y="33">/home</text>
          <text class="mono gold-text url u2" x="60" y="33">/products</text>
          <text class="mono gold-text url u3" x="60" y="33">/about</text>
          <rect class="node page p1" x="14" y="62" width="64" height="70" rx="9" />
          <rect class="node page p2" x="88" y="62" width="64" height="70" rx="9" />
          <rect class="node page p3" x="162" y="62" width="64" height="70" rx="9" />
          <text class="mono dim" x="46" y="102" text-anchor="middle">Home</text>
          <text class="mono dim" x="120" y="102" text-anchor="middle">Products</text>
          <text class="mono dim" x="194" y="102" text-anchor="middle">About</text>
          <rect class="chip" x="62" y="142" width="116" height="22" rx="11" />
          <text class="mono gold-text" x="120" y="157" text-anchor="middle">&lt;router-outlet /&gt;</text>
        }

        @case ('signals') {
          <!-- one signal changes, everything that reads it updates -->
          <rect class="node gold" x="70" y="12" width="100" height="40" rx="10" />
          <text class="mono dim" x="120" y="27" text-anchor="middle">count = signal()</text>
          <text class="bright n n1" x="120" y="45" text-anchor="middle">0</text>
          <text class="bright n n2" x="120" y="45" text-anchor="middle">1</text>
          <text class="bright n n3" x="120" y="45" text-anchor="middle">2</text>
          <path class="edge" d="M100 52 L56 100 M140 52 L184 100" />
          <circle class="packet sig-l" cx="100" cy="52" r="3" />
          <circle class="packet sig-r" cx="140" cy="52" r="3" />
          <rect class="node react" x="14" y="100" width="84" height="34" rx="9" />
          <text class="mono" x="56" y="121" text-anchor="middle">computed()</text>
          <rect class="node react" x="142" y="100" width="84" height="34" rx="9" />
          <text class="mono" x="184" y="121" text-anchor="middle">effect()</text>
          <rect class="chip" x="62" y="144" width="116" height="22" rx="11" />
          <text class="mono gold-text" x="120" y="159" text-anchor="middle">auto-updates</text>
        }
        @case ('pipes') {
          <!-- a value goes into the pipe and comes out transformed -->
          <rect class="node" x="8" y="62" width="70" height="36" rx="9" />
          <text class="mono bright2" x="43" y="85" text-anchor="middle">'angular'</text>
          <rect class="node gold" x="84" y="66" width="72" height="28" rx="14" />
          <text class="mono gold-text" x="120" y="84" text-anchor="middle">| upper</text>
          <rect class="node" x="162" y="62" width="70" height="36" rx="9" />
          <text class="mono bright2" x="197" y="85" text-anchor="middle">ANGULAR</text>
          <path class="edge" d="M78 80 H84 M156 80 H162" />
          <circle class="packet pipe" cx="20" cy="80" r="3.5" />
          <rect class="chip" x="62" y="118" width="116" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="134" text-anchor="middle">{{ '{{ value | pipe }}' }}</text>
        }
        @case ('forms') {
          <!-- validation flips a field between invalid and valid; the button follows -->
          <rect class="node" x="40" y="10" width="160" height="30" rx="8" />
          <text class="mono dim" x="52" y="29">name</text>
          <text class="mono ok" x="180" y="30">✓</text>
          <rect class="node field" x="40" y="52" width="160" height="30" rx="8" />
          <text class="mono dim" x="52" y="71">email</text>
          <text class="mono bad" x="180" y="72">✗</text>
          <text class="mono good" x="180" y="72">✓</text>
          <rect class="btn" x="70" y="100" width="100" height="30" rx="15" />
          <text class="mono btn-text" x="120" y="119" text-anchor="middle">Submit</text>
          <rect class="chip" x="62" y="142" width="116" height="22" rx="11" />
          <text class="mono gold-text" x="120" y="157" text-anchor="middle">FormControl</text>
        }
        @case ('rxjs') {
          <!-- values flow through an operator to a subscriber -->
          <path class="edge" d="M10 62 H230" />
          <path class="head" d="M222 56 L230 62 L222 68" />
          <rect class="node gold" x="88" y="40" width="64" height="44" rx="10" />
          <text class="mono gold-text" x="120" y="66" text-anchor="middle">map()</text>
          <circle class="marble m1" cx="10" cy="62" r="6" />
          <circle class="marble m2" cx="10" cy="62" r="6" />
          <circle class="marble m3" cx="10" cy="62" r="6" />
          <text class="mono dim" x="10" y="108">Observable</text>
          <text class="mono dim" x="230" y="108" text-anchor="end">subscribe()</text>
          <rect class="chip" x="62" y="128" width="116" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="144" text-anchor="middle">.pipe( … )</text>
        }
        @case ('lazy') {
          <!-- the admin chunk stays unloaded until the user opens /admin -->
          <rect class="node nav-home" x="14" y="10" width="62" height="24" rx="12" />
          <text class="mono" x="45" y="26" text-anchor="middle">Home</text>
          <rect class="node nav-admin" x="84" y="10" width="62" height="24" rx="12" />
          <text class="mono" x="115" y="26" text-anchor="middle">Admin</text>
          <circle class="cursor" cx="124" cy="30" r="4" />
          <rect class="node" x="10" y="46" width="100" height="44" rx="10" />
          <text class="mono" x="60" y="66" text-anchor="middle">main.js</text>
          <text class="mono dim" x="60" y="80" text-anchor="middle">loaded</text>
          <rect class="ghost2" x="130" y="46" width="100" height="44" rx="10" />
          <g class="chunk-solid">
            <rect class="node gold" x="130" y="46" width="100" height="44" rx="10" />
          </g>
          <text class="mono lz-name" x="180" y="66" text-anchor="middle">admin.js</text>
          <text class="mono dim lz-not" x="180" y="80" text-anchor="middle">not loaded</text>
          <text class="mono gold-text lz-dl" x="180" y="80" text-anchor="middle">downloading…</text>
          <text class="mono gold-text lz-done" x="180" y="80" text-anchor="middle">loaded ✓</text>
          <rect class="progress" x="138" y="85" width="84" height="3" rx="1.5" />
          <rect class="node page-box" x="10" y="102" width="220" height="34" rx="9" />
          <text class="mono dim page-home" x="120" y="123" text-anchor="middle">&lt;Home /&gt;</text>
          <text class="mono gold-text page-admin" x="120" y="123" text-anchor="middle">&lt;Admin /&gt; renders</text>
          <rect class="chip" x="20" y="144" width="200" height="22" rx="11" />
          <text class="mono gold-text" x="120" y="159" text-anchor="middle">loadComponent: () =&gt; import(…)</text>
        }
        @case ('interceptor') {
          <!-- the request leaves the app bare; the interceptor attaches the token before it reaches the API -->
          <rect class="node" x="4" y="60" width="52" height="40" rx="9" />
          <text class="mono" x="30" y="84" text-anchor="middle">App</text>
          <rect class="node gold" x="84" y="42" width="72" height="76" rx="10" />
          <text class="mono gold-text" x="120" y="108" text-anchor="middle">Interceptor</text>
          <rect class="node" x="184" y="60" width="52" height="40" rx="9" />
          <text class="mono" x="210" y="84" text-anchor="middle">API</text>
          <path class="edge" d="M56 80 H84 M156 80 H184" />
          <g class="icp-key">
            <rect class="node gold" x="98" y="6" width="44" height="18" rx="9" />
            <text class="mono gold-text" x="120" y="19" text-anchor="middle">token</text>
          </g>
          <path class="icp-drop" d="M120 26 V50" />
          <g class="icp-req">
            <g class="icp-tok">
              <rect class="tok-pill" x="-24" y="-30" width="48" height="16" rx="8" />
              <text class="mono tok-text" x="0" y="-18.5" text-anchor="middle">Bearer</text>
            </g>
            <rect class="req-pill" x="-15" y="-9" width="30" height="18" rx="9" />
            <text class="mono req-text" x="0" y="4" text-anchor="middle">GET</text>
          </g>
          <text class="mono gold-text icp-auth" x="210" y="116" text-anchor="middle">+ token ✓</text>
          <rect class="chip" x="30" y="134" width="180" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="150" text-anchor="middle">{{ 'req.clone({ setHeaders })' }}</text>
        }
        @case ('http') {
          <!-- request goes out, JSON comes back -->
          <rect class="node" x="8" y="42" width="64" height="60" rx="10" />
          <text class="mono" x="40" y="76" text-anchor="middle">Angular</text>
          <rect class="node gold" x="168" y="42" width="64" height="60" rx="10" />
          <text class="mono gold-text" x="200" y="76" text-anchor="middle">Server</text>
          <path class="edge" d="M72 58 H168 M72 86 H168" />
          <circle class="packet req2" cx="72" cy="58" r="3.5" />
          <circle class="packet res2" cx="168" cy="86" r="3.5" />
          <text class="mono dim" x="120" y="52" text-anchor="middle">GET</text>
          <text class="mono dim" x="120" y="104" text-anchor="middle">{{ '{ json }' }}</text>
          <rect class="chip" x="62" y="124" width="116" height="24" rx="12" />
          <text class="mono gold-text" x="120" y="140" text-anchor="middle">HttpClient</text>
        }
        @case ('communication') {
          <!-- data goes down with @Input, events come back up with @Output -->
          <rect class="node" x="40" y="10" width="160" height="40" rx="10" />
          <text class="mono" x="120" y="35" text-anchor="middle">Parent</text>
          <rect class="node gold" x="40" y="110" width="160" height="40" rx="10" />
          <text class="mono gold-text" x="120" y="135" text-anchor="middle">Child</text>
          <path class="edge" d="M92 50 V110 M148 50 V110" />
          <circle class="packet dn" cx="92" cy="50" r="3.5" />
          <circle class="packet up" cx="148" cy="110" r="3.5" />
          <text class="mono dim" x="84" y="84" text-anchor="end">&#64;Input</text>
          <text class="mono dim" x="156" y="84">&#64;Output</text>
        }
      }
    </svg>
  `,
  styles: [
    `
      svg {
        --line: rgb(var(--stone-700));
        --gold: rgb(var(--gold-400));
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .node {
        fill: rgb(var(--stone-900));
        stroke: var(--line);
        stroke-width: 1.5;
      }
      .node.gold {
        stroke: var(--gold);
      }
      .chip {
        fill: rgb(var(--gold-500) / 0.15);
      }
      .edge,
      .head {
        stroke: var(--line);
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .head {
        stroke: var(--gold);
      }
      .mono {
        font-size: 11px;
        font-weight: 600;
        fill: rgb(var(--stone-300));
      }
      .dim {
        fill: rgb(var(--stone-400));
        font-size: 10px;
      }
      .bright {
        fill: rgb(var(--stone-100));
        font-size: 13px;
      }
      .gold-text {
        fill: rgb(var(--gold-300));
      }
      .dot {
        fill: var(--line);
      }

      /* directives: the branch leaves the DOM and comes back */
      .toggle {
        animation: presence 5s ease-in-out infinite;
      }
      .ghost {
        fill: none;
        stroke: var(--line);
        stroke-width: 1.5;
        stroke-dasharray: 4 4;
        animation: ghost 5s ease-in-out infinite;
        opacity: 0;
      }
      @keyframes presence {
        0%, 40% { opacity: 1; }
        50%, 90% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes ghost {
        0%, 40% { opacity: 0; }
        50%, 90% { opacity: 1; }
        100% { opacity: 0; }
      }

      /* binding: the same text grows on both sides, packets run both ways */
      .typed {
        animation: typing 4s steps(1, end) infinite;
      }
      .caret {
        fill: var(--gold);
        animation: blink 1s steps(1) infinite;
      }
      .packet {
        fill: var(--gold);
      }
      .packet.right {
        animation: to-right 2s ease-in-out infinite;
      }
      .packet.left {
        animation: to-left 2s ease-in-out infinite;
      }
      @keyframes typing {
        0%, 100% { opacity: 1; }
        90% { opacity: 0.35; }
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
      @keyframes to-right {
        0% { transform: translateX(0); opacity: 0; }
        20%, 80% { opacity: 1; }
        100% { transform: translateX(32px); opacity: 0; }
      }
      @keyframes to-left {
        0% { transform: translateX(0); opacity: 0; }
        20%, 80% { opacity: 1; }
        100% { transform: translateX(-32px); opacity: 0; }
      }

      /* routing: three URLs take turns, the matching page card highlights */
      .url {
        opacity: 0;
        font-size: 12px;
      }
      .u1 { animation: step1 9s infinite; opacity: 1; }
      .u2 { animation: step2 9s infinite; }
      .u3 { animation: step3 9s infinite; }
      .p1 { animation: page1 9s infinite; }
      .p2 { animation: page2 9s infinite; }
      .p3 { animation: page3 9s infinite; }
      @keyframes step1 { 0%, 30% { opacity: 1; } 33%, 100% { opacity: 0; } }
      @keyframes step2 { 0%, 30% { opacity: 0; } 33%, 63% { opacity: 1; } 66%, 100% { opacity: 0; } }
      @keyframes step3 { 0%, 63% { opacity: 0; } 66%, 97% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes page1 { 0%, 30% { stroke: rgb(var(--gold-400)); } 33%, 100% { stroke: rgb(var(--stone-700)); } }
      @keyframes page2 { 0%, 30% { stroke: rgb(var(--stone-700)); } 33%, 63% { stroke: rgb(var(--gold-400)); } 66%, 100% { stroke: rgb(var(--stone-700)); } }
      @keyframes page3 { 0%, 63% { stroke: rgb(var(--stone-700)); } 66%, 97% { stroke: rgb(var(--gold-400)); } 100% { stroke: rgb(var(--stone-700)); } }


      /* shared bits for the diagrams below */
      .bright2 { fill: rgb(var(--stone-100)); font-size: 11px; }
      .react { animation: react 3s ease-in-out infinite; }
      .n { opacity: 0; }
      .n1 { animation: num1 3s infinite; opacity: 1; }
      .n2 { animation: num2 3s infinite; }
      .n3 { animation: num3 3s infinite; }
      @keyframes num1 { 0%, 30% { opacity: 1; } 33%, 100% { opacity: 0; } }
      @keyframes num2 { 0%, 30% { opacity: 0; } 33%, 63% { opacity: 1; } 66%, 100% { opacity: 0; } }
      @keyframes num3 { 0%, 63% { opacity: 0; } 66%, 97% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes react { 0%, 30% { stroke: var(--line); } 36%, 60% { stroke: var(--gold); } 66%, 100% { stroke: var(--line); } }
      .sig-l { animation: sig-l 3s ease-in infinite; }
      .sig-r { animation: sig-r 3s ease-in infinite; }
      @keyframes sig-l { 0%, 30% { transform: translate(0, 0); opacity: 0; } 33% { opacity: 1; } 60%, 100% { transform: translate(-44px, 48px); opacity: 0; } }
      @keyframes sig-r { 0%, 30% { transform: translate(0, 0); opacity: 0; } 33% { opacity: 1; } 60%, 100% { transform: translate(44px, 48px); opacity: 0; } }

      .pipe { animation: pipe 3.5s ease-in-out infinite; }
      @keyframes pipe { 0% { transform: translateX(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(178px); opacity: 0; } }

      .ok { fill: rgb(var(--status-emerald)); }
      .bad { fill: rgb(var(--panel-danger-heading)); animation: show-bad 4s infinite; }
      .good { fill: rgb(var(--status-emerald)); opacity: 0; animation: show-good 4s infinite; }
      .field { animation: field 4s infinite; }
      .btn { fill: rgb(var(--stone-800)); animation: btn 4s infinite; }
      .btn-text { fill: rgb(var(--stone-500)); animation: btn-text 4s infinite; }
      @keyframes show-bad { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes show-good { 0%, 45% { opacity: 0; } 50%, 95% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes field { 0%, 45% { stroke: rgb(var(--panel-danger-heading)); } 50%, 95% { stroke: var(--gold); } 100% { stroke: rgb(var(--panel-danger-heading)); } }
      @keyframes btn { 0%, 45% { fill: rgb(var(--stone-800)); } 50%, 95% { fill: rgb(var(--gold-500)); } 100% { fill: rgb(var(--stone-800)); } }
      @keyframes btn-text { 0%, 45% { fill: rgb(var(--stone-500)); } 50%, 95% { fill: #fff; } 100% { fill: rgb(var(--stone-500)); } }

      .marble { fill: var(--gold); opacity: 0; animation: marble 4.5s linear infinite; }
      .m2 { animation-delay: 1.5s; }
      .m3 { animation-delay: 3s; }
      @keyframes marble { 0% { transform: translateX(0); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateX(212px); opacity: 0; } }


      .req2 { animation: req2 3s ease-in-out infinite; }
      .res2 { animation: res2 3s ease-in-out infinite; }
      @keyframes req2 { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 45% { transform: translateX(96px); opacity: 1; } 50%, 100% { transform: translateX(96px); opacity: 0; } }
      @keyframes res2 { 0%, 50% { transform: translateX(0); opacity: 0; } 55% { opacity: 1; } 95% { transform: translateX(-96px); opacity: 1; } 100% { transform: translateX(-96px); opacity: 0; } }

      .dn { animation: dn 3s ease-in-out infinite; }
      .up { animation: up 3s ease-in-out infinite; }
      @keyframes dn { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 45% { transform: translateY(60px); opacity: 1; } 50%, 100% { transform: translateY(60px); opacity: 0; } }
      @keyframes up { 0%, 50% { transform: translateY(0); opacity: 0; } 55% { opacity: 1; } 95% { transform: translateY(-60px); opacity: 1; } 100% { transform: translateY(-60px); opacity: 0; } }

      /* lazy loading: click Admin, the chunk downloads, then the page renders */
      .ghost2 { fill: none; stroke: var(--line); stroke-width: 1.5; stroke-dasharray: 4 4; }
      .lz-name { fill: rgb(var(--stone-300)); }
      .nav-home { animation: nav-home 8s infinite; }
      .nav-admin { animation: nav-admin 8s infinite; }
      .cursor { transform-box: fill-box; transform-origin: center; fill: var(--gold); opacity: 0; animation: cursor 8s ease-in-out infinite; }
      .chunk-solid { opacity: 0; animation: chunk-in 8s infinite; }
      .lz-not { animation: lz-not 8s infinite; }
      .lz-dl { opacity: 0; animation: lz-dl 8s infinite; }
      .lz-done { opacity: 0; animation: lz-done 8s infinite; }
      .progress { fill: var(--gold); transform-box: fill-box; transform-origin: left; transform: scaleX(0); animation: progress 8s linear infinite; }
      .page-box { animation: page-box 8s infinite; }
      .page-home { animation: page-home 8s infinite; }
      .page-admin { opacity: 0; animation: page-admin 8s infinite; }
      @keyframes nav-home { 0%, 36% { stroke: var(--gold); } 40%, 100% { stroke: var(--line); } }
      @keyframes nav-admin { 0%, 36% { stroke: var(--line); } 40%, 96% { stroke: var(--gold); } 100% { stroke: var(--line); } }
      @keyframes cursor { 0%, 20% { opacity: 0; transform: translate(0, 18px); } 26% { opacity: 1; transform: translate(0, 18px); } 36% { opacity: 1; transform: translate(-6px, -2px); } 42% { opacity: 1; transform: translate(-6px, -2px) scale(0.6); } 48%, 100% { opacity: 0; transform: translate(-6px, -2px); } }
      @keyframes chunk-in { 0%, 62% { opacity: 0; } 68%, 96% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes lz-not { 0%, 44% { opacity: 1; } 46%, 98% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes lz-dl { 0%, 44% { opacity: 0; } 46%, 62% { opacity: 1; } 64%, 100% { opacity: 0; } }
      @keyframes lz-done { 0%, 62% { opacity: 0; } 64%, 96% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes progress { 0%, 45% { transform: scaleX(0); opacity: 1; } 62% { transform: scaleX(1); opacity: 1; } 66%, 100% { transform: scaleX(1); opacity: 0; } }
      @keyframes page-box { 0%, 68% { stroke: var(--line); } 72%, 96% { stroke: var(--gold); } 100% { stroke: var(--line); } }
      @keyframes page-home { 0%, 68% { opacity: 1; } 70%, 98% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes page-admin { 0%, 68% { opacity: 0; } 72%, 96% { opacity: 1; } 100% { opacity: 0; } }

      /* interceptor: the request is bare until it passes the gate, where the token is attached */
      .req-pill { fill: rgb(var(--stone-800)); stroke: var(--line); stroke-width: 1.5; }
      .req-text { fill: rgb(var(--stone-200)); font-size: 10px; }
      .tok-pill { fill: var(--gold); }
      .tok-text { fill: rgb(var(--stone-950)); font-size: 9px; }
      .icp-req { opacity: 0; animation: icp-req 6s linear infinite; }
      .icp-tok { opacity: 0; animation: icp-tok 6s linear infinite; }
      .icp-key { animation: icp-key 6s ease-in-out infinite; }
      .icp-drop { stroke: var(--gold); stroke-width: 1.5; stroke-dasharray: 3 3; opacity: 0; animation: icp-drop 6s ease-in-out infinite; }
      .icp-auth { opacity: 0; animation: icp-auth 6s ease-in-out infinite; }
      @keyframes icp-req { 0% { transform: translate(56px, 80px); opacity: 0; } 6% { opacity: 1; } 94% { opacity: 1; } 100% { transform: translate(184px, 80px); opacity: 0; } }
      @keyframes icp-tok { 0%, 46% { opacity: 0; transform: translateY(-14px); } 54%, 94% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(0); } }
      @keyframes icp-key { 0%, 36% { opacity: 0.55; } 44%, 58% { opacity: 1; } 66%, 100% { opacity: 0.55; } }
      @keyframes icp-drop { 0%, 42% { opacity: 0; } 48%, 56% { opacity: 1; } 62%, 100% { opacity: 0; } }
      @keyframes icp-auth { 0%, 86% { opacity: 0; } 92%, 100% { opacity: 1; } }

      @media (prefers-reduced-motion: reduce) {
        .toggle, .ghost, .typed, .caret, .packet, .u1, .u2, .u3, .p1, .p2, .p3, .react, .n1, .n2, .n3, .bad, .good, .field, .btn, .btn-text, .marble, .nav-home, .nav-admin, .cursor, .chunk-solid, .lz-not, .lz-dl, .lz-done, .progress, .page-box, .page-home, .page-admin, .icp-req, .icp-tok, .icp-key, .icp-drop, .icp-auth {
          animation: none;
        }
        .packet, .marble {
          opacity: 0;
        }
        .chunk-solid, .lz-done, .page-admin, .icp-tok, .icp-auth, .icp-key {
          opacity: 1;
        }
        .lz-not, .lz-dl, .page-home, .cursor, .progress, .icp-drop {
          opacity: 0;
        }
        .icp-req {
          opacity: 1;
          transform: translate(120px, 80px);
        }
        .good {
          opacity: 0;
        }
      }
    `,
  ],
})
export class TopicIllustrationComponent {
  readonly name = input.required<IllustrationName>();
}
