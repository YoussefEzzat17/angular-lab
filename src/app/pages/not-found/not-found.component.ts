import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ standalone: true, template: `<section class="mx-auto max-w-xl px-4 py-24 text-center"><p class="text-7xl">☁️</p><p class="mt-6 text-sm font-bold text-gold-600">404</p><h1 class="mt-2 text-4xl font-bold">This page drifted away.</h1><p class="mt-4 text-stone-600">The link may be old, or the page may not exist.</p><button (click)="takeMeHome()" class="mt-8 rounded-xl bg-gold-600 px-5 py-3 font-semibold text-white">Take me home</button></section>` })
export class NotFoundComponent { private router = inject(Router); takeMeHome(): void { this.router.navigate(['/']); } }
