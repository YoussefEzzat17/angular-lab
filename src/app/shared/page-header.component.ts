import { Component, input } from '@angular/core';

import { DownloadPdfButtonComponent } from './download-pdf-button.component';

/**
 * The top of a topic page: small eyebrow, big title, optional PDF download pill, and the intro
 * paragraph (projected, so it can contain <strong>/<code> markup).
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [DownloadPdfButtonComponent],
  host: { class: 'block' },
  template: `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-gold-400">{{ eyebrow() }}</p>
        <h1 class="mt-1 text-3xl font-bold sm:text-4xl">{{ title() }}</h1>
      </div>
      @if (pdf(); as file) {
        <a [appDownloadPdf]="file"></a>
      }
    </div>
    <p class="mt-3 max-w-3xl text-stone-400"><ng-content /></p>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input('HANDS-ON WORKSHOP');
  /** File name inside /public/pdfs; omit for pages without a guide. */
  readonly pdf = input<string>();
}
