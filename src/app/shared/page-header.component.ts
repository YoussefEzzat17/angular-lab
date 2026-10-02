import { Component, input } from '@angular/core';

import { DownloadPdfButtonComponent } from './download-pdf-button.component';
import { IllustrationName, TopicIllustrationComponent } from './topic-illustration.component';

/**
 * The top of a topic page: small eyebrow, big title, optional PDF download pill, and the intro
 * paragraph (projected, so it can contain <strong>/<code> markup).
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [DownloadPdfButtonComponent, TopicIllustrationComponent],
  host: { class: 'block' },
  template: `
    <div [class]="illustration() ? 'md:flex md:items-start md:justify-between md:gap-8' : ''">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-start justify-between gap-4" [class.md:block]="illustration()">
          <div>
            <p class="text-sm font-semibold text-gold-400">{{ eyebrow() }}</p>
            <h1 class="mt-1 text-3xl font-bold sm:text-4xl">{{ title() }}</h1>
          </div>
          @if (pdf(); as file) {
            <a [appDownloadPdf]="file" [class.md:hidden]="illustration()"></a>
          }
        </div>
        <p class="mt-3 max-w-3xl text-stone-400"><ng-content /></p>
      </div>

      @if (illustration()) {
        <div class="hidden shrink-0 md:flex md:w-64 md:flex-col md:items-end md:gap-4 lg:w-72">
          @if (pdf(); as file) {
            <a [appDownloadPdf]="file"></a>
          }
          @if (illustration(); as art) {
            <app-topic-illustration [name]="art" class="w-full" />
          }
        </div>
      }
    </div>
    @if (illustration(); as art) {
      <app-topic-illustration [name]="art" class="mx-auto mt-6 w-full max-w-xs md:hidden" />
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input('HANDS-ON WORKSHOP');
  /** File name inside /public/pdfs; omit for pages without a guide. */
  readonly pdf = input<string>();
  /** Optional animated diagram shown beside the intro (below it on phones). */
  readonly illustration = input<IllustrationName>();
}
