import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SearchPaletteComponent } from './core/layout/search-palette.component';
import { ToastComponent } from './core/layout/toast.component';
import { GamificationService } from './core/services/gamification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, SearchPaletteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() {
    // Created up front so a new badge or level is celebrated on whichever page it is earned.
    inject(GamificationService);
  }
}
