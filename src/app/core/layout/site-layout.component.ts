import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '../../learn/layout/top-navbar.component';
import { LearnFooterComponent } from '../../learn/layout/learn-footer.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, TopNavbarComponent, LearnFooterComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-top-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-learn-footer />
    </div>
  `,
})
export class SiteLayoutComponent {}
