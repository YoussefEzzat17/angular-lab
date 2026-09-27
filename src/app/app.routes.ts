import { Routes } from '@angular/router';

import { AssignmentComponent } from './pages/assignment/assignment.component';
import { BindingComponent } from './pages/binding/binding.component';
import { ComponentCommunicationComponent } from './pages/component-communication/component-communication.component';
import { DirectivesComponent } from './pages/directives/directives.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { FormsComponent } from './pages/forms/forms.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductsComponent } from './pages/products/products.component';
import { RxjsComponent } from './pages/rxjs/rxjs.component';
import { SignalsPlaygroundComponent } from './pages/signals-playground/signals-playground.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'products', component: ProductsComponent, title: 'Browse' },
  { path: 'products/:id', component: ProductDetailsComponent, title: 'Title Details' },
  { path: 'favorites', component: FavoritesComponent, title: 'My List' },
  { path: 'binding', component: BindingComponent, title: 'Binding' },
  { path: 'communication', component: ComponentCommunicationComponent, title: 'Parent and Child' },
  { path: 'directives', component: DirectivesComponent, title: 'Directives' },
  { path: 'forms', component: FormsComponent, title: 'Forms' },
  { path: 'signals', component: SignalsPlaygroundComponent, title: 'Signals Playground' },
  { path: 'rxjs', component: RxjsComponent, title: 'RxJS' },
  { path: 'movies', component: MoviesComponent, title: 'Real Movie API' },
  { path: 'assignment', component: AssignmentComponent, title: 'Assignment' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
