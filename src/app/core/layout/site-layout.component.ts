import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '../../learn/layout/top-navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, TopNavbarComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-top-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class SiteLayoutComponent {}
