import { Component, computed, input } from '@angular/core';

import { IconComponent } from './icon.component';

/**
 * The gold "Download PDF Guide" pill. Used as an attribute on a real anchor so it stays a plain
 * `<a download>`: `<a appDownloadPdf="data-binding.pdf"></a>` serves `/pdfs/data-binding.pdf`.
 */
@Component({
  selector: 'a[appDownloadPdf]',
  standalone: true,
  imports: [IconComponent],
  host: {
    class:
      'group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95',
    '[attr.href]': 'href()',
    '[attr.download]': 'file()',
  },
  template: `
    <app-icon name="download" class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5" />
    Download PDF Guide
  `,
})
export class DownloadPdfButtonComponent {
  readonly file = input.required<string>({ alias: 'appDownloadPdf' });
  protected readonly href = computed(() => `/pdfs/${this.file()}`);
}
