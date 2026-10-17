import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SearchPaletteComponent } from './core/layout/search-palette.component';
import { ToastComponent } from './core/layout/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, SearchPaletteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
