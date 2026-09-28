import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './core/layout/footer.component';
import { NavbarComponent } from './core/layout/navbar.component';
import { ToastComponent } from './core/layout/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
