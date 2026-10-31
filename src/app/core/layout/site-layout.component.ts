import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '../../learn/layout/top-navbar.component';
import { LearnFooterComponent } from '../../learn/layout/learn-footer.component';
import { TopicsSheetComponent } from '../../learn/sidebar/topics-sheet.component';
import { MobileNavComponent } from '../../shared/mobile-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, MobileNavComponent, TopNavbarComponent, LearnFooterComponent, TopicsSheetComponent],
  template: `
    <!-- The bottom padding sits below the footer so the fixed phone nav never covers it. dvh follows the visible viewport on phones. -->
    <div class="flex min-h-dvh flex-col pb-[calc(4.375rem+env(safe-area-inset-bottom))] lg:pb-0">
      <app-top-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-learn-footer />

      <app-mobile-nav />

      <app-topics-sheet />
    </div>
  `,
})
export class SiteLayoutComponent {}
